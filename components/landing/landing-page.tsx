"use client"

import { useLocale } from "@/lib/i18n/i18n-context"
import { ArrowRight, Shield, Calculator, BarChart3, Target, DollarSign, TrendingUp, Zap, LayoutDashboard, Clock, AlertTriangle, Sparkles, ChevronRight } from "lucide-react"
import Link from "next/link"
import { categoryLabel, type ToolCategory } from "@/lib/tools-metadata"

type Tool = {
  id: string
  zh: string
  en: string
  descZh: string
  descEn: string
  href: string
  icon: React.ElementType
  ready: boolean
  new?: boolean
  badge?: string
  category: ToolCategory
}

const categories: { key: ToolCategory; icon: React.ElementType }[] = [
  { key: "quant", icon: Calculator },
  { key: "ai", icon: Sparkles },
  { key: "dashboard", icon: LayoutDashboard },
]

const tools: Tool[] = [
  // ── Quantitative Tools ──
  {
    id: "graham-number",
    zh: "格雷厄姆数",
    en: "Graham Number",
    descZh: "本杰明·格雷厄姆的保守估值公式，通过每股收益和每股净资产计算内在价值上限",
    descEn: "Benjamin Graham's conservative formula using EPS and book value per share",
    href: "/tools/graham-number",
    icon: Calculator,
    ready: true,
    new: true,
    category: "quant",
  },
  {
    id: "margin-of-safety",
    zh: "安全边际",
    en: "Margin of Safety",
    descZh: "计算当前价格与内在价值的差距，判断当前价格是否具备安全边际",
    descEn: "Calculate the gap between price and intrinsic value to assess buy-zone safety",
    href: "/tools/margin-of-safety",
    icon: Shield,
    ready: true,
    new: true,
    category: "quant",
  },
  {
    id: "pe-percentile",
    zh: "PE分位对比",
    en: "PE Percentile",
    descZh: "对比当前市盈率在历史估值中的分位位置，判断估值高低",
    descEn: "See where current P/E sits in the historical distribution",
    href: "/tools/pe-percentile",
    icon: BarChart3,
    ready: true,
    new: true,
    category: "quant",
  },
  {
    id: "tenx-ten-years",
    zh: "十年十倍",
    en: "10x in 10 Years",
    descZh: "计算十年十倍需要的年化增速，评估个股增长预期是否匹配",
    descEn: "Calculate required annual growth rate for 10x in 10 years",
    href: "/tools/tenx-ten-years",
    icon: Target,
    ready: true,
    new: true,
    category: "quant",
  },
  {
    id: "fcf-quality",
    zh: "FCF质量检测",
    en: "FCF Quality",
    descZh: "检验净利润是否由真实现金流支撑，识别「纸面富贵」风险",
    descEn: "Check if net profit is backed by real cash flow — spot financial fraud risk",
    href: "/tools/fcf-quality",
    icon: DollarSign,
    ready: true,
    new: true,
    category: "quant",
  },
  {
    id: "reverse-calculator",
    zh: "倒推估值",
    en: "Reverse Valuation",
    descZh: "输入目标回报、利润增速和未来市盈率，倒推合理估值与买入价格区间",
    descEn: "Enter target return, growth rate, and future P/E to reverse-engineer fair value",
    href: "/tools/reverse-calculator",
    icon: Clock,
    ready: true,
    category: "quant",
  },
  {
    id: "peg-ratio",
    zh: "PEG 估值",
    en: "PEG Ratio",
    descZh: "市盈率与盈利增速的比值，评估增长型企业的估值合理性",
    descEn: "Price/Earnings to Growth ratio — evaluate growth stock valuation",
    href: "/tools/peg-ratio",
    icon: TrendingUp,
    ready: true,
    new: true,
    category: "quant",
  },
  {
    id: "szr-calculator",
    zh: "市赚率 (SZR)",
    en: "SZR (PE/ROE)",
    descZh: "PE与ROE的比值，衡量价格与价值的匹配程度",
    descEn: "PE to ROE ratio — measure price vs value alignment",
    href: "/tools/szr-calculator",
    icon: Target,
    ready: true,
    new: true,
    category: "quant",
  },
  // ── AI Analysis Tools ──
  {
    id: "moat-analyzer",
    zh: "护城河分析",
    en: "Moat Analyzer",
    descZh: "基于年报文本，AI 分析企业护城河来源与可持续性",
    descEn: "AI analyzes moat sources and sustainability from annual report text",
    href: "/tools/moat-analyzer",
    icon: Shield,
    ready: true,
    badge: "AI",
    category: "ai",
  },
  {
    id: "annual-report",
    zh: "年报摘要",
    en: "Annual Report Summary",
    descZh: "输入年报文本，AI 提取关键业务数据与战略要点",
    descEn: "AI extracts key business data and strategic highlights from annual report",
    href: "/tools/annual-report",
    icon: LayoutDashboard,
    ready: true,
    badge: "AI",
    category: "ai",
  },
  {
    id: "risk-factors",
    zh: "风险因素清单",
    en: "Risk Factors",
    descZh: "从年报或公告中提取风险因素，按重要性排序",
    descEn: "Extract and rank risk factors from annual reports or disclosures",
    href: "/tools/risk-factors",
    icon: AlertTriangle,
    ready: true,
    badge: "AI",
    category: "ai",
  },
  // ── Dashboard ──
  {
    id: "dashboard",
    zh: "个股仪表盘",
    en: "Stock Dashboard",
    descZh: "输入股票代码，一览关键指标与历史走势",
    descEn: "Enter stock code to view key metrics and historical trends",
    href: "/dashboard",
    icon: LayoutDashboard,
    ready: true,
    category: "dashboard",
  },
]

const categoryIcons: Record<ToolCategory, React.ElementType> = {
  quant: Calculator,
  ai: Sparkles,
  dashboard: LayoutDashboard,
}

function ToolCard({ tool, isZh }: { tool: Tool; isZh: boolean }) {
  const Icon = tool.icon
  return (
    <Link
      href={tool.href}
      className={`
        group relative flex flex-col gap-4 rounded-2xl border p-6 text-left
        transition-all duration-200
        ${tool.ready
          ? "bg-background hover:border-green-300 hover:shadow-lg hover:shadow-green-100/50 dark:hover:shadow-green-950/30 dark:hover:border-green-700"
          : "bg-muted/30 opacity-60 cursor-not-allowed"
        }
      `}
      {...(tool.ready ? {} : { "aria-disabled": true })}
    >
      {/* Icon + badges */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${tool.ready ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" : "bg-muted text-muted-foreground"}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2">
          {tool.new && (
            <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-medium px-2 py-0.5 rounded-full">
              {isZh ? "新" : "New"}
            </span>
          )}
          {tool.badge && (
            <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium px-2 py-0.5 rounded-full">
              {tool.badge}
            </span>
          )}
          {!tool.ready && (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {isZh ? "待配置" : "Setup required"}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 flex-1">
        <h3 className="font-semibold text-base text-foreground">
          {isZh ? tool.zh : tool.en}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isZh ? tool.descZh : tool.descEn}
        </p>
      </div>

      {/* Footer arrow */}
      {tool.ready && (
        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <span>{isZh ? "立即使用" : "Use now"}</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      )}
    </Link>
  )
}

export function LandingPage() {
  const { locale } = useLocale()
  const isZh = locale === "zh-CN"

  const toolGroups = categories.map(cat => ({
    key: cat.key,
    label: categoryLabel(cat.key, isZh),
    icon: cat.icon,
    items: tools.filter(t => t.category === cat.key),
  }))

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
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

      {/* Tool grid by category */}
      <section className="flex-1 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          {toolGroups.map((group) => {
            const CatIcon = group.icon
            return (
              <div key={group.key} id={`cat-${group.key}`}>
                {/* Category heading */}
                <div className="flex items-center gap-2 mb-5">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                    group.key === "ai"
                      ? "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400"
                      : group.key === "dashboard"
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                      : "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                  }`}>
                    <CatIcon className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-bold">{group.label}</h2>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {group.items.length} {isZh ? "个工具" : "tools"}
                  </span>
                </div>

                {/* Tool cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} isZh={isZh} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}