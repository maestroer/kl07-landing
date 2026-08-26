import { useEffect, useRef, useState } from 'react'

/* ── появление при скролле ─────────────────────────────────────────────── */

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || seen) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [seen])

  return (
    <div
      ref={ref}
      className={`reveal ${seen ? 'in' : ''} ${className}`}
      style={{ transitionDelay: seen ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  )
}

/* ── заголовок секции ──────────────────────────────────────────────────── */

export function SectionHead({ n, label, note }: { n?: string; label: string; note?: string }) {
  return (
    <div className="mb-6 mt-20 flex items-baseline justify-between gap-4 border-b border-soft pb-2 sm:mt-28">
      <span className="flex items-baseline gap-3">
        {n && <span className="text-[11px] tabular-nums text-mute">{n}</span>}
        <span className="text-[13px] font-bold text-lilac">{label}</span>
      </span>
      {note && <span className="text-right text-[11px] text-mute">{note}</span>}
    </div>
  )
}

/* ── чипы ──────────────────────────────────────────────────────────────── */

export function Tag({ children, tone = 'violet' }: { children: React.ReactNode; tone?: 'violet' | 'orange' | 'green' }) {
  const cls = tone === 'orange' ? 'chip chip-o' : tone === 'green' ? 'chip chip-g' : 'chip'
  return <span className={cls}>{children}</span>
}

/* ── ячейка-метрика ────────────────────────────────────────────────────── */

export function Stat({
  label,
  value,
  hint,
  tone = 'violet',
}: {
  label?: string
  value: string
  hint?: string
  tone?: 'violet' | 'orange' | 'white'
}) {
  const color = tone === 'orange' ? 'text-orange' : tone === 'white' ? 'text-white' : 'text-lilac'
  return (
    <div className="cell rounded-lg px-4 py-4">
      {label && <div className="mb-1 text-[11px] uppercase tracking-wider text-mute">{label}</div>}
      <div className={`text-[26px] font-bold leading-tight ${color}`}>{value}</div>
      {hint && <div className="mt-1 text-[12px] text-dim">{hint}</div>}
    </div>
  )
}

/* ── маркер-выделение как в презентации ────────────────────────────────── */

export function Mark({ children, tone = 'orange' }: { children: React.ReactNode; tone?: 'orange' | 'violet' }) {
  return <span className={tone === 'violet' ? 'mk-v' : 'mk'}>{children}</span>
}
