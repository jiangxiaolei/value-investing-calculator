"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, Calculator, Info, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useLocale } from "@/lib/i18n/i18n-context"
import { formatNumber } from "@/lib/formatters"

interface Trade {
  id: number
  shares: number
  price: number
  fee: number
}

export function CostBasisCalculator() {
  const { locale } = useLocale()
  const isZh = locale === "zh-CN"

  const [trades, setTrades] = useState<Trade[]>([
    { id: 1, shares: 1000, price: 15.5, fee: 15 },
    { id: 2, shares: 500, price: 18.2, fee: 10 },
  ])
  const [currentPrice, setCurrentPrice] = useState(16.8)
  const [totalSold, setTotalSold] = useState(0)
  const [avgSoldPrice, setAvgSoldPrice] = useState(0)
  const [sellFee, setSellFee] = useState(0)

  const nextId = useMemo(() => Math.max(...trades.map(t => t.id), 0) + 1, [trades])

  const addTrade = () => {
    setTrades([...trades, { id: nextId, shares: 1000, price: 20, fee: 10 }])
  }

  const removeTrade = (id: number) => {
    if (trades.length <= 1) return
    setTrades(trades.filter(t => t.id !== id))
  }

  const updateTrade = (id: number, field: keyof Trade, value: number) => {
    setTrades(trades.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const analysis = useMemo(() => {
    const totalShares = trades.reduce((sum, t) => sum + t.shares, 0)
    const totalCost = trades.reduce((sum, t) => sum + t.shares * t.price + t.fee, 0)
    const totalFees = trades.reduce((sum, t) => sum + t.fee, 0)
    const avgCost = totalShares > 0 ? totalCost / totalShares : 0

    const currentValue = totalShares * currentPrice
    const totalUnrealized = currentValue - totalCost
    const totalReturn = totalCost > 0 ? (currentValue / totalCost - 1) * 100 : 0

    // Realized P&L
    const realizedProceeds = totalSold * avgSoldPrice - sellFee
    const realizedCost = totalSold * avgCost
    const realizedPL = realizedProceeds - realizedCost

    const remainingShares = Math.max(0, totalShares - totalSold)
    const remainingCost = remainingShares * avgCost

    return { totalShares, totalCost, totalFees, avgCost, currentValue, totalUnrealized, totalReturn, realizedPL, realizedProceeds, remainingShares, remainingCost }
  }, [trades, currentPrice, totalSold, avgSoldPrice, sellFee])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {isZh ? "持仓成本计算器" : "Cost Basis Calculator"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isZh ? "多次买入的平均成本与盈亏分析" : "Average cost and P&L analysis for multiple purchases"}
        </p>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {isZh
            ? "分批买入同一只股票后，用加权平均成本计算真实持仓成本，一目了然地看到浮盈浮亏。支持记录卖出交易。"
            : "Track your average cost basis across multiple purchases. See unrealized gains/losses clearly. Supports partial sell tracking."
          }
        </p>
      </div>

      {/* Buy Trades */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-chart-2" />
              {isZh ? "买入记录" : "Purchase Records"}
            </CardTitle>
            <CardDescription>
              {isZh ? "依次添加每次买入的股数、价格和手续费" : "Add each purchase with shares, price, and fees"}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={addTrade} className="gap-1">
            <Plus className="h-4 w-4" /> {isZh ? "添加" : "Add"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {trades.map((trade, idx) => (
            <div key={trade.id} className="flex flex-wrap items-end gap-3 p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                {idx + 1}
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{isZh ? "股数" : "Shares"}</Label>
                <Input type="number" value={trade.shares} onChange={(e) => updateTrade(trade.id, "shares", Number(e.target.value))} min={0} step={100} className="w-20 h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{isZh ? "买入价" : "Price"}</Label>
                <Input type="number" value={trade.price} onChange={(e) => updateTrade(trade.id, "price", Number(e.target.value))} min={0} step={0.01} className="w-20 h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{isZh ? "手续费" : "Fee"}</Label>
                <Input type="number" value={trade.fee} onChange={(e) => updateTrade(trade.id, "fee", Number(e.target.value))} min={0} step={0.1} className="w-16 h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">{isZh ? "小计" : "Subtotal"}</div>
                <div className="h-8 flex items-center text-sm font-medium">{formatNumber(trade.shares * trade.price + trade.fee, locale, 0)}</div>
              </div>
              {trades.length > 1 && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => removeTrade(trade.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Current Price & Sell Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{isZh ? "当前市价" : "Current Market Price"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input type="number" value={currentPrice} onChange={(e) => setCurrentPrice(Number(e.target.value))} min={0} step={0.01} className="w-28" />
              <span className="text-muted-foreground">{isZh ? "元" : "CNY"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{isZh ? "已卖出（可选）" : "Sells (Optional)"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{isZh ? "卖出股数" : "Shares Sold"}</Label>
                <Input type="number" value={totalSold} onChange={(e) => setTotalSold(Number(e.target.value))} min={0} step={100} className="w-20" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{isZh ? "卖出均价" : "Avg Sell Price"}</Label>
                <Input type="number" value={avgSoldPrice} onChange={(e) => setAvgSoldPrice(Number(e.target.value))} min={0} step={0.01} className="w-20" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{isZh ? "卖出费用" : "Sell Fee"}</Label>
                <Input type="number" value={sellFee} onChange={(e) => setSellFee(Number(e.target.value))} min={0} step={0.1} className="w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{isZh ? "持仓分析" : "Position Analysis"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border bg-card text-center">
              <div className="text-xs text-muted-foreground">{isZh ? "总买入" : "Total Shares Bought"}</div>
              <div className="text-xl font-bold">{formatNumber(analysis.totalShares, locale, 0)}</div>
            </div>
            <div className="p-3 rounded-lg border bg-card text-center">
              <div className="text-xs text-muted-foreground">{isZh ? "总投入" : "Total Invested"}</div>
              <div className="text-xl font-bold">{formatNumber(analysis.totalCost, locale, 0)}</div>
            </div>
            <div className="p-3 rounded-lg border bg-card text-center">
              <div className="text-xs text-muted-foreground">{isZh ? "总手续费" : "Total Fees"}</div>
              <div className="text-xl font-bold text-muted-foreground">{formatNumber(analysis.totalFees, locale, 0)}</div>
            </div>
            <div className="p-3 rounded-lg border bg-card text-center">
              <div className="text-xs text-muted-foreground">{isZh ? "剩余持仓" : "Remaining Shares"}</div>
              <div className="text-xl font-bold">{formatNumber(analysis.remainingShares, locale, 0)}</div>
            </div>
          </div>

          <Separator />

          {/* Average Cost & Unrealized P&L */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-muted/50">
              <div className="text-sm text-muted-foreground mb-2">{isZh ? "加权平均成本" : "Weighted Avg Cost"}</div>
              <div className="text-4xl font-bold">{formatNumber(analysis.avgCost, locale, 3)}</div>
              <div className="mt-2 flex gap-4 text-sm">
                <span className="text-muted-foreground">{isZh ? "当前价" : "Current"}: {formatNumber(currentPrice, locale, 2)}</span>
                <span className={currentPrice >= analysis.avgCost ? "text-green-600 dark:text-green-400" : "text-red-500"}>
                  {currentPrice >= analysis.avgCost ? "↑" : "↓"} {Math.abs(((currentPrice / analysis.avgCost) - 1) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-card border">
              <div className="text-sm text-muted-foreground mb-3">{isZh ? "盈亏汇总" : "P&L Summary"}</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{isZh ? "当前持仓市值" : "Current Position Value"}</span>
                  <span className="font-semibold">{formatNumber(analysis.currentValue, locale, 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{isZh ? "累计浮盈/浮亏" : "Unrealized P&L"}</span>
                  <span className={`font-semibold ${analysis.totalUnrealized >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                    {analysis.totalUnrealized >= 0 ? "+" : ""}{formatNumber(analysis.totalUnrealized, locale, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{isZh ? "总回报率" : "Total Return"}</span>
                  <span className={`font-semibold ${analysis.totalReturn >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                    {analysis.totalReturn >= 0 ? "+" : ""}{analysis.totalReturn.toFixed(2)}%
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">{isZh ? "已实现盈亏" : "Realized P&L"}</span>
                  <span className={`font-semibold ${analysis.realizedPL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                    {analysis.realizedPL >= 0 ? "+" : ""}{formatNumber(analysis.realizedPL, locale, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-sm font-semibold mb-1">
              {isZh ? "💡 怎么用" : "💡 How to Use"}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isZh
                ? `把每笔买入的股数、价格和手续费填入左侧表格，工具自动计算加权平均成本。填入当前股价查看浮盈浮亏。如果部分卖出过，填写卖出记录查看已实现盈亏。注意：A股卖出还需考虑印花税（卖出金额的0.05%），建议填入「手续费」中。`
                : "Enter each purchase's shares, price, and fee. The tool calculates weighted average cost automatically. Enter the current price to see unrealized P&L. For partial sells, enter the details to track realized gains. Note: consider all trading fees including stamp duty."
              }
            </p>
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
                  ? "持仓成本计算不考虑分红、送股、配股等因素的影响。实际税务处理（如分红扣税、资本利得税）因地区和个人情况而异。本工具仅供学习参考，不构成投资建议。"
                  : "This cost basis calculator does not account for dividends, stock splits, or rights offerings. Tax treatment varies by jurisdiction. For educational purposes only."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}