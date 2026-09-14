import { Link } from 'react-router-dom'
import { useDocMeta, useI18n } from '../i18n'
import { site } from '../site'
import { Chrome } from '../components/Chrome'
import { BarChart, LineChart } from '../components/Charts'
import { Mark, Reveal, SectionHead, Stat, Tag } from '../components/ui'

export default function Invest() {
  const { t } = useI18n()
  const v = t.invest
  useDocMeta(t.meta.investTitle, t.meta.investDesc)

  const m = v.forecast.monthShort
  const months = [6, 8, 10, 12, 14, 16, 18]
  const users = [75, 120, 150, 260, 340, 420, 500]
  const mrr = [110, 176, 220, 381, 498, 615, 733]
  const marginMonths = [9, 12, 14, 16, 18]
  const margin = [12, 94, 153, 194, 250]
  const profit = [0.3, 0.9, 1.9, 3.2, 4.4]

  const axis: [string, string, string] = [`${m} 6`, `${m} 12`, `${m} 18`]

  return (
    <Chrome title={t.chrome.invest}>
      {/* ── шапка ───────────────────────────────────────────────────────── */}
      <section>
        <p className="text-[12px] text-dim">{v.tagline}</p>
        <h1 className="mt-4 text-[32px] font-bold leading-tight tracking-tight text-white sm:text-[44px]">
          {v.headlineA}
          <br />
          <Mark>{v.headlineB}</Mark>
        </h1>

        <div className="mt-6 max-w-[760px] space-y-0.5 text-[13px] leading-relaxed text-txt">
          {v.lead.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px]">
          <span className="text-mute">{v.docs.label}</span>
          <a href={site.onepager} target="_blank" rel="noreferrer noopener" className="link">
            {v.docs.onepager}
          </a>
          <a href={site.deck} target="_blank" rel="noreferrer noopener" className="link">
            {v.docs.deck}
          </a>
        </div>
      </section>

      {/* ── профайл ─────────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="01" label={v.profile.label} note={v.profile.note} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {v.profile.cells.map(([label, value, hint], i) => (
            <Stat
              key={label}
              label={label}
              value={value}
              hint={hint}
              tone={i === 3 || i === 5 ? 'orange' : i === 1 ? 'white' : 'violet'}
            />
          ))}
        </div>
      </Reveal>

      {/* ── рынок ───────────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="02" label={v.market.label} note={v.market.note} />
        <div className="cell overflow-x-auto rounded-lg">
          <table className="w-full min-w-[520px] border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-soft">
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-mute">
                  {v.market.head[0]}
                </th>
                <th className="px-4 py-3 text-right text-[11px] uppercase tracking-wider text-mute">
                  {v.market.head[1]}
                </th>
              </tr>
            </thead>
            <tbody>
              {v.market.rows.map(([k, val]) => (
                <tr key={k} className="border-b border-soft last:border-0">
                  <td className="px-4 py-3 text-txt">{k}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-lilac">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* ── прогноз ─────────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="03" label={v.forecast.label} note={v.forecast.note} />

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <LineChart
            title={v.forecast.usersTitle}
            axis={axis}
            color="#8b7cf6"
            points={months.map((mo, i) => ({ x: `m${mo}`, v: users[i], label: String(users[i]) }))}
          />
          <LineChart
            title={v.forecast.mrrTitle}
            axis={axis}
            color="#e8825f"
            points={months.map((mo, i) => ({ x: `m${mo}`, v: mrr[i], label: `${mrr[i]}K` }))}
          />
        </div>

        <p className="mt-8 text-[18px] font-bold leading-snug text-white sm:text-[24px]">
          {v.forecast.punch[0]} <Mark>{v.forecast.punch[1]}</Mark> {v.forecast.punch[2]}{' '}
          <Mark tone="violet">{v.forecast.punch[3]}</Mark> {v.forecast.punch[4]}
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <BarChart
            title={v.forecast.marginTitle}
            color="#8b7cf6"
            points={marginMonths.map((mo, i) => ({ x: String(mo), v: margin[i], label: `${margin[i]}%` }))}
          />
          <BarChart
            title={v.forecast.profitTitle}
            color="#e8825f"
            points={marginMonths.map((mo, i) => ({
              x: String(mo),
              v: profit[i],
              label: `${profit[i].toFixed(1)}M`,
            }))}
          />
        </div>

        <p className="mt-8 text-[18px] font-bold leading-snug text-white sm:text-[22px]">
          {v.forecast.punch2A} <Mark>{v.forecast.punch2B}</Mark>, {v.forecast.punch2C}{' '}
          <Mark>{v.forecast.punch2D}</Mark>
        </p>
      </Reveal>

      {/* ── сильные стороны ─────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="04" label={v.strengths.label} note={v.strengths.note} />
        <div className="grid gap-3 sm:grid-cols-2">
          {v.strengths.items.map(([title, text]) => (
            <div key={title} className="cell rounded-lg px-4 py-4">
              <div className="mb-1.5 font-bold text-white">{title}</div>
              <div className="text-[12px] leading-relaxed text-dim">{text}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── условия ─────────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="05" label={v.terms.label} note={v.terms.note} />
        <div className="grid gap-3 lg:grid-cols-3">
          {v.terms.items.map((item) => {
            const color =
              item.accent === 'violet' ? 'text-lilac' : item.accent === 'orange' ? 'text-orange' : 'text-white'
            return (
              <div
                key={item.key}
                className={`cell flex flex-col rounded-lg px-5 py-5 ${
                  item.accent === 'violet' ? 'border-violet/35' : ''
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider text-mute">{item.key}</span>
                  <Tag tone={item.accent === 'orange' ? 'orange' : item.accent === 'violet' ? 'violet' : 'green'}>
                    {item.badge}
                  </Tag>
                </div>

                <div className={`mt-2 text-[18px] font-bold leading-tight ${color}`}>{item.name}</div>
                <div className="mt-1 text-[15px] font-bold text-white">{item.amount}</div>

                <p className="mt-4 text-[12px] leading-relaxed text-txt">{item.text}</p>
                <p className="mt-3 text-[12px] leading-relaxed text-dim">{item.text2}</p>

                <div className="mt-auto space-y-1 border-t border-soft pt-4 text-[12px]">
                  {item.facts.map(([k, val]) => (
                    <div key={k} className="flex justify-between gap-3">
                      <span className="text-mute">{k}</span>
                      <span className="text-right font-bold text-txt">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6">
          <div className="mb-3 text-[12px] font-bold text-white">{v.terms.allTitle}</div>
          <div className="grid gap-3 sm:grid-cols-3">
            {v.terms.all.map(([title, text]) => (
              <div key={title} className="cell rounded-lg px-4 py-4">
                <div className="mb-1 font-bold text-lilac">{title}</div>
                <div className="text-[12px] leading-relaxed text-dim">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── контакт ─────────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="06" label={v.contact.label} note={v.contact.note} />
        <div className="cell rounded-lg px-5 py-6 sm:px-7 sm:py-8">
          <p className="max-w-[720px] text-[18px] font-bold leading-snug text-white sm:text-[22px]">
            {v.contact.headline}
          </p>
          <p className="mt-3 max-w-[720px] text-[12px] leading-relaxed text-dim">{v.contact.body}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={site.tgUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-md border border-orange/60 bg-orange/15 px-6 py-3 text-center text-[13px] font-bold text-orange transition-colors hover:bg-orange/25"
            >
              {v.contact.tg} — {site.tg}
            </a>
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent(v.contact.mailSubject)}`}
              className="rounded-md border border-line px-6 py-3 text-center text-[13px] font-bold text-lilac transition-colors hover:border-violet/60 hover:bg-violet/10"
            >
              {v.contact.mail}
            </a>
          </div>
        </div>

        <p className="mt-6 max-w-[860px] text-[11px] leading-relaxed text-mute">{v.disclaimer}</p>

        <Link to="/" className="link mt-8 inline-block text-[12px]">
          ← {t.nav.back}
        </Link>
      </Reveal>
    </Chrome>
  )
}
