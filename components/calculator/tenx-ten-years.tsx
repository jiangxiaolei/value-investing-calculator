"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, Calculator, Info, TrendingUp, Target, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useLocale } from "@/lib/i18n/i18n-context"
import { formatNumber, formatPercent } from "@/lib/formatters"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TenXTenYearsProps {
  initialPrice?: number
  initialEps?: number
  initialTargetPe?: number
  initialYears?: number
}

export function TenXTenYearsCalculator({
  initialPrice = 10,
  initialEps = 1,
  initialTargetPe = 15,
  initialYears = 10
}: TenXTenYearsProps) {
  const { t, locale } = useLocale()
  const isZh = locale === "zh-CN"

  const [currentPrice, setCurrentPrice] = useState(initialPrice)
  const [currentEps, setCurrentEps] = useState(initialEps)
  const [targetPe, setTargetPe] = useState(initialTargetPe)
  const [years, setYears] = useState(initialYears)

  // Calculate required annual growth rate for 10x return
  const requiredGrowthRate = useMemo(() => {
    if (years <= 0) return null
    return (Math.pow(10, 1 / years) - 1) * 100
  }, [years])

  // Calculate required EPS growth rate (since price = EPS * PE)
  const requiredEpsGrowthRate = useMemo(() => {
    if (!requiredGrowthRate) return null
    // If PE stays constant, stock price grows at same rate as EPS
    // So required EPS growth rate equals required stock price growth rate
    return requiredGrowthRate
  }, [requiredGrowthRate])

  // Calculate target price (10x from current)
  const targetPrice = useMemo(() => {
    if (currentPrice <= 0) return null
    return currentPrice * 10
  }, [currentPrice])

  // Calculate future EPS needed to achieve target PE
  const requiredFutureEps = useMemo(() => {
    if (!targetPrice || !targetPe || targetPe <= 0) return null
    return targetPrice / targetPe
  }, [targetPrice, targetPe])

  // Calculate required EPS CAGR
  const requiredEpsCagr = useMemo(() => {
    if (!requiredFutureEps || !currentEps || currentEps <= 0 || years <= 0) return null
    return (Math.pow(requiredFutureEps / currentEps, 1 / years) - 1) * 100
  }, [requiredFutureEps, currentEps, years])

  // Generate table data for different growth rates
  const growthRateTable = useMemo(() => {
    if (currentPrice <= 0 || !years || years <= 0) return []

    const growthRates = [10, 15, 20, 25, 25.89, 30, 35, 40]
    return growthRates.map(rate => {
      const futurePrice = currentPrice * Math.pow(1 + rate / 100, years)
      const multiplier = futurePrice / currentPrice
      const isTarget = rate >= 25.89 - 0.01 && rate <= 25.89 + 0.01

      return {
        rate,
        futurePrice,
        multiplier,
        isTarget
      }
    })
  }, [currentPrice, years])

  // Verdict on whether the required growth rate is realistic
  const verdict = useMemo(() => {
    if (!requiredEpsCagr) return null

    if (requiredEpsCagr <= 15) return "veryAchievable"
    if (requiredEpsCagr <= 20) return "achievable"
    if (requiredEpsCagr <= 25) return "challenging"
    if (requiredEpsCagr <= 30) return "veryChallenging"
    return "extremelyDifficult"
  }, [requiredEpsCagr])

  const getVerdictInfo = () => {
    if (!verdict) return { label: "", color: "", bgColor: "", description: "" }

    const verdictMap = {
      veryAchievable: {
        label: isZh ? "极易实现" : "Very Achievable",
        color: "text-[hsl(var(--color-cheap))]",
        bgColor: "bg-[hsl(var(--color-cheap))]/10 border-[hsl(var(--color-cheap))]/30",
        description: isZh
          ? "所需的EPS年复合增长率在公司历史增长范围内，实现可能性很高。"
          : "Required EPS CAGR is within company's historical growth range. High likelihood of success."
      },
      achievable: {
        label: isZh ? "可以实现" : "Achievable",
        color: "text-[hsl(var(--color-cheap))]",
        bgColor: "bg-[hsl(var(--color-cheap))]/10 border-[hsl(var(--color-cheap))]/30",
        description: isZh
          ? "所需的EPS年复合增长率需要公司保持良好的增长态势，但仍可实现。"
          : "Required EPS CAGR requires company to maintain strong growth momentum, but is achievable."
      },
      challenging: {
        label: isZh ? "具有挑战" : "Challenging",
        color: "text-[hsl(var(--color-fair))]",
        bgColor: "bg-[hsl(var(--color-fair))]/10 border-[hsl(var(--color-fair))]/30",
        description: isZh
          ? "所需的EPS年复合增长率较高，需要公司具备强大的竞争优势和市场环境。"
          : "Required EPS CAGR is relatively high. Company needs strong competitive advantages and favorable market conditions."
      },
      veryChallenging: {
        label: isZh ? "非常困难" : "Very Challenging",
        color: "text-[hsl(var(--color-expensive))]",
        bgColor: "bg-[hsl(var(--color-expensive))]/10 border-[hsl(var(--color-expensive))]/30",
        description: isZh
          ? "所需的EPS年复合增长率非常罕见，只有极少数顶级公司能够长期维持。"
          : "Required EPS CAGR is extremely rare. Only a few top-tier companies can sustain such growth long-term."
      },
      extremelyDifficult: {
        label: isZh ? "几乎不可能" : "Extremely Difficult",
        color: "text-[hsl(var(--color-overvalued))]",
        bgColor: "bg-[hsl(var(--color-overvalued))]/10 border-[hsl(var(--color-overvalued))]/30",
        description: isZh
          ? "所需的EPS年复合增长率在历史上极少有公司能够实现，建议降低收益预期。"
          : "Required EPS CAGR has rarely been achieved by any company historically. Consider lowering return expectations."
      }
    }

    return verdictMap[verdict]
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {isZh ? "十年十倍计算器" : "10x in 10 Years Calculator"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isZh ? "评估股票十年十倍的可能性" : "Evaluate the Feasibility of 10x Return in 10 Years"}
        </p>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {isZh
            ? "计算实现十年十倍收益所需的年复合增长率，评估公司是否具备实现这一目标的能力。"
            : "Calculate the required CAGR to achieve 10x returns in 10 years and assess whether the company can achieve this goal."
          }
        </p>
      </div>

      {/* Formula Card */}
      <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-muted-foreground font-medium">
              {isZh ? "十年十倍所需增长率" : "Required CAGR for 10x in 10 Years"}:
            </span>
            <code className="bg-background px-4 py-2 rounded-lg border font-mono text-sm">
              (10)^(1/n) - 1 ≈ 25.89%
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
                  ? "十年十倍意味着股票价格需要增长到初始价格的10倍。这需要约25.89%的年复合增长率。假设你投资100元，十年后需要变成1000元。"
                  : "10x in 10 years means the stock price needs to grow to 10x the initial price. This requires approximately 25.89% CAGR. If you invest $100, it needs to become $1000 in 10 years."
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
            {isZh ? "输入股票的当前价格、EPS和目标市盈率" : "Enter current stock price, EPS, and target P/E ratio"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                      ? "公司股票当前的市场价格。"
                      : "Current market price of the stock."
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

            {/* Current EPS Input */}
            <div className="space-y-2">
              <Label htmlFor="currentEps" className="flex items-center text-sm">
                {isZh ? "当前每股收益 (EPS)" : "Current EPS"}
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
                      : "Net profit after tax per share. Usually using last 12 months data."
                    }
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="currentEps"
                  type="number"
                  value={currentEps}
                  onChange={(e) => setCurrentEps(Number(e.target.value))}
                  min={0}
                  step={0.01}
                  className="w-28"
                />
                <span className="text-muted-foreground">{isZh ? "元" : "CNY"}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Target PE Input */}
            <div className="space-y-2">
              <Label htmlFor="targetPe" className="flex items-center text-sm">
                {isZh ? "目标市盈率 (PE)" : "Target P/E Ratio"}
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
                      ? "你预期十年后市场会给这只股票的市盈率。典型值为15-25倍。"
                      : "Expected P/E ratio the market will assign to this stock in 10 years. Typical values are 15-25x."
                    }
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="targetPe"
                  type="number"
                  value={targetPe}
                  onChange={(e) => setTargetPe(Number(e.target.value))}
                  min={0}
                  step={0.1}
                  className="w-28"
                />
                <span className="text-muted-foreground">×</span>
              </div>
            </div>

            {/* Years Input */}
            <div className="space-y-2">
              <Label htmlFor="years" className="flex items-center text-sm">
                {isZh ? "投资期限" : "Investment Period"}
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
                      ? "投资持有的时间长度，以年为单位。"
                      : "Duration of investment holding period in years."
                    }
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  min={1}
                  max={50}
                  step={1}
                  className="w-28"
                />
                <span className="text-muted-foreground">{isZh ? "年" : "years"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-chart-1" />
            {isZh ? "计算结果" : "Calculation Results"}
          </CardTitle>
          <CardDescription>
            {isZh ? "实现十年十倍所需的增长分析" : "Growth analysis required for 10x return"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Result - Required Growth Rate */}
          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-muted/50">
            <div className="text-sm text-muted-foreground mb-2">
              {isZh ? "实现十倍收益所需的年复合增长率" : "Required CAGR for 10x Return"}
            </div>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">
              {requiredGrowthRate !== null
                ? `${formatPercent(requiredGrowthRate.toFixed(2))}`
                : "—"
              }
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {isZh
                ? `${currentPrice} ${isZh ? "元" : "CNY"} → ${targetPrice ? formatNumber(targetPrice, locale, 2) : "—" } ${isZh ? "元" : "CNY"} (10x)`
                : `${currentPrice} → ${targetPrice ? formatNumber(targetPrice, locale, 2) : "—" } (10x)`
              }
            </div>
          </div>

          <Separator />

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <TrendingUp className="h-3.5 w-3.5" />
                {isZh ? "目标价格" : "Target Price"}
              </div>
              <div className="text-xl font-bold">
                {targetPrice !== null
                  ? `${formatNumber(targetPrice, locale, 2)} ${isZh ? "元" : "CNY"}`
                  : "—"
                }
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Calculator className="h-3.5 w-3.5" />
                {isZh ? "所需EPS" : "Required Future EPS"}
              </div>
              <div className="text-xl font-bold">
                {requiredFutureEps !== null
                  ? `${formatNumber(requiredFutureEps, locale, 2)} ${isZh ? "元" : "CNY"}`
                  : "—"
                }
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Clock className="h-3.5 w-3.5" />
                {isZh ? "EPS年增长率" : "Required EPS CAGR"}
              </div>
              <div className="text-xl font-bold">
                {requiredEpsCagr !== null
                  ? `${formatPercent(requiredEpsCagr.toFixed(2))}`
                  : "—"
                }
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
                {getVerdictInfo().description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Growth Rate Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-chart-2" />
            {isZh ? "不同增长率下的收益表" : "Returns at Different Growth Rates"}
          </CardTitle>
          <CardDescription>
            {isZh
              ? `假设持有 ${years} 年后，以 ${targetPe}倍市盈率计算`
              : `Assuming ${years} year holding period with ${targetPe}x P/E ratio`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">
                  {isZh ? "年复合增长率" : "CAGR"}
                </TableHead>
                <TableHead className="text-right">
                  {isZh ? "10年后股价" : "Price in 10 Years"}
                </TableHead>
                <TableHead className="text-right">
                  {isZh ? "收益倍数" : "Return Multiple"}
                </TableHead>
                <TableHead className="text-right">
                  {isZh ? "状态" : "Status"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {growthRateTable.map((row) => (
                <TableRow
                  key={row.rate}
                  className={row.isTarget ? "bg-green-50 dark:bg-green-950/20 font-semibold" : ""}
                >
                  <TableCell className="text-left">
                    {formatPercent(row.rate.toFixed(1))}
                    {row.isTarget && (
                      <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                        ({isZh ? "目标" : "Target"})
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(row.futurePrice, locale, 2)} {isZh ? "元" : "CNY"}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.multiplier.toFixed(2)}x
                  </TableCell>
                  <TableCell className="text-right">
                    {row.multiplier >= 10
                      ? (isZh ? "✓ 达成十倍" : "✓ 10x Achieved")
                      : row.multiplier >= 5
                      ? (isZh ? "↑ 5倍以上" : "↑ 5x+")
                      : (isZh ? "— 未达标" : "— Below Target")
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reference Section */}
      <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            {isZh ? "历史参考" : "Historical Reference"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground leading-relaxed">
            {isZh
              ? "能够长期维持25%以上EPS增长率的公司极为罕见。以下是一些参考数据："
              : "Companies that can sustain EPS growth rates above 25% for extended periods are extremely rare. Here are some reference data:"
            }
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>
              {isZh
                ? "标准普尔500指数：长期年化收益率约10-11%"
                : "S&P 500 Index: Long-term annual return approximately 10-11%"
              }
            </li>
            <li>
              {isZh
                ? "顶尖成长股（如亚马逊、苹果等）：20年维度能维持20%+增长率"
                : "Top Growth Stocks (e.g., Amazon, Apple): 20%+ growth rate over 20-year periods"
              }
            </li>
            <li>
              {isZh
                ? "Tenbagger股（十年十倍股）：历史上极为稀少，需要极强竞争优势"
                : "Tenbagger Stocks: Extremely rare historically, requires exceptional competitive advantages"
              }
            </li>
          </ul>
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
                  ? "本计算器基于简化的假设（PE比率保持稳定），实际投资结果会受到多种因素影响。股票价格不仅取决于EPS增长，还受市场情绪、估值倍数变化等因素影响。十年十倍是非常具有挑战性的目标，应结合公司基本面、行业前景和管理层能力等多方面因素综合判断。投资决策需谨慎，本工具仅供参考。"
                  : "This calculator is based on simplified assumptions (P/E ratio remains constant). Actual investment results will be affected by multiple factors. Stock price depends not only on EPS growth but also on market sentiment and valuation multiple changes. 10x return in 10 years is an extremely challenging goal. Always consider company fundamentals, industry outlook, and management capabilities. Investment decisions should be made carefully. This tool is for reference only."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
