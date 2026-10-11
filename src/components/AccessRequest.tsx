import { Mail, Send } from 'lucide-react'
import { CopyButton } from '@/components/arc/copy-button/copy-button'
import { LinkButton, Surface } from '@/components/kit'
import { useI18n } from '@/i18n'
import { site } from '@/site'

/**
 * Заявка на ранний доступ без формы и бэкенда: человек копирует адрес вместе с готовым
 * текстом письма и отправляет его из своей почты.
 */
export function AccessRequest() {
  const { t } = useI18n()
  const c = t.home.cta

  // Один кусок для буфера: адрес, тема и текст — чтобы вставить в письмо, ничего не набирая.
  const clipboard = `${site.email}\n\n${c.subjectLabel}: ${c.subject}\n\n${c.template}`
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(c.template)}`

  return (
    <Surface className="!p-0">
      <dl className="m-0 text-sm">
        <div className="flex gap-4 border-b border-line-subtle px-6 py-4 sm:px-8">
          <dt className="w-14 shrink-0 text-muted">{c.to}</dt>
          <dd className="m-0 break-all font-medium text-foreground">{site.email}</dd>
        </div>
        <div className="flex gap-4 border-b border-line-subtle px-6 py-4 sm:px-8">
          <dt className="w-14 shrink-0 text-muted">{c.subjectLabel}</dt>
          <dd className="m-0 font-medium text-foreground">{c.subject}</dd>
        </div>
      </dl>

      <p className="m-0 whitespace-pre-wrap px-6 py-6 text-base leading-relaxed text-secondary sm:px-8">{c.template}</p>

      <div className="flex flex-col gap-4 border-t border-line bg-surface-muted px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <CopyButton value={clipboard} label={c.copy} />
          <LinkButton variant="secondary" href={mailto}>
            <Mail size={16} /> {c.open}
          </LinkButton>
          <LinkButton variant="ghost" href={site.tgUrl}>
            <Send size={16} /> {c.tg}
          </LinkButton>
        </div>
        <p className="m-0 text-xs text-muted">{c.hint}</p>
      </div>
    </Surface>
  )
}
