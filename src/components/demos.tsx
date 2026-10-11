import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Check, FileText, ShieldCheck } from 'lucide-react'
import { AnimatedCounter } from '@/components/arc/animated-counter/animated-counter'
import { Badge } from '@/components/arc/badge/badge'
import { LineChart } from '@/components/arc/line-chart/line-chart'
import SegmentedControl from '@/components/arc/segmented-control/segmented-control'
import { Slider } from '@/components/arc/slider/slider'
import { Tags } from '@/components/kit'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'

/* Живые панели модулей KL07, собранные из компонентов Arc. Данные в них демонстрационные:
   задача панелей — показать интерфейс продукта, а не статистику. */

/** Витрина: тонированная подложка с панелью внутри и подписью под ней. */
export function Showcase({
  name,
  kind,
  text,
  tags,
  className,
  children,
}: {
  name: string
  kind: string
  text?: string
  tags?: string[]
  className?: string
  children: React.ReactNode
}) {
  return (
    <article className={cn('flex min-w-0 flex-col', className)}>
      <div className="flex flex-1 items-center justify-center rounded-[2.5rem] bg-surface-muted p-3 sm:p-8">
        <div className="w-full min-w-0">{children}</div>
      </div>
      <div className="mt-4 px-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="display m-0 text-base font-semibold text-foreground">{name}</h3>
          <span className="text-sm text-muted">{kind}</span>
        </div>
        {text && <p className="m-0 mt-2 max-w-[62ch] text-sm leading-relaxed text-secondary">{text}</p>}
        {tags && (
          <div className="mt-3">
            <Tags items={tags} />
          </div>
        )}
      </div>
    </article>
  )
}

function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('rounded-surface border border-line bg-surface p-5 shadow-resting sm:p-6', className)}>
      {children}
    </div>
  )
}

/* ── дашборд ───────────────────────────────────────────────────────────── */

const METRICS = [
  { base: 42, amp: 5, trend: 0.5, decimals: 0 },
  { base: 2840, amp: 260, trend: 22, decimals: 0 },
  { base: 1240, amp: 130, trend: 14, decimals: 0 },
  { base: 78, amp: 7, trend: 0.3, decimals: 0 },
]
const POINTS = 12

// Детерминированная «живая» кривая: одинаковая на сервере, в тестах и у каждого посетителя.
function curve(metric: number, range: number, shift: number) {
  const m = METRICS[metric]
  const seed = metric * 1.7 + range * 0.9 + shift * 0.6
  // Прошлый период лежит ниже текущего на 8–14%, чтобы сравнение читалось с первого взгляда.
  const level = m.base * (1 - shift * (0.08 + range * 0.03))
  return Array.from({ length: POINTS }, (_, i) =>
    Math.round(level + m.amp * Math.sin(i * 0.85 + seed) + m.amp * 0.45 * Math.cos(i * 1.9 + seed * 2) + m.trend * i),
  )
}

export function DashboardDemo({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n()
  const d = t.demo.dash
  const locale = t.code === 'ru' ? 'ru-RU' : 'en-US'
  const [range, setRange] = useState('1')
  const [metric, setMetric] = useState(0)

  const summary = useMemo(
    () =>
      METRICS.map((_, i) => {
        const now = curve(i, Number(range), 0)
        const prev = curve(i, Number(range), 1)
        const last = now[POINTS - 1]
        const before = prev[POINTS - 1]
        return { now, prev, last, change: ((last - before) / before) * 100 }
      }),
    [range],
  )
  const active = summary[metric]
  const unit = d.units[metric]

  return (
    <Panel className={cn(!compact && '!p-0')}>
      <div className={cn('flex flex-wrap items-center justify-between gap-3', !compact && 'px-5 pt-5 sm:px-6 sm:pt-6')}>
        <h4 className="display m-0 text-base font-semibold text-foreground">{d.title}</h4>
        <SegmentedControl
          label={d.range}
          value={range}
          onValueChange={setRange}
          options={d.ranges.map((r, i) => ({ value: String(i), label: r }))}
        />
      </div>

      {compact ? (
        <div className="mt-5">
          <div className="text-sm text-muted">{d.metrics[metric]}</div>
          <div className="display tnum mt-1 text-[2.5rem] font-semibold leading-none text-foreground">
            <AnimatedCounter value={active.last} suffix={unit} locale={locale} />
          </div>
          <Delta value={active.change} label={d.vs} />
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 border-y border-line sm:grid-cols-4" role="tablist" aria-label={d.title}>
          {summary.map((s, i) => (
            <button
              key={d.metrics[i]}
              type="button"
              role="tab"
              aria-selected={metric === i}
              onClick={() => setMetric(i)}
              className={cn(
                'border-b-2 px-5 py-4 text-left transition-colors sm:px-6',
                i > 0 && 'sm:border-l sm:border-l-[color:var(--border)]',
                metric === i
                  ? 'border-b-[color:var(--foreground)] bg-surface-muted'
                  : 'border-b-transparent hover:bg-surface-muted',
              )}
            >
              <div className="text-sm text-secondary">{d.metrics[i]}</div>
              <div className="display tnum mt-1 text-2xl font-semibold text-foreground">
                {s.last.toLocaleString(locale)}
                <span className="ml-1 text-sm font-normal text-muted">{d.units[i]}</span>
              </div>
              <Delta value={s.change} />
            </button>
          ))}
        </div>
      )}

      <div className={cn('mt-4', !compact && 'px-5 pb-5 sm:px-6 sm:pb-6')}>
        <LineChart
          label={d.metrics[metric]}
          categoryLabel={d.point}
          height={compact ? 190 : 230}
          unit={unit}
          data={active.now.map((v, i) => ({
            key: `p${i}`,
            label: `${d.point} ${i + 1}`,
            axisLabel: i % 3 === 0 ? String(i + 1) : undefined,
            values: { now: v, prev: active.prev[i] },
          }))}
          series={[
            { key: 'now', label: d.current },
            { key: 'prev', label: d.previous, dashed: true, area: false },
          ]}
        />
      </div>
    </Panel>
  )
}

function Delta({ value, label }: { value: number; label?: string }) {
  const up = value >= 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <div className={cn('tnum mt-1 flex items-center gap-1 text-sm', up ? 'text-success' : 'text-danger')}>
      <Icon size={14} aria-hidden="true" />
      {up ? '+' : '−'}
      {Math.abs(value).toFixed(1)}%{label ? ` ${label}` : ''}
    </div>
  )
}

/* ── калькулятор ───────────────────────────────────────────────────────── */

export function CalculatorDemo() {
  const { t } = useI18n()
  const c = t.demo.calc
  const locale = t.code === 'ru' ? 'ru-RU' : 'en-US'
  const rub = (n: number) => `${Math.round(n).toLocaleString(locale)} ₽`

  const [rate, setRate] = useState(3000)
  const [hours, setHours] = useState(120)
  const [tools, setTools] = useState(12000)

  const revenue = rate * hours
  const tax = revenue * 0.06
  const net = revenue - tax - tools
  const margin = revenue > 0 ? (net / revenue) * 100 : 0

  return (
    <Panel>
      <div className="flex flex-col gap-6">
        <Slider label={c.rate} value={rate} onValueChange={setRate} min={1000} max={8000} step={100} showValue format={rub} />
        <Slider label={c.hours} value={hours} onValueChange={setHours} min={10} max={400} step={5} showValue />
        <Slider label={c.tools} value={tools} onValueChange={setTools} min={0} max={40000} step={500} showValue format={rub} />
      </div>

      <dl className="m-0 mt-6 border-t border-line-subtle pt-4 text-sm">
        {[
          [c.revenue, rub(revenue)],
          [c.tax, `− ${rub(tax)}`],
          [c.toolsRow, `− ${rub(tools)}`],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-1.5">
            <dt className="text-secondary">{k}</dt>
            <dd className="tnum m-0 text-foreground">{v}</dd>
          </div>
        ))}
        <div className="mt-2 flex items-end justify-between gap-4 border-t border-line pt-4">
          <dt className="text-secondary">{c.net}</dt>
          <dd className="m-0 text-right">
            <div className="display tnum text-2xl font-semibold text-foreground">
              <AnimatedCounter value={Math.round(net)} suffix={' ₽'} locale={locale} />
            </div>
            <div className="tnum text-sm text-accent-strong">
              {c.margin} {Math.round(margin)}%
            </div>
          </dd>
        </div>
      </dl>
    </Panel>
  )
}

/* ── ai-архитектор ─────────────────────────────────────────────────────── */

export function ArchitectDemo() {
  const { t } = useI18n()
  const a = t.demo.ai
  return (
    <Panel>
      <div className="ml-auto w-fit max-w-[90%] rounded-panel rounded-br-md bg-surface-muted px-4 py-3 text-sm text-foreground">
        {a.prompt}
      </div>

      <dl className="m-0 mt-4 rounded-panel border border-line">
        {a.rows.map(([k, v], i) => (
          <div key={k} className={cn('flex gap-4 px-4 py-3 text-sm', i > 0 && 'border-t border-line-subtle')}>
            <dt className="w-[72px] shrink-0 text-muted">{k}</dt>
            <dd className={cn('m-0 text-foreground', i === a.rows.length - 1 && 'display tnum text-lg font-semibold')}>{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <Badge tone="neutral" icon={<Check size={12} />}>
          {a.saved}
        </Badge>
      </div>
    </Panel>
  )
}

/* ── инвойсы ───────────────────────────────────────────────────────────── */

export function InvoiceDemo() {
  const { t } = useI18n()
  const v = t.demo.invoice
  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="display text-base font-semibold text-foreground">{v.no}</div>
          <div className="text-sm text-muted">{v.client}</div>
        </div>
        <Badge tone="neutral">{v.status}</Badge>
      </div>

      <ul className="m-0 mt-5 list-none p-0 text-sm">
        {v.items.map(([name, qty, sum], i) => (
          <li key={name} className={cn('flex items-baseline gap-3 py-2.5', i > 0 && 'border-t border-line-subtle')}>
            <span className="min-w-0 flex-1 text-foreground">{name}</span>
            <span className="tnum text-muted">{qty}</span>
            <span className="tnum w-[84px] text-right text-foreground">{sum}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-line pt-4">
        <span className="text-sm text-secondary">{v.total}</span>
        <span className="display tnum text-2xl font-semibold text-foreground">{v.totalVal}</span>
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-3 text-sm text-muted">
        <span>{v.tax}</span>
        <span className="tnum">{v.taxVal}</span>
      </div>

      <div className="mt-4">
        <Badge tone="neutral" icon={<FileText size={12} />}>
          {v.pdf}
        </Badge>
      </div>
    </Panel>
  )
}

/* ── сабтрекер ─────────────────────────────────────────────────────────── */

export function SubtrackerDemo() {
  const { t } = useI18n()
  const s = t.demo.subs
  return (
    <Panel>
      <div className="flex items-baseline justify-between gap-3">
        <div className="display text-base font-semibold text-foreground">{s.title}</div>
        <div className="text-right">
          <span className="display tnum text-2xl font-semibold text-foreground">{s.total}</span>
          <span className="ml-1.5 text-sm text-muted">{s.month}</span>
        </div>
      </div>

      <ul className="m-0 mt-5 list-none p-0 text-sm">
        {s.items.map(([name, price, date], i) => (
          <li key={name} className={cn('flex items-center gap-3 py-2.5', i > 0 && 'border-t border-line-subtle')}>
            <span className="min-w-0 flex-1 text-foreground">{name}</span>
            {date ? (
              <span className="text-muted">
                {s.next} {date}
              </span>
            ) : (
              <Badge tone="neutral" size="sm">
                {s.unused}
              </Badge>
            )}
            <span className="tnum w-[68px] text-right text-foreground">{price}</span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

/* ── проекты ───────────────────────────────────────────────────────────── */

const STATUS_TONE = ['neutral', 'neutral', 'neutral'] as const

export function ProjectsDemo() {
  const { t } = useI18n()
  const p = t.demo.projects
  return (
    <Panel>
      <div className="flex items-baseline justify-between gap-3">
        <div className="display text-base font-semibold text-foreground">{p.title}</div>
        <div className="text-sm text-muted">{p.margin}</div>
      </div>
      <ul className="m-0 mt-4 list-none p-0 text-sm">
        {p.items.map(([name, margin, status], i) => (
          <li key={name} className={cn('flex items-center gap-3 py-2.5', i > 0 && 'border-t border-line-subtle')}>
            <span className="min-w-0 flex-1 text-foreground">{name}</span>
            <Badge tone={STATUS_TONE[status]} size="sm">
              {p.statuses[status]}
            </Badge>
            <span className="tnum w-[44px] text-right font-medium text-foreground">{margin}</span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

/* ── профиль ───────────────────────────────────────────────────────────── */

export function ProfileDemo() {
  const { t } = useI18n()
  const p = t.demo.profile
  return (
    <Panel>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 text-foreground">
          <ShieldCheck size={16} className="text-secondary" aria-hidden="true" /> {p.twofa}
        </span>
        <Badge tone="neutral" size="sm">
          {p.on}
        </Badge>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line-subtle pt-3 text-sm">
        <span className="text-foreground">{p.plan}</span>
        <Badge tone="neutral" size="sm">
          {p.planVal}
        </Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4">
        {[
          [12, p.projects],
          [640, p.hours],
        ].map(([n, label]) => (
          <div key={label as string}>
            <div className="display tnum text-2xl font-semibold text-foreground">
              <AnimatedCounter value={n as number} animateOnView />
            </div>
            <div className="text-sm text-muted">{label}</div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
