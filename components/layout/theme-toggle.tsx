"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useT } from "@/lib/i18n/i18n-context"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const t = useT()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <Button variant="ghost" size="icon" disabled className="h-9 w-9" />

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      title={t("header.theme")}
      className="h-9 w-9"
    >
      {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}