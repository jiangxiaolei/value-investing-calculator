"use client"

import { useLocale } from "@/lib/i18n/i18n-context"

export function Footer() {
  const { t } = useLocale()

  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>{t("footer.text")}</p>
        <p className="mt-1">{t("app.disclaimer")}</p>
      </div>
    </footer>
  )
}