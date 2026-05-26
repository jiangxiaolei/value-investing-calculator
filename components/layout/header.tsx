"use client"

import { useState } from "react"
import { useLocale } from "@/lib/i18n/i18n-context"
import { LocaleSwitcher } from "./locale-switcher"
import { ThemeToggle } from "./theme-toggle"
import { getToolsByCategory, categoryLabel } from "@/lib/tools-metadata"
import { Calculator, Sparkles, LayoutDashboard, Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const categories = [
  { key: "quant" as const, icon: Calculator },
  { key: "ai" as const, icon: Sparkles },
  { key: "dashboard" as const, icon: LayoutDashboard },
]

const categoryIcons: Record<string, React.ElementType> = {
  quant: Calculator,
  ai: Sparkles,
  dashboard: LayoutDashboard,
}

export function Header() {
  const { locale } = useLocale()
  const isZh = locale === "zh-CN"
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity shrink-0">
          <img src="/logo.svg" alt="归估值" width={28} height={28} className="flex-shrink-0" />
          <div className="flex items-center gap-1">
            <span className="font-bold text-sm text-amber-700 dark:text-amber-400">归</span>
            <span className="font-semibold text-sm">{isZh ? "估值" : "Guigu"}</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {/* All Tools dropdown */}
          <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
            <button
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              onClick={() => setToolsOpen(!toolsOpen)}
            >
              {isZh ? "全部工具" : "All Tools"}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
            </button>

            {toolsOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 rounded-xl border bg-background shadow-lg p-2 space-y-1 z-50">
                {categories.map((cat) => {
                  const CatIcon = cat.icon
                  const tools = getToolsByCategory(cat.key)
                  return (
                    <div key={cat.key}>
                      <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <CatIcon className="h-3 w-3" />
                        {categoryLabel(cat.key, isZh)}
                      </div>
                      {tools.map((tool) => {
                        const href = tool.id === "dashboard" ? "/dashboard" : `/tools/${tool.id}`
                        return (
                          <Link
                            key={tool.id}
                            href={href}
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            onClick={() => setToolsOpen(false)}
                          >
                            <span className="text-muted-foreground">{tool.id === "dashboard" ? "" : ""}</span>
                            <span>{isZh ? tool.zh : tool.en}</span>
                            {tool.category === "ai" && (
                              <span className="ml-auto text-[10px] font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-1.5 py-0.5 rounded">AI</span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Category links — scroll on home, navigate on tool pages */}
          {categories.map((cat) => {
            const CatIcon = cat.icon
            const href = isHome ? `#cat-${cat.key}` : `/#cat-${cat.key}`
            return (
              <a
                key={cat.key}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                <CatIcon className="h-3.5 w-3.5" />
                {categoryLabel(cat.key, isZh)}
              </a>
            )
          })}
          {/* Blog link */}
          <Link
            href="/blog"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors"
          >
            📖 {isZh ? "博客" : "Blog"}
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
          {/* Mobile hamburger */}
          <button
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={isZh ? "菜单" : "Menu"}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="max-w-5xl mx-auto px-4 py-3 space-y-1">
            {categories.map((cat) => {
              const CatIcon = cat.icon
              const tools = getToolsByCategory(cat.key)
              return (
                <div key={cat.key} className="py-1">
                  <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <CatIcon className="h-3 w-3" />
                    {categoryLabel(cat.key, isZh)}
                  </div>
                  {tools.map((tool) => {
                    const href = tool.id === "dashboard" ? "/dashboard" : `/tools/${tool.id}`
                    return (
                      <Link
                        key={tool.id}
                        href={href}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span>{isZh ? tool.zh : tool.en}</span>
                        {tool.category === "ai" && (
                          <span className="text-[10px] font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-1.5 py-0.5 rounded">AI</span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )
            })}
            {/* Blog link in mobile */}
            <Link
              href="/blog"
              className="flex items-center gap-2 px-3 py-2.5 mt-2 text-sm font-medium rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              📖 {isZh ? "价值投资博客" : "Value Investing Blog"}
              <span className="ml-auto text-xs opacity-60">→</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}