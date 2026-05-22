"use client"

import { useState } from "react"
import { useLocale } from "@/lib/i18n/i18n-context"
import { ArrowLeft, Shield, Calculator, BarChart3, Target, DollarSign, TrendingUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GrahamNumberCalculator } from "@/components/calculator/graham-number"
import { MarginOfSafetyCalculator } from "@/components/calculator/margin-of-safety"
import { PEPortfolioCalculator } from "@/components/calculator/pe-percentile"
import { TenXTenYearsCalculator } from "@/components/calculator/tenx-ten-years"
import { FCFQCalculator } from "@/components/calculator/fcf-quality"

type ToolId = "graham-number" | "margin-of-safety" | "pe-percentile" | "tenx-ten-years" | "fcf-quality" | null

type ToolMeta = {
  id: ToolId
  zh: string
  en: string
  descZh: string
  descEn: string
  icon: React.ElementType
}

const tools: ToolMeta[] = [
  {
    id: "graham-number",
    zh: "格雷厄姆数",
    en: "Graham Number",
    descZh: "本杰明·格雷厄姆的保守估值公式，通过每股收益和每股净资产计算内在价值上限",
    descEn: "Benjamin Graham's conservative formula using EPS and book value per share",
    icon: Calculator,
  },
  {
    id: "margin-of-safety",
    zh: "安全边际",
    en: "Margin of Safety",
    descZh: "计算当前价格与内在价值的差距，判断当前价格是否具备安全边际",
    descEn: "Calculate the gap between price and intrinsic value to assess buy-zone safety",
    icon: Shield,
  },
  {
    id: "pe-percentile",
    zh: "PE分位对比",
    en: "PE Percentile",
    descZh: "对比当前市盈率在历史估值中的分位位置，判断估值高低",
    descEn: "See where current P/E sits in the historical distribution",
    icon: BarChart3,
  },
  {
    id: "tenx-ten-years",
    zh: "十年十倍",
    en: "10x in 10 Years",
    descZh: "计算十年十倍需要的年化增速，评估个股增长预期是否匹配",
    descEn: "Calculate required annual growth rate for 10x in 10 years",
    icon: Target,
  },
  {
    id: "fcf-quality",
    zh: "FCF质量检测",
    en: "FCF Quality",
    descZh: "检验净利润是否由真实现金流支撑，识别「纸面富贵」风险",
    descEn: "Check if net profit is backed by real cash flow — spot financial fraud risk",
    icon: DollarSign,
  },
]

function ToolCard({ tool, isZh, onSelect }: { tool: ToolMeta; isZh: boolean; onSelect: () => void }) {
  const Icon = tool.icon
  return (
    <button
      onClick={onSelect}
      className="
        group relative flex flex-col gap-4 rounded-2xl border p-6 text-left w-full
        bg-background hover:border-green-300 hover:shadow-lg hover:shadow-green-100/50
        dark:hover:shadow-green-950/30 dark:hover:border-green-700
        transition-all duration-200 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-green-500/30
      "
    >
      {/* Icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
          <Icon className="h-6 w-6" />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
            {isZh ? "立即使用 →" : "Use →"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-base text-foreground">
          {isZh ? tool.zh : tool.en}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isZh ? tool.descZh : tool.descEn}
        </p>
      </div>
    </button>
  )
}

export function LandingPage() {
  const { locale } = useLocale()
  const isZh = locale === "zh-CN"
  const [selectedTool, setSelectedTool] = useState<ToolId>(null)

  // Tool renderer
  const renderTool = () => {
    switch (selectedTool) {
      case "graham-number":
        return <GrahamNumberCalculator />
      case "margin-of-safety":
        return <MarginOfSafetyCalculator />
      case "pe-percentile":
        return <PEPortfolioCalculator />
      case "tenx-ten-years":
        return <TenXTenYearsCalculator />
      case "fcf-quality":
        return <FCFQCalculator />
      default:
        return null
    }
  }

  const selectedMeta = tools.find((t) => t.id === selectedTool)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero — always visible when no tool selected */}
      <section className="bg-gradient-to-b from-green-50/60 to-background dark:from-green-950/20 py-10 px-4 border-b">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-medium px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {isZh ? "免费工具 · 无需注册" : "Free Tools · No Sign-up"}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="text-green-700 dark:text-green-400">归估值</span>
            <span className="text-foreground"> — </span>
            <span className="text-foreground">{isZh ? "价值投资工具箱" : "Value Investing Toolkit"}</span>
          </h1>

          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {isZh
              ? "价值投资的本质是定性分析。定量工具帮你快速筛选、验证和比较，让判断更高效。"
              : "Value investing is fundamentally qualitative. Quantitative tools help you filter, verify, and compare — making judgment more efficient."}
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-green-600" />
              {isZh ? "安全边际" : "Margin of Safety"}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-600" />
              {isZh ? "增长复利" : "Compounding Growth"}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-green-600" />
              {isZh ? "秒出结论" : "Instant Insight"}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="flex-1 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Tool view — shown when a tool is selected */}
          {selectedTool && selectedMeta ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Back button + tool title */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTool(null)}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {isZh ? "返回工具箱" : "Back to Tools"}
                </Button>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                  {(() => {
                    const Icon = selectedMeta.icon
                    return <Icon className="h-5 w-5" />
                  })()}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{isZh ? selectedMeta.zh : selectedMeta.en}</h2>
                  <p className="text-sm text-muted-foreground">{isZh ? selectedMeta.descZh : selectedMeta.descEn}</p>
                </div>
              </div>

              {/* Tool component */}
              <div className="pt-2">
                {renderTool()}
              </div>
            </div>
          ) : (
            /* Tool grid — shown when no tool selected */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isZh={isZh}
                  onSelect={() => setSelectedTool(tool.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
