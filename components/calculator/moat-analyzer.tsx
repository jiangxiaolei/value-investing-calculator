"use client"

import { useState } from "react"
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  DollarSign,
  Building2,
  Search,
  Star,
  Award,
  Lightbulb
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocale } from "@/lib/i18n/i18n-context"

interface StockData {
  code: string; name: string; price: number; change: number
  pe: number | null; pb: number | null; roe: number | null
  grossMargin: number | null; netMargin: number | null
  debtRatio: number | null; marketCap: number
  eps: number | null; dividendYield: number | null; fcf: number | null
}

interface MoatScore {
  type: string; typeZh: string; score: number; level: string
  evidence: string; evidenceZh: string
}

interface MoatResult {
  stockData: StockData
  moatScores: MoatScore[]
  overallMoat: "wide" | "narrow" | "none" | "unknown"
  overallScore: number
  summary: string; summaryZh: string
  keyTakeaways: string[]; keyTakeawaysZh: string[]
}

function formatNumber(n: number | null, d = 2) { return n === null ? "—" : n.toFixed(d) }
function formatLargeCap(n: number) { return n >= 10000 ? (n/10000).toFixed(1)+"万亿" : n.toFixed(1)+"亿" }
function getMoatColor(level: string) {
  if (level === "wide") return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700"
  if (level === "narrow") return "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700"
  if (level === "none") return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700"
  return "text-gray-500 bg-gray-100"
}
function getScoreColor(s: number) {
  if (s >= 8) return "bg-green-500"
  if (s >= 5) return "bg-amber-500"
  return "bg-red-500"
}

export function MoatAnalyzer() {
  const { locale } = useLocale()
  const isZh = locale === "zh-CN"
  const [stockCode, setStockCode] = useState(""); const [exchange, setExchange] = useState("sz")
  const [isLoading, setIsLoading] = useState(false); const [result, setResult] = useState<MoatResult | null>(null); const [error, setError] = useState<string | null>(null)

  const fetchStock = async (code: string, exch: string): Promise<StockData> => {
    const w = process.env.NEXT_PUBLIC_AI_API_URL || ""
    const r = await fetch(`${w}/?code=${encodeURIComponent(code.trim())}&exchange=${exch}`)
    if (!r.ok) throw new Error(isZh ? "未找到該股票" : "Stock not found")
    const j = await r.json(); const d = j.data
    if (!d) throw new Error(isZh ? "未找到該股票" : "Stock not found")
    return {
      code: d.code, name: d.name, price: d.price, change: d.change || 0,
      pe: d.pe ?? null, pb: d.pb ?? null, roe: d.roe ?? null,
      grossMargin: d.grossMargin ?? null, netMargin: d.netMargin ?? null,
      debtRatio: d.debtRatio ?? null, marketCap: d.marketCap || d.floatMarketCap || 0,
      eps: d.eps ?? null, dividendYield: d.dividendYield ?? null, fcf: d.fcf ?? null,
    }
  }

  const analyzeMoat = (sd: StockData): MoatResult => {
    const scores: MoatScore[] = []

    // 1. Profitability Moat (ROE as proxy for competitive advantage)
    let roeScore = 5
    let roeEv = "", roeEvZh = ""
    if (sd.roe !== null) {
      if (sd.roe > 0.25) { roeScore = 9; roeEv = `ROE ${(sd.roe*100).toFixed(1)}% — exceptional, strong competitive advantage signal`; roeEvZh = `ROE ${(sd.roe*100).toFixed(1)}% — 極強盈利能力，明顯競爭優勢` }
      else if (sd.roe > 0.15) { roeScore = 7; roeEv = `ROE ${(sd.roe*100).toFixed(1)}% — good, above average`; roeEvZh = `ROE ${(sd.roe*100).toFixed(1)}% — 良好，高於平均` }
      else if (sd.roe > 0.10) { roeScore = 5; roeEv = `ROE ${(sd.roe*100).toFixed(1)}% — average`; roeEvZh = `ROE ${(sd.roe*100).toFixed(1)}% — 一般` }
      else { roeScore = 2; roeEv = `ROE ${(sd.roe*100).toFixed(1)}% — below average, limited moat`; roeEvZh = `ROE ${(sd.roe*100).toFixed(1)}% — 低於平均，護城河有限` }
    }
    scores.push({ type: "Profitability", typeZh: "盈利能力", score: roeScore, level: roeScore >= 7 ? "strong" : roeScore >= 4 ? "moderate" : "weak", evidence: roeEv, evidenceZh: roeEvZh })

    // 2. Pricing Power (Gross Margin)
    let gmScore = 5
    let gmEv = "", gmEvZh = ""
    if (sd.grossMargin !== null) {
      if (sd.grossMargin > 0.60) { gmScore = 9; gmEv = `Gross margin ${(sd.grossMargin*100).toFixed(0)}% — exceptional pricing power`; gmEvZh = `毛利率 ${(sd.grossMargin*100).toFixed(0)}% — 極強定價權` }
      else if (sd.grossMargin > 0.40) { gmScore = 7; gmEv = `Gross margin ${(sd.grossMargin*100).toFixed(0)}% — strong pricing power`; gmEvZh = `毛利率 ${(sd.grossMargin*100).toFixed(0)}% — 強定價權` }
      else if (sd.grossMargin > 0.20) { gmScore = 5; gmEv = `Gross margin ${(sd.grossMargin*100).toFixed(0)}% — moderate`; gmEvZh = `毛利率 ${(sd.grossMargin*100).toFixed(0)}% — 中等` }
      else { gmScore = 3; gmEv = `Gross margin ${(sd.grossMargin*100).toFixed(0)}% — low, limited pricing power`; gmEvZh = `毛利率 ${(sd.grossMargin*100).toFixed(0)}% — 低，定價權有限` }
    }
    scores.push({ type: "Pricing Power", typeZh: "定價權", score: gmScore, level: gmScore >= 7 ? "strong" : gmScore >= 4 ? "moderate" : "weak", evidence: gmEv, evidenceZh: gmEvZh })

    // 3. Financial Stability (debt ratio as moat strength indicator)
    let dbScore = 5
    let dbEv = "", dbEvZh = ""
    if (sd.debtRatio !== null) {
      if (sd.debtRatio < 0.30) { dbScore = 8; dbEv = `Debt ratio ${(sd.debtRatio*100).toFixed(0)}% — very conservative, strong moat support`; dbEvZh = `資產負債率 ${(sd.debtRatio*100).toFixed(0)}% — 極穩健，護城河支撐` }
      else if (sd.debtRatio < 0.50) { dbScore = 6; dbEv = `Debt ratio ${(sd.debtRatio*100).toFixed(0)}% — moderate`; dbEvZh = `資產負債率 ${(sd.debtRatio*100).toFixed(0)}% — 中等` }
      else { dbScore = 3; dbEv = `Debt ratio ${(sd.debtRatio*100).toFixed(0)}% — high leverage weakens moat`; dbEvZh = `資產負債率 ${(sd.debtRatio*100).toFixed(0)}% — 高槓桿削弱護城河` }
    }
    scores.push({ type: "Financial Stability", typeZh: "財務穩健度", score: dbScore, level: dbScore >= 7 ? "strong" : dbScore >= 4 ? "moderate" : "weak", evidence: dbEv, evidenceZh: dbEvZh })

    // 4. Size & Scale Advantage
    let szScore = 5
    let szEv = "", szEvZh = ""
    if (sd.marketCap > 5000) { szScore = 8; szEv = `Market cap ${formatLargeCap(sd.marketCap)} — mega cap, significant scale moat`; szEvZh = `市值 ${formatLargeCap(sd.marketCap)} — 超大盤，規模護城河明顯` }
    else if (sd.marketCap > 500) { szScore = 6; szEv = `Market cap ${formatLargeCap(sd.marketCap)} — large cap`; szEvZh = `市值 ${formatLargeCap(sd.marketCap)} — 大盤股` }
    else if (sd.marketCap > 50) { szScore = 4; szEv = `Market cap ${formatLargeCap(sd.marketCap)} — mid cap`; szEvZh = `市值 ${formatLargeCap(sd.marketCap)} — 中盤股` }
    else { szScore = 2; szEv = `Market cap ${formatLargeCap(sd.marketCap)} — small cap, limited scale moat`; szEvZh = `市值 ${formatLargeCap(sd.marketCap)} — 小盤股，規模護城河有限` }
    scores.push({ type: "Scale Advantage", typeZh: "規模優勢", score: szScore, level: szScore >= 7 ? "strong" : szScore >= 4 ? "moderate" : "weak", evidence: szEv, evidenceZh: szEvZh })

    const overallScore = Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length)
    const overallMoat = overallScore >= 7 ? "wide" : overallScore >= 4 ? "narrow" : "none"

    const takeaways = [], takeawaysZh = []
    if (sd.roe !== null && sd.roe > 0.15) { takeaways.push(`Consistently high ROE (${(sd.roe*100).toFixed(1)}%) suggests durable competitive advantage`); takeawaysZh.push(`持續高ROE（${(sd.roe*100).toFixed(1)}%）暗示持續競爭優勢`) }
    if (sd.grossMargin !== null && sd.grossMargin > 0.40) { takeaways.push(`Pricing power evident from ${(sd.grossMargin*100).toFixed(0)}% gross margin`); takeawaysZh.push(`${(sd.grossMargin*100).toFixed(0)}%毛利率反映強定價權`) }
    if (sd.debtRatio !== null && sd.debtRatio < 0.30) { takeaways.push("Low debt allows moat investment without financial strain"); takeawaysZh.push("低負債讓公司有能力持續投資護城河") }
    if (sd.marketCap > 5000) { takeaways.push("Mega-cap status provides intrinsic scale moat"); takeawaysZh.push("超大盤規模提供天然的規模護城河") }
    if (sd.pe !== null && sd.pe > 40) { takeaways.push("Premium valuation (PE > 40) — market prices in a wide moat already"); takeawaysZh.push("溢價估值——市場已爲寬護城河定價") }

    let summary = "", summaryZh = ""
    if (overallMoat === "wide") {
      summary = `Wide moat (${overallScore}/10). ${sd.name} shows strong competitive advantages across multiple dimensions. Its high profitability and financial strength suggest durable above-average returns.`
      summaryZh = `寬護城河（${overallScore}/10）。${sd.name}在多重維度展現強競爭優勢，高盈利能力和財務實力暗示可持續的超額回報。`
    } else if (overallMoat === "narrow") {
      summary = `Narrow moat (${overallScore}/10). ${sd.name} has some competitive advantages, but they may not be durable enough to fend off competition long-term.`
      summaryZh = `窄護城河（${overallScore}/10）。${sd.name}具備一定競爭優勢，但可能需要持續投入以維持。`
    } else {
      summary = `No significant moat detected (${overallScore}/10). ${sd.name} lacks clear competitive advantages. Competing primarily on price or execution rather than structural advantages.`
      summaryZh = `未檢出明顯護城河（${overallScore}/10）。${sd.name}缺乏明確競爭優勢，更多靠價格或執行力競爭。`
    }

    return { stockData: sd, moatScores: scores, overallMoat, overallScore, summary, summaryZh, keyTakeaways: takeaways, keyTakeawaysZh: takeawaysZh }
  }

  const handleAnalyze = async () => {
    if (!stockCode.trim()) { setError(isZh ? "請輸入股票代碼" : "Please enter a stock code"); return }
    setIsLoading(true); setError(null); setResult(null)
    try { const sd = await fetchStock(stockCode, exchange); setResult(analyzeMoat(sd)) }
    catch (err) { setError(err instanceof Error ? err.message : isZh ? "獲取數據失敗" : "Failed to fetch") }
    finally { setIsLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <ShieldCheck className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          {isZh ? "護城河評分" : "Moat Rating"}
        </h1>
        <p className="text-base text-muted-foreground max-w-xl mx-auto">
          {isZh ? "輸入股票代碼，基於ROE、毛利率、負債率、市值等真實數據評估企業競爭護城河" : "Enter a stock code to evaluate competitive moat using real financial data — ROE, margins, debt, and scale."}
        </p>
      </div>

      {/* Input */}
      <Card className="border-amber-200 dark:border-amber-900">
        <CardHeader><CardTitle className="flex items-center gap-2"><Search className="h-5 w-5 text-amber-500" />{isZh ? "查詢股票" : "Stock Lookup"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="space-y-2">
              <Label>{isZh ? "交易所" : "Exchange"}</Label>
              <Select value={exchange} onValueChange={setExchange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sz">{isZh ? "深交所 (SZ)" : "Shenzhen (SZ)"}</SelectItem>
                  <SelectItem value="sh">{isZh ? "上交所 (SH)" : "Shanghai (SH)"}</SelectItem>
                  <SelectItem value="hk">{isZh ? "港股 (HK)" : "Hong Kong (HK)"}</SelectItem>
                  <SelectItem value="us">{isZh ? "美股 (US)" : "US Stocks"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isZh ? "股票代碼" : "Stock Code"}</Label>
              <Input value={stockCode} onChange={(e)=>setStockCode(e.target.value)} placeholder={isZh ? "例：600519" : "e.g. AAPL"} onKeyDown={(e)=>e.key==="Enter"&&handleAnalyze()} />
            </div>
            <Button onClick={handleAnalyze} disabled={isLoading||!stockCode.trim()} className="bg-amber-600 hover:bg-amber-700">
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isZh ? "分析中..." : "Analyzing..."}</> : <><Award className="mr-2 h-4 w-4" />{isZh ? "評估護城河" : "Rate Moat"}</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && <Card className="border-destructive/50 bg-destructive/10"><CardContent className="pt-6"><div className="flex items-start gap-3"><AlertCircle className="h-5 w-5 text-destructive shrink-0"/><p className="text-sm">{error}</p></div></CardContent></Card>}

      {result && <>
        {/* Header */}
        <Card className="border-amber-200 dark:border-amber-900">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold"><Building2 className="h-5 w-5 inline text-amber-600 mr-2"/>{result.stockData.name}<span className="text-sm font-mono text-muted-foreground ml-2">({result.stockData.code.toUpperCase()})</span></h2>
                <div className="text-2xl font-bold mt-1">¥{result.stockData.price.toFixed(2)}</div>
              </div>
              <div className={`px-5 py-3 rounded-xl text-center ${getMoatColor(result.overallMoat)}`}>
                <div className="text-xs text-muted-foreground">{isZh ? "護城河" : "Moat"}</div>
                <div className="text-lg font-bold">{result.overallScore}/10</div>
                <div className="text-xs">{isZh ? (result.overallMoat === "wide" ? "寬" : result.overallMoat === "narrow" ? "窄" : "無") : result.overallMoat.toUpperCase()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card><CardContent className="pt-6"><p className="text-sm leading-relaxed">{isZh ? result.summaryZh : result.summary}</p></CardContent></Card>

        {/* Dimension Scores */}
        <Card>
          <CardHeader><CardTitle className="text-lg">{isZh ? "護城河維度評分" : "Moat Dimensions"}</CardTitle><CardDescription>{isZh ? "1-10分，越高越強" : "1-10, higher = stronger"}</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {result.moatScores.map((m, i) => (
              <div key={i} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{isZh ? m.typeZh : m.type}</span>
                  <span className="text-sm font-medium">{m.score}/10</span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full mb-2">
                  <div className={`h-full rounded-full transition-all ${getScoreColor(m.score)}`} style={{width:`${m.score*10}%`}} />
                </div>
                <p className="text-xs text-muted-foreground">{isZh ? m.evidenceZh : m.evidence}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Key Takeaways */}
        <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1"><Lightbulb className="h-4 w-4 text-amber-600" />{isZh ? "關鍵結論" : "Key Takeaways"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {(isZh ? result.keyTakeawaysZh : result.keyTakeaways).map((t, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1"><span className="text-amber-500">•</span> {t}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </>}

      {/* Quick try */}
      <Card className="border-amber-200 dark:border-amber-900">
        <CardHeader className="pb-3"><CardTitle className="text-sm">{isZh ? "快速試用" : "Quick Try"}</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[
            { label: "貴州茅台", sub: "600519", exch: "sh" },
            { label: "騰訊控股", sub: "00700", exch: "hk" },
            { label: "Apple", sub: "AAPL", exch: "us" },
            { label: "招商銀行", sub: "600036", exch: "sh" },
            { label: "Microsoft", sub: "MSFT", exch: "us" },
          ].map((ex, i) => (
            <Button key={i} variant="outline" size="sm" onClick={()=>{setStockCode(ex.sub);setExchange(ex.exch)}}>{ex.label} ({ex.sub})</Button>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-start gap-2 p-4 text-xs text-muted-foreground bg-muted/50 rounded-lg border">
        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
        <p>{isZh ? "護城河評估基於公開財務數據的自動分析，僅供參考。真正的護城河需要定性研究——品牌、管理層、行業結構等因素無法僅通過數字衡量。" : "Moat assessment is automated from public financial data. True moat analysis requires qualitative research — brand, management, industry structure."}</p>
      </div>
    </div>
  )
}
