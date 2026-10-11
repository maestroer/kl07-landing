import { Moon, Send, Sun } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/arc/button/button'
import { LetterCascade } from '@/components/ui/letter-cascade'
import { LinkButton } from '@/components/kit'
import { useI18n } from '@/i18n'
import { site } from '@/site'
import { useTheme } from '@/theme'
import { cn } from '@/lib/utils'

/** Оболочка всех страниц: плавающая шапка-пилюля, контент, подвал. */
export function Shell({ children, banner }: { children: React.ReactNode; banner?: React.ReactNode }) {
  const { lang, setLang, t } = useI18n()
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()

  const items = [
    { to: '/', label: t.nav.product, active: !pathname.startsWith('/invest') && !pathname.startsWith('/b2b') },
    { to: '/b2b', label: t.nav.b2b, active: pathname.startsWith('/b2b') },
    { to: '/invest', label: t.nav.invest, active: pathname.startsWith('/invest') },
  ]

  return (
    <div className="relative min-h-screen">
      <div className="wash" aria-hidden="true" />
      {banner}

      <header className="sticky top-3 z-40 mx-auto w-full max-w-[1160px] px-3 sm:px-6">
        <div className="flex items-center gap-1 rounded-full border border-line bg-[color-mix(in_oklab,var(--surface)_82%,transparent)] py-1.5 pl-2 pr-1.5 shadow-raised backdrop-blur-xl sm:gap-2">
          <Link to="/" className="px-1.5 text-foreground sm:px-3" aria-label="KL07">
            <LetterCascade text="KL07" className="display text-base font-semibold sm:text-lg" />
          </Link>

          <nav className="flex items-center gap-0.5" aria-label="KL07">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                aria-current={item.active ? 'page' : undefined}
                className={cn(
                  'rounded-full px-2 py-1.5 text-[13px] transition-colors sm:px-3 sm:text-sm',
                  item.active
                    ? 'bg-surface-muted font-medium text-foreground'
                    : 'text-secondary hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
              aria-label={t.ui.langSwitch}
            >
              {lang === 'ru' ? 'EN' : 'RU'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggle}
              aria-label={theme === 'dark' ? t.ui.themeLight : t.ui.themeDark}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
            <span className="hidden sm:inline-flex">
              <LinkButton variant="primary" size="sm" href={site.tgUrl}>
                <Send size={14} /> {t.nav.tg}
              </LinkButton>
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1160px] px-4 pb-24 pt-14 sm:px-6 sm:pt-20">{children}</main>

      <footer className="relative z-10 border-t border-line">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:px-6">
          <span className="display font-semibold text-foreground">KL07</span>
          <span>{t.footer.rights}</span>
          <span className="hidden sm:inline" aria-hidden="true">
            ·
          </span>
          <span>{t.footer.built}</span>
          <a
            href={site.tgUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-secondary underline-offset-4 hover:text-foreground hover:underline sm:ml-auto"
          >
            {t.nav.tg}
          </a>
        </div>
      </footer>
    </div>
  )
}
