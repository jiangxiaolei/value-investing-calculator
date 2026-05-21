"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Search, TrendingUp, BarChart3, AlertCircle, Loader2, Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface StockQuote {
  code: string
  name: string
  price: number
  change: number
  changePercent: number
  pe: number | null
  pb: number | null
  marketCap: number
  // A-share specific
  roe?: number | null
  grossMargin?: number | null
  debtRatio?: number | null
  dividendYield?: number | null
  totalRevenue?: number | null
  netProfit?: number | null
  fcf?: number | null
  // HK specific
  eps?: number | null
  hsiVolume?: number | null
  // Historical PE percentile
  peHistory?: { date: string; pe: number }[]
}

const REGION_LABELS: Record<string, { label: string; prefix: string; example: string }> = {
  "A-股": { label: "A股", prefix: "", example: "000001 / 平安银行" },
  "HK股": { label: "港股", prefix: "hk", example: "00700 / 腾讯控股" },
  "US股": { label: "美股", prefix: "us", example: "AAPL / 苹果" },
}

// Mock data for when API fails
const MOCK_QUOTE_腾讯: StockQuote = {
  code: "00700",
  name: "腾讯控股",
  price: 385.0,
  change: 5.2,
  changePercent: 1.37,
  pe: 18.5,
  pb: 3.8,
  marketCap: 35600,
  roe: 22.4,
  grossMargin: 47.2,
  debtRatio: 32.1,
  dividendYield: 1.8,
  totalRevenue: 6090,
  netProfit: 1156,
  fcf: 980,
  eps: 12.1,
  peHistory: [
    { date: "2020", pe: 28.5 },
    { date: "2021", pe: 22.1 },
    { date: "2022", pe: 12.8 },
    { date: "2023", pe: 15.3 },
    { date: "2024", pe: 17.2 },
    { date: "2025", pe: 18.5 },
  ],
}

const MOCK_QUOTE_茅台: StockQuote = {
  code: "600519",
  name: "贵州茅台",
  price: 1680.0,
  change: -12.5,
  changePercent: -0.74,
  pe: 22.3,
  pb: 8.9,
  marketCap: 2110,
  roe: 35.2,
  grossMargin: 91.9,
  debtRatio: 18.5,
  dividendYield: 3.2,
  totalRevenue: 1476,
  netProfit: 747,
  fcf: 620,
  peHistory: [
    { date: "2020", pe: 48.2 },
    { date: "2021", pe: 41.5 },
    { date: "2022", pe: 32.8 },
    { date: "2023", pe: 28.1 },
    { date: "2024", pe: 25.2 },
    { date: "2025", pe: 22.3 },
  ],
}

const KNOWN_STOCKS: Record<string, StockQuote> = {
  "00700": MOCK_QUOTE_腾讯,
  "腾讯": MOCK_QUOTE_腾讯,
  "600519": MOCK_QUOTE_茅台,
  "茅台": MOCK_QUOTE_茅台,
  "腾讯控股": MOCK_QUOTE_腾讯,
  "贵州茅台": MOCK_QUOTE_茅台,
}

function MetricCard({
  label,
  value,
  unit = "",
  hint,
  highlight,
  warn,
}: {
  label: string
  value: number | string | null
  unit?: string
  hint?: string
  highlight?: boolean
  warn?: boolean
}) {
  if (value === null || value === undefined) return null
  const display = typeof value === "number" ? (Number.isInteger(value) ? value : value.toFixed(2)) : value
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`bg-muted/40 rounded-lg p-3 border cursor-help ${highlight ? "border-green-400 bg-green-50 dark:bg-green-950/20" : ""} ${warn ? "border-red-300 bg-red-50 dark:bg-red-950/20" : ""}`}>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className={`text-xl font-bold tabular-nums ${highlight ? "text-green-700 dark:text-green-400" : warn ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
              {display}<span className="text-xs font-normal text-muted-foreground ml-1">{unit}</span>
            </p>
          </div>
        </TooltipTrigger>
        {hint && <TooltipContent><p className="text-xs max-w-xs">{hint}</p></TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  )
}

function formatMarketCap(cap: number): string {
  if (cap >= 10000) return `${(cap / 10000).toFixed(2)} 万亿`
  if (cap >= 100) return `${(cap / 100).toFixed(2)} 亿`
  return `${cap} 亿`
}

function PEBadge({ pe }: { pe: number | null }) {
  if (pe === null) return <Badge variant="outline">无数据</Badge>
  if (pe < 0) return <Badge variant="destructive">亏损</Badge>
  if (pe < 15) return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">偏低</Badge>
  if (pe <= 30) return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">合理</Badge>
  return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300">偏高</Badge>
}

function PEHistoryChart({ history }: { history: { date: string; pe: number }[] }) {
  if (!history || history.length === 0) return null
  const max = Math.max(...history.map((h) => h.pe))
  const min = Math.min(...history.map((h) => h.pe))
  const range = max - min || 1
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground mb-2">{history.length > 5 ? "近" : ""}{history.length}年 PE 走势</p>
      <div className="flex items-end gap-1 h-16">
        {history.map((h, i) => {
          const height = ((h.pe - min) / range) * 60 + 20
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <span className="text-xs tabular-nums text-muted-foreground">{h.pe.toFixed(1)}</span>
              <div
                className="w-full bg-green-500/70 rounded-sm transition-all hover:bg-green-500"
                style={{ height: `${height}px` }}
                title={`${h.date}: PE ${h.pe}`}
              />
              <span className="text-xs text-muted-foreground">{h.date}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function StockDashboard() {
  const [query, setQuery] = useState("")
  const [region, setRegion] = useState<"A-股" | "HK股" | "US股">("A-股")
  const [quote, setQuote] = useState<StockQuote | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchStock = useCallback(async (code: string, regionKey: string) => {
    if (!code.trim()) return
    setLoading(true)
    setError(null)
    setQuote(null)

    // Try known stocks first (for demo)
    const normalized = code.trim().toUpperCase()
    const found = Object.entries(KNOWN_STOCKS).find(
      ([k]) => k.toUpperCase() === normalized || KNOWN_STOCKS[k].name.includes(code.trim())
    )
    if (found) {
      setQuote(found[1])
      setLoading(false)
      return
    }

    // Use East Money API for A-shares
    if (regionKey === "A-股") {
      try {
        const emCode = code.trim().startsWith("0") || code.trim().startsWith("6")
          ? code.trim()
          : code.trim().padStart(6, "0")
        const url = `https://push2.eastmoney.com/api/qt/stock/get?secid=1.${emCode}&fields=f43,f57,f58,f107,f57,f44,f45,f46,f47,f48,f50,f57,f58,f107,f116,f117,f162,f163&cb=&_=`
        const res = await fetch(url)
        const data = await res.json()
        if (data.data) {
          const d = data.data
          setQuote({
            code: emCode,
            name: d.f58 || code,
            price: d.f43 / 100 || 0,
            change: 0,
            changePercent: 0,
            pe: d.f162 ? d.f162 / 100 : null,
            pb: d.f167 ? d.f167 / 100 : null,
            marketCap: d.f116 ? d.f116 / 100000000 : 0,
          })
          return
        }
      } catch (e) {
        console.error("East Money API error:", e)
      }
    }

    setError("未找到该股票，请检查代码后重试。")
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchStock(query, region)
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" />
            股票搜索
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder={`输入股票代码，如：${REGION_LABELS[region].example}`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="flex gap-2">
              {(Object.keys(REGION_LABELS) as Array<keyof typeof REGION_LABELS>).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`px-3 py-2 text-sm rounded-md border transition ${
                    region === r
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {REGION_LABELS[r].label}
                </button>
              ))}
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "查询"}
              </button>
            </div>
          </form>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            <span>演示数据：输入 <code className="bg-muted px-1 rounded">腾讯</code>、<code className="bg-muted px-1 rounded">00700</code>、<code className="bg-muted px-1 rounded">茅台</code>、<code className="bg-muted px-1 rounded">600519</code> 可查看效果</span>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {quote && (
        <div className="space-y-4">
          {/* Header info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold">{quote.name}</h2>
                    <PEBadge pe={quote.pe} />
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">{quote.code}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold tabular-nums">
                    {quote.price > 0 ? quote.price.toFixed(2) : "—"}
                    <span className="text-base font-normal text-muted-foreground ml-1">
                      {region === "A-股" ? "元" : region === "HK股" ? "港元" : "美元"}
                    </span>
                  </div>
                  {quote.change !== 0 && (
                    <div className={`text-sm font-medium ${quote.change >= 0 ? "text-red-500" : "text-green-500"}`}>
                      {quote.change >= 0 ? "+" : ""}{quote.change.toFixed(2)} ({quote.changePercent >= 0 ? "+" : ""}{quote.changePercent.toFixed(2)}%)
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <MetricCard
              label="市盈率 (P/E)"
              value={quote.pe}
              hint={quote.pe !== null ? (quote.pe < 15 ? "偏低，有价值陷阱可能" : quote.pe > 30 ? "偏高，需高增长支撑" : "在合理区间") : "无数据"}
              highlight={quote.pe !== null && quote.pe >= 15 && quote.pe <= 30}
              warn={quote.pe !== null && quote.pe > 40}
            />
            <MetricCard
              label="市净率 (P/B)"
              value={quote.pb}
              hint="市净率低于1可能意味低估，也可能是高 ROE 的结果"
            />
            <MetricCard
              label="净资产收益率 (ROE)"
              value={quote.roe}
              unit="%"
              hint="ROE > 15% 为优质公司，> 25% 为顶级公司"
              highlight={quote.roe !== null && quote.roe > 20}
            />
            <MetricCard
              label="股息率"
              value={quote.dividendYield}
              unit="%"
              hint="股息率需结合利润增速和可持续性判断"
              highlight={quote.dividendYield !== null && quote.dividendYield > 3}
            />
            <MetricCard
              label="毛利率"
              value={quote.grossMargin}
              unit="%"
              hint="高毛利率通常意味着护城河（品牌、技术、网络效应）"
              highlight={quote.grossMargin !== null && quote.grossMargin > 40}
            />
            <MetricCard
              label="资产负债率"
              value={quote.debtRatio}
              unit="%"
              hint="低于50%为稳健，超过70%需警惕"
              warn={quote.debtRatio !== null && quote.debtRatio > 70}
            />
            <MetricCard
              label="市值"
              value={quote.marketCap > 0 ? formatMarketCap(quote.marketCap) : null}
              hint="总市值 = 股价 × 总股本"
            />
            <MetricCard
              label="净利润"
              value={quote.netProfit > 0 ? `${(quote.netProfit / 100).toFixed(2)} 亿` : null}
              hint="归属于上市公司股东的净利润"
            />
          </div>

          {/* Revenue & FCF */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">盈利能力</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">营业收入</p>
                  <p className="text-xl font-bold tabular-nums">
                    {quote.totalRevenue ? `${(quote.totalRevenue / 100).toFixed(1)} 亿` : "—"}
                    <span className="text-xs font-normal text-muted-foreground ml-1">元/港元</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">自由现金流 (FCF)</p>
                  <p className="text-xl font-bold tabular-nums">
                    {quote.fcf ? `${(quote.fcf / 100).toFixed(1)} 亿` : "—"}
                    <span className="text-xs font-normal text-muted-foreground ml-1">元/港元</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">FCF = 经营现金流 - 资本支出</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PE History */}
          {quote.peHistory && quote.peHistory.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">历史估值 (PE)</CardTitle>
              </CardHeader>
              <CardContent>
                <PEHistoryChart history={quote.peHistory} />
                <Separator className="my-3" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">最低 PE</p>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">
                      {Math.min(...quote.peHistory.map((h) => h.pe)).toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">平均 PE</p>
                    <p className="text-sm font-bold">
                      {(quote.peHistory.reduce((s, h) => s + h.pe, 0) / quote.peHistory.length).toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">当前 PE</p>
                    <p className="text-sm font-bold">
                      {quote.pe?.toFixed(1) || "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick valuation judgment */}
          <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <BarChart3 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-300 mb-1">快速判断</p>
                  <div className="text-sm text-green-700/80 dark:text-green-400/80 space-y-1">
                    {quote.pe !== null && (
                      <p>• 市盈率 {quote.pe.toFixed(1)} 倍，{
                        quote.pe < 15 ? "偏低，需确认基本面" :
                        quote.pe <= 30 ? "处于合理区间" :
                        "偏高，需要强劲增长支撑"
                      }</p>
                    )}
                    {quote.roe !== null && quote.roe > 15 && (
                      <p>• ROE {quote.roe.toFixed(1)}%，{quote.roe > 25 ? "优秀" : "良好"}的资本回报能力</p>
                    )}
                    {quote.dividendYield !== null && quote.dividendYield > 2 && (
                      <p>• 股息率 {quote.dividendYield.toFixed(1)}%，有现金回报</p>
                    )}
                    {quote.debtRatio !== null && quote.debtRatio < 50 && (
                      <p>• 资产负债率 {quote.debtRatio.toFixed(1)}%，财务稳健</p>
                    )}
                    {!quote.pe || quote.pe < 0 || !quote.roe || quote.roe < 15 ? (
                      <p className="text-xs text-muted-foreground">（数据不完整，请在估算器中手动输入相关指标）</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA to calculator */}
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground mb-2">
              想要计算这只股票的理想买入价格？
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              使用未来回报倒推估值器 <TrendingUp className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
