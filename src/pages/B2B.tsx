import { useMemo, useState } from 'react'
import { Bot, Boxes, Check, Cpu, Lightbulb, ListChecks, Send, Users } from 'lucide-react'
import { AnimatedCounter } from '@/components/arc/animated-counter/animated-counter'
import { Badge } from '@/components/arc/badge/badge'
import SegmentedControl from '@/components/arc/segmented-control/segmented-control'
import { Slider } from '@/components/arc/slider/slider'
import { LetterCascade } from '@/components/ui/letter-cascade'
import { FlowBoard, type FlowLink, type FlowNode } from '@/components/FlowBoard'
import { Ink, LinkButton, Point, Section, Surface } from '@/components/kit'
import { Shell } from '@/components/Shell'
import { useDocMeta, useI18n } from '@/i18n'
import { site } from '@/site'
import { cn } from '@/lib/utils'

/* Модель головной фичи: своя команда vs аутстафф с учётом налога на переключение
   контекста и цены простоя проекта, с которого забирают время. */

const DAY_HOURS = 8
const CRIT_FACTOR = [1, 2, 4] as const

function estimate(p: {
  hours: number
  cost: number
  outstaff: number
  allocation: number // 0..100, насколько человек уже занят на другом проекте
  crit: number
  penalty: number // %
}) {
  const busy = p.allocation / 100
  const naive = p.hours * p.cost

  // Переключение контекста бьёт только когда человек реально разрывается между проектами.
  const effPenalty = busy > 0 ? p.penalty / 100 : 0
  const effHours = p.hours / (1 - effPenalty)
  const switchTax = (effHours - p.hours) * p.cost

  // Часы, которые уходят с другого проекта, превращаются в дни его задержки.
  const delayDays = (effHours * busy) / DAY_HOURS
  const delay = delayDays * DAY_HOURS * p.cost * CRIT_FACTOR[p.crit]

  const own = naive + switchTax + delay
  return { naive, switchTax, delay, own, out: p.hours * p.outstaff, hidden: switchTax + delay }
}

const ENGINE_LINKS: FlowLink[] = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({
  from: 'engine',
  to: id,
  bidirectional: true,
}))

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
  const [crit, setCrit] = useState('1')
  const [penalty, setPenalty] = useState(25)

  const r = useMemo(
    () => estimate({ hours, cost, outstaff, allocation, crit: Number(crit), penalty }),
    [hours, cost, outstaff, allocation, crit, penalty],
  )
  const ownCheaper = r.own <= r.out
  const diff = Math.abs(r.own - r.out)

  const [cost0, decide] = b.engine.groups
  const engineNodes: FlowNode[] = [
    { id: 'engine', x: 0.5, y: 0.5, label: t.ui.engine, icon: <Cpu size={18} />, status: 'processing', size: 'lg' },
    { id: 'a', x: 0.17, y: 0.16, label: cost0.items[0][0], icon: <Users size={16} /> },
    { id: 'b', x: 0.12, y: 0.5, label: cost0.items[2][0], icon: <ListChecks size={16} /> },
    { id: 'c', x: 0.17, y: 0.82, label: cost0.items[4][0], icon: <Boxes size={16} /> },
    { id: 'd', x: 0.83, y: 0.16, label: decide.items[0][0], icon: <Bot size={16} /> },
    { id: 'e', x: 0.88, y: 0.5, label: decide.items[1][0], icon: <Lightbulb size={16} /> },
    { id: 'f', x: 0.83, y: 0.82, label: decide.items[3][0], icon: <ListChecks size={16} /> },
  ]

  return (
    <Shell>
      {/* ── шапка ───────────────────────────────────────────────────────── */}
      <section>
        <Badge tone="info">{b.tagline}</Badge>
        <h1 className="display mt-6 max-w-[18ch] text-[clamp(2.25rem,6vw,4.5rem)] font-semibold text-foreground">
          {b.headlineA} <Ink>{b.headlineB}</Ink>
        </h1>
        <p className="mt-6 max-w-[68ch] text-lg text-secondary">{b.lead.join(' ')}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <LinkButton variant="primary" size="lg" href={site.tgUrl}>
            <Send size={16} /> {b.ctaPilot}
          </LinkButton>
          <Badge tone="success">{b.status}</Badge>
        </div>
      </section>

      {/* ── для кого ────────────────────────────────────────────────────── */}
      <Section n="01" label={b.forWho.label} title={b.forWho.note}>
        <div className="grid gap-4 md:grid-cols-3">
          {b.forWho.items.map(([title, text]) => (
            <Point key={title} title={title} text={text} />
          ))}
        </div>
      </Section>

      {/* ── калькулятор ─────────────────────────────────────────────────── */}
      <Section n="02" label={b.calc.label} title={b.calc.title} note={b.calc.intro}>
        <div className="grid gap-4 lg:grid-cols-2">
          <Surface className="flex flex-col gap-7">
            <Slider label={b.calc.hours} value={hours} onValueChange={setHours} min={8} max={800} step={8} showValue format={(v) => `${v} ${t.code === 'ru' ? 'ч' : 'h'}`} />
            <div>
              <Slider label={b.calc.cost} value={cost} onValueChange={setCost} min={500} max={8000} step={100} showValue format={rub} />
              <p className="mt-2 text-xs text-muted">{b.calc.costHint}</p>
            </div>
            <Slider label={b.calc.outstaff} value={outstaff} onValueChange={setOutstaff} min={500} max={10000} step={100} showValue format={rub} />
            <Slider label={b.calc.allocation} value={allocation} onValueChange={setAllocation} min={0} max={100} step={5} showValue format={(v) => `${v}%`} />
            <Slider label={b.calc.penalty} value={penalty} onValueChange={setPenalty} min={0} max={40} step={5} showValue format={(v) => `${v}%`} />
            <div className="flex flex-col gap-3">
              <span className="text-sm text-secondary">{b.calc.criticality}</span>
              <SegmentedControl
                label={b.calc.criticality}
                value={crit}
                onValueChange={setCrit}
                options={b.calc.crit.map((c, i) => ({ value: String(i), label: `${c} ×${CRIT_FACTOR[i]}` }))}
              />
            </div>
          </Surface>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: b.calc.own, value: r.own, win: ownCheaper },
                { label: b.calc.out, value: r.out, win: !ownCheaper },
              ].map((x) => (
                <Surface key={x.label} className={cn('!p-6', x.win && 'border-[color:var(--accent)]')}>
                  <div className="flex items-center justify-between gap-2 text-sm text-muted">
                    <span>{x.label}</span>
                    {x.win && <Check size={16} className="text-accent-strong" aria-hidden="true" />}
                  </div>
                  <div className="display tnum mt-2 text-[1.75rem] font-semibold text-foreground">
                    <AnimatedCounter value={Math.round(x.value)} suffix={" ₽"} locale={locale} />
                  </div>
                </Surface>
              ))}
            </div>

            <Surface muted className="!p-6" >
              <p className="display m-0 text-xl font-medium text-foreground" aria-live="polite">
                {ownCheaper ? b.calc.verdictOwn : b.calc.verdictOut} <Ink>{rub(diff)}</Ink>
              </p>
              <p className="m-0 mt-2 text-sm text-secondary">
                {b.calc.hidden}: <span className="tnum font-semibold text-foreground">{rub(r.hidden)}</span>
              </p>
            </Surface>

            <Surface className="!p-0">
              <dl className="m-0">
                {[
                  { k: b.calc.rows.naive, v: r.naive, note: b.calc.naiveNote, plus: false },
                  { k: b.calc.rows.switch, v: r.switchTax, plus: true },
                  { k: b.calc.rows.delay, v: r.delay, plus: true },
                ].map((row, i) => (
                  <div key={row.k} className={cn('flex items-start justify-between gap-4 px-6 py-3.5 text-sm', i > 0 && 'border-t border-line-subtle')}>
                    <dt className="text-secondary">
                      {row.k}
                      {row.note && <span className="block text-xs text-muted">{row.note}</span>}
                    </dt>
                    <dd className="tnum m-0 whitespace-nowrap font-medium text-foreground">
                      {row.plus ? '+ ' : ''}
                      {rub(row.v)}
                    </dd>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-4 border-t border-line px-6 py-4">
                  <dt className="display font-semibold text-foreground">{b.calc.rows.total}</dt>
                  <dd className="display tnum m-0 whitespace-nowrap text-lg font-semibold text-accent-strong">{rub(r.own)}</dd>
                </div>
              </dl>
            </Surface>
          </div>
        </div>
        <p className="mt-4 max-w-[90ch] text-xs leading-relaxed text-muted">{b.calc.assumptions}</p>
      </Section>

      {/* ── как считаем ─────────────────────────────────────────────────── */}
      <Section n="03" label={b.how.label} title={b.how.note}>
        <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-2">
          {b.how.steps.map(([title, text], i) => (
            <li key={title}>
              <Point title={title} text={text} index={i + 1} />
            </li>
          ))}
        </ol>
      </Section>

      {/* ── инструменты ─────────────────────────────────────────────────── */}
      <Section n="04" label={b.engine.label} title={t.ui.engineTitle} note={b.engine.note}>
        <Surface muted className="mb-4 !px-4 !pb-10 !pt-4">
          <FlowBoard nodes={engineNodes} links={ENGINE_LINKS} height={340} minWidth={760} label={t.ui.engineTitle} />
        </Surface>

        <div className="grid gap-4 lg:grid-cols-2">
          {b.engine.groups.map((g) => (
            <Surface key={g.title} className="self-start !p-0">
              <h3 className="display m-0 border-b border-line px-6 py-4 text-lg font-semibold text-foreground">
                <LetterCascade text={g.title} />
              </h3>
              <ul className="m-0 list-none p-0">
                {g.items.map(([title, text], i) => (
                  <li key={title} className={cn('flex gap-3 px-6 py-4', i > 0 && 'border-t border-line-subtle')}>
                    <Check size={16} className="mt-1 shrink-0 text-accent-strong" aria-hidden="true" />
                    <div>
                      <div className="font-medium text-foreground">{title}</div>
                      <div className="mt-0.5 text-sm leading-relaxed text-secondary">{text}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Surface>
          ))}
        </div>
      </Section>

      {/* ── пилот ───────────────────────────────────────────────────────── */}
      <Section n="05" label={b.pilot.label} title={b.pilot.headline} note={b.pilot.body}>
        <LinkButton variant="primary" size="lg" href={site.tgUrl}>
          <Send size={16} /> {b.pilot.tg} — {site.tg}
        </LinkButton>
      </Section>
    </Shell>
  )
}
