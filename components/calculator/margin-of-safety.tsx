"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, Calculator, Info, Shield, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useLocale } from "@/lib/i18n/i18n-context"
import { formatNumber } from "@/lib/formatters"

interface MarginOfSafetyProps {
  initialIntrinsicValue?: number
  initialCurrentPrice?: number
}

export function MarginOfSafetyCalculator({
  initialIntrinsicValue = 100,
  initialCurrentPrice = 75
}: MarginOfSafetyProps) {
  const { t, locale } = useLocale()
  const isZh = locale === "zh-CN"

  const [intrinsicValue, setIntrinsicValue] = useState(initialIntrinsicValue)
  const [currentPrice, setCurrentPrice] = useState(initialCurrentPrice)

  const marginOfSafety = useMemo(() => {
    if (intrinsicValue <= 0 || currentPrice <= 0) return null
    return ((intrinsicValue - currentPrice) / intrinsicValue) * 100
  }, [intrinsicValue, currentPrice])

  const verdict = useMemo(() => {
    if (marginOfSafety === null) return null
    
    if (marginOfSafety >= 40) return "verySafe"
    if (marginOfSafety >= 20) return "safe"
    if (marginOfSafety >= 0) return "slightlyUndervalued"
    if (marginOfSafety >= -20) return "slightlyOvervalued"
    return "veryOvervalued"
  }, [marginOfSafety])

  const getVerdictInfo = () => {
    if (!verdict) return { label: "", color: "", bgColor: "", icon: null }
    
    const verdictMap = {
      verySafe: {
        label: isZh ? "极佳安全边际" : "Excellent Margin of Safety",
        color: "text-[hsl(var(--color-cheap))]",
        bgColor: "bg-[hsl(var(--color-cheap))]/10 border-[hsl(var(--color-cheap))]/30",
        icon: Shield
      },
      safe: {
        label: isZh ? "良好安全边际" : "Good Margin of Safety",
        color: "text-[hsl(var(--color-cheap))]",
        bgColor: "bg-[hsl(var(--color-cheap))]/10 border-[hsl(var(--color-cheap))]/30",
        icon: Shield
      },
      slightlyUndervalued: {
        label: isZh ? "轻微低估" : "Slightly Undervalued",
        color: "text-[hsl(var(--color-fair))]",
        bgColor: "bg-[hsl(var(--color-fair))]/10 border-[hsl(var(--color-fair))]/30",
        icon: TrendingUp
      },
      slightlyOvervalued: {
        label: isZh ? "轻微高估" : "Slightly Overvalued",
        color: "text-[hsl(var(--color-expensive))]",
        bgColor: "bg-[hsl(var(--color-expensive))]/10 border-[hsl(var(--color-expensive))]/30",
        icon: TrendingDown
      },
      veryOvervalued: {
        label: isZh ? "严重高估" : "Significantly Overvalued",
        color: "text-[hsl(var(--color-overvalued))]",
        bgColor: "bg-[hsl(var(--color-overvalued))]/10 border-[hsl(var(--color-overvalued))]/30",
        icon: TrendingDown
      }
    }
    
    return verdictMap[verdict]
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {isZh ? "安全边际" : "Margin of Safety"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isZh ? "价值投资的核心原则" : "Core Principle of Value Investing"}
        </p>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {isZh 
            ? "安全边际由本杰明·格雷厄姆提出，是指股票当前价格与内在价值之间的差距。安全边际越大，投资风险越低，潜在回报越高。"
            : "Margin of Safety, proposed by Benjamin Graham, refers to the gap between current stock price and intrinsic value. A larger margin means lower risk and higher potential returns."
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
              (内在价值 - 当前价格) / 内在价值 × 100
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
                  ? "安全边际是格雷厄姆价值投资体系的核心理念。它代表了在估值计算中给自己留出的缓冲空间，以应对不确定性和避免错误决策带来的损失。"
                  : "Margin of Safety is the core concept in Graham's value investing system. It represents a buffer in valuation calculations to handle uncertainty and avoid losses from incorrect decisions."
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
            {isZh ? "输入股票的内在价值和当前价格" : "Enter the intrinsic value and current price"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Intrinsic Value Input */}
            <div className="space-y-2">
              <Label htmlFor="intrinsicValue" className="flex items-center text-sm">
                {isZh ? "内在价值" : "Intrinsic Value"}
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
                      ? "股票的合理估值，可通过多种估值方法（如格雷厄姆数值、DCF、自由现金流等）计算得出。"
                      : "The fair valuation of a stock, can be calculated through various valuation methods (such as Graham Number, DCF, Free Cash Flow, etc.)."
                    }
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="intrinsicValue"
                  type="number"
                  value={intrinsicValue}
                  onChange={(e) => setIntrinsicValue(Number(e.target.value))}
                  min={0}
                  step={0.01}
                  className="w-28"
                />
                <span className="text-muted-foreground">{isZh ? "元" : "CNY"}</span>
              </div>
            </div>

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
                      ? "公司股票当前的市场价格。安全边际计算需要将此价格与内在价值进行对比。"
                      : "Current market price of the stock. Margin of Safety calculation compares this price with intrinsic value."
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
            {isZh ? "基于公式计算得出的安全边际" : "Margin of Safety based on the formula"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Result */}
          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-muted/50">
            <div className="text-sm text-muted-foreground mb-2">
              {isZh ? "安全边际" : "Margin of Safety"}
            </div>
            <div className={`text-5xl font-bold ${marginOfSafety !== null ? (marginOfSafety >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400") : "text-muted-foreground"}`}>
              {marginOfSafety !== null 
                ? `${marginOfSafety >= 0 ? "+" : ""}${formatNumber(marginOfSafety, locale, 2)}%`
                : "—"
              }
            </div>
            {marginOfSafety !== null && (
              <div className="mt-3 text-sm text-muted-foreground">
                {marginOfSafety >= 0
                  ? isZh
                    ? "股价低于内在价值，存在上涨空间"
                    : "Price below intrinsic value, upside potential"
                  : isZh
                    ? "股价高于内在价值，存在下跌风险"
                    : "Price above intrinsic value, downside risk"
                }
              </div>
            )}
          </div>

          <Separator />

          {/* Price Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[hsl(var(--color-cheap))]/10 border border-[hsl(var(--color-cheap))]/30">
              <div className="text-xs text-muted-foreground mb-1">
                {isZh ? "内在价值" : "Intrinsic Value"}
              </div>
              <div className="text-xl font-bold text-[hsl(var(--color-cheap))]">
                {intrinsicValue > 0 
                  ? `${formatNumber(intrinsicValue, locale, 2)} ${isZh ? "元" : "CNY"}`
                  : "—"
                }
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isZh ? "估值价格" : "Valuation price"}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[hsl(var(--color-fair))]/10 border border-[hsl(var(--color-fair))]/30">
              <div className="text-xs text-muted-foreground mb-1">
                {isZh ? "当前股价" : "Current Price"}
              </div>
              <div className="text-xl font-bold text-[hsl(var(--color-fair))]">
                {currentPrice > 0 
                  ? `${formatNumber(currentPrice, locale, 2)} ${isZh ? "元" : "CNY"}`
                  : "—"
                }
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isZh ? "市场价格" : "Market price"}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-muted">
              <div className="text-xs text-muted-foreground mb-1">
                {isZh ? "差异金额" : "Difference"}
              </div>
              <div className={`text-xl font-bold ${intrinsicValue - currentPrice >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {intrinsicValue > 0 && currentPrice > 0
                  ? `${intrinsicValue - currentPrice >= 0 ? "+" : ""}${formatNumber(intrinsicValue - currentPrice, locale, 2)} ${isZh ? "元" : "CNY"}`
                  : "—"
                }
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isZh ? "价格差异" : "Price difference"}
              </div>
            </div>
          </div>

          {/* Verdict */}
          {verdict && (
            <div className={`p-4 rounded-lg border ${getVerdictInfo().bgColor}`}>
              <div className="flex items-center gap-3">
                {getVerdictInfo().icon && (() => {
                  const Icon = getVerdictInfo().icon
                  return <Icon className={`h-6 w-6 ${getVerdictInfo().color}`} />
                })()}
                <div className={`text-lg font-semibold ${getVerdictInfo().color}`}>
                  {getVerdictInfo().label}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {verdict === "verySafe" || verdict === "safe"
                  ? isZh
                    ? "安全边际充足，提供了良好的风险缓冲空间。这是格雷厄姆推荐的理想买入区间，建议在价格低于内在价值20%-40%时买入。"
                    : "Sufficient margin of safety provides good risk buffer. This is the ideal buying range recommended by Graham. Consider buying when price is 20%-40% below intrinsic value."
                  : verdict === "slightlyUndervalued"
                  ? isZh
                    ? "安全边际较小，价格接近内在价值。虽有轻微安全边际，但可能需要等待更好的买入时机。"
                    : "Small margin of safety, price close to intrinsic value. While there is a slight margin, you may want to wait for a better buying opportunity."
                  : verdict === "slightlyOvervalued" || verdict === "veryOvervalued"
                  ? isZh
                    ? "股价高于内在价值，安全边际为负。这意味着投资风险较高，建议谨慎考虑或等待价格回调。"
                    : "Stock price exceeds intrinsic value, negative margin of safety. This means higher investment risk. Consider proceeding with caution or waiting for a price pullback."
                  : ""
                }
              </p>
            </div>
          )}

          {/* Investment Recommendation */}
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm mb-1">
                  {isZh ? "格雷厄姆建议" : "Graham's Recommendation"}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isZh 
                    ? "格雷厄姆建议投资者只在价格显著低于内在价值时买入，通常要求至少20%-30%的安全边际。安全边际越大，在估值错误或市场波动时提供的保护就越大。"
                    : "Graham recommended that investors only buy when the price is significantly below intrinsic value, typically requiring at least 20%-30% margin of safety. The larger the margin, the more protection it provides against valuation errors or market volatility."
                  }
                </p>
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
                  ? "安全边际的计算基于对内在价值的估计，而内在价值本身是不确定的。不同的估值方法可能得出不同的结果。安全边际只是一个参考指标，投资决策应综合考虑公司基本面、行业环境和个人风险承受能力。本工具仅供参考。"
                  : "Margin of Safety calculation is based on estimates of intrinsic value, which itself is uncertain. Different valuation methods may yield different results. Margin of Safety is only a reference indicator. Investment decisions should consider company fundamentals, industry environment, and personal risk tolerance. This tool is for reference only."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
