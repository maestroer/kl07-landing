# -*- coding: utf-8 -*-
"""Ставит элементы shadcn-реестров (Arc UI, Componentry) без CLI:
читает registry-JSON, рекурсивно тянет registryDependencies, пишет файлы в src/."""
import io, json, os, sys, urllib.request

SEEN, NPM = set(), set()

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'kl07-landing'})
    return json.load(urllib.request.urlopen(req, timeout=60))

def dest(f, base):
    t = f.get('target') or f['path']
    t = t.replace('@components/', 'components/')
    if t.startswith('registry/'): t = t[len('registry/'):]
    return os.path.join('src', t)

def install(url):
    if url in SEEN: return
    SEEN.add(url)
    d = fetch(url)
    NPM.update(d.get('dependencies') or [])
    for f in d.get('files', []):
        p = dest(f, url)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        io.open(p, 'w', encoding='utf-8', newline='\n').write(f['content'])
        print('  +', p.replace(os.sep, '/'))
    for r in d.get('registryDependencies') or []:
        install(r if r.startswith('http') else url.rsplit('/', 1)[0] + '/' + r + '.json')

for spec in sys.argv[1:]:
    reg, name = spec.split('/')
    base = {'arc': 'https://uiarc.dev/r/', 'cy': 'https://componentry.dev/r/'}[reg]
    install(base + name + '.json')
print('npm deps:', sorted(NPM))
