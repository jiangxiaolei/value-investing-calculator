"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, Calculator, Info, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useLocale } from "@/lib/i18n/i18n-context"
import { formatNumber } from "@/lib/formatters"

interface FCFQProps {
  initialNetIncome?: number
  initialOcf?: number
  initialFcf?: number
  initialCapEx?: number
}

type MetricStatus = "pass" | "warn" | "fail"

export function FCFQCalculator({
  initialNetIncome = 100,
  initialOcf = 110,
  initialFcf = 80,
  initialCapEx = 30
}: FCFQProps) {
  const { t, locale } = useLocale()
  const isZh = locale === "zh-CN"

  const [netIncome, setNetIncome] = useState(initialNetIncome)
  const [ocf, setOcf] = useState(initialOcf)
  const [fcf, setFcf] = useState(initialFcf)
  const [capex, setCapex] = useState(initialCapEx)

  // Calculate the 4 key metrics
  const metrics = useMemo(() => {
    const ocfToNi = netIncome !== 0 ? ocf / netIncome : null
    const fcfToNi = netIncome !== 0 ? fcf / netIncome : null
    const fcfToOcf = ocf !== 0 ? fcf / ocf : null
    const capexToOcf = ocf !== 0 ? capex / ocf : null

    return { ocfToNi, fcfToNi, fcfToOcf, capexToOcf }
  }, [netIncome, ocf, fcf, capex])

  // Determine status for each metric
  const getStatus = (value: number | null, thresholds: { pass: number; warn: number }, inverse?: boolean): MetricStatus => {
    if (value === null) return "fail"
    
    if (inverse) {
      // For ratios where lower is better (e.g., CapEx/OCF)
      if (value <= thresholds.pass) return "pass"
      if (value <= thresholds.warn) return "warn"
      return "fail"
    } else {
      // For ratios where higher is better
      if (value >= thresholds.pass) return "pass"
      if (value >= thresholds.warn) return "warn"
      return "fail"
    }
  }

  const ocfToNiStatus = getStatus(metrics.ocfToNi, { pass: 1.0, warn: 0.8 })
  const fcfToNiStatus = getStatus(metrics.fcfToNi, { pass: 0.8, warn: 0.5 })
  const fcfToOcfStatus = getStatus(metrics.fcfToOcf, { pass: 0.8, warn: 0.6 })
  const capexToOcfStatus = getStatus(metrics.capexToOcf, { pass: 0.4, warn: 0.6 }, true)

  // Calculate overall quality score (0-100)
  const qualityScore = useMemo(() => {
    const scores: number[] = []
    
    if (metrics.ocfToNi !== null) {
      const ocfScore = Math.min(100, Math.max(0, (metrics.ocfToNi! * 100)))
      scores.push(ocfScore)
    }
    if (metrics.fcfToNi !== null) {
      const fcfScore = Math.min(100, Math.max(0, (metrics.fcfToNi! * 100)))
      scores.push(fcfScore)
    }
    if (metrics.fcfToOcf !== null) {
      const fcfOcfScore = Math.min(100, Math.max(0, (metrics.fcfToOcf! * 100)))
      scores.push(fcfOcfScore)
    }
    if (metrics.capexToOcf !== null) {
      const capexScore = Math.min(100, Math.max(0, (1 - metrics.capexToOcf!) * 100))
      scores.push(capexScore)
    }
    
    if (scores.length === 0) return null
    return scores.reduce((a, b) => a + b, 0) / scores.length
  }, [metrics])

  const getScoreGrade = () => {
    if (qualityScore === null) return { label: "", color: "", bgColor: "" }
    
    if (qualityScore >= 80) {
      return {
        label: isZh ? "优质" : "High Quality",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700"
      }
    } else if (qualityScore >= 60) {
      return {
        label: isZh ? "中等" : "Medium Quality",
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-700"
      }
    } else {
      return {
        label: isZh ? "低质" : "Low Quality",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700"
      }
    }
  }

  const getStatusColor = (status: MetricStatus) => {
    switch (status) {
      case "pass":
        return {
          text: "text-green-600 dark:text-green-400",
          bg: "bg-green-100 dark:bg-green-900/40",
          border: "border-green-300 dark:border-green-700",
          icon: TrendingUp
        }
      case "warn":
        return {
          text: "text-yellow-600 dark:text-yellow-400",
          bg: "bg-yellow-100 dark:bg-yellow-900/40",
          border: "border-yellow-300 dark:border-yellow-700",
          icon: Minus
        }
      case "fail":
        return {
          text: "text-red-600 dark:text-red-400",
          bg: "bg-red-100 dark:bg-red-900/40",
          border: "border-red-300 dark:border-red-700",
          icon: TrendingDown
        }
    }
  }

  const getStatusLabel = (status: MetricStatus) => {
    switch (status) {
      case "pass":
        return isZh ? "通过" : "Pass"
      case "warn":
        return isZh ? "警告" : "Warning"
      case "fail":
        return isZh ? "失败" : "Fail"
    }
  }

  const MetricCard = ({
    title,
    value,
    status,
    description
  }: {
    title: string
    value: number | null
    status: MetricStatus
    description: string
  }) => {
    const colors = getStatusColor(status)
    const StatusIcon = colors.icon

    return (
      <div className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className={`flex items-center gap-1.5 ${colors.text}`}>
            <StatusIcon className="h-4 w-4" />
            <span className="text-xs font-medium">{getStatusLabel(status)}</span>
          </div>
        </div>
        <div className={`text-2xl font-bold ${colors.text}`}>
          {value !== null ? `${(value * 100).toFixed(1)}%` : "—"}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {isZh ? "自由现金流质量分析" : "FCF Quality Checker"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isZh ? "检验利润是否由现金流支撑" : "Check if profits are backed by cash"}
        </p>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {isZh 
            ? "通过对比净利润、经营现金流、自由现金流和资本支出，评估企业盈利质量和现金保障程度。"
            : "Evaluate earnings quality and cash backing by comparing Net Income, Operating Cash Flow, Free Cash Flow, and CapEx."
          }
        </p>
      </div>

      {/* Formula Card */}
      <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-muted-foreground font-medium">
              {isZh ? "核心指标" : "Core Metrics"}:
            </span>
            <div className="flex gap-2 flex-wrap justify-center">
              <code className="bg-background px-3 py-1.5 rounded-lg border font-mono text-xs">
                OCF/NI ≥ 100%
              </code>
              <code className="bg-background px-3 py-1.5 rounded-lg border font-mono text-xs">
                FCF/NI ≥ 80%
              </code>
              <code className="bg-background px-3 py-1.5 rounded-lg border font-mono text-xs">
                FCF/OCF ≥ 80%
              </code>
              <code className="bg-background px-3 py-1.5 rounded-lg border font-mono text-xs">
                CapEx/OCF ≤ 40%
              </code>
            </div>
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
                  ? "高质量的现金流意味着：经营现金流应覆盖净利润，自由现金流应足够支付资本开支且有剩余，资本开支占经营现金流的比例不宜过高。"
                  : "High-quality cash flow means: OCF should cover Net Income, FCF should be sufficient for CapEx with surplus, and CapEx should not be too high relative to OCF."
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
            {isZh ? "输入公司的四项现金流数据（单位：百万元或万美元）" : "Enter company's four cash flow metrics (in millions or ten thousands)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Net Income Input */}
            <div className="space-y-2">
              <Label htmlFor="netIncome" className="flex items-center text-sm">
                {isZh ? "净利润 (Net Income)" : "Net Income"}
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
                      ? "公司税后净利润，即收入减去所有成本、费用和 taxes。"
                      : "Company's net profit after tax, i.e., revenue minus all costs, expenses and taxes."
                    }
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="netIncome"
                  type="number"
                  value={netIncome}
                  onChange={(e) => setNetIncome(Number(e.target.value))}
                  min={0}
                  step={1}
                  className="w-28"
                />
                <span className="text-muted-foreground">{isZh ? "百万元" : "M"}</span>
              </div>
            </div>

            {/* OCF Input */}
            <div className="space-y-2">
              <Label htmlFor="ocf" className="flex items-center text-sm">
                {isZh ? "经营现金流 (OCF)" : "Operating Cash Flow"}
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
                      ? "公司主营业务产生的现金流，通常来自现金流量表的\"经营活动现金流量净额\"。"
                      : "Cash flow from company's core business operations, usually from 'Net cash from operating activities' in cash flow statement."
                    }
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="ocf"
                  type="number"
                  value={ocf}
                  onChange={(e) => setOcf(Number(e.target.value))}
                  min={0}
                  step={1}
                  className="w-28"
                />
                <span className="text-muted-foreground">{isZh ? "百万元" : "M"}</span>
              </div>
            </div>

            {/* FCF Input */}
            <div className="space-y-2">
              <Label htmlFor="fcf" className="flex items-center text-sm">
                {isZh ? "自由现金流 (FCF)" : "Free Cash Flow"}
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
                      ? "企业产生的可以自由支配的现金流，通常 = 经营现金流 - 资本支出。"
                      : "Cash flow that can be freely used by the company, usually = OCF - CapEx."
                    }
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="fcf"
                  type="number"
                  value={fcf}
                  onChange={(e) => setFcf(Number(e.target.value))}
                  min={0}
                  step={1}
                  className="w-28"
                />
                <span className="text-muted-foreground">{isZh ? "百万元" : "M"}</span>
              </div>
            </div>

            {/* CapEx Input */}
            <div className="space-y-2">
              <Label htmlFor="capex" className="flex items-center text-sm">
                {isZh ? "资本支出 (CapEx)" : "Capital Expenditure"}
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
                      ? "公司用于购买或维护固定资产（如设备、房地产）的现金支出。"
                      : "Cash spent by company on purchasing or maintaining fixed assets (e.g., equipment, real estate)."
                    }
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="capex"
                  type="number"
                  value={capex}
                  onChange={(e) => setCapex(Number(e.target.value))}
                  min={0}
                  step={1}
                  className="w-28"
                />
                <span className="text-muted-foreground">{isZh ? "百万元" : "M"}</span>
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
            {isZh ? "质量分析结果" : "Quality Analysis Results"}
          </CardTitle>
          <CardDescription>
            {isZh ? "基于四个关键比率的综合评估" : "Comprehensive evaluation based on four key ratios"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quality Score */}
          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-muted/50">
            <div className="text-sm text-muted-foreground mb-2">
              {isZh ? "现金流质量评分" : "Cash Flow Quality Score"}
            </div>
            <div className={`text-5xl font-bold ${getScoreGrade().color}`}>
              {qualityScore !== null 
                ? formatNumber(qualityScore, locale, 1)
                : "—"
              }
              {qualityScore !== null && <span className="text-2xl">/100</span>}
            </div>
            {qualityScore !== null && (
              <div className={`mt-3 px-4 py-1.5 rounded-full text-sm font-medium border ${getScoreGrade().bgColor} ${getScoreGrade().color}`}>
                {getScoreGrade().label}
              </div>
            )}
          </div>

          <Separator />

          {/* Four Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard
              title={isZh ? "经营现金流/净利润" : "OCF / Net Income"}
              value={metrics.ocfToNi}
              status={ocfToNiStatus}
              description={
                isZh 
                  ? "衡量净利润的现金保障程度，应 ≥ 100%"
                  : "Measures cash backing for profits, should be ≥ 100%"
              }
            />
            <MetricCard
              title={isZh ? "自由现金流/净利润" : "FCF / Net Income"}
              value={metrics.fcfToNi}
              status={fcfToNiStatus}
              description={
                isZh 
                  ? "衡量净利润转换为自由现金流的比例，应 ≥ 80%"
                  : "Measures conversion of profits to free cash flow, should be ≥ 80%"
              }
            />
            <MetricCard
              title={isZh ? "自由现金流/经营现金流" : "FCF / OCF"}
              value={metrics.fcfToOcf}
              status={fcfToOcfStatus}
              description={
                isZh 
                  ? "衡量经营现金流的质量，应 ≥ 80%"
                  : "Measures quality of operating cash flow, should be ≥ 80%"
              }
            />
            <MetricCard
              title={isZh ? "资本支出/经营现金流" : "CapEx / OCF"}
              value={metrics.capexToOcf}
              status={capexToOcfStatus}
              description={
                isZh 
                  ? "衡量资本支出占用经营现金流的比例，应 ≤ 40%"
                  : "Measures CapEx占用OCF的比例, should be ≤ 40%"
              }
            />
          </div>

          <Separator />

          {/* Cash Flow Summary */}
          <div className="p-4 rounded-lg bg-muted/50 border">
            <div className="text-sm font-medium mb-3">
              {isZh ? "现金流数据汇总" : "Cash Flow Summary"}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">
                  {isZh ? "净利润" : "Net Income"}
                </div>
                <div className="text-lg font-semibold">
                  {formatNumber(netIncome, locale, 2)} {isZh ? "M" : "M"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  {isZh ? "经营现金流" : "OCF"}
                </div>
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {formatNumber(ocf, locale, 2)} {isZh ? "M" : "M"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  {isZh ? "资本支出" : "CapEx"}
                </div>
                <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                  {formatNumber(capex, locale, 2)} {isZh ? "M" : "M"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  {isZh ? "自由现金流" : "FCF"}
                </div>
                <div className="text-lg font-semibold text-chart-2">
                  {formatNumber(fcf, locale, 2)} {isZh ? "M" : "M"}
                </div>
              </div>
            </div>
          </div>

          {/* Interpretation Guide */}
          {qualityScore !== null && (
            <div className={`p-4 rounded-lg border ${getScoreGrade().bgColor}`}>
              <div className="flex items-center gap-3">
                <div className={`text-lg font-semibold ${getScoreGrade().color}`}>
                  {qualityScore >= 80
                    ? isZh ? "✓ 盈利质量优秀" : "✓ Excellent Earnings Quality"
                    : qualityScore >= 60
                    ? isZh ? "⚠ 盈利质量一般" : "⚠ Medium Earnings Quality"
                    : isZh ? "✗ 盈利质量堪忧" : "✗ Poor Earnings Quality"
                  }
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {qualityScore >= 80
                  ? isZh
                    ? "公司的经营现金流充足，能够有效覆盖净利润，资本支出占比合理，自由现金流充裕。这是高质量企业的典型特征。"
                    : "Company's OCF is sufficient to cover Net Income effectively, CapEx ratio is reasonable, and FCF is abundant. This is typical of high-quality enterprises."
                  : qualityScore >= 60
                  ? isZh
                    ? "公司的现金流表现尚可，但部分指标存在警示信号。建议结合行业特性和公司历史数据进一步分析。"
                    : "Company's cash flow performance is acceptable, but some indicators show warning signals. Recommend further analysis considering industry characteristics and company history."
                  : isZh
                    ? "公司现金流状况令人担忧，净利润的现金保障程度较低或资本支出占比过高。需要仔细分析原因，警惕可能的财务问题。"
                    : "Company's cash flow situation is concerning, with low cash backing for profits or excessively high CapEx ratio. Careful analysis of causes is needed. Beware of potential financial issues."
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
                  ? "现金流质量分析应结合行业特点和发展阶段综合判断。资本密集型行业（如制造业、基础设施）的CapEx/OCF通常较高，而轻资产行业（如软件、服务）则较低。成熟企业的现金流通常比成长企业更稳定。此外，应连续多年观察指标变化趋势，而非仅看单一年份数据。"
                  : "FCF quality analysis should be combined with industry characteristics and development stage for comprehensive judgment. Capital-intensive industries (e.g., manufacturing, infrastructure) typically have higher CapEx/OCF, while asset-light industries (e.g., software, services) are lower. Mature enterprises usually have more stable cash flows than growth companies. Additionally, observe trends over multiple years rather than just single-year data."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
