"use client"

import { useLocale } from "@/lib/i18n/i18n-context"
import { ArrowRight, TrendingUp, Shield, Zap, Calculator, GitCompare, Target, Percent, Clock, DollarSign, BarChart3, LayoutDashboard } from "lucide-react"
import Link from "next/link"

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
}

type Category = {
  id: string
  zh: string
  en: string
  tools: Tool[]
}

const tools: Category[] = [
  {
    id: "valuation",
    zh: "估值工具",
    en: "Valuation Tools",
    tools: [
      {
        id: "graham-number",
        zh: "格雷厄姆数",
        en: "Graham Number",
        descZh: "本杰明·格雷厄姆的保守估值公式，通过每股收益和每股净资产计算内在价值",
        descEn: "Benjamin Graham's conservative formula using EPS and book value per share",
        href: "/tools/graham-number",
        icon: Calculator,
        ready: true,
        new: true,
      },
      {
        id: "margin-of-safety",
        zh: "安全边际",
        en: "Margin of Safety",
        descZh: "计算当前价格与内在价值的差距，判断买入安全区间",
        descEn: "Calculate the gap between price and intrinsic value to assess buy-zone safety",
        href: "/tools/margin-of-safety",
        icon: Shield,
        ready: true,
        new: true,
      },
      {
        id: "pe-percentile",
        zh: "PE分位对比",
        en: "PE Percentile",
        descZh: "对比当前市盈率在历史估值中的分位位置",
        descEn: "See where current P/E sits in the historical distribution",
        href: "/tools/pe-percentile",
        icon: BarChart3,
        ready: true,
        new: true,
      },
      {
        id: "tenx-ten-years",
        zh: "十年十倍",
        en: "10x in 10 Years",
        descZh: "计算十年十倍需要的年化增速，对标选股目标",
        descEn: "Calculate required annual growth rate for 10x in 10 years",
        href: "/tools/tenx-ten-years",
        icon: Target,
        ready: true,
        new: true,
      },
      {
        id: "fcf-quality",
        zh: "FCF质量检测",
        en: "FCF Quality",
        descZh: "检验净利润是否由真实现金流支撑，识别财务造假风险",
        descEn: "Check if net profit is backed by real cash flow — spot financial fraud risk",
        href: "/tools/fcf-quality",
        icon: DollarSign,
        ready: true,
        new: true,
      },
    ],
  },
  {
    id: "research",
    zh: "研究工具",
    en: "Research Tools",
    tools: [
      {
        id: "dashboard",
        zh: "个股仪表盘",
        en: "Stock Dashboard",
        descZh: "输入股票代码，一览关键指标与历史走势",
        descEn: "Enter stock code to view key metrics and historical trends",
        href: "/dashboard",
        icon: LayoutDashboard,
        ready: true,
      },
      {
        id: "calculator",
        zh: "倒推估值计算器",
        en: "Reverse-Engineer Calculator",
        descZh: "输入目标回报、利润增速和未来市盈率，倒推合理估值与买入价格区间",
        descEn: "Enter target return, growth rate, and future P/E to reverse-engineer fair value",
        href: "/",
        icon: Calculator,
        ready: true,
      },
    ],
  },
]

export function LandingPage() {
  const { locale, t } = useLocale()
  const isZh = locale === "zh-CN"

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50/50 to-background dark:from-green-950/20 py-12 px-4 border-b">
        <div className="max-w-4xl mx-auto text-center space-y-4">
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
            <span className="text-foreground">{isZh ? "价值投资工具目录" : "Value Investing Tool Directory"}</span>
          </h1>

          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {isZh
              ? "输入预期回报、利润增速和未来市盈率，让数字告诉你：这家公司当前值什么价，以及在哪个价格以下才值得买入。"
              : "Enter your target return, profit growth rate, and future P/E ratio. Let the numbers tell you what the company is worth — and at what price it becomes a buy."}
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-green-600" />
              {isZh ? "安全边际思维" : "Margin of Safety Thinking"}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-600" />
              {isZh ? "倒推合理估值" : "Reverse-Engineer Fair Value"}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-green-600" />
              {isZh ? "秒出决策区间" : "Instant Decision Framework"}
            </div>
          </div>
        </div>
      </section>

      {/* Tool Directory */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          {tools.map((category) => (
            <div key={category.id}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold tracking-tight">
                  {isZh ? category.zh : category.en}
                </h2>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Tool Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className={`
                        group relative flex flex-col gap-3 rounded-xl border p-5 text-left transition-all
                        ${tool.ready
                          ? "bg-background hover:border-green-300 hover:shadow-sm hover:shadow-green-100 dark:hover:shadow-green-950/20 dark:hover:border-green-700"
                          : "bg-muted/30 opacity-70 cursor-not-allowed"
                        }
                      `}
                      {...(tool.ready ? {} : { "aria-disabled": true })}
                    >
                      {/* Badge row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex items-center gap-2">
                          {tool.new && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-medium px-2 py-0.5 rounded-full">
                              {isZh ? "新" : "New"}
                            </span>
                          )}
                          {!tool.ready && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                              {isZh ? "即将上线" : "Coming Soon"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm leading-snug mb-1">
                          {isZh ? tool.zh : tool.en}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
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
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
