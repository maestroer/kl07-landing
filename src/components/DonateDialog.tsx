import { CopyButton } from '@/components/arc/copy-button/copy-button'
import { Dialog, DialogContent } from '@/components/arc/dialog/dialog'
import { useI18n } from '@/i18n'
import { wallets } from '@/site'

/** Окно с крипто-кошельками проекта. Адреса задаются в src/site.ts. */
export function DonateDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n()
  const d = t.home.donate

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={d.heading} description={d.body}>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {wallets.map((w) => {
            const has = w.address.trim().length > 0
            return (
              <li
                key={`${w.ticker}-${w.network}`}
                className="flex items-center gap-3 rounded-panel border border-line bg-surface-muted px-4 py-3"
              >
                <div className="w-[84px] shrink-0">
                  <div className="display text-sm font-semibold text-foreground">{w.ticker}</div>
                  <div className="text-xs text-muted">{w.network}</div>
                </div>
                {/* Адрес показываем целиком: перед отправкой его сверяют глазами. */}
                <code className="min-w-0 flex-1 break-all text-xs leading-snug text-secondary">
                  {has ? w.address : `— ${d.soon}`}
                </code>
                {has && (
                  <CopyButton
                    value={w.address}
                    iconOnly
                    variant="plain"
                    label={`${t.ui.copy}: ${w.ticker} ${w.network}`}
                  />
                )}
              </li>
            )
          })}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
