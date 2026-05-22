"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, Calculator, Info, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useLocale } from "@/lib/i18n/i18n-context"
import { formatNumber } from "@/lib/formatters"

interface PEPortfolioProps {
  initialCurrentPE?: number
  initialHistoricalAvgPE?: number
  initialHistoryPeriod?: number
  initialStdDev?: number
}

// Error function approximation for normal distribution calculation
function erf(x: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  
  const sign = x < 0 ? -1 : 1
  x = Math.abs(x)
  
  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
  
  return sign * y
}

// Calculate percentile from z-score
function zScoreToPercentile(z: number): number {
  return (1 + erf(z / Math.sqrt(2))) / 2 * 100
}

export function PEPortfolioCalculator({
  initialCurrentPE = 15,
  initialHistoricalAvgPE = 20,
  initialHistoryPeriod = 10,
  initialStdDev = 8
}: PEPortfolioProps) {
  const { t, locale } = useLocale()
  const isZh = locale === "zh-CN"

  const [currentPE, setCurrentPE] = useState(initialCurrentPE)
  const [historicalAvgPE, setHistoricalAvgPE] = useState(initialHistoricalAvgPE)
  const [historyPeriod, setHistoryPeriod] = useState(initialHistoryPeriod)
  const [stdDev, setStdDev] = useState(initialStdDev)

  const percentile = useMemo(() => {
    if (currentPE <= 0 || historicalAvgPE <= 0 || stdDev <= 0) return null
    
    // Z-score = (current PE - average PE) / standard deviation
    const zScore = (currentPE - historicalAvgPE) / stdDev
    
    // Convert z-score to percentile (percentage of distribution below current PE)
    const pct = zScoreToPercentile(zScore)
    
    return {
      zScore,
      percentile: Math.max(0, Math.min(100, pct)),
      isBelowAverage: currentPE < historicalAvgPE,
      isAboveAverage: currentPE > historicalAvgPE
    }
  }, [currentPE, historicalAvgPE, stdDev])

  const verdict = useMemo(() => {
    if (percentile === null) return null
    
    const p = percentile.percentile
    if (p <= 10) return "extremelyLow"
    if (p <= 25) return "veryLow"
    if (p <= 40) return "low"
    if (p <= 60) return "fair"
    if (p <= 75) return "high"
    if (p <= 90) return "veryHigh"
    return "extremelyHigh"
  }, [percentile])

  const getVerdictInfo = () => {
    if (!verdict) return { label: "", color: "", bgColor: "", barColor: "" }
    
    const verdictMap = {
      extremelyLow: {
        label: isZh ? "极低估值" : "Extremely Low Valuation",
        color: "text-[hsl(var(--color-cheap))]",
        bgColor: "bg-[hsl(var(--color-cheap))]/10 border-[hsl(var(--color-cheap))]/30",
        barColor: "bg-[hsl(var(--color-cheap))]"
      },
      veryLow: {
        label: isZh ? "很低估值" : "Very Low Valuation",
        color: "text-[hsl(var(--color-cheap))]",
        bgColor: "bg-[hsl(var(--color-cheap))]/10 border-[hsl(var(--color-cheap))]/30",
        barColor: "bg-[hsl(var(--color-cheap))]"
      },
      low: {
        label: isZh ? "偏低估值" : "Below Average Valuation",
        color: "text-[hsl(var(--color-cheap))]",
        bgColor: "bg-[hsl(var(--color-cheap))]/10 border-[hsl(var(--color-cheap))]/30",
        barColor: "bg-[hsl(var(--color-cheap))]"
      },
      fair: {
        label: isZh ? "合理估值" : "Fair Valuation",
        color: "text-[hsl(var(--color-fair))]",
        bgColor: "bg-[hsl(var(--color-fair))]/10 border-[hsl(var(--color-fair))]/30",
        barColor: "bg-[hsl(var(--color-fair))]"
      },
      high: {
        label: isZh ? "偏高估值" : "Above Average Valuation",
        color: "text-[hsl(var(--color-expensive))]",
        bgColor: "bg-[hsl(var(--color-expensive))]/10 border-[hsl(var(--color-expensive))]/30",
        barColor: "bg-[hsl(var(--color-expensive))]"
      },
      veryHigh: {
        label: isZh ? "很高估值" : "Very High Valuation",
        color: "text-[hsl(var(--color-expensive))]",
        bgColor: "bg-[hsl(var(--color-expensive))]/10 border-[hsl(var(--color-expensive))]/30",
        barColor: "bg-[hsl(var(--color-expensive))]"
      },
      extremelyHigh: {
        label: isZh ? "极高估值" : "Extremely High Valuation",
        color: "text-[hsl(var(--color-overvalued))]",
        bgColor: "bg-[hsl(var(--color-overvalued))]/10 border-[hsl(var(--color-overvalued))]/30",
        barColor: "bg-[hsl(var(--color-overvalued))]"
      }
    }
    
    return verdictMap[verdict]
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {isZh ? "市盈率历史分位" : "PE Percentile"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isZh ? "当前PE在历史分布中的位置" : "Current PE Position in Historical Distribution"}
        </p>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {isZh 
            ? "通过比较当前市盈率与历史平均水平，计算当前估值在历史数据中的百分位排名。"
            : "Compare current P/E ratio with historical average to calculate percentile ranking in historical data."
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
              Z = (PE - μ) / σ
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
                  ? "Z-score表示当前PE偏离历史平均值的标准差倍数。通过Z-score查表可得百分位值。μ为历史平均PE，σ为标准差。"
                  : "Z-score indicates how many standard deviations the current PE is from the historical mean. Percentile is derived from Z-score lookup. μ is historical mean PE, σ is standard deviation."
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
            {isZh ? "输入PE数据和历史统计信息" : "Enter PE data and historical statistics"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Current PE Input */}
            <div className="space-y-2">
              <Label htmlFor="currentPE" className="flex items-center text-sm">
                {isZh ? "当前市盈率 (PE)" : "Current P/E Ratio"}
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
                      ? "公司当前的滚动市盈率（TTM），通常可以在财经网站查询获得。"
                      : "Company's current trailing twelve months (TTM) P/E ratio, usually available on financial websites."
                    }
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="currentPE"
                  type="number"
                  value={currentPE}
                  onChange={(e) => setCurrentPE(Number(e.target.value))}
                  min={0}
                  step={0.1}
                  className="w-28"
                />
                <span className="text-muted-foreground">×</span>
              </div>
            </div>

            {/* Historical Average PE Input */}
            <div className="space-y-2">
              <Label htmlFor="historicalAvgPE" className="flex items-center text-sm">
                {isZh ? "历史平均市盈率" : "Historical Average P/E"}
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
                      ? "该股票在过去N年的平均市盈率，反映市场长期给予的估值水平。"
                      : "Average P/E ratio of the stock over the past N years, reflecting long-term market valuation."
                    }
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="historicalAvgPE"
                  type="number"
                  value={historicalAvgPE}
                  onChange={(e) => setHistoricalAvgPE(Number(e.target.value))}
                  min={0}
                  step={0.1}
                  className="w-28"
                />
                <span className="text-muted-foreground">×</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* History Period Input */}
            <div className="space-y-2">
              <Label htmlFor="historyPeriod" className="flex items-center text-sm">
                {isZh ? "历史周期" : "History Period"}
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
                      ? "用于计算历史平均值的数据周期长度，通常为5年、10年或更长。"
                      : "Length of data period for calculating historical average, typically 5, 10 years or longer."
                    }
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="historyPeriod"
                  type="number"
                  value={historyPeriod}
                  onChange={(e) => setHistoryPeriod(Number(e.target.value))}
                  min={1}
                  max={100}
                  step={1}
                  className="w-28"
                />
                <span className="text-muted-foreground">{isZh ? "年" : "years"}</span>
              </div>
            </div>

            {/* Standard Deviation Input */}
            <div className="space-y-2">
              <Label htmlFor="stdDev" className="flex items-center text-sm">
                {isZh ? "市盈率标准差" : "P/E Standard Deviation"}
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
                  <TooltipContent side="top" className="max-w-[280px] text-xs leading-relaxed">
                    {isZh 
                      ? "市盈率在历史周期内的波动程度（标准差）。可从财经网站或彭博获取。若未知，可使用默认值8-10。"
                      : "Degree of variation (standard deviation) of P/E ratio over the history period. Available from financial websites or Bloomberg. If unknown, use default value 8-10."
                    }
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="stdDev"
                  type="number"
                  value={stdDev}
                  onChange={(e) => setStdDev(Number(e.target.value))}
                  min={0.1}
                  step={0.1}
                  className="w-28"
                />
                <span className="text-muted-foreground">×</span>
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
            {isZh ? "基于公式计算得出的百分位分析" : "Percentile analysis based on the formula"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Percentile Visualization */}
          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-muted/50">
            <div className="text-sm text-muted-foreground mb-4">
              {isZh ? "历史百分位" : "Historical Percentile"}
            </div>
            
            {/* Visual Percentile Bar */}
            <div className="w-full max-w-md relative">
              {/* Background scale */}
              <div className="h-8 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 relative overflow-hidden">
                {/* Indicator arrow */}
                {percentile !== null && (
                  <div 
                    className="absolute top-0 transform -translate-x-1/2 transition-all duration-500 ease-out"
                    style={{ left: `${percentile.percentile}%` }}
                  >
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-foreground" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-foreground border-2 background shadow-lg" />
                  </div>
                )}
              </div>
              
              {/* Scale labels */}
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{isZh ? "低" : "Low"}</span>
                <span>50%</span>
                <span>{isZh ? "高" : "High"}</span>
              </div>
            </div>

            {/* Percentile Number */}
            <div className="mt-6 text-5xl font-bold">
              {percentile !== null 
                ? <span className={getVerdictInfo().color}>{formatNumber(percentile.percentile, locale, 1)}%</span>
                : <span className="text-muted-foreground">—</span>
              }
            </div>
            
            {percentile !== null && (
              <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                {percentile.isBelowAverage ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-[hsl(var(--color-cheap))]" />
                    <span>
                      {isZh ? "低于平均值" : "Below average"} {formatNumber(Math.abs(percentile.zScore), locale, 2)}σ
                    </span>
                  </>
                ) : percentile.isAboveAverage ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-[hsl(var(--color-expensive))]" />
                    <span>
                      {isZh ? "高于平均值" : "Above average"} {formatNumber(Math.abs(percentile.zScore), locale, 2)}σ
                    </span>
                  </>
                ) : (
                  <span>{isZh ? "等于平均值" : "Equal to average"}</span>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* PE Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="text-xs text-muted-foreground mb-1">
                {isZh ? "当前市盈率" : "Current P/E"}
              </div>
              <div className="text-xl font-bold">
                {currentPE > 0 ? formatNumber(currentPE, locale, 1) : "—"}×
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isZh ? "市场价格" : "Market price"}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[hsl(var(--color-fair))]/10 border border-[hsl(var(--color-fair))]/30">
              <div className="text-xs text-muted-foreground mb-1">
                {isZh ? "历史平均" : "Historical Average"}
              </div>
              <div className="text-xl font-bold text-[hsl(var(--color-fair))]">
                {historicalAvgPE > 0 ? formatNumber(historicalAvgPE, locale, 1) : "—"}×
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isZh ? `${historyPeriod}年平均` : `${historyPeriod}-year average`}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="text-xs text-muted-foreground mb-1">
                {isZh ? "标准差" : "Std Deviation"}
              </div>
              <div className="text-xl font-bold">
                {stdDev > 0 ? formatNumber(stdDev, locale, 1) : "—"}×
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isZh ? "波动幅度" : "Variation range"}
              </div>
            </div>
          </div>

          {/* Verdict */}
          {verdict && percentile && (
            <div className={`p-4 rounded-lg border ${getVerdictInfo().bgColor}`}>
              <div className="flex items-center gap-3">
                <div className={`text-lg font-semibold ${getVerdictInfo().color}`}>
                  {getVerdictInfo().label}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {verdict === "extremelyLow" || verdict === "veryLow" || verdict === "low"
                  ? isZh
                    ? `当前市盈率处于历史最低的${formatNumber(percentile.percentile, locale, 1)}%分位，估值极具吸引力。但需注意低PE可能反映市场对公司前景的悲观预期。`
                    : `Current P/E is at the ${formatNumber(percentile.percentile, locale, 1)}th percentile of historical data, indicating extremely attractive valuation. However, low P/E may reflect market pessimism about company's prospects.`
                  : verdict === "fair"
                  ? isZh
                    ? `当前市盈率处于历史的中间水平（约${formatNumber(percentile.percentile, locale, 1)}%分位），估值相对合理。`
                    : `Current P/E is at middle range of historical data (${formatNumber(percentile.percentile, locale, 1)}th percentile), indicating relatively fair valuation.`
                  : verdict === "high" || verdict === "veryHigh" || verdict === "extremelyHigh"
                  ? isZh
                    ? `当前市盈率处于历史最高的${formatNumber(percentile.percentile, locale, 1)}%分位，估值偏高。需谨慎考虑风险。`
                    : `Current P/E is at the ${formatNumber(percentile.percentile, locale, 1)}th percentile of historical data, indicating elevated valuation. Proceed with caution.`
                  : ""
                }
              </p>
            </div>
          )}

          {/* Investment Insight */}
          {percentile && (
            <div className="p-4 rounded-lg bg-muted/30 border border-dashed">
              <div className="text-sm font-medium mb-2">{isZh ? "投资提示" : "Investment Insight"}</div>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                {percentile.percentile <= 20 ? (
                  <p>
                    {isZh 
                      ? "• 历史分位低于20%通常被视为价值投资机会，代表当前价格相对历史偏低。"
                      : "• Percentile below 20% is often regarded as a value investing opportunity, indicating relatively low price compared to history."
                    }
                  </p>
                ) : percentile.percentile <= 50 ? (
                  <p>
                    {isZh 
                      ? "• 历史分位在20%-50%之间，表示估值略低于或接近历史平均水平。"
                      : "• Percentile between 20%-50% indicates valuation slightly below or near historical average."
                    }
                  </p>
                ) : percentile.percentile <= 80 ? (
                  <p>
                    {isZh 
                      ? "• 历史分位在50%-80%之间，表示估值略高于历史平均水平，需关注估值压力。"
                      : "• Percentile between 50%-80% indicates valuation slightly above historical average. Pay attention to valuation pressure."
                    }
                  </p>
                ) : (
                  <p>
                    {isZh 
                      ? "• 历史分位高于80%通常表示估值偏高，建议等待更好的买入时机或谨慎评估。"
                      : "• Percentile above 80% usually indicates elevated valuation. Consider waiting for better entry points or evaluate carefully."
                    }
                  </p>
                )}
                <p>
                  {isZh 
                    ? "• 本工具仅供参考，实际投资决策需结合公司基本面、行业环境和宏观经济因素综合考虑。"
                    : "• This tool is for reference only. Actual investment decisions should consider company fundamentals, industry environment, and macroeconomic factors."
                  }
                </p>
              </div>
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
                  ? "PE百分位分析基于历史数据推算，假设市盈率服从正态分布。实际市场中，PE分布可能存在偏态，且受行业特性、成长阶段和市场环境等因素影响。本工具仅供参考，不构成投资建议。投资有风险，决策需谨慎。"
                  : "PE percentile analysis is based on historical data extrapolation, assuming P/E ratio follows a normal distribution. In reality, PE distribution may be skewed and affected by industry characteristics, growth stage, and market conditions. This tool is for reference only and does not constitute investment advice. Investment involves risk, make decisions carefully."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
