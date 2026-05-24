"use client"

import { type ReactNode } from "react"
import Link from "next/link"
import { ChevronRight, ArrowLeft, Calculator, Shield, Sparkles } from "lucide-react"
import { useLocale } from "@/lib/i18n/i18n-context"
import { getToolMeta, getRelatedTools, categoryLabel, type ToolCategory } from "@/lib/tools-metadata"

const categoryIcons: Record<ToolCategory, ReactNode> = {
  quant: <Calculator className="h-3 w-3" />,
  ai: <Sparkles className="h-3 w-3 text-purple-500" />,
  dashboard: <Shield className="h-3 w-3 text-blue-500" />,
}

export function ToolPageLayout({
  toolId,
  children,
}: {
  toolId: string
  children: ReactNode
}) {
  const { locale } = useLocale()
  const isZh = locale === "zh-CN"
  const meta = getToolMeta(toolId)
  const related = getRelatedTools(toolId)

  if (!meta) return <>{children}</>

  const catLabel = categoryLabel(meta.category, isZh)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
          {isZh ? "首页" : "Home"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="flex items-center gap-1">
          {categoryIcons[meta.category]}
          <span>{catLabel}</span>
        </span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">
          {isZh ? meta.zh : meta.en}
        </span>
      </nav>

      {/* Back link (mobile) */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 hover:underline sm:hidden"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {isZh ? "返回全部工具" : "Back to all tools"}
      </Link>

      {/* Main tool content */}
      {children}

      {/* Related tools */}
      {related.length > 0 && (
        <section className="pt-6 border-t">
          <h2 className="text-lg font-semibold mb-4">
            {isZh ? "相关工具" : "Related Tools"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {related.map((rt) => {
              const href = rt.id === "dashboard" ? "/dashboard" : `/tools/${rt.id}`
              return (
                <Link
                  key={rt.id}
                  href={href}
                  className="group rounded-xl border p-4 hover:border-green-300 hover:shadow-md transition-all duration-200 bg-background"
                >
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {isZh ? rt.zh : rt.en}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                    {isZh ? rt.zhDesc : rt.enDesc}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}