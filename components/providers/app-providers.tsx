"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { LocaleProvider } from "@/lib/i18n/i18n-context"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LocaleProvider>
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}