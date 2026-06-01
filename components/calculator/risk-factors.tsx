"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Loader2,
  AlertCircle,
  CheckCircle,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Shield,
  DollarSign,
  Building2,
  Search,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocale } from "@/lib/i18n/i18n-context"

interface StockData {
  code: string
  name: string
  price: number
  change: number
  pe: number | null
  pb: number | null
  roe: number | null
  grossMargin: number | null
  netMargin: number | null
  debtRatio: number | null
  marketCap: number
  eps: number | null
  nav: number | null
  dividendYield: number | null
  fcf: number | null
}

interface RiskScore {
  dimension: string
  dimensionZh: string
  score: number  // 1-10, higher = more risky
  level: "low" | "medium" | "high"
  details: string
  detailsZh: string
}

interface AnalysisResult {
  stockData: StockData
  riskScores: RiskScore[]
  overallRisk: "low" | "medium" | "high"
  overallScore: number
  summary: string
  summaryZh: string
  keySignals: { positive: string[]; positiveZh: string[]; warning: string[]; warningZh: string[] }
}

function getLevelColor(level: "low" | "medium" | "high"): string {
  switch (level) {
    case "low": return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40"
    case "medium": return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/40"
    case "high": return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40"
  }
}

function scoreLevel(score: number): "low" | "medium" | "high" {
  if (score <= 3) return "low"
  if (score <= 6) return "medium"
  return "high"
}

function getChangeIcon(change: number) {
  if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
  if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
  return <Minus className="h-4 w-4 text-gray-400" />
}

function formatNumber(n: number | null, decimals = 2): string {
  if (n === null || n === undefined) return "—"
  return n.toFixed(decimals)
}

function formatLargeNumber(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万亿"
  if (n >= 1) return n.toFixed(1) + "亿"
  return n.toFixed(0)
}

export function RiskScorecard() {
  const { t, locale } = useLocale()
  const isZh = locale === "zh-CN"

  const [stockCode, setStockCode] = useState("")
  const [exchange, setExchange] = useState("sz")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fetchedData, setFetchedData] = useState<StockData | null>(null)

  const fetchStockData = async (code: string, exch: string): Promise<StockData> => {
    const res = await fetch(`/api/stock?code=${encodeURIComponent(code.trim())}&exchange=${exch}`)
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || `HTTP ${res.status}`)
    }
    const json = await res.json()
    const d = json.data
    if (!d) throw new Error(isZh ? "未找到该股票" : "Stock not found")
    return {
      code: d.code,
      name: d.name,
      price: d.price,
      change: d.change || 0,
      pe: d.pe ?? null,
      pb: d.pb ?? null,
      roe: d.roe ?? null,
      grossMargin: d.grossMargin ?? null,
      netMargin: d.netMargin ?? null,
      debtRatio: d.debtRatio ?? null,
      marketCap: d.marketCap || d.floatMarketCap || 0,
      eps: d.eps ?? null,
      nav: d.nav ?? null,
      dividendYield: d.dividendYield ?? null,
      fcf: d.fcf ?? null,
    }
  }

  const calculateRisk = (sd: StockData): AnalysisResult => {
    const scores: RiskScore[] = []

    // 1. Valuation Risk
    let valScore = 5
    const peDesc: string[] = [], peDescZh: string[] = []
    if (sd.pe !== null) {
      if (sd.pe > 50) { valScore = 9; peDesc.push("PE > 50x — extreme overvaluation"); peDescZh.push("市盈率 > 50倍 — 極端高估") }
      else if (sd.pe > 30) { valScore = 7; peDesc.push("PE 30-50x — above industry average"); peDescZh.push("市盈率 30-50倍 — 高於行業平均") }
      else if (sd.pe > 20) { valScore = 5; peDesc.push("PE 20-30x — moderate"); peDescZh.push("市盈率 20-30倍 — 中等") }
      else if (sd.pe > 10) { valScore = 3; peDesc.push("PE 10-20x — reasonable range"); peDescZh.push("市盈率 10-20倍 — 合理區間") }
      else { valScore = 2; peDesc.push("PE < 10x — potentially undervalued (check for value traps)"); peDescZh.push("市盈率 < 10倍 — 可能低估（注意價值陷阱）") }
    }
    if (sd.pb !== null) {
      if (sd.pb > 10) valScore = Math.min(valScore + 2, 10)
      else if (sd.pb < 1) valScore = Math.max(valScore - 1, 1)
    }
    scores.push({
      dimension: "Valuation Risk", dimensionZh: "估值風險",
      score: valScore, level: scoreLevel(valScore),
      details: peDesc.join(". ") || (peDescZh.join("；")), detailsZh: peDescZh.join("；") || (peDesc.join(". "))
    })

    // 2. Financial Health Risk
    let healthScore = 5
    const hDesc: string[] = [], hDescZh: string[] = []
    if (sd.debtRatio !== null) {
      if (sd.debtRatio > 0.7) { healthScore = 9; hDesc.push(`Debt ratio ${(sd.debtRatio*100).toFixed(0)}% — high leverage`); hDescZh.push(`資產負債率 ${(sd.debtRatio*100).toFixed(0)}% — 高槓桿`) }
      else if (sd.debtRatio > 0.5) { healthScore = 6; hDesc.push(`Debt ratio ${(sd.debtRatio*100).toFixed(0)}% — moderate`); hDescZh.push(`資產負債率 ${(sd.debtRatio*100).toFixed(0)}% — 中等`) }
      else { healthScore = 2; hDesc.push(`Debt ratio ${(sd.debtRatio*100).toFixed(0)}% — conservative`); hDescZh.push(`資產負債率 ${(sd.debtRatio*100).toFixed(0)}% — 穩健`) }
    }
    if (sd.fcf !== null && sd.fcf < 0) {
      healthScore = Math.min(healthScore + 2, 10)
      hDesc.push("Negative free cash flow — cash flow risk")
      hDescZh.push("自由現金流為負 — 現金流風險")
    }
    scores.push({
      dimension: "Financial Health", dimensionZh: "財務健康",
      score: healthScore, level: scoreLevel(healthScore),
      details: hDesc.join(". ") || (hDescZh.join("；")), detailsZh: hDescZh.join("；") || (hDesc.join(". "))
    })

    // 3. Profitability Risk
    let profScore = 5
    const pDesc: string[] = [], pDescZh: string[] = []
    if (sd.roe !== null) {
      if (sd.roe > 0.2) { profScore = 2; pDesc.push(`ROE ${(sd.roe*100).toFixed(1)}% — excellent`); pDescZh.push(`ROE ${(sd.roe*100).toFixed(1)}% — 優秀`) }
      else if (sd.roe > 0.15) { profScore = 3; pDesc.push(`ROE ${(sd.roe*100).toFixed(1)}% — good`); pDescZh.push(`ROE ${(sd.roe*100).toFixed(1)}% — 良好`) }
      else if (sd.roe > 0.1) { profScore = 5; pDesc.push(`ROE ${(sd.roe*100).toFixed(1)}% — average`); pDescZh.push(`ROE ${(sd.roe*100).toFixed(1)}% — 一般`) }
      else if (sd.roe > 0) { profScore = 7; pDesc.push(`ROE ${(sd.roe*100).toFixed(1)}% — below average`); pDescZh.push(`ROE ${(sd.roe*100).toFixed(1)}% — 低於平均`) }
      else { profScore = 9; pDesc.push(`ROE ${(sd.roe*100).toFixed(1)}% — negative, loss-making`); pDescZh.push(`ROE ${(sd.roe*100).toFixed(1)}% — 虧損狀態`) }
    }
    if (sd.netMargin !== null) {
      if (sd.netMargin > 0.2) pDesc.push(`Net margin ${(sd.netMargin*100).toFixed(1)}% — strong pricing power`)
      else if (sd.netMargin < 0.05) pDesc.push(`Net margin ${(sd.netMargin*100).toFixed(1)}% — thin margins`)
      if (sd.netMargin > 0.2) pDescZh.push(`淨利率 ${(sd.netMargin*100).toFixed(1)}% — 強定價權`)
      else if (sd.netMargin < 0.05) pDescZh.push(`淨利率 ${(sd.netMargin*100).toFixed(1)}% — 利潤微薄`)
    }
    scores.push({
      dimension: "Profitability Risk", dimensionZh: "盈利能力風險",
      score: profScore, level: scoreLevel(profScore),
      details: pDesc.join(". ") || (pDescZh.join("；")), detailsZh: pDescZh.join("；") || (pDesc.join(". "))
    })

    // 4. Size & Liquidity Risk
    let sizeScore = 5
    const sDesc: string[] = [], sDescZh: string[] = []
    if (sd.marketCap > 1000) { sizeScore = 2; sDesc.push(`Market cap ${formatLargeNumber(sd.marketCap)} — mega cap`); sDescZh.push(`市值 ${formatLargeNumber(sd.marketCap)} — 超大盤`) }
    else if (sd.marketCap > 100) { sizeScore = 4; sDesc.push(`Market cap ${formatLargeNumber(sd.marketCap)} — large cap`); sDescZh.push(`市值 ${formatLargeNumber(sd.marketCap)} — 大盤`) }
    else if (sd.marketCap > 10) { sizeScore = 6; sDesc.push(`Market cap ${formatLargeNumber(sd.marketCap)} — mid cap`); sDescZh.push(`市值 ${formatLargeNumber(sd.marketCap)} — 中盤`) }
    else if (sd.marketCap > 0) { sizeScore = 8; sDesc.push(`Market cap ${formatLargeNumber(sd.marketCap)} — small cap (higher volatility)`); sDescZh.push(`市值 ${formatLargeNumber(sd.marketCap)} — 小盤（波動大）`) }
    scores.push({
      dimension: "Size & Liquidity", dimensionZh: "規模與流動性風險",
      score: sizeScore, level: scoreLevel(sizeScore),
      details: sDesc.join(". ") || (sDescZh.join("；")), detailsZh: sDescZh.join("；") || (sDesc.join(". "))
    })

    const overallScore = Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length)
    const overallRisk = scoreLevel(overallScore) as "low" | "medium" | "high"

    // Generate key signals
    const positive: string[] = [], positiveZh: string[] = []
    const warning: string[] = [], warningZh: string[] = []

    if (sd.roe !== null && sd.roe > 0.15) { positive.push(`ROE ${(sd.roe*100).toFixed(1)}%`); positiveZh.push(`ROE ${(sd.roe*100).toFixed(1)}%）`) }
    if (sd.debtRatio !== null && sd.debtRatio < 0.4) { positive.push("Low leverage"); positiveZh.push("低槓桿") }
    if (sd.dividendYield !== null && sd.dividendYield > 0.03) { positive.push(`Dividend ${(sd.dividendYield*100).toFixed(1)}%`); positiveZh.push(`股息率 ${(sd.dividendYield*100).toFixed(1)}%`) }
    if (sd.fcf !== null && sd.fcf > 0) { positive.push("Positive FCF"); positiveZh.push("正自由現金流") }

    if (sd.pe !== null && sd.pe > 40) { warning.push(`High PE (${sd.pe.toFixed(0)}x)`); warningZh.push(`高市盈率（${sd.pe.toFixed(0)}倍）`) }
    if (sd.debtRatio !== null && sd.debtRatio > 0.6) { warning.push(`High debt (${(sd.debtRatio*100).toFixed(0)}%)`); warningZh.push(`高負債率（${(sd.debtRatio*100).toFixed(0)}%）`) }
    if (sd.roe !== null && sd.roe < 0.08) { warning.push(`Low ROE (${(sd.roe*100).toFixed(1)}%)`); warningZh.push(`低ROE（${(sd.roe*100).toFixed(1)}%）`) }
    if (sd.marketCap > 0 && sd.marketCap < 10) { warning.push("Small cap volatility risk"); warningZh.push("小盤波動風險") }

    let summary = "", summaryZh = ""
    if (overallScore <= 3) {
      summary = `Low overall risk (${overallScore}/10). ${sd.name} shows strong fundamentals with healthy profitability and conservative financial structure.`
      summaryZh = `總體風險較低（${overallScore}/10）。${sd.name}基本面穩健，盈利能力強，財務結構保守。`
    } else if (overallScore <= 6) {
      summary = `Moderate overall risk (${overallScore}/10). ${sd.name} has average risk profile. Monitor key metrics closely.`
      summaryZh = `總體風險中等（${overallScore}/10）。${sd.name}風險水平一般，建議密切關注關鍵指標變化。`
    } else {
      summary = `Higher overall risk (${overallScore}/10). ${sd.name} shows several red flags. Further research is strongly recommended before investment.`
      summaryZh = `總體風險較高（${overallScore}/10）。${sd.name}存在多項警示信號，投資前建議深入研究。`
    }

    setFetchedData(sd)
    return {
      stockData: sd,
      riskScores: scores,
      overallRisk,
      overallScore,
      summary, summaryZh,
      keySignals: { positive, positiveZh, warning, warningZh }
    }
  }

  const handleAnalyze = async () => {
    if (!stockCode.trim()) {
      setError(isZh ? "請輸入股票代碼" : "Please enter a stock code")
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)
    setFetchedData(null)

    try {
      const sd = await fetchStockData(stockCode, exchange)
      const analysis = calculateRisk(sd)
      setResult(analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : (isZh ? "獲取數據失敗" : "Failed to fetch data"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          {isZh ? "股票風險評分" : "Stock Risk Scorecard"}
        </h1>
        <p className="text-base text-muted-foreground max-w-xl mx-auto">
          {isZh
            ? "輸入股票代碼，基於真實財務數據自動評估估值、財務健康、盈利能力和規模四大維度風險"
            : "Enter a stock code to automatically assess valuation, financial health, profitability, and size risks using real financial data."
          }
        </p>
      </div>

      {/* Input Card */}
      <Card className="border-amber-200 dark:border-amber-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-amber-500" />
            {isZh ? "查詢股票" : "Look Up Stock"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="space-y-2">
              <Label>{isZh ? "交易所" : "Exchange"}</Label>
              <Select value={exchange} onValueChange={setExchange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sz">{isZh ? "深交所 (SZ)" : "Shenzhen (SZ)"}</SelectItem>
                  <SelectItem value="sh">{isZh ? "上交所 (SH)" : "Shanghai (SH)"}</SelectItem>
                  <SelectItem value="hk">{isZh ? "港股 (HK)" : "Hong Kong (HK)"}</SelectItem>
                  <SelectItem value="us">{isZh ? "美股 (US)" : "US Stocks"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label>{isZh ? "股票代碼" : "Stock Code"}</Label>
              <Input
                value={stockCode}
                onChange={(e) => setStockCode(e.target.value)}
                placeholder={isZh ? "例：000001 或 600519" : "e.g. 000001 or AAPL"}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isLoading || !stockCode.trim()}
              className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isZh ? "分析中..." : "Analyzing..."}</>
              ) : (
                <><BarChart3 className="mr-2 h-4 w-4" /> {isZh ? "開始分析" : "Start Analysis"}</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <>
          {/* Company Header Card */}
          <Card className="border-amber-200 dark:border-amber-900">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-amber-600" />
                    {result.stockData.name}
                    <span className="text-sm font-mono text-muted-foreground">({result.stockData.code.toUpperCase()})</span>
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-2xl font-bold">{result.stockData.price.toFixed(2)}</span>
                    <span className={`flex items-center gap-1 ${result.stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {getChangeIcon(result.stockData.change)}
                      {result.stockData.change > 0 ? '+' : ''}{result.stockData.change.toFixed(2)}
                    </span>
                  </div>
                </div>
                {/* Overall Risk Badge */}
                <div className={`px-5 py-3 rounded-xl text-center ${
                  result.overallRisk === "low" ? "bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-700" :
                  result.overallRisk === "medium" ? "bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-700" :
                  "bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700"
                }`}>
                  <div className="text-xs text-muted-foreground">{isZh ? "綜合風險" : "Overall Risk"}</div>
                  <div className={`text-lg font-bold ${
                    result.overallRisk === "low" ? "text-green-600 dark:text-green-400" :
                    result.overallRisk === "medium" ? "text-yellow-600 dark:text-yellow-400" :
                    "text-red-600 dark:text-red-400"
                  }`}>
                    {result.overallScore}/10
                  </div>
                  <div className="text-xs">{isZh
                    ? (result.overallRisk === "low" ? "低風險" : result.overallRisk === "medium" ? "中等風險" : "高風險")
                    : (result.overallRisk === "low" ? "Low Risk" : result.overallRisk === "medium" ? "Medium Risk" : "High Risk")
                  }</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm leading-relaxed">{isZh ? result.summaryZh : result.summary}</p>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card>
            <CardHeader><CardTitle className="text-lg">{isZh ? "關鍵財務指標" : "Key Financial Metrics"}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "市值", labelEn: "Market Cap", value: formatLargeNumber(result.stockData.marketCap), icon: DollarSign },
                  { label: "市盈率", labelEn: "PE", value: formatNumber(result.stockData.pe), icon: BarChart3 },
                  { label: "ROE", labelEn: "ROE", value: result.stockData.roe !== null ? (result.stockData.roe*100).toFixed(1)+"%" : "—", icon: TrendingUp },
                  { label: "資產負債率", labelEn: "Debt Ratio", value: result.stockData.debtRatio !== null ? (result.stockData.debtRatio*100).toFixed(0)+"%" : "—", icon: Shield },
                ].map((m, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50 border">
                    <div className="text-xs text-muted-foreground mb-1">{isZh ? m.label : m.labelEn}</div>
                    <div className="text-lg font-semibold">{m.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{isZh ? "風險維度評分" : "Risk Dimension Scores"}</CardTitle>
              <CardDescription>{isZh ? "1分=最安全，10分=最高風險" : "1=Safer, 10=Riskier"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.riskScores.map((rs, i) => (
                <div key={i} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{isZh ? rs.dimensionZh : rs.dimension}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(rs.level)}`}>
                      {rs.score}/10 · {isZh
                        ? (rs.level === "low" ? "低" : rs.level === "medium" ? "中" : "高")
                        : (rs.level === "low" ? "Low" : rs.level === "medium" ? "Med" : "High")}
                    </span>
                  </div>
                  {/* Score Bar */}
                  <div className="w-full h-2 bg-muted rounded-full mb-2">
                    <div className={`h-full rounded-full transition-all ${
                      rs.level === "low" ? "bg-green-500" : rs.level === "medium" ? "bg-yellow-500" : "bg-red-500"
                    }`} style={{ width: `${rs.score * 10}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">{isZh ? rs.detailsZh : rs.details}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Key Signals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.keySignals.positive.length > 0 && (
              <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {isZh ? "正面信號" : "Positive Signals"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {(isZh ? result.keySignals.positiveZh : result.keySignals.positive).map((s, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                        <span className="text-green-500">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {result.keySignals.warning.length > 0 && (
              <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    {isZh ? "警告信號" : "Warning Signals"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {(isZh ? result.keySignals.warningZh : result.keySignals.warning).map((s, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                        <span className="text-red-500">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Example buttons */}
      <Card className="border-amber-200 dark:border-amber-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">{isZh ? "快速試用" : "Quick Try"}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[
            { label: "貴州茅台", sub: "600519", exch: "sh" },
            { label: "騰訊控股", sub: "00700", exch: "hk" },
            { label: "Apple", sub: "AAPL", exch: "us" },
            { label: "平安銀行", sub: "000001", exch: "sz" },
          ].map((ex, i) => (
            <Button key={i} variant="outline" size="sm" onClick={() => { setStockCode(ex.sub); setExchange(ex.exch); }}>
              {ex.label} ({ex.sub})
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-4 text-xs text-muted-foreground bg-muted/50 rounded-lg border">
        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
        <p>{isZh
          ? "風險評分基於財務數據自動計算，僅供參考，不構成投資建議。數據來源東方財富（A股/港股）和 Yahoo Finance（美股），可能存在延遲。"
          : "Risk scores are auto-calculated from financial data for reference only, not investment advice. Data from East Money (A/H shares) and Yahoo Finance (US stocks), may be delayed."}
        </p>
      </div>
    </div>
  )
}
