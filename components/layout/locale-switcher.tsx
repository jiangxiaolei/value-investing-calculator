"use client"

import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLocale } from "@/lib/i18n/i18n-context"
import type { Locale } from "@/lib/i18n/dictionaries"

const localeLabels: Record<Locale, string> = {
  "zh-CN": "中文",
  en: "English",
}

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useLocale()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title={t("header.locale")} className="h-9 w-9">
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(localeLabels) as Locale[]).map((key) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setLocale(key)}
            className={locale === key ? "font-semibold" : ""}
          >
            {localeLabels[key]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}