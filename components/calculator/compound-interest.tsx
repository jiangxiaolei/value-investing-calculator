"use client"

import { useState, useMemo } from "react"
import { DollarSign, TrendingUp, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLocale } from "@/lib/i18n/i18n-context"
import { formatNumber } from "@/lib/formatters"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"

export function CompoundInterestCalculator() {
  const { locale } = useLocale()
  const isZh = locale === "zh-CN"

  const [principal, setPrincipal] = useState(10000)
  const [monthly, setMonthly] = useState(500)
  const [rate, setRate] = useState(8)
  const [years, setYears] = useState(10)
  const [inflation, setInflation] = useState(3)

  const results = useMemo(() => {
    if (rate <= 0 || years <= 0) return null

    const monthlyRate = rate / 100 / 12
    const inflationRate = inflation / 100
    let balance = principal
    const yearlyData: { year: number; balance: number; contributions: number; earnings: number; inflationAdjusted: number }[] = []
    let totalContributions = principal

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + monthlyRate) + monthly
      }
      totalContributions += monthly * 12
      const earnings = balance - totalContributions
      const inflationAdjusted = balance / Math.pow(1 + inflationRate, y)
      yearlyData.push({
        year: y,
        balance: Math.round(balance * 100) / 100,
        contributions: totalContributions,
        earnings: Math.round(earnings * 100) / 100,
        inflationAdjusted: Math.round(inflationAdjusted * 100) / 100,
      })
    }

    const final = yearlyData[yearlyData.length - 1]
    return {
      finalBalance: final.balance,
      finalAdjusted: final.inflationAdjusted,
      totalContributions: final.contributions,
      totalEarnings: final.earnings,
      buyingPowerLoss: final.balance - final.inflationAdjusted,
      yearlyData,
    }
  }, [principal, monthly, rate, years, inflation])

  // Comparison data: what if started 5 years earlier vs later
  const comparisonData = useMemo(() => {
    if (!results) return null
    const variations = [-5, 0, 5].map(offset => {
      const actualYears = Math.max(1, years + offset)
      const monthlyRate = rate / 100 / 12
      let balance = principal
      let totalC = principal
      for (let y = 1; y <= actualYears; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + monthlyRate) + monthly
        }
        totalC += monthly * 12
      }
      return {
        label: offset === 0 ? (isZh ? "当前计划" : "Current") : offset < 0 ? (isZh ? `早${Math.abs(offset)}年` : `${Math.abs(offset)}yr earlier`) : (isZh ? `晚${offset}年` : `${offset}yr later`),
        balance: Math.round(balance),
        contributions: totalC,
        color: offset === 0 ? "#0d9488" : offset < 0 ? "#2563eb" : "#dc2626",
      }
    })
    return variations
  }, [results, years, principal, monthly, rate, isZh])

  if (!results) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">{isZh ? "请输入有效的年化收益率和年限" : "Enter valid rate and years"}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-teal-600" />
            {isZh ? "复利计算参数" : "Compound Interest Parameters"}
          </CardTitle>
          <CardDescription>
            {isZh
              ? "调整以下参数，查看定投增长的雪球效应"
              : "Adjust parameters to see the snowball effect of compound interest"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>{isZh ? "初始本金 ($)" : "Initial Principal ($)"}</Label>
              <Input
                type="number"
                min={0}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>{isZh ? "每月定投 ($)" : "Monthly Contribution ($)"}</Label>
              <Input
                type="number"
                min={0}
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>{isZh ? "年化收益率 (%)" : "Annual Return (%)"}</Label>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>{isZh ? "投资年限" : "Investment Period (Years)"}</Label>
              <Input
                type="number"
                min={1}
                max={60}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>{isZh ? "年通胀率 (%)" : "Annual Inflation (%)"}</Label>
              <Input
                type="number"
                min={0}
                max={50}
                step={0.1}
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/30 dark:to-teal-900/20 border-teal-200 dark:border-teal-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-teal-700 dark:text-teal-300">
              {isZh ? "最终总资产" : "Final Balance"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              ${formatNumber(results.finalBalance, locale, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
              {isZh ? "通胀调整后" : "Inflation Adjusted"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              ${formatNumber(results.finalAdjusted, locale, 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isZh ? `通胀侵蚀 $${formatNumber(results.buyingPowerLoss, locale, 0)}` : `Inflation ate $${formatNumber(results.buyingPowerLoss, locale, 0)}`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {isZh ? "总投入" : "Total Invested"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${formatNumber(results.totalContributions, locale, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {isZh ? "总收益" : "Total Earnings"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${formatNumber(results.totalEarnings, locale, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-teal-600" />
            {isZh ? "资产增长曲线" : "Growth Over Time"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              balance: { label: isZh ? "总资产" : "Balance", color: "#0d9488" },
              contributions: { label: isZh ? "累计投入" : "Contributions", color: "#94a3b8" },
              inflationAdjusted: { label: isZh ? "通胀调整后" : "Inflation Adj.", color: "#f59e0b" },
            }}
          >
            <AreaChart data={results.yearlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tickFormatter={(v) => `Y${v}`} />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="balance" stroke="#0d9488" fill="#0d9488" fillOpacity={0.15} strokeWidth={2} name="balance" />
              <Area type="monotone" dataKey="contributions" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 4" name="contributions" />
              <Area type="monotone" dataKey="inflationAdjusted" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="2 2" name="inflationAdjusted" />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Comparison: Start earlier vs later */}
      {comparisonData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-teal-600" />
              {isZh ? "时间的力量：早开始 vs 晚开始" : "The Power of Time: Start Earlier vs Later"}
            </CardTitle>
            <CardDescription>
              {isZh
                ? "同样的月投金额，早5年和晚5年差距有多大？"
                : "Same monthly contribution — how much difference does 5 years make?"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {comparisonData.map((item) => (
                <Card key={item.label} className={`border-l-4`} style={{ borderLeftColor: item.color }}>
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xl font-bold" style={{ color: item.color }}>
                      ${formatNumber(item.balance, locale, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isZh ? `投入 $${formatNumber(item.contributions, locale, 0)}` : `Invested $${formatNumber(item.contributions, locale, 0)}`}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ChartContainer
              config={{
                balance: { label: isZh ? "最终资产" : "Final Balance", color: "#0d9488" },
              }}
            >
              <BarChart data={comparisonData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="balance" fill="#0d9488" radius={[4, 4, 0, 0]} name="balance" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Year-by-Year Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-teal-600" />
            {isZh ? "逐年明细" : "Year-by-Year Breakdown"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isZh ? "年份" : "Year"}</TableHead>
                  <TableHead className="text-right">{isZh ? "总资产" : "Balance"}</TableHead>
                  <TableHead className="text-right">{isZh ? "累计投入" : "Invested"}</TableHead>
                  <TableHead className="text-right">{isZh ? "收益" : "Earnings"}</TableHead>
                  <TableHead className="text-right">{isZh ? "通胀调整后" : "Inflation Adj."}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.yearlyData.map((row) => (
                  <TableRow key={row.year}>
                    <TableCell>{isZh ? `第${row.year}年` : `Year ${row.year}`}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${formatNumber(row.balance, locale, 0)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      ${formatNumber(row.contributions, locale, 0)}
                    </TableCell>
                    <TableCell className={`text-right ${row.earnings >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                      ${formatNumber(row.earnings, locale, 0)}
                    </TableCell>
                    <TableCell className="text-right text-amber-600 dark:text-amber-400">
                      ${formatNumber(row.inflationAdjusted, locale, 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}