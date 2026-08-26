import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '../i18n'
import { wallets } from '../site'

/** Окно донатов — повторяет оболочку основного окна проекта. */
export function DonateModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const d = t.home.donate
  const [copied, setCopied] = useState<string | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  async function copy(key: string, address: string) {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
    } catch {
      // буфер недоступен (http, старый браузер) — выделяем текст, чтобы скопировать вручную
      const node = document.getElementById(`addr-${key}`)
      if (node) {
        const range = document.createRange()
        range.selectNodeContents(node)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
      return
    }
    setCopied(key)
    window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600)
  }

  // Портал в body: у окна проекта есть backdrop-filter, а он делает элемент
  // containing block для position:fixed — иначе модалка центрируется по карточке.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-3 py-10 backdrop-blur-sm sm:items-center sm:px-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={d.heading}
    >
      <div className="term w-full max-w-[620px]" onClick={(e) => e.stopPropagation()}>
        {/* титульная строка — как у основного окна */}
        <div className="flex items-center gap-3 border-b border-soft px-4 py-2.5">
          <div className="flex shrink-0 gap-1.5" aria-hidden="true">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={d.close}
              className="h-[10px] w-[10px] rounded-full bg-[#ff5f57] transition-transform hover:scale-125"
            />
            <span className="h-[10px] w-[10px] rounded-full bg-[#febc2e] opacity-60" />
            <span className="h-[10px] w-[10px] rounded-full bg-[#28c840] opacity-60" />
          </div>
          <div className="min-w-0 flex-1 truncate text-center text-[12px] text-dim">{d.window}</div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-[11px] text-mute transition-colors hover:text-orange"
          >
            {d.close}
          </button>
        </div>

        <div className="px-5 py-6 sm:px-6">
          <div className="text-[18px] font-bold leading-tight text-white">{d.heading}</div>
          <p className="mt-2 max-w-[460px] text-[12px] leading-relaxed text-dim">{d.body}</p>

          <div className="mt-6 cell rounded-lg">
            {wallets.map((w, i) => {
              const key = `${w.ticker}-${w.network}`
              const has = w.address.trim().length > 0
              return (
                <div
                  key={key}
                  className={`flex flex-col gap-1.5 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 ${
                    i ? 'border-t border-soft' : ''
                  }`}
                >
                  <div className="flex w-[128px] shrink-0 items-baseline gap-2">
                    <span className="font-bold text-lilac">{w.ticker}</span>
                    <span className="text-[11px] text-mute">{w.network}</span>
                  </div>

                  {has ? (
                    <button
                      type="button"
                      onClick={() => copy(key, w.address)}
                      className="group flex min-w-0 flex-1 items-center gap-2 text-left"
                      title={d.hint}
                    >
                      <span
                        id={`addr-${key}`}
                        className="min-w-0 flex-1 truncate text-[12px] text-txt transition-colors group-hover:text-orange"
                      >
                        {w.address}
                      </span>
                      <span className="shrink-0 text-[11px] text-mute transition-colors group-hover:text-orange">
                        {copied === key ? d.copied : '⧉'}
                      </span>
                    </button>
                  ) : (
                    <span className="flex-1 text-[12px] text-mute">— {d.soon}</span>
                  )}
                </div>
              )
            })}
          </div>

          <p className="mt-3 text-[11px] text-mute">{d.hint}</p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
