import { Locale } from "./dictionaries"

const STORAGE_KEY = "app-locale"

export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "en"
  const lang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || ""
  if (lang.toLowerCase().startsWith("zh")) return "zh-CN"
  return "en"
}

export function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en"
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "zh-CN" || stored === "en") return stored
  } catch {
    // localStorage unavailable
  }
  return detectBrowserLocale()
}

export function persistLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // localStorage unavailable
  }
}