import { ArrowLeft, FileDown, Mail, Send } from 'lucide-react'
import { Badge } from '@/components/arc/badge/badge'
import { BarChart } from '@/components/arc/bar-chart/bar-chart'
import { LineChart } from '@/components/arc/line-chart/line-chart'
import { Ink, LinkButton, Point, Section, Surface } from '@/components/kit'
import { Shell } from '@/components/Shell'
import { useDocMeta, useI18n } from '@/i18n'
import { site } from '@/site'
import { cn } from '@/lib/utils'

// Модельный прогноз из презентации проекта.
const MONTHS = [6, 8, 10, 12, 14, 16, 18]
const USERS = [75, 120, 150, 260, 340, 420, 500]
const MRR = [110, 176, 220, 381, 498, 615, 733]
const MARGIN_MONTHS = [9, 12, 14, 16, 18]
const MARGIN = [12, 94, 153, 194, 250]
const PROFIT = [0.3, 0.9, 1.9, 3.2, 4.4]

export default function Invest() {
  const { t } = useI18n()
  const v = t.invest
  useDocMeta(t.meta.investTitle, t.meta.investDesc)

  const mo = v.forecast.monthShort
  const period = `${mo} ${MARGIN_MONTHS[0]}–${MARGIN_MONTHS[MARGIN_MONTHS.length - 1]}`

  const line = (values: number[], key: string) =>
    MONTHS.map((m, i) => ({
      key: `m${m}`,
      label: `${mo} ${m}`,
      axisLabel: i % 3 === 0 ? `${mo} ${m}` : undefined,
      values: { [key]: values[i] },
    }))

  const bars = (values: number[]) =>
    MARGIN_MONTHS.map((m, i) => ({ key: `m${m}`, label: `${mo} ${m}`, axisLabel: String(m), value: values[i] }))

  return (
    <Shell>
      {/* ── шапка ───────────────────────────────────────────────────────── */}
      <section>
        <Badge tone="warning">{v.tagline}</Badge>
        <h1 className="display mt-6 max-w-[16ch] text-[clamp(2.25rem,6vw,4.5rem)] font-semibold text-foreground">
          {v.headlineA} <Ink>{v.headlineB}</Ink>
        </h1>
        <p className="mt-6 max-w-[68ch] text-lg text-secondary">{v.lead.join(' ')}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <LinkButton variant="primary" size="lg" href={site.tgUrl}>
            <Send size={16} /> {v.contact.tg}
          </LinkButton>
          <LinkButton variant="secondary" size="lg" href={site.onepager}>
            <FileDown size={16} /> {v.docs.onepager}
          </LinkButton>
          <LinkButton variant="secondary" size="lg" href={site.deck}>
            <FileDown size={16} /> {v.docs.deck}
          </LinkButton>
        </div>
      </section>

      {/* ── профайл ─────────────────────────────────────────────────────── */}
      <Section n="01" label={v.profile.label} title={v.profile.note}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {v.profile.cells.map(([label, value, hint]) => (
            <Surface key={label} className="!p-6">
              <div className="text-sm text-muted">{label}</div>
              <div className="display tnum mt-2 text-[2rem] font-semibold leading-tight text-foreground">{value}</div>
              <div className="mt-1 text-sm text-secondary">{hint}</div>
            </Surface>
          ))}
        </div>
      </Section>

      {/* ── рынок ───────────────────────────────────────────────────────── */}
      <Section n="02" label={v.market.label} title={`${v.market.label} ${v.market.note}`}>
        <Surface className="overflow-x-auto !p-0">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-4 text-left font-normal text-muted">
                  {v.market.head[0]}
                </th>
                <th scope="col" className="px-6 py-4 text-right font-normal text-muted">
                  {v.market.head[1]}
                </th>
              </tr>
            </thead>
            <tbody>
              {v.market.rows.map(([k, val]) => (
                <tr key={k} className="border-t border-line-subtle">
                  <th scope="row" className="px-6 py-3.5 text-left font-normal text-secondary">
                    {k}
                  </th>
                  <td className="tnum px-6 py-3.5 text-right font-medium text-foreground">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Surface>
      </Section>

      {/* ── юнит-экономика ──────────────────────────────────────────────── */}
      <Section n="03" label={v.forecast.label} title={v.forecast.punch.join(' ')} note={v.forecast.note}>
        <div className="grid gap-4 lg:grid-cols-2">
          <Surface>
            <h3 className="display m-0 mb-4 text-base font-semibold text-foreground">{v.forecast.usersTitle}</h3>
            <LineChart
              label={v.forecast.usersTitle}
              categoryLabel={t.ui.months}
              height={240}
              legend={false}
              data={line(USERS, 'users')}
              series={[{ key: 'users', label: v.forecast.usersTitle }]}
            />
          </Surface>
          <Surface>
            <h3 className="display m-0 mb-4 text-base font-semibold text-foreground">{v.forecast.mrrTitle}</h3>
            <LineChart
              label={v.forecast.mrrTitle}
              categoryLabel={t.ui.months}
              height={240}
              legend={false}
              formatValue={(n) => `${n}K`}
              formatTick={(n) => `${n}K`}
              data={line(MRR, 'mrr')}
              series={[{ key: 'mrr', label: v.forecast.mrrTitle, color: '#e8825f' }]}
            />
          </Surface>
          <Surface>
            <h3 className="display m-0 mb-4 text-base font-semibold text-foreground">{v.forecast.marginTitle}</h3>
            <BarChart
              label={v.forecast.marginTitle}
              period={period}
              averageLabel={t.ui.avg}
              valueLabel={t.ui.atPoint}
              showAverage={false}
              categoryLabel={t.ui.months}
              height={220}
              formatValue={(n) => `${Math.round(n)}%`}
              data={bars(MARGIN)}
            />
          </Surface>
          <Surface>
            <h3 className="display m-0 mb-4 text-base font-semibold text-foreground">{v.forecast.profitTitle}</h3>
            <BarChart
              label={v.forecast.profitTitle}
              period={period}
              averageLabel={t.ui.avg}
              valueLabel={t.ui.atPoint}
              showAverage={false}
              categoryLabel={t.ui.months}
              height={220}
              formatValue={(n) => `${n.toFixed(1)}M`}
              data={bars(PROFIT)}
            />
          </Surface>
        </div>

        <p className="display mt-10 max-w-[30ch] text-[clamp(1.375rem,3vw,2rem)] font-medium text-foreground">
          {v.forecast.punch2A} <Ink>{v.forecast.punch2B}</Ink>, {v.forecast.punch2C} <Ink>{v.forecast.punch2D}</Ink>
        </p>
      </Section>

      {/* ── сильные стороны ─────────────────────────────────────────────── */}
      <Section n="04" label={v.strengths.label} title={v.strengths.note}>
        <div className="grid gap-4 sm:grid-cols-2">
          {v.strengths.items.map(([title, text]) => (
            <Point key={title} title={title} text={text} />
          ))}
        </div>
      </Section>

      {/* ── условия ─────────────────────────────────────────────────────── */}
      <Section n="05" label={v.terms.label} title={`${v.terms.label}: ${v.terms.note}`}>
        <div className="grid gap-4 lg:grid-cols-3">
          {v.terms.items.map((item) => {
            const featured = item.accent === 'violet'
            return (
              <Surface key={item.key} className={cn('flex flex-col', featured && 'border-[color:var(--accent)] shadow-raised')}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-muted">{item.key}</span>
                  <Badge size="sm" tone={featured ? 'info' : item.accent === 'orange' ? 'warning' : 'neutral'}>
                    {item.badge}
                  </Badge>
                </div>
                <h3 className="display m-0 mt-3 text-2xl font-semibold text-foreground">{item.name}</h3>
                <div className="display tnum mt-1 text-lg font-medium text-accent-strong">{item.amount}</div>

                <p className="mt-5 text-sm leading-relaxed text-secondary">{item.text}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.text2}</p>

                <dl className="m-0 mt-auto grid grid-cols-[1fr_auto] gap-y-1.5 border-t border-line-subtle pt-5 text-sm">
                  {item.facts.map(([k, val]) => (
                    <div key={k} className="contents">
                      <dt className="text-muted">{k}</dt>
                      <dd className="m-0 text-right font-medium text-foreground">{val}</dd>
                    </div>
                  ))}
                </dl>
              </Surface>
            )
          })}
        </div>

        <h3 className="display mb-4 mt-10 text-lg font-semibold text-foreground">{v.terms.allTitle}</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {v.terms.all.map(([title, text]) => (
            <Point key={title} title={title} text={text} />
          ))}
        </div>
      </Section>

      {/* ── контакт ─────────────────────────────────────────────────────── */}
      <Section n="06" label={v.contact.label} title={v.contact.headline} note={v.contact.body}>
        <div className="flex flex-wrap items-center gap-3">
          <LinkButton variant="primary" size="lg" href={site.tgUrl}>
            <Send size={16} /> {v.contact.tg}
          </LinkButton>
          <LinkButton
            variant="secondary"
            size="lg"
            href={`mailto:${site.email}?subject=${encodeURIComponent(v.contact.mailSubject)}`}
          >
            <Mail size={16} /> {v.contact.mail}
          </LinkButton>
        </div>

        <p className="mt-8 max-w-[90ch] text-xs leading-relaxed text-muted">{v.disclaimer}</p>

        <div className="mt-8">
          <LinkButton variant="ghost" to="/">
            <ArrowLeft size={16} /> {t.nav.back}
          </LinkButton>
        </div>
      </Section>
    </Shell>
  )
}
