"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, Calculator, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useLocale } from "@/lib/i18n/i18n-context"
import { formatNumber } from "@/lib/formatters"

export function RoeRoicCalculator() {
  const { locale } = useLocale()
  const isZh = locale === "zh-CN"

  // ROE inputs
  const [netIncome, setNetIncome] = useState(100)
  const [equity, setEquity] = useState(500)

  // ROIC inputs  
  const [nopat, setNopat] = useState(100)
  const [totalAssets, setTotalAssets] = useState(800)
  const [cash, setCash] = useState(100)
  const [nonInterestLiab, setNonInterestLiab] = useState(200)

  // Non-financial leverage inputs for DuPont
  const [totalRevenue, setTotalRevenue] = useState(1000)
  const [totalLiabilities, setTotalLiabilities] = useState(300)

  const roe = useMemo(() => {
    if (equity <= 0) return null
    return (netIncome / equity) * 100
  }, [netIncome, equity])

  const roeDuPont = useMemo(() => {
    if (equity <= 0 || totalRevenue <= 0) return null
    const profitMargin = (netIncome / totalRevenue) * 100
    const assetTurnover = totalRevenue / (equity + totalLiabilities)
    const financialLeverage = (equity + totalLiabilities) / equity
    return { profitMargin, assetTurnover, financialLeverage, roe: profitMargin * assetTurnover * financialLeverage / 100 }
  }, [netIncome, totalRevenue, equity, totalLiabilities])

  const roic = useMemo(() => {
    const investedCapital = totalAssets - cash - nonInterestLiab
    if (investedCapital <= 0) return null
    return (nopat / investedCapital) * 100
  }, [nopat, totalAssets, cash, nonInterestLiab])

  const computeGrade = (val: number | null, metric: "roe" | "roic") => {
    if (val === null) return null
    if (metric === "roe") {
      if (val >= 20) return { label: isZh ? "优秀 🏆" : "Excellent 🏆", color: "text-green-600 dark:text-green-400", desc: isZh ? "连续5年>20%说明有宽阔护城河" : "Sustained 5+ years indicates a wide moat" }
      if (val >= 15) return { label: isZh ? "良好 ✓" : "Good ✓", color: "text-emerald-600 dark:text-emerald-400", desc: isZh ? "高于市场平均水平的盈利能力" : "Above-market profitability" }
      if (val >= 10) return { label: isZh ? "一般 →" : "Average →", color: "text-amber-600 dark:text-amber-400", desc: isZh ? "接近市场平均水平" : "Near market average" }
      if (val >= 5) return { label: isZh ? "偏低 ↓" : "Below Average ↓", color: "text-orange-500", desc: isZh ? "可能需要检查盈利能力和杠杆水平" : "Check profitability and leverage" }
      return { label: isZh ? "较差 ✗" : "Poor ✗", color: "text-red-500", desc: isZh ? "远低于平均水平，需排除盈利质量问题" : "Well below average, check earnings quality" }
    }
    if (val >= 15) return { label: isZh ? "优秀 🏆" : "Excellent 🏆", color: "text-green-600 dark:text-green-400", desc: isZh ? "投入资本回报率超过大多数公司" : "Exceeds most companies' capital efficiency" }
    if (val >= 10) return { label: isZh ? "良好 ✓" : "Good ✓", color: "text-emerald-600 dark:text-emerald-400", desc: isZh ? "高于加权平均资本成本（WACC）" : "Above weighted average cost of capital" }
    if (val >= 5) return { label: isZh ? "一般 →" : "Average →", color: "text-amber-600 dark:text-amber-400", desc: isZh ? "接近资本成本，创造价值有限" : "Near cost of capital, limited value creation" }
    return { label: isZh ? "偏低 ↓" : "Below Average ↓", color: "text-red-500", desc: isZh ? "低于资本成本，股东价值被侵蚀" : "Below cost of capital, value destruction" }
  }

  const roeGrade = computeGrade(roe, "roe")
  const roicGrade = computeGrade(roic, "roic")

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {isZh ? "ROE/ROIC 分析器" : "ROE/ROIC Analyzer"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isZh ? "衡量公司盈利能力的核心指标" : "Core metrics for measuring company profitability"}
        </p>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {isZh
            ? "ROE（净资产收益率）衡量股东资金使用效率，ROIC（投入资本回报率）衡量整体经营效率——排除杠杆影响，是巴菲特最关注的指标之一。"
            : "ROE measures shareholder capital efficiency, ROIC measures operating efficiency excluding leverage — one of Warren Buffett's favorite metrics."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROE Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-chart-2" />
              ROE {isZh ? "计算" : "Calculation"}
            </CardTitle>
            <CardDescription>
              {isZh ? "净资产收益率 = 净利润 ÷ 股东权益" : "Return on Equity = Net Income ÷ Shareholder's Equity"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ni" className="text-sm">{isZh ? "净利润（Net Income）" : "Net Income"}</Label>
              <Input id="ni" type="number" value={netIncome} onChange={(e) => setNetIncome(Number(e.target.value))} min={0} step={1} className="w-28" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eq" className="flex items-center text-sm">
                {isZh ? "股东权益（Equity）" : "Shareholder's Equity"}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="inline-flex items-center justify-center ml-1 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
                    {isZh ? "总资产 - 总负债。可在资产负债表找到。" : "Total Assets - Total Liabilities. Found on the balance sheet."}
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input id="eq" type="number" value={equity} onChange={(e) => setEquity(Number(e.target.value))} min={1} step={1} className="w-28" />
            </div>

            <Separator />

            <div className="text-center py-4">
              <div className="text-xs text-muted-foreground mb-1">ROE</div>
              <div className={`text-4xl font-bold ${roeGrade?.color || ""}`}>
                {roe !== null ? `${roe.toFixed(2)}%` : "—"}
              </div>
              {roeGrade && (
                <div className="mt-2">
                  <span className={`text-sm font-semibold ${roeGrade.color}`}>{roeGrade.label}</span>
                  <p className="text-xs text-muted-foreground mt-1">{roeGrade.desc}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ROIC Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-chart-1" />
              ROIC {isZh ? "计算" : "Calculation"}
            </CardTitle>
            <CardDescription>
              {isZh ? "投入资本回报率 = NOPAT ÷ 投入资本" : "Return on Invested Capital = NOPAT ÷ Invested Capital"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nopatInput" className="flex items-center text-sm">
                NOPAT
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="inline-flex items-center justify-center ml-1 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
                    {isZh ? "税后营业利润（Net Operating Profit After Tax）。≈ 营业利润 × (1 - 税率)" : "Net Operating Profit After Tax. ≈ Operating Income × (1 - Tax Rate)"}
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input id="nopatInput" type="number" value={nopat} onChange={(e) => setNopat(Number(e.target.value))} min={0} step={1} className="w-28" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ta" className="text-sm">{isZh ? "总资产（Total Assets）" : "Total Assets"}</Label>
              <Input id="ta" type="number" value={totalAssets} onChange={(e) => setTotalAssets(Number(e.target.value))} min={1} step={1} className="w-28" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="cashHeld" className="text-sm">{isZh ? "现金" : "Cash"}</Label>
                <Input id="cashHeld" type="number" value={cash} onChange={(e) => setCash(Number(e.target.value))} min={0} step={1} className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="niliab" className="text-sm">{isZh ? "无息负债" : "Non-Interest Liab."}</Label>
                <Input id="niliab" type="number" value={nonInterestLiab} onChange={(e) => setNonInterestLiab(Number(e.target.value))} min={0} step={1} className="w-full" />
              </div>
            </div>

            <Separator />

            <div className="text-center py-4">
              <div className="text-xs text-muted-foreground mb-1">ROIC</div>
              <div className={`text-4xl font-bold ${roicGrade?.color || ""}`}>
                {roic !== null ? `${roic.toFixed(2)}%` : "—"}
              </div>
              {roicGrade && (
                <div className="mt-2">
                  <span className={`text-sm font-semibold ${roicGrade.color}`}>{roicGrade.label}</span>
                  <p className="text-xs text-muted-foreground mt-1">{roicGrade.desc}</p>
                </div>
              )}
              {roic !== null && (
                <div className="mt-3 text-xs text-muted-foreground">
                  {isZh ? "投入资本：" : "Invested Capital: "}{formatNumber(totalAssets - cash - nonInterestLiab, locale, 0)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DuPont Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{isZh ? "杜邦分析（ROE 分解）" : "DuPont Analysis (ROE Decomposition)"}</CardTitle>
          <CardDescription>
            {isZh ? "把 ROE 拆解为三个驱动因素，看清盈利能力的真正来源" : "Decompose ROE into three drivers to understand the true source of profitability"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {roeDuPont && roeDuPont.roe > 0 ? (
            <>
              <div className="p-4 rounded-lg bg-muted/50 mb-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">ROE = {isZh ? "净利润率" : "Profit Margin"} × {isZh ? "资产周转率" : "Asset Turnover"} × {isZh ? "财务杠杆" : "Financial Leverage"}</div>
                <div className="text-3xl font-bold mt-1">{roeDuPont.roe.toFixed(2)}%</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg border bg-card text-center">
                  <div className="text-xs text-muted-foreground">{isZh ? "净利润率" : "Profit Margin"}</div>
                  <div className="text-lg font-bold">{roeDuPont.profitMargin.toFixed(2)}%</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{isZh ? "每元销售额赚多少利润" : "Profit per revenue yuan"}</div>
                </div>
                <div className="p-3 rounded-lg border bg-card text-center">
                  <div className="text-xs text-muted-foreground">{isZh ? "资产周转率" : "Asset Turnover"}</div>
                  <div className="text-lg font-bold">{roeDuPont.assetTurnover.toFixed(2)}x</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{isZh ? "每元资产产生多少销售" : "Revenue per asset yuan"}</div>
                </div>
                <div className="p-3 rounded-lg border bg-card text-center">
                  <div className="text-xs text-muted-foreground">{isZh ? "财务杠杆" : "Fin. Leverage"}</div>
                  <div className="text-lg font-bold">{roeDuPont.financialLeverage.toFixed(2)}x</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{isZh ? "高 ≠ 好，增加风险" : "Higher ≠ better, adds risk"}</div>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isZh
                    ? `💡 杜邦分析揭示：当 ROE 高时，不一定是好事。如果高 ROE 来自高财务杠杆（${roeDuPont.financialLeverage.toFixed(2)}x），意味着公司承担了较多债务。真正优质的公司 ROE 应来自高净利润率 + 高周转率。`
                    : `💡 DuPont reveals: A high ROE isn't always good. If it's driven by high financial leverage (${roeDuPont.financialLeverage.toFixed(2)}x), the company carries more debt. Quality companies derive ROE from high margins + high turnover.`
                  }
                </p>
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">
              {isZh ? "请填写左侧的净利润和股东权益" : "Fill in net income and equity on the left"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <div className="text-sm font-semibold mb-2">
            {isZh ? "ROE/ROIC 参考标准" : "ROE/ROIC Reference Standards"}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">ROE</div>
              <div className="space-y-1">
                <div className="flex justify-between"><span>🏆 {isZh ? "优秀" : "Excellent"}</span><span className="text-green-600 font-semibold">{">20%"}</span></div>
                <div className="flex justify-between"><span>✓ {isZh ? "良好" : "Good"}</span><span className="font-semibold">15-20%</span></div>
                <div className="flex justify-between"><span>→ {isZh ? "一般" : "Average"}</span><span>10-15%</span></div>
                <div className="flex justify-between"><span>↓ {isZh ? "偏低" : "Low"}</span><span className="text-red-500">{"<10%"}</span></div>
              </div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">ROIC</div>
              <div className="space-y-1">
                <div className="flex justify-between"><span>🏆 {isZh ? "优秀" : "Excellent"}</span><span className="text-green-600 font-semibold">{">15%"}</span></div>
                <div className="flex justify-between"><span>✓ {isZh ? "良好" : "Good"}</span><span className="font-semibold">10-15%</span></div>
                <div className="flex justify-between"><span>→ {isZh ? "一般" : "Average"}</span><span>5-10%</span></div>
                <div className="flex justify-between"><span>↓ {isZh ? "偏低" : "Low"}</span><span className="text-red-500">{"<5%"}</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-[hsl(var(--color-overvalued))]/30 bg-[hsl(var(--color-overvalued))]/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[hsl(var(--color-overvalued))] mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm mb-1">{isZh ? "请注意" : "Important Note"}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isZh
                  ? "ROE 和 ROIC 是衡量盈利能力的核心指标，但不能仅凭单一指标做投资决策。高 ROE 可能来自高杠杆（高风险），高 ROIC 更可靠但需关注趋势变化。建议结合安全边际和护城河分析综合判断。本工具仅供参考。"
                  : "ROE and ROIC are core profitability metrics but should not be used in isolation. High ROE may come from high leverage (risky), while high ROIC is more reliable. Combine with margin of safety and moat analysis. This tool is for reference only."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
