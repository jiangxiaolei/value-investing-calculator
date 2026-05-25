"use client"

import { useState, useMemo } from "react"
import { DollarSign, TrendingDown, ArrowLeftRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLocale } from "@/lib/i18n/i18n-context"
import { formatNumber } from "@/lib/formatters"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"

// US CPI data (1913-2025, annual averages)
const CPI_DATA: { year: number; cpi: number }[] = [
  { year: 1913, cpi: 9.9 }, { year: 1914, cpi: 10.0 }, { year: 1915, cpi: 10.1 },
  { year: 1916, cpi: 10.9 }, { year: 1917, cpi: 12.8 }, { year: 1918, cpi: 15.1 },
  { year: 1919, cpi: 17.3 }, { year: 1920, cpi: 20.0 }, { year: 1921, cpi: 17.9 },
  { year: 1922, cpi: 16.8 }, { year: 1923, cpi: 17.1 }, { year: 1924, cpi: 17.1 },
  { year: 1925, cpi: 17.5 }, { year: 1926, cpi: 17.7 }, { year: 1927, cpi: 17.4 },
  { year: 1928, cpi: 17.1 }, { year: 1929, cpi: 17.1 }, { year: 1930, cpi: 16.7 },
  { year: 1931, cpi: 15.2 }, { year: 1932, cpi: 13.7 }, { year: 1933, cpi: 13.0 },
  { year: 1934, cpi: 13.4 }, { year: 1935, cpi: 13.7 }, { year: 1936, cpi: 13.9 },
  { year: 1937, cpi: 14.4 }, { year: 1938, cpi: 14.1 }, { year: 1939, cpi: 13.9 },
  { year: 1940, cpi: 14.0 }, { year: 1941, cpi: 14.7 }, { year: 1942, cpi: 16.3 },
  { year: 1943, cpi: 17.3 }, { year: 1944, cpi: 17.6 }, { year: 1945, cpi: 18.0 },
  { year: 1946, cpi: 19.5 }, { year: 1947, cpi: 22.3 }, { year: 1948, cpi: 24.1 },
  { year: 1949, cpi: 23.8 }, { year: 1950, cpi: 24.1 }, { year: 1951, cpi: 26.0 },
  { year: 1952, cpi: 26.5 }, { year: 1953, cpi: 26.7 }, { year: 1954, cpi: 26.9 },
  { year: 1955, cpi: 26.8 }, { year: 1956, cpi: 27.2 }, { year: 1957, cpi: 28.1 },
  { year: 1958, cpi: 28.9 }, { year: 1959, cpi: 29.1 }, { year: 1960, cpi: 29.6 },
  { year: 1961, cpi: 29.9 }, { year: 1962, cpi: 30.2 }, { year: 1963, cpi: 30.6 },
  { year: 1964, cpi: 31.0 }, { year: 1965, cpi: 31.5 }, { year: 1966, cpi: 32.4 },
  { year: 1967, cpi: 33.4 }, { year: 1968, cpi: 34.8 }, { year: 1969, cpi: 36.7 },
  { year: 1970, cpi: 38.8 }, { year: 1971, cpi: 40.5 }, { year: 1972, cpi: 41.8 },
  { year: 1973, cpi: 44.4 }, { year: 1974, cpi: 49.3 }, { year: 1975, cpi: 53.8 },
  { year: 1976, cpi: 56.9 }, { year: 1977, cpi: 60.6 }, { year: 1978, cpi: 65.2 },
  { year: 1979, cpi: 72.6 }, { year: 1980, cpi: 82.4 }, { year: 1981, cpi: 90.9 },
  { year: 1982, cpi: 96.5 }, { year: 1983, cpi: 99.6 }, { year: 1984, cpi: 103.9 },
  { year: 1985, cpi: 107.6 }, { year: 1986, cpi: 109.6 }, { year: 1987, cpi: 113.6 },
  { year: 1988, cpi: 118.3 }, { year: 1989, cpi: 124.0 }, { year: 1990, cpi: 130.7 },
  { year: 1991, cpi: 136.2 }, { year: 1992, cpi: 140.3 }, { year: 1993, cpi: 144.5 },
  { year: 1994, cpi: 148.2 }, { year: 1995, cpi: 152.4 }, { year: 1996, cpi: 156.9 },
  { year: 1997, cpi: 160.5 }, { year: 1998, cpi: 163.0 }, { year: 1999, cpi: 166.6 },
  { year: 2000, cpi: 172.2 }, { year: 2001, cpi: 177.1 }, { year: 2002, cpi: 179.9 },
  { year: 2003, cpi: 184.0 }, { year: 2004, cpi: 188.9 }, { year: 2005, cpi: 195.3 },
  { year: 2006, cpi: 201.6 }, { year: 2007, cpi: 207.3 }, { year: 2008, cpi: 215.3 },
  { year: 2009, cpi: 214.5 }, { year: 2010, cpi: 218.1 }, { year: 2011, cpi: 224.9 },
  { year: 2012, cpi: 229.6 }, { year: 2013, cpi: 233.0 }, { year: 2014, cpi: 236.7 },
  { year: 2015, cpi: 237.0 }, { year: 2016, cpi: 240.0 }, { year: 2017, cpi: 245.1 },
  { year: 2018, cpi: 251.1 }, { year: 2019, cpi: 255.7 }, { year: 2020, cpi: 258.8 },
  { year: 2021, cpi: 271.0 }, { year: 2022, cpi: 292.7 }, { year: 2023, cpi: 304.7 },
  { year: 2024, cpi: 314.0 }, { year: 2025, cpi: 322.0 },
]

const currentYear = 2025
const currentCPI = CPI_DATA.find(d => d.year === currentYear)?.cpi || 322

export function InflationCalculator() {
  const { locale } = useLocale()
  const isZh = locale === "zh-CN"

  const [mode, setMode] = useState<"forward" | "backward">("forward")
  const [amount, setAmount] = useState(10000)
  const [fromYear, setFromYear] = useState(2000)
  const [toYear, setToYear] = useState(2026)
  const [inflationRate, setInflationRate] = useState(3)

  // Forward calculation: today's $X in Y years at Z% inflation
  const forwardResult = useMemo(() => {
    const years = toYear - currentYear
    if (years <= 0) return null
    const futureValue = amount / Math.pow(1 + inflationRate / 100, years)
    return {
      original: amount,
      futureValue: Math.round(futureValue * 100) / 100,
      years,
      lossPercent: Math.round((1 - futureValue / amount) * 1000) / 10,
    }
  }, [amount, toYear, inflationRate, mode])

  // Backward calculation: historical $X = ? today
  const backwardResult = useMemo(() => {
    const fromCPI = CPI_DATA.find(d => d.year === fromYear)?.cpi
    if (!fromCPI) return null
    const todayValue = amount * (currentCPI / fromCPI)
    return {
      original: amount,
      fromYear,
      todayValue: Math.round(todayValue * 100) / 100,
      multiplier: Math.round((currentCPI / fromCPI) * 10) / 10,
    }
  }, [amount, fromYear, mode])

  // Historical CPI chart data (selectable range: 1950-present)
  const chartData = useMemo(() => {
    return CPI_DATA.filter(d => d.year >= 1950).map(d => ({
      year: d.year,
      cpi: d.cpi,
      value: backwardResult ? Math.round(100 * (d.cpi / currentCPI) * 10000) / 100 : null,
    }))
  }, [backwardResult])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-amber-600" />
            {isZh ? "通胀购买力计算" : "Inflation & Purchasing Power"}
          </CardTitle>
          <CardDescription>
            {isZh
              ? "理解通胀如何侵蚀你的购买力——历史数据和未来预测"
              : "Understand how inflation erodes purchasing power — historical data and future projections"}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forward" className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            {isZh ? "正向计算（未来）" : "Forward (Future)"}
          </TabsTrigger>
          <TabsTrigger value="backward" className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            {isZh ? "反向计算（历史）" : "Backward (Historical)"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forward" className="space-y-6 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>{isZh ? "当前金额 ($)" : "Current Amount ($)"}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isZh ? "目标年份" : "Target Year"}</Label>
                  <Input
                    type="number"
                    min={currentYear + 1}
                    max={2080}
                    value={toYear}
                    onChange={(e) => setToYear(Math.min(2080, Math.max(currentYear + 1, parseInt(e.target.value) || 2026)))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isZh ? "预期年通胀率 (%)" : "Expected Inflation Rate (%)"}</Label>
                  <Input
                    type="number"
                    min={0}
                    max={50}
                    step={0.1}
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {forwardResult && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {isZh ? "当前价值" : "Today's Value"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ${formatNumber(forwardResult.original, locale, 0)}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-50 to-red-50 dark:from-amber-950/30 dark:to-red-950/20 border-amber-200 dark:border-amber-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    {forwardResult.years}{isZh ? "年后实际价值" : " Years Later"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    ${formatNumber(forwardResult.futureValue, locale, 0)}
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    {isZh ? `缩水 ${forwardResult.lossPercent}%` : `Lost ${forwardResult.lossPercent}%`}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-500">
                    {isZh ? "购买力损失" : "Purchasing Power Lost"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-500">
                    ${formatNumber(forwardResult.original - forwardResult.futureValue, locale, 0)}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="backward" className="space-y-6 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{isZh ? "历史金额 ($)" : "Historical Amount ($)"}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isZh ? "历史年份" : "Historical Year"}</Label>
                  <Input
                    type="number"
                    min={1913}
                    max={currentYear}
                    value={fromYear}
                    onChange={(e) => setFromYear(Math.min(currentYear, Math.max(1913, parseInt(e.target.value) || 2000)))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {backwardResult && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {backwardResult.fromYear}{isZh ? "年的价值" : " Value"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ${formatNumber(backwardResult.original, locale, 0)}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/30 dark:to-teal-900/20 border-teal-200 dark:border-teal-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-teal-700 dark:text-teal-300">
                    {isZh ? "相当于今天" : "Today's Equivalent"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    ${formatNumber(backwardResult.todayValue, locale, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isZh ? `约${backwardResult.multiplier}倍` : `${backwardResult.multiplier}x multiplier`}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {isZh ? "通胀累计" : "Total Inflation"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {Math.round((backwardResult.multiplier - 1) * 100)}%
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* CPI Historical Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-amber-600" />
            {isZh ? "美国 CPI 历史走势（1950-2025）" : "US CPI Historical Trend (1950-2025)"}
          </CardTitle>
          <CardDescription>
            {isZh
              ? "消费者价格指数——衡量通胀的基准指标"
              : "Consumer Price Index — the benchmark measure of inflation"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              cpi: { label: "CPI", color: "#f59e0b" },
            }}
          >
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} interval={7} />
              <YAxis tickFormatter={(v) => `${v}`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="cpi" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} name="cpi" />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Notable examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            {isZh ? "通胀对购买力的真实影响" : "Real Impact of Inflation"}
          </CardTitle>
          <CardDescription>
            {isZh ? "同一笔钱在不同年代的购买力" : "Same amount of money across different eras"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isZh ? "年份" : "Year"}</TableHead>
                <TableHead className="text-right">{isZh ? "当时值" : "Then"}</TableHead>
                <TableHead className="text-right">{isZh ? "相当于今天" : "Today (2025)"}</TableHead>
                <TableHead className="text-right">{isZh ? "倍数" : "Multiplier"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { year: 1965, amount: 1000, label: isZh ? "1965年的" : "1965" },
                { year: 1980, amount: 1000, label: isZh ? "1980年的" : "1980" },
                { year: 1995, amount: 1000, label: isZh ? "1995年的" : "1995" },
                { year: 2010, amount: 1000, label: isZh ? "2010年的" : "2010" },
              ].map(({ year, amount }) => {
                const cpi = CPI_DATA.find(d => d.year === year)?.cpi
                if (!cpi) return null
                const today = Math.round(amount * (currentCPI / cpi))
                const mult = Math.round((currentCPI / cpi) * 10) / 10
                return (
                  <TableRow key={year}>
                    <TableCell>{year}</TableCell>
                    <TableCell className="text-right">${formatNumber(amount, locale, 0)}</TableCell>
                    <TableCell className="text-right font-medium text-teal-600 dark:text-teal-400">
                      ${formatNumber(today, locale, 0)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{mult}x</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}