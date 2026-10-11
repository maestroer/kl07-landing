import { useEffect, useRef, useState } from 'react'
import { CircuitBoard } from '@/components/ui/circuit-board'
import { useTheme } from '@/theme'

export type FlowNode = {
  id: string
  /** Положение центра узла в долях ширины и высоты доски, 0..1. */
  x: number
  y: number
  label: string
  icon?: React.ReactNode
  status?: 'active' | 'processing'
  size?: 'sm' | 'md' | 'lg'
}

export type FlowLink = { from: string; to: string; bidirectional?: boolean }

/**
 * Обёртка над CircuitBoard из Componentry. Сам компонент рисует в пикселях и не знает
 * про ширину контейнера и про тему Arc — здесь координаты задаются долями, доска
 * тянется по ширине родителя, а цвета берутся из текущей темы.
 */
export function FlowBoard({
  nodes,
  links,
  height = 320,
  minWidth = 620,
  label,
}: {
  nodes: FlowNode[]
  links: FlowLink[]
  height?: number
  minWidth?: number
  label: string
}) {
  const { theme } = useTheme()
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setWidth(Math.max(minWidth, Math.floor(el.clientWidth)))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [minWidth])

  const dark = theme === 'dark'

  return (
    <div ref={ref} className="overflow-x-auto" role="img" aria-label={label}>
      {width > 0 && (
        <CircuitBoard
          // Узлы анимируются при появлении; при смене ширины пересоздаём доску, чтобы трассы не разъехались с узлами.
          key={`${width}-${theme}`}
          variant={theme}
          width={width}
          height={height}
          showGrid
          traceWidth={2}
          pulseSpeed={2.4}
          gridColor={dark ? 'rgba(255,255,255,0.06)' : 'rgba(20,20,30,0.07)'}
          traceColor={dark ? 'rgba(255,255,255,0.22)' : 'rgba(20,20,30,0.2)'}
          pulseColor={dark ? 'rgba(255,255,255,0.9)' : 'rgba(20,20,20,0.8)'}
          nodes={nodes.map((n) => ({
            id: n.id,
            x: Math.round(n.x * width),
            y: Math.round(n.y * height),
            label: n.label,
            icon: n.icon,
            status: n.status ?? 'active',
            size: n.size ?? 'md',
          }))}
          connections={links.map((l) => ({ from: l.from, to: l.to, animated: true, bidirectional: l.bidirectional }))}
        />
      )}
    </div>
  )
}
