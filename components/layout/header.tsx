"use client"

import { useLocale } from "@/lib/i18n/i18n-context"
import { LocaleSwitcher } from "./locale-switcher"
import { ThemeToggle } from "./theme-toggle"
import Link from "next/link"

export function Header() {
  const { locale } = useLocale()
  const isZh = locale === "zh-CN"

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img src="/logo.svg" alt="归估值" width={28} height={28} className="flex-shrink-0" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-green-700 dark:text-green-400">归</span>
            <span className="font-semibold text-sm">
              {isZh ? "估值" : "Guigu"}
            </span>
          </div>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          <span className="px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 rounded-md">
            {isZh ? "工具箱" : "Tools"}
          </span>
        </nav>

        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
