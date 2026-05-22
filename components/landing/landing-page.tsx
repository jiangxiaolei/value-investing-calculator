"use client"

import { useLocale } from "@/lib/i18n/i18n-context"
import { ArrowRight, TrendingUp, Shield, Zap, Calculator, LayoutDashboard, BarChart3, GitCompare, Target, Bell, Search } from "lucide-react"
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
        id: "calculator",
        zh: "倒推估值计算器",
        en: "Reverse-Engineer Calculator",
        descZh: "输入目标回报、利润增速和未来市盈率，倒推合理估值与买入价格区间",
        descEn: "Enter target return, profit growth, and future P/E to reverse-engineer fair value and buy zones",
        href: "/",
        icon: Calculator,
        ready: true,
      },
      {
        id: "compare",
        zh: "估值对比",
        en: "Valuation Compare",
        descZh: "横向对比多家公司的估值水平，识别相对高低估机会",
        descEn: "Compare valuations across companies to spot relative under/overvaluation",
        href: "#",
        icon: GitCompare,
        ready: false,
      },
      {
        id: "pe-ratio",
        zh: "合理市盈率",
        en: "Fair P/E Ratio",
        descZh: "基于利润增速与ROE推算个股合理市盈率区间",
        descEn: "Derive fair P/E range from growth rate and ROE",
        href: "#",
        icon: Target,
        ready: false,
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
        new: true,
      },
      {
        id: "screener",
        zh: "选股器",
        en: "Stock Screener",
        descZh: "按行业、估值、盈利能力等多维度筛选个股",
        descEn: "Filter stocks by industry, valuation, profitability and more",
        href: "#",
        icon: Search,
        ready: false,
      },
    ],
  },
  {
    id: "portfolio",
    zh: "持仓工具",
    en: "Portfolio Tools",
    tools: [
      {
        id: "tracking",
        zh: "持仓跟踪",
        en: "Portfolio Tracking",
        descZh: "记录持仓成本与目标价，追踪重要指标变化提醒",
        descEn: "Log positions and target prices, get alerts on key metric changes",
        href: "#",
        icon: Bell,
        ready: false,
      },
      {
        id: "performance",
        zh: "收益分析",
        en: "Performance Analysis",
        descZh: "分析持仓组合的历史收益与风险指标",
        descEn: "Analyze historical returns and risk metrics of your portfolio",
        href: "#",
        icon: BarChart3,
        ready: false,
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
