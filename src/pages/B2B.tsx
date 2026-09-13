import { useMemo, useState } from 'react'
import { useDocMeta, useI18n } from '../i18n'
import { site } from '../site'
import { Chrome } from '../components/Chrome'
import { Mark, Reveal, SectionHead, Tag } from '../components/ui'

/* Демо-модель головной фичи из ТЗ (раздел 3.1): своя команда vs аутстафф с учётом
   налога на переключение контекста и цены простоя проекта, с которого забирают время. */

const DAY_HOURS = 8
const CRIT_FACTOR = [1, 2, 4] as const

function estimate(p: {
  hours: number
  cost: number
  outstaff: number
  allocation: number // 0..100, насколько человек уже занят на другом проекте
  crit: 0 | 1 | 2
  penalty: number // 0..50, %
}) {
  const busy = p.allocation / 100
  const naive = p.hours * p.cost

  // Переключение контекста бьёт только когда человек реально разрывается между проектами.
  const effPenalty = busy > 0 ? p.penalty / 100 : 0
  const effHours = p.hours / (1 - effPenalty)
  const switchTax = (effHours - p.hours) * p.cost

  // Часы, которые уходят с другого проекта, превращаются в дни его задержки.
  const pulledHours = effHours * busy
  const delayDays = pulledHours / DAY_HOURS
  const teamDay = DAY_HOURS * p.cost
  const delay = delayDays * teamDay * CRIT_FACTOR[p.crit]

  const own = naive + switchTax + delay
  const out = p.hours * p.outstaff
  return { naive, switchTax, delay, own, out, hidden: switchTax + delay, delayDays }
}

export default function B2B() {
  const { t } = useI18n()
  const b = t.b2b
  useDocMeta(t.b2bMeta.title, t.b2bMeta.desc)

  const locale = t.code === 'ru' ? 'ru-RU' : 'en-US'
  const rub = (n: number) => `${Math.round(n).toLocaleString(locale)} ₽`

  const [hours, setHours] = useState(160)
  const [cost, setCost] = useState(2500)
  const [outstaff, setOutstaff] = useState(3200)
  const [allocation, setAllocation] = useState(60)
  const [crit, setCrit] = useState<0 | 1 | 2>(1)
  const [penalty, setPenalty] = useState(25)

  const r = useMemo(
    () => estimate({ hours, cost, outstaff, allocation, crit, penalty }),
    [hours, cost, outstaff, allocation, crit, penalty],
  )
  const ownCheaper = r.own <= r.out
  const diff = Math.abs(r.own - r.out)

  return (
    <Chrome title={t.chrome.b2b}>
      {/* ── шапка ───────────────────────────────────────────────────────── */}
      <section>
        <p className="text-[12px] text-dim">{b.tagline}</p>
        <h1 className="mt-4 text-[30px] font-bold leading-tight tracking-tight text-white sm:text-[42px]">
          {b.headlineA}
          <br />
          <Mark>{b.headlineB}</Mark>
        </h1>
        <div className="mt-6 max-w-[780px] space-y-0.5 text-[13px] leading-relaxed text-txt">
          {b.lead.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Tag tone="orange">{b.status}</Tag>
          <a href={site.tgUrl} target="_blank" rel="noreferrer noopener" className="link text-[12px]">
            {b.ctaPilot} →
          </a>
        </div>
      </section>

      {/* ── для кого ────────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="01" label={b.forWho.label} note={b.forWho.note} />
        <div className="grid gap-3 md:grid-cols-3">
          {b.forWho.items.map(([title, text]) => (
            <div key={title} className="cell rounded-lg px-4 py-4">
              <div className="mb-1 font-bold text-white">{title}</div>
              <div className="text-[12px] leading-relaxed text-dim">{text}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── калькулятор ─────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="02" label={b.calc.label} note={b.calc.note} />
        <p className="text-[18px] font-bold leading-snug text-white sm:text-[22px]">{b.calc.title}</p>
        <p className="mt-3 max-w-[780px] text-[12px] leading-relaxed text-dim">{b.calc.intro}</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* ввод */}
          <div className="cell space-y-5 rounded-lg px-5 py-5">
            <Slider label={b.calc.hours} value={hours} min={8} max={800} step={8} onChange={setHours} format={(v) => `${v} ${t.code === 'ru' ? 'ч' : 'h'}`} />
            <Slider label={b.calc.cost} hint={b.calc.costHint} value={cost} min={500} max={8000} step={100} onChange={setCost} format={rub} />
            <Slider label={b.calc.outstaff} value={outstaff} min={500} max={10000} step={100} onChange={setOutstaff} format={rub} />
            <Slider label={b.calc.allocation} value={allocation} min={0} max={100} step={5} onChange={setAllocation} format={(v) => `${v}%`} />
            <Slider label={b.calc.penalty} value={penalty} min={0} max={40} step={5} onChange={setPenalty} format={(v) => `${v}%`} />

            <div>
              <div className="mb-2 text-[12px] text-blu">{b.calc.criticality}</div>
              <div className="flex flex-wrap gap-2">
                {b.calc.crit.map((c, i) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCrit(i as 0 | 1 | 2)}
                    className={`chip transition-colors ${
                      crit === i ? 'border-orange/60 bg-orange/12 text-orange' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {c} ×{CRIT_FACTOR[i]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* результат */}
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="cell rounded-lg px-4 py-4">
                <div className="text-[11px] uppercase tracking-wider text-mute">{b.calc.own}</div>
                <div className={`mt-1 text-[22px] font-bold leading-tight ${ownCheaper ? 'text-grn' : 'text-orange'}`}>
                  {rub(r.own)}
                </div>
                <div className="mt-1 text-[11px] text-dim">
                  {b.calc.hidden}: <span className="text-orange">{rub(r.hidden)}</span>
                </div>
              </div>
              <div className="cell rounded-lg px-4 py-4">
                <div className="text-[11px] uppercase tracking-wider text-mute">{b.calc.out}</div>
                <div className={`mt-1 text-[22px] font-bold leading-tight ${ownCheaper ? 'text-orange' : 'text-grn'}`}>
                  {rub(r.out)}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-line bg-violet/[0.05] px-4 py-3 text-[13px] font-bold text-white" aria-live="polite">
              {ownCheaper ? b.calc.verdictOwn : b.calc.verdictOut} <Mark>{rub(diff)}</Mark>
            </div>

            <div className="cell rounded-lg">
              {[
                [b.calc.rows.naive, r.naive, 'text-txt'],
                [b.calc.rows.switch, r.switchTax, 'text-orange'],
                [b.calc.rows.delay, r.delay, 'text-orange'],
              ].map(([k, v, cls], i) => (
                <div key={k as string} className={`flex justify-between gap-4 px-4 py-2.5 text-[12px] ${i ? 'border-t border-soft' : ''}`}>
                  <span className="text-dim">
                    {k as string}
                    {i === 0 && <span className="block text-[11px] text-mute">{b.calc.naiveNote}</span>}
                  </span>
                  <span className={`whitespace-nowrap font-bold ${cls as string}`}>
                    {i ? '+ ' : ''}
                    {rub(v as number)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between gap-4 border-t border-soft px-4 py-3 text-[13px]">
                <span className="font-bold text-white">{b.calc.rows.total}</span>
                <span className="whitespace-nowrap font-bold text-lilac">{rub(r.own)}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 max-w-[860px] text-[11px] leading-relaxed text-mute">{b.calc.assumptions}</p>
      </Reveal>

      {/* ── как считаем ─────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="03" label={b.how.label} note={b.how.note} />
        <ol className="m-0 grid list-none gap-3 p-0 md:grid-cols-2">
          {b.how.steps.map(([title, text], i) => (
            <li key={title} className="cell flex gap-4 rounded-lg px-4 py-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-violet/50 bg-violet/12 text-[12px] font-bold text-lilac">
                {i + 1}
              </span>
              <span>
                <span className="block font-bold text-white">{title}</span>
                <span className="block text-[12px] leading-relaxed text-dim">{text}</span>
              </span>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* ── один движок ─────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="04" label={b.engine.label} note={b.engine.note} />
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="cell rounded-lg">
            {b.engine.next.map(([title, text], i) => (
              <div key={title} className={`px-4 py-3 ${i ? 'border-t border-soft' : ''}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-white">{title}</span>
                  <Tag tone="orange">{b.engine.newTag}</Tag>
                </div>
                <div className="mt-1 text-[12px] leading-relaxed text-dim">{text}</div>
              </div>
            ))}
          </div>
          <div className="cell rounded-lg">
            {b.engine.ready.map(([title, text], i) => (
              <div key={title} className={`px-4 py-3 ${i ? 'border-t border-soft' : ''}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-txt">{title}</span>
                  <Tag tone="green">{b.engine.readyTag}</Tag>
                </div>
                <div className="mt-1 text-[12px] leading-relaxed text-dim">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── роадмап ─────────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="05" label={b.roadmap.label} note={b.roadmap.note} />
        <ol className="m-0 list-none space-y-2 p-0">
          {b.roadmap.steps.map(([title, text], i) => (
            <li key={title} className="flex gap-4 text-[12px]">
              <span className="w-6 shrink-0 tabular-nums text-mute">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className="font-bold text-white">{title}</span>
                <span className="text-dim"> — {text}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-6 cell rounded-lg px-4 py-4">
          <div className="mb-3 text-[12px] font-bold text-lilac">{b.roadmap.laterTitle}</div>
          <div className="flex flex-wrap gap-1.5">
            {b.roadmap.later.map((x) => (
              <span key={x} className="chip opacity-70">
                {x}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-mute">{b.roadmap.laterNote}</p>
        </div>
      </Reveal>

      {/* ── пилот ───────────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="06" label={b.pilot.label} note={b.pilot.note} />
        <div className="cell rounded-lg px-5 py-6 sm:px-7 sm:py-8">
          <p className="max-w-[720px] text-[18px] font-bold leading-snug text-white sm:text-[22px]">{b.pilot.headline}</p>
          <p className="mt-3 max-w-[720px] text-[12px] leading-relaxed text-dim">{b.pilot.body}</p>
          <a
            href={site.tgUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-block rounded-md border border-orange/60 bg-orange/15 px-6 py-3 text-[13px] font-bold text-orange transition-colors hover:bg-orange/25"
          >
            {b.pilot.tg} — {site.tg}
          </a>
        </div>
      </Reveal>
    </Chrome>
  )
}

function Slider({
  label,
  hint,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string
  hint?: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format: (v: number) => string
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3 text-[12px]">
        <span className="text-blu">{label}</span>
        <span className="whitespace-nowrap font-bold text-white">{format(value)}</span>
      </span>
      {hint && <span className="block text-[11px] text-mute">{hint}</span>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[#8b7cf6]"
      />
    </label>
  )
}
