"use client"

import { useState, useMemo } from "react"
import { Plus, Trash2, PieChart, ArrowUpDown, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/lib/i18n/i18n-context"
import { formatNumber } from "@/lib/formatters"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"

interface AssetRow {
  id: string
  name: string
  target: number
  value: number
}

const COLORS = ["#0d9488", "#2563eb", "#f59e0b", "#dc2626", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16"]
const DEFAULT_ASSETS: AssetRow[] = [
  { id: "1", name: "股票 ETF", target: 60, value: 60000 },
  { id: "2", name: "债券 ETF", target: 30, value: 25000 },
  { id: "3", name: "现金/存款", target: 10, value: 15000 },
]

export function PortfolioRebalancer() {
  const { locale } = useLocale()
  const isZh = locale === "zh-CN"

  const [assets, setAssets] = useState<AssetRow[]>(DEFAULT_ASSETS)
  const [newName, setNewName] = useState("")

  const addAsset = () => {
    if (!newName.trim()) return
    setAssets([...assets, { id: String(Date.now()), name: newName, target: 0, value: 0 }])
    setNewName("")
  }

  const removeAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id))
  }

  const updateAsset = (id: string, field: "name" | "target" | "value", val: string | number) => {
    setAssets(assets.map(a => a.id === id ? { ...a, [field]: val } : a))
  }

  // Auto-normalize targets to sum to 100%
  const normalizeTargets = () => {
    const total = assets.reduce((s, a) => s + a.target, 0)
    if (total === 0) return
    setAssets(assets.map(a => ({
      ...a,
      target: Math.round((a.target / total) * 1000) / 10,
    })))
  }

  const results = useMemo(() => {
    const totalTarget = assets.reduce((s, a) => s + a.target, 0)
    const totalValue = assets.reduce((s, a) => s + a.value, 0)
    if (totalValue <= 0 || totalTarget <= 0) return null

    const withAnalysis = assets.map(a => {
      const currentPct = totalValue > 0 ? (a.value / totalValue) * 100 : 0
      const targetPct = a.target
      const deviation = currentPct - targetPct
      const deviationAbs = Math.abs(deviation)
      const adjustedValue = totalValue * (targetPct / 100)
      const tradeAmount = adjustedValue - a.value
      return { ...a, currentPct, targetPct, deviation, deviationAbs, adjustedValue, tradeAmount }
    })

    // Calculate total needed trades
    const totalBuys = withAnalysis.filter(a => a.tradeAmount > 0).reduce((s, a) => s + a.tradeAmount, 0)
    const totalSells = withAnalysis.filter(a => a.tradeAmount < 0).reduce((s, a) => s + Math.abs(a.tradeAmount), 0)

    return {
      totalValue,
      totalTarget,
      assets: withAnalysis,
      totalBuys: Math.round(totalBuys * 100) / 100,
      totalSells: Math.round(totalSells * 100) / 100,
      isBalanced: Math.max(...withAnalysis.map(a => a.deviationAbs)) < 1,
    }
  }, [assets])

  const chartData = useMemo(() => {
    if (!results) return []
    const data: { name: string; current: number; target: number }[] = []
    results.assets.forEach(a => {
      data.push({ name: a.name, current: Math.round(a.currentPct * 10) / 10, target: a.targetPct })
    })
    return data
  }, [results])

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-teal-600" />
            {isZh ? "当前持仓" : "Current Holdings"}
          </CardTitle>
          <CardDescription>
            {isZh
              ? "添加你的资产类别，设置目标配比，输入当前市值"
              : "Add your asset classes, set target allocation, and enter current market values"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Header */}
            <div className="grid grid-cols-[1fr_80px_100px_80px_36px] gap-2 text-xs font-medium text-muted-foreground px-2">
              <span>{isZh ? "资产类别" : "Asset Class"}</span>
              <span className="text-right">{isZh ? "目标 %" : "Target %"}</span>
              <span className="text-right">{isZh ? "当前市值 ($)" : "Value ($)"}</span>
              <span className="text-right">{isZh ? "偏离" : "Dev"}</span>
              <span></span>
            </div>

            {assets.map((asset, idx) => (
              <div key={asset.id} className="grid grid-cols-[1fr_80px_100px_80px_36px] gap-2 items-center">
                <Input
                  value={asset.name}
                  onChange={(e) => updateAsset(asset.id, "name", e.target.value)}
                  placeholder={isZh ? "资产名称" : "Asset name"}
                  className="h-9 text-sm"
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={asset.target || ""}
                  onChange={(e) => updateAsset(asset.id, "target", Number(e.target.value))}
                  className="h-9 text-sm text-right"
                />
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  value={asset.value || ""}
                  onChange={(e) => updateAsset(asset.id, "value", Number(e.target.value))}
                  className="h-9 text-sm text-right"
                />
                <div className="text-right text-sm">
                  {results && results.assets[idx] && (
                    <span className={results.assets[idx].deviation > 1 ? "text-red-500 font-medium" : results.assets[idx].deviation < -1 ? "text-teal-600 font-medium" : "text-muted-foreground"}>
                      {results.assets[idx].deviation > 0 ? "+" : ""}{results.assets[idx].deviation.toFixed(1)}%
                    </span>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => removeAsset(asset.id)}>
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            ))}

            {/* Add new asset row */}
            <div className="grid grid-cols-[1fr_80px_100px_80px_36px] gap-2 items-center pt-2 border-t">
              <div className="flex gap-2">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={isZh ? "新资产名称..." : "New asset..."}
                  className="h-9 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && addAsset()}
                />
                <Button variant="outline" size="sm" className="h-9" onClick={addAsset}>
                  <Plus className="h-4 w-4 mr-1" /> {isZh ? "添加" : "Add"}
                </Button>
              </div>
            </div>

            {/* Normalize button */}
            {assets.length > 1 && (
              <div className="flex justify-end pt-2">
                <Button variant="ghost" size="sm" onClick={normalizeTargets} className="text-xs text-muted-foreground">
                  <Info className="h-3 w-3 mr-1" />
                  {isZh ? "归一化目标配比（总和=100%）" : "Normalize targets to sum to 100%"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {results && results.totalValue > 0 && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isZh ? "总市值" : "Total Value"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  ${formatNumber(results.totalValue, locale, 0)}
                </p>
              </CardContent>
            </Card>
            <Card className={results.isBalanced ? "bg-green-50 dark:bg-green-950/20 border-green-200" : "bg-amber-50 dark:bg-amber-950/20 border-amber-200"}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isZh ? "平衡状态" : "Status"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-lg font-bold ${results.isBalanced ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                  {results.isBalanced ? (isZh ? "✅ 已平衡" : "✅ Balanced") : (isZh ? "⚠️ 需再平衡" : "⚠️ Needs Rebalance")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isZh ? "需卖出" : "Need to Sell"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-500">
                  ${formatNumber(results.totalSells, locale, 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isZh ? "需买入" : "Need to Buy"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  ${formatNumber(results.totalBuys, locale, 0)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5 text-teal-600" />
                {isZh ? "当前 vs 目标配比" : "Current vs Target Allocation"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  current: { label: isZh ? "当前" : "Current", color: "#0d9488" },
                  target: { label: isZh ? "目标" : "Target", color: "#94a3b8" },
                }}
                className="h-[300px]"
              >
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${v}%`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="current" fill="#0d9488" radius={[4, 4, 0, 0]} name="current" />
                  <Bar dataKey="target" fill="#94a3b8" radius={[4, 4, 0, 0]} name="target" opacity={0.6} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Trade Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isZh ? "再平衡操作指令" : "Rebalance Instructions"}
              </CardTitle>
              <CardDescription>
                {isZh
                  ? "以下操作可将你的组合调整至目标配置"
                  : "Execute the following trades to reach your target allocation"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isZh ? "资产" : "Asset"}</TableHead>
                    <TableHead className="text-right">{isZh ? "当前" : "Current"}</TableHead>
                    <TableHead className="text-right">{isZh ? "目标" : "Target"}</TableHead>
                    <TableHead className="text-right">{isZh ? "偏离" : "Deviation"}</TableHead>
                    <TableHead className="text-right">{isZh ? "操作" : "Action"}</TableHead>
                    <TableHead className="text-right">{isZh ? "金额" : "Amount"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.assets.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell className="text-right">{a.currentPct.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">{a.targetPct.toFixed(1)}%</TableCell>
                      <TableCell className={`text-right font-medium ${a.deviation > 0 ? "text-red-500" : a.deviation < 0 ? "text-teal-600" : ""}`}>
                        {a.deviation > 0 ? "+" : ""}{a.deviation.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">
                        {a.tradeAmount > 0.01 ? (
                          <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:text-teal-300 dark:border-teal-800">
                            {isZh ? "买入" : "BUY"}
                          </Badge>
                        ) : a.tradeAmount < -0.01 ? (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800">
                            {isZh ? "卖出" : "SELL"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-500">
                            {isZh ? "持有" : "HOLD"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {Math.abs(a.tradeAmount) > 0.01
                          ? `${a.tradeAmount > 0 ? "+" : "-"}$${formatNumber(Math.abs(a.tradeAmount), locale, 0)}`
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}