import { useState } from 'react'
import { Button } from '@/components/arc/button/button'
import { ChipGroup } from '@/components/arc/chip-group/chip-group'
import { Input } from '@/components/arc/input/input'
import { Surface } from '@/components/kit'
import { useI18n } from '@/i18n'
import { site } from '@/site'

type State = 'idle' | 'sending' | 'ok' | 'err'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function Waitlist() {
  const { t } = useI18n()
  const c = t.home.cta

  const [email, setEmail] = useState('')
  const [segment, setSegment] = useState<string[]>([c.segments[0]])
  const [state, setState] = useState<State>('idle')
  const [msg, setMsg] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'sending') return

    if (!EMAIL_RE.test(email.trim())) {
      setState('err')
      setMsg(c.invalid)
      return
    }

    setState('sending')
    setMsg('')

    const payload = {
      email: email.trim(),
      segment: segment[0] ?? '',
      source: 'kl07-landing',
      at: new Date().toISOString(),
    }

    // Бэкенда пока нет: если endpoint не задан — уводим лид в письмо, чтобы он не потерялся.
    if (!site.waitlistEndpoint) {
      const body = encodeURIComponent(`email: ${payload.email}\n${c.segmentLabel}: ${payload.segment}`)
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('KL07 — early access')}&body=${body}`
      setState('ok')
      setMsg(c.ok)
      return
    }

    try {
      const res = await fetch(site.waitlistEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(String(res.status))
      setState('ok')
      setMsg(c.ok)
      setEmail('')
    } catch {
      setState('err')
      setMsg(c.err)
    }
  }

  const invalid = state === 'err' && msg === c.invalid

  return (
    <Surface>
      <form onSubmit={submit} noValidate className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <Input
            label={c.emailLabel}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={c.emailPlaceholder}
            value={email}
            error={invalid ? msg : undefined}
            onChange={(e) => {
              setEmail(e.target.value)
              if (state === 'err') setState('idle')
            }}
          />
          <Button type="submit" variant="primary" size="lg" loading={state === 'sending'}>
            {state === 'sending' ? c.sending : c.submit}
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted">{c.segmentLabel}</span>
          <ChipGroup
            label={c.segmentLabel}
            options={c.segments.map((s) => ({ value: s, label: s }))}
            value={segment}
            onValueChange={setSegment}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm" aria-live="polite">
          {msg && !invalid && <span className={state === 'ok' ? 'text-success' : 'text-danger'}>{msg}</span>}
          {state !== 'ok' && (
            <>
              <span className="text-muted">{c.or}</span>
              <a
                href={site.tgUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent-strong underline-offset-4 hover:underline"
              >
                {c.tg}
              </a>
            </>
          )}
        </div>
      </form>
    </Surface>
  )
}
