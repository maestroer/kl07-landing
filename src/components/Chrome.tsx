import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n'
import { site } from '../site'

/* ── фоновый вотермарк: детерминированный, чтобы не «прыгал» между рендерами ── */

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function Watermark() {
  const marks = useMemo(() => {
    const rand = mulberry32(0x07)
    const words = ['KL07', 'KL07', 'UNIT ECONOMICS', 'KL07', 'ЭКОНОМИКА ПРОЕКТА']
    return Array.from({ length: 34 }, (_, i) => ({
      id: i,
      word: words[Math.floor(rand() * words.length)],
      top: `${rand() * 100}%`,
      left: `${rand() * 100}%`,
      size: `${10 + rand() * 26}px`,
      rot: `${-70 + rand() * 140}deg`,
    }))
  }, [])

  return (
    <div className="watermark" aria-hidden="true">
      {marks.map((m) => (
        <span key={m.id} style={{ top: m.top, left: m.left, fontSize: m.size, transform: `rotate(${m.rot})` }}>
          {m.word}
        </span>
      ))}
    </div>
  )
}

/* ── часы в титульной строке ───────────────────────────────────────────── */

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  const offset = -now.getTimezoneOffset() / 60
  const tz = `UTC${offset >= 0 ? '+' : ''}${offset}`

  return (
    <span className="hidden tabular-nums text-mute sm:inline">
      {hh}:{mm}:{ss} {tz}
    </span>
  )
}

/* ── оболочка страницы ─────────────────────────────────────────────────── */

export function Chrome({ title, children }: { title: string; children: React.ReactNode }) {
  const { lang, setLang, t } = useI18n()
  const { pathname } = useLocation()
  const onInvest = pathname.startsWith('/invest')

  return (
    <>
      <div className="glow" aria-hidden="true" />
      <Watermark />
      <div className="grain" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-[1120px] px-3 py-6 sm:px-6 sm:py-10">
        <div className="term overflow-hidden">
          {/* титульная строка окна */}
          <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-soft bg-[rgba(12,11,18,0.86)] px-4 py-2.5 backdrop-blur-md">
            <div className="flex shrink-0 gap-1.5" aria-hidden="true">
              <span className="h-[10px] w-[10px] rounded-full bg-[#ff5f57]" />
              <span className="h-[10px] w-[10px] rounded-full bg-[#febc2e]" />
              <span className="h-[10px] w-[10px] rounded-full bg-[#28c840]" />
            </div>

            <div className="min-w-0 flex-1 truncate text-center text-[12px] text-dim">{title}</div>

            <div className="flex shrink-0 items-center gap-3 text-[11px]">
              <Clock />
              <button
                type="button"
                onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
                className="rounded border border-line px-2 py-[2px] font-bold uppercase text-lilac transition-colors hover:border-orange/60 hover:text-orange"
                aria-label={lang === 'ru' ? 'Switch to English' : 'Переключить на русский'}
              >
                {lang === 'ru' ? 'en' : 'ru'}
              </button>
            </div>
          </div>

          {/* навигация */}
          <div className="flex items-center gap-4 border-b border-soft px-4 py-2 text-[12px] sm:px-7">
            <Link
              to="/"
              className={`transition-colors hover:text-orange ${!onInvest ? 'font-bold text-lilac' : 'text-dim'}`}
            >
              {t.nav.product}
            </Link>
            <span className="text-mute">/</span>
            <Link
              to="/invest"
              className={`transition-colors hover:text-orange ${onInvest ? 'font-bold text-lilac' : 'text-dim'}`}
            >
              {t.nav.invest}
            </Link>
            <a
              href={site.tgUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="ml-auto text-dim transition-colors hover:text-orange"
            >
              {site.tg}
            </a>
          </div>

          {/* контент */}
          <div className="px-4 py-8 sm:px-7 sm:py-10">{children}</div>

          {/* подвал */}
          <div className="flex flex-col gap-2 border-t border-soft px-4 py-5 text-[11px] text-mute sm:flex-row sm:items-center sm:px-7">
            <span>{t.footer.rights}</span>
            <span className="hidden sm:inline">·</span>
            <span>{t.footer.built}</span>
            <a
              href={site.tgUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="link ml-auto"
            >
              {site.tg}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
