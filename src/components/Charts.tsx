/* Графики в стиле презентации: тонкие линии, подписи значений прямо над точками. */

type Point = { x: string; v: number; label: string }

const VIOLET = '#8b7cf6'

/* ── линейный график ───────────────────────────────────────────────────── */

export function LineChart({
  title,
  points,
  color = VIOLET,
  axis,
}: {
  title: string
  points: Point[]
  color?: string
  axis: [string, string, string]
}) {
  const W = 640
  const H = 250
  const padX = 26
  const padTop = 40
  const padBottom = 34

  const values = points.map((p) => p.v)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1

  const px = (i: number) => padX + (i * (W - padX * 2)) / (points.length - 1)
  const py = (v: number) => padTop + (1 - (v - min) / span) * (H - padTop - padBottom) * 0.86 + (H - padTop - padBottom) * 0.07

  const path = points.map((p, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${py(p.v).toFixed(1)}`).join(' ')
  const area = `${path} L${px(points.length - 1).toFixed(1)},${H - padBottom} L${px(0).toFixed(1)},${H - padBottom} Z`
  const gid = `grad-${title.replace(/\W+/g, '')}`

  return (
    <figure className="m-0">
      <figcaption className="mb-3 text-[12px] font-bold text-txt">{title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={title}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.20" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((f) => (
          <line
            key={f}
            x1={padX}
            x2={W - padX}
            y1={padTop + f * (H - padTop - padBottom)}
            y2={padTop + f * (H - padTop - padBottom)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        <path d={area} fill={`url(#${gid})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, i) => (
          <g key={p.x}>
            <circle cx={px(i)} cy={py(p.v)} r="4" fill={color} />
            <text
              x={px(i)}
              y={py(p.v) - 13}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="700"
              fill="#e7e5f2"
              fontFamily="inherit"
            >
              {p.label}
            </text>
          </g>
        ))}

        <text x={padX} y={H - 10} fontSize="11" fill="#57556e" fontFamily="inherit">
          {axis[0]}
        </text>
        <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="11" fill="#57556e" fontFamily="inherit">
          {axis[1]}
        </text>
        <text x={W - padX} y={H - 10} textAnchor="end" fontSize="11" fill="#57556e" fontFamily="inherit">
          {axis[2]}
        </text>
      </svg>
    </figure>
  )
}

/* ── столбчатый график ─────────────────────────────────────────────────── */

export function BarChart({
  title,
  points,
  color = VIOLET,
}: {
  title: string
  points: Point[]
  color?: string
}) {
  const W = 640
  const H = 250
  const padX = 26
  const padTop = 40
  const padBottom = 34
  const max = Math.max(...points.map((p) => p.v))
  const slot = (W - padX * 2) / points.length
  const bw = slot * 0.62
  const base = H - padBottom

  return (
    <figure className="m-0">
      <figcaption className="mb-3 text-[12px] font-bold text-txt">{title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={title}>
        {[0, 0.5, 1].map((f) => (
          <line
            key={f}
            x1={padX}
            x2={W - padX}
            y1={padTop + f * (H - padTop - padBottom)}
            y2={padTop + f * (H - padTop - padBottom)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        {points.map((p, i) => {
          const h = Math.max(4, (p.v / max) * (base - padTop - 6))
          const x = padX + i * slot + (slot - bw) / 2
          return (
            <g key={p.x}>
              <rect x={x} y={base - h} width={bw} height={h} rx="3" fill={color} opacity="0.9" />
              <text
                x={x + bw / 2}
                y={base - h - 9}
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="700"
                fill="#e7e5f2"
                fontFamily="inherit"
              >
                {p.label}
              </text>
              <text
                x={x + bw / 2}
                y={H - 10}
                textAnchor="middle"
                fontSize="11"
                fill="#57556e"
                fontFamily="inherit"
              >
                {p.x}
              </text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
