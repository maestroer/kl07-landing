import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/arc/badge/badge'
import { Button, type ButtonProps } from '@/components/arc/button/button'
import { InViewTitle } from '@/components/arc/in-view-title/in-view-title'
import { cn } from '@/lib/utils'

/* Общие строительные блоки страниц. Сами контролы — из Arc UI, здесь только раскладка. */

export function Section({
  n,
  label,
  title,
  note,
  id,
  children,
}: {
  n: string
  label: string
  title: string
  note?: string
  id?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="mt-24 scroll-mt-28 sm:mt-32">
      <header className="mb-8 sm:mb-10">
        <div className="mb-4 flex items-center gap-3 text-sm text-muted">
          <span className="tnum">{n}</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
          <span>{label}</span>
        </div>
        <InViewTitle
          text={title}
          as="h2"
          variant="blur"
          className="display max-w-[24ch] text-[clamp(1.75rem,4.2vw,2.75rem)] font-semibold text-foreground"
        />
        {note && <p className="mt-4 max-w-[62ch] text-base text-secondary">{note}</p>}
      </header>
      {children}
    </section>
  )
}

export function Surface({
  className,
  muted = false,
  children,
}: {
  className?: string
  muted?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-surface border border-line p-6 sm:p-8',
        muted ? 'bg-surface-muted' : 'bg-surface shadow-resting',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Карточка-тезис: заголовок и пояснение. */
export function Point({ title, text, index }: { title: string; text: string; index?: number }) {
  return (
    <Surface className="flex h-full flex-col gap-2">
      {index !== undefined && (
        <span className="tnum mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-accent-subtle text-sm font-semibold text-accent-strong">
          {index}
        </span>
      )}
      <h3 className="display text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-secondary">{text}</p>
    </Surface>
  )
}

export function Ink({ children }: { children: React.ReactNode }) {
  return <span className="ink">{children}</span>
}

export function Tags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((x) => (
        <Badge key={x} size="sm" tone="neutral">
          {x}
        </Badge>
      ))}
    </div>
  )
}

/** Кнопка Arc, которая ведёт по ссылке: внутренний роут — через роутер, внешний — в новой вкладке. */
export function LinkButton({
  to,
  href,
  children,
  ...props
}: Omit<ButtonProps, 'onClick'> & { to?: string; href?: string }) {
  const navigate = useNavigate()
  return (
    <Button
      {...props}
      role="link"
      onClick={() => {
        if (to) navigate(to)
        else if (href?.startsWith('mailto:')) window.location.href = href
        else if (href) window.open(href, '_blank', 'noopener,noreferrer')
      }}
    >
      {children}
    </Button>
  )
}
