"use client"

import { Calculator } from "lucide-react"
import { useLocale } from "@/lib/i18n/i18n-context"
import { LocaleSwitcher } from "./locale-switcher"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const { t } = useLocale()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-chart-2" />
          <span className="font-semibold text-sm sm:text-base">{t("app.title")}</span>
        </div>
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}