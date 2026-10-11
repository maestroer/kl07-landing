import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Calculator,
  Check,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Minus,
  Repeat,
  Send,
  Sparkles,
  User,
} from 'lucide-react'
import { AnnouncementBar } from '@/components/arc/announcement-bar/announcement-bar'
import { Badge } from '@/components/arc/badge/badge'
import { BillingPrice, BillingToggle } from '@/components/arc/billing-toggle/billing-toggle'
import { Button } from '@/components/arc/button/button'
import { CopyButton } from '@/components/arc/copy-button/copy-button'
import { Progress } from '@/components/arc/progress/progress'
import { LetterCascade } from '@/components/ui/letter-cascade'
import {
  ArchitectDemo,
  CalculatorDemo,
  DashboardDemo,
  InvoiceDemo,
  ProfileDemo,
  ProjectsDemo,
  Showcase,
  SubtrackerDemo,
} from '@/components/demos'
import { DonateDialog } from '@/components/DonateDialog'
import { FlowBoard, type FlowLink, type FlowNode } from '@/components/FlowBoard'
import { Ink, LinkButton, Point, Section, Surface } from '@/components/kit'
import { Shell } from '@/components/Shell'
import { Waitlist } from '@/components/Waitlist'
import { useDocMeta, useI18n } from '@/i18n'
import { fundraising, site } from '@/site'
import { cn } from '@/lib/utils'

// Цена за месяц: [при оплате за год, при помесячной оплате]. Порядок как у тарифов в словаре.
const PRICES: [number, number][] = [
  [0, 0],
  [790, 990],
  [2290, 2890],
]

const FLOW_LINKS: FlowLink[] = [
  { from: 'ai', to: 'calc' },
  { from: 'calc', to: 'projects' },
  { from: 'profile', to: 'projects' },
  { from: 'projects', to: 'invoices' },
  { from: 'projects', to: 'subs' },
  { from: 'invoices', to: 'dash' },
  { from: 'subs', to: 'dash' },
]

export default function Home() {
  const { t } = useI18n()
  const h = t.home
  const navigate = useNavigate()
  const [donateOpen, setDonateOpen] = useState(false)
  const [billing, setBilling] = useState('year')
  useDocMeta(t.meta.homeTitle, t.meta.homeDesc)

  const locale = t.code === 'ru' ? 'ru-RU' : 'en-US'
  const rub = (n: number) => `${n.toLocaleString(locale)} ₽`

  // Узлы схемы названы так же, как модули в словаре: порядок items — дашборд, калькулятор,
  // инвойсы, проекты, сабтрекер, ai-архитектор, профиль.
  const m = h.modules.items
  const flowNodes: FlowNode[] = [
    { id: 'ai', x: 0.07, y: 0.52, label: m[5].name, icon: <Sparkles size={18} />, status: 'processing', size: 'lg' },
    { id: 'calc', x: 0.29, y: 0.52, label: m[1].name, icon: <Calculator size={16} /> },
    { id: 'profile', x: 0.51, y: 0.14, label: m[6].name, icon: <User size={12} />, size: 'sm' },
    { id: 'projects', x: 0.51, y: 0.52, label: m[3].name, icon: <FolderKanban size={18} />, size: 'lg' },
    { id: 'invoices', x: 0.73, y: 0.22, label: m[2].name, icon: <FileText size={16} /> },
    { id: 'subs', x: 0.73, y: 0.8, label: m[4].name, icon: <Repeat size={16} /> },
    { id: 'dash', x: 0.93, y: 0.52, label: m[0].name, icon: <LayoutDashboard size={16} /> },
  ]

  return (
    <Shell
      banner={
        <AnnouncementBar
          id="kl07-b2b"
          label={t.nav.b2b}
          messages={[
            {
              id: 'b2b',
              message: t.ui.announce,
              action: { label: t.ui.announceCta, onClick: () => navigate('/b2b') },
            },
          ]}
        />
      }
    >
      {/* ── шапка ───────────────────────────────────────────────────────── */}
      <section className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <h1>
            <LetterCascade
              text="KL07"
              staggerFrom="center"
              className="display text-[clamp(4.5rem,13vw,9rem)] font-semibold leading-[0.9] text-foreground"
            />
          </h1>

          <p className="display mt-6 max-w-[22ch] text-[clamp(1.5rem,3.4vw,2.25rem)] font-medium text-foreground">
            {h.headline[0]} <Ink>{h.headline[1]}</Ink>
          </p>

          <dl className="mt-8 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
            {h.whoami.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted">{k}</dt>
                <dd className="m-0 text-secondary">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {h.cta.label} <ArrowRight size={16} />
            </Button>
            <LinkButton variant="secondary" size="lg" href={site.tgUrl}>
              <Send size={16} /> {t.nav.tg}
            </LinkButton>
            <CopyButton value={site.email} label="email" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[2.5rem] bg-surface-muted p-3 sm:p-5">
            <DashboardDemo compact />
          </div>

          <Surface className="flex flex-col gap-5">
            <dl className="m-0 grid grid-cols-[1fr_auto] gap-y-1.5 text-sm">
              <dt className="font-semibold text-foreground">{h.statusPanel.star[0]}</dt>
              <dd className="m-0">
                <Badge tone="success" size="sm">
                  {h.statusPanel.star[1]}
                </Badge>
              </dd>
              {h.statusPanel.rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted">{k}</dt>
                  <dd className="tnum m-0 text-right text-secondary">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="border-t border-line-subtle pt-5">
              <Progress value={fundraising.raised} max={fundraising.goal} label={h.donate.raisedLabel} showValue />
              <div className="mt-2 flex items-baseline justify-between gap-3 text-sm">
                <span className="tnum font-semibold text-foreground">{rub(fundraising.raised)}</span>
                <span className="tnum text-muted">
                  {h.donate.of} {rub(fundraising.goal)}
                </span>
              </div>
            </div>

            <Button variant="secondary" onClick={() => setDonateOpen(true)}>
              {h.donate.button} <ArrowRight size={16} />
            </Button>
          </Surface>
        </div>
      </section>

      {/* ── проблема ────────────────────────────────────────────────────── */}
      <Section n="01" label={h.problem.label} title={h.problem.note} note={h.problem.body.join(' ')}>
        <div className="grid gap-4 sm:grid-cols-2">
          {h.problem.pains.map(([title, text]) => (
            <Point key={title} title={title} text={text} />
          ))}
        </div>
      </Section>

      {/* ── сравнение ───────────────────────────────────────────────────── */}
      <Section n="02" label={h.compare.label} title={h.compare.note}>
        <Surface className="overflow-x-auto !p-0">
          <table className="w-full min-w-[620px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left font-normal text-muted" />
                {h.compare.cols.map((c, i) => (
                  <th
                    key={c}
                    scope="col"
                    className={cn(
                      'px-4 py-4 text-center',
                      i === 0 ? 'display text-base font-semibold text-foreground' : 'font-normal text-muted',
                    )}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {h.compare.rows.map((row) => {
                const [name, ...cells] = row
                return (
                  <tr key={name as string} className="border-t border-line-subtle">
                    <th scope="row" className="px-6 py-3.5 text-left font-normal text-secondary">
                      {name}
                    </th>
                    {(cells as number[]).map((v, i) => (
                      <td key={i} className={cn('px-4 py-3.5 text-center', i === 0 && 'bg-accent-subtle')}>
                        {v ? (
                          <Check
                            size={18}
                            className={cn('inline', i === 0 ? 'text-accent-strong' : 'text-muted')}
                            aria-label="✓"
                          />
                        ) : (
                          <Minus size={16} className="inline text-line-strong" aria-label="—" />
                        )}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Surface>
        <p className="mt-4 max-w-[78ch] text-xs leading-relaxed text-muted">{h.compare.footnote}</p>
      </Section>

      {/* ── модули ──────────────────────────────────────────────────────── */}
      <Section n="03" label={h.modules.label} title={t.ui.flowTitle} note={h.modules.note}>
        <Surface muted className="mb-4 !px-4 !pb-10 !pt-4">
          <FlowBoard nodes={flowNodes} links={FLOW_LINKS} label={t.ui.flowTitle} />
          <p className="mt-8 text-center text-sm text-muted">{t.ui.flowNote}</p>
        </Surface>

        <div className="mt-10 grid gap-x-4 gap-y-12 lg:grid-cols-2">
          {(
            [
              [0, <DashboardDemo key="d" />, 'lg:col-span-2'],
              [1, <CalculatorDemo key="c" />, ''],
              [5, <ArchitectDemo key="a" />, ''],
              [2, <InvoiceDemo key="i" />, ''],
              [4, <SubtrackerDemo key="s" />, ''],
              [3, <ProjectsDemo key="p" />, ''],
              [6, <ProfileDemo key="u" />, ''],
            ] as [number, React.ReactNode, string][]
          ).map(([i, demo, span]) => (
            <Showcase key={m[i].name} name={m[i].name} kind={m[i].kind} text={m[i].text} tags={m[i].tags} className={span}>
              {demo}
            </Showcase>
          ))}
        </div>
        <p className="mt-8 text-xs text-muted">{t.demo.note}</p>
      </Section>

      {/* ── ai-архитектор ───────────────────────────────────────────────── */}
      <Section
        n="04"
        label={h.ai.label}
        title={`${h.ai.headline[0]} ${h.ai.headline[1]}`}
        note={h.ai.body.join(' ')}
      >
        <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
          {h.ai.steps.map(([title, text], i) => (
            <li key={title}>
              <Point title={title} text={text} index={i + 1} />
            </li>
          ))}
        </ol>
        <p className="display mt-10 max-w-[26ch] text-[clamp(1.5rem,3.4vw,2.25rem)] font-medium text-foreground">
          {h.ai.punchA} <Ink>{h.ai.punchB}</Ink>
        </p>
      </Section>

      {/* ── тарифы ──────────────────────────────────────────────────────── */}
      <Section n="05" label={h.pricing.label} title={h.pricing.note}>
        <div className="mb-6">
          <BillingToggle
            value={billing}
            onValueChange={setBilling}
            label={t.ui.billing}
            options={[
              { value: 'year', label: t.ui.yearly, badge: '−20%' },
              { value: 'month', label: t.ui.monthly },
            ]}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {h.pricing.plans.map((p, i) => {
            const [yearly, monthly] = PRICES[i]
            const free = monthly === 0
            const featured = i === 1
            return (
              <Surface
                key={p.name}
                className={cn('flex flex-col', featured && 'border-[color:var(--accent)] shadow-raised')}
              >
                <h3 className="display text-2xl font-semibold text-foreground">{p.name}</h3>

                <div className="mt-5 text-foreground">
                  <BillingPrice
                    amount={billing === 'year' ? yearly : monthly}
                    currency=""
                    period={t.ui.perMonth}
                    locale={locale}
                    was={billing === 'year' && monthly > yearly ? monthly : undefined}
                  />
                </div>
                <p className="mt-1 text-xs text-muted">
                  {free ? t.ui.forever : billing === 'year' ? t.ui.yearlyNote : t.ui.monthlyNote}
                </p>

                <p className="mt-5 min-h-[3.5rem] text-sm leading-relaxed text-secondary">{p.text}</p>

                <ul className="m-0 mt-5 flex list-none flex-col gap-2 border-t border-line-subtle p-0 pt-5 text-sm text-secondary">
                  {p.feats.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <Check size={16} className="mt-0.5 shrink-0 text-accent-strong" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </Surface>
            )
          })}
        </div>
      </Section>

      {/* ── ранний доступ ───────────────────────────────────────────────── */}
      <Section n="06" id="early-access" label={h.cta.label} title={h.cta.headline} note={h.cta.body.join(' ')}>
        <Waitlist />
      </Section>

      {/* ── переход на инвест-страницу ──────────────────────────────────── */}
      <Surface muted className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <Badge tone="warning">{h.investBanner.label}</Badge>
        <p className="m-0 flex-1 text-base text-secondary">{h.investBanner.text}</p>
        <LinkButton variant="primary" to="/invest">
          {h.investBanner.link} <ArrowRight size={16} />
        </LinkButton>
      </Surface>

      <DonateDialog open={donateOpen} onOpenChange={setDonateOpen} />
    </Shell>
  )
}
