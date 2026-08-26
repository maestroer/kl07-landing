import { useState } from 'react'
import { useI18n } from '../i18n'
import { site } from '../site'

type State = 'idle' | 'sending' | 'ok' | 'err'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function Waitlist() {
  const { t } = useI18n()
  const c = t.home.cta

  const [email, setEmail] = useState('')
  const [segment, setSegment] = useState(c.segments[0])
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

    const payload = { email: email.trim(), segment, source: 'kl07-landing', at: new Date().toISOString() }

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

  return (
    <form onSubmit={submit} className="cell rounded-lg p-5 sm:p-6">
      <div className="mb-5 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label htmlFor="wl-email" className="mb-2 block text-[11px] uppercase tracking-wider text-mute">
            {c.emailLabel}
          </label>
          <div className="flex items-center gap-2 border-b border-soft pb-2 focus-within:border-violet/60">
            <span className="text-grn">›</span>
            <input
              id="wl-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (state === 'err') setState('idle')
              }}
              placeholder={c.emailPlaceholder}
              className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-mute"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={state === 'sending'}
          className="w-full rounded-md border border-violet/60 bg-violet/15 px-6 py-3 text-[13px] font-bold text-lilac transition-colors hover:border-orange/70 hover:bg-orange/15 hover:text-orange disabled:opacity-50 sm:w-auto"
        >
          {state === 'sending' ? c.sending : c.submit}
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] uppercase tracking-wider text-mute">{c.segmentLabel}</span>
        {c.segments.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSegment(s)}
            className={`chip transition-colors ${
              segment === s ? 'border-orange/60 bg-orange/12 text-orange' : 'opacity-70 hover:opacity-100'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
        {msg && <span className={state === 'ok' ? 'text-grn' : 'text-orange'}>{msg}</span>}
        {state !== 'ok' && (
          <>
            <span className="text-mute">{c.or}</span>
            <a href={site.tgUrl} target="_blank" rel="noreferrer noopener" className="link">
              {c.tg}
            </a>
          </>
        )}
      </div>
    </form>
  )
}
