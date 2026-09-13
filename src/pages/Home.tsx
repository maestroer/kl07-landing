import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocMeta, useI18n } from '../i18n'
import { fundraising, site } from '../site'
import { Chrome } from '../components/Chrome'
import { DonateModal } from '../components/DonateModal'
import { CopyMail, Mark, Reveal, SectionHead, Stat, Tag } from '../components/ui'
import { Waitlist } from '../components/Waitlist'

export default function Home() {
  const { t } = useI18n()
  const h = t.home
  const [donateOpen, setDonateOpen] = useState(false)
  useDocMeta(t.meta.homeTitle, t.meta.homeDesc)

  return (
    <Chrome title={t.chrome.home}>
      {/* ── шапка ───────────────────────────────────────────────────────── */}
      <section className="grid gap-10 lg:grid-cols-[1fr_280px] lg:gap-12">
        <div>
          <h1 className="text-[42px] font-bold leading-none tracking-tight text-white sm:text-[56px]">
            KL<span className="text-violet">07</span>
          </h1>
          <p className="mt-3 text-[13px] text-dim">{h.tagline}</p>

          <p className="mt-6 max-w-[560px] text-[17px] font-bold leading-snug text-white sm:text-[19px]">
            {h.headline[0]} <Mark>{h.headline[1]}</Mark>
          </p>

          <div className="mt-7 space-y-1.5">
            {h.whoami.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-x-4 sm:flex-row">
                <span className="w-[120px] shrink-0 text-blu">{k}</span>
                <span className="text-txt">{v}</span>
              </div>
            ))}
            <div className="flex flex-col gap-x-4 pt-1 sm:flex-row">
              <span className="w-[120px] shrink-0 text-blu">{h.findme}</span>
              <span className="flex flex-wrap gap-x-3">
                <a href={site.tgUrl} target="_blank" rel="noreferrer noopener" className="link">
                  [telegram]
                </a>
                <CopyMail
                  value={site.email}
                  label="email"
                  hint={h.copyMail.hint}
                  copiedText={h.copyMail.copied}
                  manualText={h.copyMail.manual}
                />
              </span>
            </div>
          </div>
        </div>

        {/* панель статуса + прогресс сбора */}
        <div className="text-[12px] leading-relaxed">
          <div className="flex justify-between gap-4">
            <span className="font-bold text-orange">★ {h.statusPanel.star[0]}</span>
            <span className="font-bold text-white">{h.statusPanel.star[1]}</span>
          </div>

          {h.statusPanel.rows.map(([k, v], i, arr) => (
            <div key={k} className="mt-1 flex justify-between gap-4">
              <span className="text-blu">
                <span className="text-mute">{i === arr.length - 1 ? '└' : '├'}</span> {k}
              </span>
              <span className="text-lilac">{v}</span>
            </div>
          ))}

          <DonateProgress
            raised={fundraising.raised}
            goal={fundraising.goal}
            label={h.donate.raisedLabel}
            of={h.donate.of}
            locale={t.code === 'ru' ? 'ru-RU' : 'en-US'}
          />

          <button
            type="button"
            onClick={() => setDonateOpen(true)}
            className="mt-3 w-full rounded-md border border-orange/60 bg-orange/15 px-4 py-2.5 text-[12px] font-bold text-orange transition-colors hover:bg-orange/25"
          >
            {h.donate.button} →
          </button>
        </div>
      </section>

      {/* ── проблема ────────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="01" label={h.problem.label} note={h.problem.note} />
        <div className="max-w-[760px] space-y-0.5 text-txt">
          {h.problem.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {h.problem.pains.map(([title, text]) => (
            <div key={title} className="cell rounded-lg px-4 py-4">
              <div className="mb-1 font-bold text-white">{title}</div>
              <div className="text-[12px] leading-relaxed text-dim">{text}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── сравнение ───────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="02" label={h.compare.label} note={h.compare.note} />
        <div className="cell overflow-x-auto rounded-lg">
          <table className="w-full min-w-[560px] border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-soft">
                <th className="px-4 py-3 text-left font-normal text-mute" />
                {h.compare.cols.map((c, i) => (
                  <th key={c} className={`px-3 py-3 text-center font-bold ${i === 0 ? 'text-lilac' : 'text-dim'}`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {h.compare.rows.map((row) => {
                const [name, ...cells] = row
                return (
                  <tr key={name as string} className="border-b border-soft last:border-0">
                    <td className="px-4 py-2.5 text-txt">{name}</td>
                    {(cells as number[]).map((v, i) => (
                      <td key={i} className="px-3 py-2.5 text-center">
                        {v ? (
                          <span className={i === 0 ? 'font-bold text-grn' : 'text-dim'}>✓</span>
                        ) : (
                          <span className="text-mute">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-[760px] text-[11px] leading-relaxed text-mute">{h.compare.footnote}</p>
      </Reveal>

      {/* ── модули ──────────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="03" label={h.modules.label} note={h.modules.note} />
        <div className="space-y-3">
          {h.modules.items.map((m) => (
            <div key={m.name} className="cell rounded-lg px-4 py-4 sm:px-5">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="text-[15px] font-bold text-white">{m.name}</span>
                <span className="text-[12px] text-orange">{m.kind}</span>
              </div>
              <p className="mt-2 max-w-[760px] text-[12px] leading-relaxed text-dim">{m.text}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── ai-архитектор ───────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="04" label={h.ai.label} note={h.ai.note} />
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div>
            <h2 className="text-[24px] font-bold leading-tight text-white sm:text-[30px]">
              AI-<Mark tone="violet">{t.words.architect}</Mark>
            </h2>
            <p className="mt-4 max-w-[520px] text-[15px] font-bold leading-snug text-white">
              {h.ai.headline[0]}
              <br />
              {h.ai.headline[1]}
            </p>
            <div className="mt-4 max-w-[520px] space-y-0.5 text-[12px] leading-relaxed text-dim">
              {h.ai.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <ol className="m-0 list-none space-y-5 p-0">
            {h.ai.steps.map(([title, text], i) => (
              <li key={title} className="flex gap-4">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border text-[12px] font-bold ${
                    i === 2 ? 'border-orange/50 bg-orange/12 text-orange' : 'border-violet/50 bg-violet/12 text-lilac'
                  }`}
                >
                  {i + 1}
                </span>
                <span>
                  <span className="block font-bold text-white">{title}</span>
                  <span className="block text-[12px] leading-relaxed text-dim">{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-10 text-[18px] font-bold leading-snug text-white sm:text-[24px]">
          {h.ai.punchA} <Mark>{h.ai.punchB}</Mark>
        </p>
      </Reveal>

      {/* ── тарифы ──────────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="05" label={h.pricing.label} note={h.pricing.note} />
        <div className="grid gap-3 md:grid-cols-3">
          {h.pricing.plans.map((p) => {
            const color = p.accent === 'violet' ? 'text-lilac' : p.accent === 'orange' ? 'text-orange' : 'text-white'
            return (
              <div
                key={p.name}
                className={`cell flex flex-col rounded-lg px-5 py-5 ${p.accent === 'violet' ? 'border-violet/30' : ''}`}
              >
                <div className="text-[11px] uppercase tracking-wider text-mute">{t.words.plan}</div>
                <div className={`mt-1 text-[20px] font-bold ${color}`}>{p.name}</div>

                <div className={`mt-4 text-[30px] font-bold leading-none ${color}`}>
                  {p.price}
                  <span className="text-[14px] font-normal text-dim">{p.per}</span>
                </div>
                <div className="mt-1.5 text-[11px] text-orange">{p.priceNote}</div>
                {p.alt && <div className="mt-0.5 text-[11px] text-mute">{p.alt}</div>}

                <p className="mt-5 min-h-[48px] text-[12px] leading-relaxed text-dim">{p.text}</p>

                <ul className="mt-4 space-y-1.5 border-t border-soft pt-4 text-[12px] text-txt">
                  {p.feats.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-grn">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </Reveal>

      {/* ── статус ──────────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="06" label={h.status.label} note={h.status.note} />
        <p className="text-[22px] font-bold leading-tight text-white sm:text-[28px]">
          {h.status.headlineA} <Mark>{h.status.headlineB}</Mark>
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="cell rounded-lg px-4 py-4">
            {h.status.log.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-x-4 py-1 text-[12px] sm:flex-row">
                <span className="w-[168px] shrink-0 text-blu">{k}</span>
                <span className="text-dim">{v}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {h.status.stats.map(([v, hint], i) => (
              <Stat key={v} value={v} hint={hint} tone={i === 1 ? 'white' : i === 2 ? 'orange' : 'violet'} />
            ))}
          </div>
        </div>

        <p className="mt-4 max-w-[760px] text-[12px] leading-relaxed text-mute">{h.status.left}</p>
      </Reveal>

      {/* ── вейтлист ────────────────────────────────────────────────────── */}
      <Reveal>
        <SectionHead n="07" label={h.cta.label} note={h.cta.note} />
        <p className="mb-3 text-[22px] font-bold leading-tight text-white sm:text-[26px]">{h.cta.headline}</p>
        <div className="mb-6 max-w-[720px] space-y-0.5 text-[12px] leading-relaxed text-dim">
          {h.cta.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <Waitlist />
      </Reveal>

      {/* ── переход на инвест-страницу ──────────────────────────────────── */}
      <Reveal>
        <Link
          to="/invest"
          className="mt-16 flex flex-col gap-2 rounded-lg border border-line bg-violet/[0.04] px-5 py-5 transition-colors hover:border-orange/50 hover:bg-orange/[0.05] sm:flex-row sm:items-center sm:gap-6"
        >
          <span className="chip chip-o shrink-0">{h.investBanner.label}</span>
          <span className="flex-1 text-[13px] text-txt">{h.investBanner.text}</span>
          <span className="shrink-0 font-bold text-lilac">{h.investBanner.link} →</span>
        </Link>
      </Reveal>

      {donateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
    </Chrome>
  )
}

function DonateProgress({
  raised,
  goal,
  label,
  of,
  locale,
}: {
  raised: number
  goal: number
  label: string
  of: string
  locale: string
}) {
  const pct = Math.min(100, Math.max(0, (raised / goal) * 100))
  const fmt = (n: number) => `${n.toLocaleString(locale)} ₽`

  return (
    <div className="mt-5 border-t border-soft pt-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-blu">{label}</span>
        <span className="font-bold text-orange">{Math.round(pct)}%</span>
      </div>

      <div
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={raised}
        aria-label={`${label}: ${fmt(raised)} ${of} ${fmt(goal)}`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet to-orange"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-3">
        <span className="font-bold text-white">{fmt(raised)}</span>
        <span className="text-mute">
          {of} {fmt(goal)}
        </span>
      </div>
    </div>
  )
}
