"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { Locale, TranslationKey, dictionaries } from "./dictionaries"
import { getInitialLocale, persistLocale } from "./locale-utils"

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setLocaleState(getInitialLocale())
    setMounted(true)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    persistLocale(next)
    document.documentElement.lang = next === "zh-CN" ? "zh-CN" : "en"
  }, [])

  const t = useCallback(
    (key: TranslationKey): string => {
      return dictionaries[locale][key] || dictionaries["en"][key] || key
    },
    [locale]
  )

  if (!mounted) {
    return (
      <LocaleContext.Provider value={{ locale: "en", setLocale, t }}>
        {children}
      </LocaleContext.Provider>
    )
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}

export function useT(): (key: TranslationKey) => string {
  return useLocale().t
}