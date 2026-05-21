"use client"

import { useLocale } from "@/lib/i18n/i18n-context"
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  const { locale, t } = useLocale()
  const isZh = locale === "zh-CN"

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50/50 to-background dark:from-green-950/20 py-16 px-4 border-b">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-medium px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {isZh ? "免费工具 · 无需注册" : "Free Tool · No Sign-up"}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-green-700 dark:text-green-400">归估值</span>
            <span className="text-foreground"> — </span>
            <span className="text-foreground">{isZh ? "价值投资思维工具" : "Value Investing Tools"}</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {isZh
              ? "输入预期回报、利润增速和未来市盈率，让数字告诉你：这家公司当前值什么价，以及在哪个价格以下才值得买入。"
              : "Enter your target return, profit growth rate, and future P/E ratio. Let the numbers tell you what the company is worth today — and at what price it becomes a buy."}
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

      {/* How it works mini-section */}
      <section className="bg-muted/20 py-8 px-4 border-b">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            {isZh ? "工具工作流" : "Research Workflow"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                zh: "仪表盘",
                en: "Dashboard",
                descZh: "输入股票代码，查看关键指标",
                descEn: "Enter stock code, view key metrics",
                href: "/dashboard",
                ready: false,
              },
              {
                step: "2",
                zh: "估值计算",
                en: "Calculator",
                descZh: "倒推合理估值与买入价格",
                descEn: "Reverse-engineer fair value & buy price",
                href: "/",
                ready: true,
              },
              {
                step: "3",
                zh: "持仓跟踪",
                en: "Portfolio Tracking",
                descZh: "关注重要指标变化提醒",
                descEn: "Alert on key metric changes",
                href: "#",
                ready: false,
              },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3 bg-background rounded-lg border p-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${item.ready ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}`}>
                  {item.ready ? <span className="text-white">{item.step}</span> : item.step}
                </div>
                <div>
                  <p className="font-medium text-sm">{isZh ? item.zh : item.en}</p>
                  <p className="text-xs text-muted-foreground">{isZh ? item.descZh : item.descEn}</p>
                </div>
                {!item.ready && (
                  <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                    {isZh ? "即将上线" : "Coming Soon"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
