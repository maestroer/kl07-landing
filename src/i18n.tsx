import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ru, type Dict } from './content/ru'
import { en } from './content/en'

export type Lang = 'ru' | 'en'

const STORE_KEY = 'kl07.lang'

function initial(): Lang {
  try {
    const saved = localStorage.getItem(STORE_KEY)
    if (saved === 'ru' || saved === 'en') return saved
  } catch {
    /* приватный режим / заблокированное хранилище — просто идём дальше */
  }
  // Продукт для российского рынка — RU по умолчанию, независимо от локали браузера.
  return 'ru'
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict }

const I18nCtx = createContext<Ctx>({ lang: 'ru', setLang: () => {}, t: ru })

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORE_KEY, l)
    } catch {
      /* not critical */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<Ctx>(() => ({ lang, setLang, t: lang === 'ru' ? ru : en }), [lang, setLang])

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
}

export function useI18n() {
  return useContext(I18nCtx)
}

/** Проставляет title/description под текущий язык и страницу. */
export function useDocMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title
    const el = document.querySelector('meta[name="description"]')
    if (el) el.setAttribute('content', description)
  }, [title, description])
}
