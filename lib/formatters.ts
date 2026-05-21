import { Locale } from "./i18n/dictionaries"

export function formatCurrency(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "zh-CN" ? "zh-CN" : "en-US", {
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value}%`
}

export function formatNumber(value: number, locale: Locale, decimals = 1): string {
  return new Intl.NumberFormat(locale === "zh-CN" ? "zh-CN" : "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value)
}