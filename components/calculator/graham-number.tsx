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

interface GrahamNumberProps {
  initialEps?: number
  initialBvps?: number
  initialPrice?: number
}

export function GrahamNumberCalculator({
  initialEps = 2.5,
  initialBvps = 15,
  initialPrice = 20
}: GrahamNumberProps) {
  const { t, locale } = useLocale()
  const isZh = locale === "zh-CN"

  const [eps, setEps] = useState(initialEps)
  const [bvps, setBvps] = useState(initialBvps)
  const [currentPrice, setCurrentPrice] = useState(initialPrice)

  const grahamNumber = useMemo(() => {
    if (eps <= 0 || bvps <= 0) return null
    return Math.sqrt(22.5 * eps * bvps)
  }, [eps, bvps])

  const verdict = useMemo(() => {
    if (!grahamNumber || currentPrice <= 0) return null
    
    const ratio = currentPrice / grahamNumber
    if (ratio <= 0.7) return "veryUndervalued"
    if (ratio <= 0.85) return "undervalued"
    if (ratio <= 1.15) return "fair"
    if (ratio <= 1.5) return "overvalued"
    return "veryOvervalued"
  }, [grahamNumber, currentPrice])

  const getVerdictInfo = () => {
    if (!verdict) return { label: "", color: "", bgColor: "" }
    
    const verdictMap = {
      veryUndervalued: {
        label: isZh ? "严重低估" : "Significantly Undervalued",
        color: "text-[hsl(var(--color-cheap))]",
        bgColor: "bg-[hsl(var(--color-cheap))]/10 border-[hsl(var(--color-cheap))]/30"
      },
      undervalued: {
        label: isZh ? "相对低估" : "Undervalued",
        color: "text-[hsl(var(--color-cheap))]",
        bgColor: "bg-[hsl(var(--color-cheap))]/10 border-[hsl(var(--color-cheap))]/30"
      },
      fair: {
        label: isZh ? "合理估值" : "Fair Valuation",
        color: "text-[hsl(var(--color-fair))]",
        bgColor: "bg-[hsl(var(--color-fair))]/10 border-[hsl(var(--color-fair))]/30"
      },
      overvalued: {
        label: isZh ? "相对高估" : "Overvalued",
        color: "text-[hsl(var(--color-expensive))]",
        bgColor: "bg-[hsl(var(--color-expensive))]/10 border-[hsl(var(--color-expensive))]/30"
      },
      veryOvervalued: {
        label: isZh ? "严重高估" : "Significantly Overvalued",
        color: "text-[hsl(var(--color-overvalued))]",
        bgColor: "bg-[hsl(var(--color-overvalued))]/10 border-[hsl(var(--color-overvalued))]/30"
      }
    }
    
    return verdictMap[verdict]
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {isZh ? "格雷厄姆数值" : "Graham Number"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isZh ? "价值投资的经典估值公式" : "Classic Value Investing Valuation Formula"}
        </p>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {isZh 
            ? "由"本杰明·格雷厄姆"提出的保守估值方法，通过每股收益和每股净资产计算股票的内在价值。"
            : "A conservative valuation method proposed by Benjamin Graham, calculating intrinsic value using EPS and book value per share."
          }
        </p>
      </div>

      {/* Formula Card */}
      <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-muted-foreground font-medium">
              {isZh ? "公式" : "Formula"}:
            </span>
            <code className="bg-background px-4 py-2 rounded-lg border font-mono text-sm">
              √(22.5 × EPS × BVPS)
            </code>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[300px] text-xs leading-relaxed">
                {isZh 
                  ? "22.5 是一个安全系数，源自格雷厄姆对成长股（最高增速不超过25%）的市盈率上限（15倍）和对稳健股（最高增速不超过10%）的市盈率上限（22.5倍）的经验值。"
                  : "22.5 is a safety factor derived from Graham's经验值 for growth stocks (P/E limit of 15x) and defensive stocks (P/E limit of 22.5x)."
                }
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-chart-2" />
            {isZh ? "输入参数" : "Input Parameters"}
          </CardTitle>
          <CardDescription>
            {isZh ? "输入公司的每股收益和每股净资产" : "Enter company's EPS and Book Value Per Share"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* EPS Input */}
            <div className="space-y-2">
              <Label htmlFor="eps" className="flex items-center text-sm">
                {isZh ? "每股收益 (EPS)" : "Earnings Per Share (EPS)"}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center ml-1 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
                    {isZh 
                      ? "公司每股股票的税后净利润。通常使用最近12个月的数据。"
                      : "Net profit after tax per share of stock. Usually using last 12 months data."
                    }
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="eps"
                  type="number"
                  value={eps}
                  onChange={(e) => setEps(Number(e.target.value))}
                  min={0}
                  step={0.01}
                  className="w-28"
                />
                <span className="text-muted-foreground">{isZh ? "元" : "CNY"}</span>
              </div>
            </div>

            {/* BVPS Input */}
            <div className="space-y-2">
              <Label htmlFor="bvps" className="flex items-center text-sm">
                {isZh ? "每股净资产 (BVPS)" : "Book Value Per Share (BVPS)"}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center ml-1 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
                    {isZh 
                      ? "公司每股股票的账面价值，即股东权益除以股本总数。"
                      : "Book value per share, i.e., total shareholders' equity divided by total shares outstanding."
                    }
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="bvps"
                  type="number"
                  value={bvps}
                  onChange={(e) => setBvps(Number(e.target.value))}
                  min={0}
                  step={0.01}
                  className="w-28"
                />
                <span className="text-muted-foreground">{isZh ? "元" : "CNY"}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Current Price Input */}
          <div className="space-y-2">
            <Label htmlFor="currentPrice" className="flex items-center text-sm">
              {isZh ? "当前股价" : "Current Stock Price"}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center ml-1 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
                  {isZh 
                    ? "公司股票当前的市场价格，用于与格雷厄姆数值进行对比。"
                    : "Current market price of the stock, used for comparison with Graham Number."
                  }
                </TooltipContent>
              </Tooltip>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="currentPrice"
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
                min={0}
                step={0.01}
                className="w-28"
              />
              <span className="text-muted-foreground">{isZh ? "元" : "CNY"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-chart-1" />
            {isZh ? "计算结果" : "Calculation Results"}
          </CardTitle>
          <CardDescription>
            {isZh ? "基于公式计算得出的估值结果" : "Valuation results based on the formula"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Result */}
          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-muted/50">
            <div className="text-sm text-muted-foreground mb-2">
              {isZh ? "格雷厄姆数值（内在价值）" : "Graham Number (Intrinsic Value)"}
            </div>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">
              {grahamNumber !== null 
                ? `${formatNumber(grahamNumber, locale, 2)} ${isZh ? "元" : "CNY"}`
                : "—"
              }
            </div>
            {grahamNumber !== null && currentPrice > 0 && (
              <div className="mt-3 text-sm text-muted-foreground">
                {isZh ? "当前股价相比格雷厄姆数值：" : "Current price vs Graham Number: "}
                <span className={getVerdictInfo().color}>
                  {((currentPrice / grahamNumber - 1) * 100).toFixed(1)}%
                  {currentPrice > grahamNumber ? " ↑" : " ↓"}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Price Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[hsl(var(--color-cheap))]/10 border border-[hsl(var(--color-cheap))]/30">
              <div className="text-xs text-muted-foreground mb-1">
                {isZh ? "理想买入价（-30%）" : "Ideal Buy Price (-30%)"}
              </div>
              <div className="text-xl font-bold text-[hsl(var(--color-cheap))]">
                {grahamNumber !== null 
                  ? `${formatNumber(grahamNumber * 0.7, locale, 2)} ${isZh ? "元" : "CNY"}`
                  : "—"
                }
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isZh ? "30% 安全边际" : "30% margin of safety"}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[hsl(var(--color-fair))]/10 border border-[hsl(var(--color-fair))]/30">
              <div className="text-xs text-muted-foreground mb-1">
                {isZh ? "格雷厄姆数值" : "Graham Number"}
              </div>
              <div className="text-xl font-bold text-[hsl(var(--color-fair))]">
                {grahamNumber !== null 
                  ? `${formatNumber(grahamNumber, locale, 2)} ${isZh ? "元" : "CNY"}`
                  : "—"
                }
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isZh ? "合理估值" : "Fair valuation"}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[hsl(var(--color-expensive))]/10 border border-[hsl(var(--color-expensive))]/30">
              <div className="text-xs text-muted-foreground mb-1">
                {isZh ? "当前股价" : "Current Price"}
              </div>
              <div className="text-xl font-bold text-[hsl(var(--color-expensive))]">
                {currentPrice > 0 
                  ? `${formatNumber(currentPrice, locale, 2)} ${isZh ? "元" : "CNY"}`
                  : "—"
                }
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isZh ? "市场价格" : "Market price"}
              </div>
            </div>
          </div>

          {/* Verdict */}
          {verdict && (
            <div className={`p-4 rounded-lg border ${getVerdictInfo().bgColor}`}>
              <div className="flex items-center gap-3">
                <div className={`text-lg font-semibold ${getVerdictInfo().color}`}>
                  {getVerdictInfo().label}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {verdict === "veryUndervalued" || verdict === "undervalued"
                  ? isZh
                    ? "当前股价显著低于格雷厄姆数值，存在较大的安全边际，是较好的买入时机。"
                    : "Current price is significantly below Graham Number with substantial margin of safety. Good buying opportunity."
                  : verdict === "fair"
                  ? isZh
                    ? "当前股价接近格雷厄姆数值，处于合理估值区间。"
                    : "Current price is close to Graham Number. Fair valuation zone."
                  : verdict === "overvalued" || verdict === "veryOvervalued"
                  ? isZh
                    ? "当前股价高于格雷厄姆数值，估值偏高，需谨慎考虑。"
                    : "Current price is above Graham Number. Valuation is elevated. Proceed with caution."
                  : ""
                }
              </p>
            </div>
          )}
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
                  ? "格雷厄姆数值是一个相对保守的估值方法，适用于稳定性较高、盈利能力较好的公司。它不考虑公司的成长性和行业特殊性，因此应结合其他估值方法综合使用。投资决策需谨慎，本工具仅供参考。"
                  : "Graham Number is a relatively conservative valuation method suitable for companies with high stability and good profitability. It does not consider company's growth potential or industry specifics, so it should be used in combination with other valuation methods. Investment decisions should be made carefully. This tool is for reference only."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
