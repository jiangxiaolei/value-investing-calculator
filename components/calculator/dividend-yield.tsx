"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, Calculator, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useLocale } from "@/lib/i18n/i18n-context"
import { formatNumber } from "@/lib/formatters"

export function DividendYieldCalculator() {
  const { t, locale } = useLocale()
  const isZh = locale === "zh-CN"

  // Mode 1: Forward dividend yield
  const [annualDps, setAnnualDps] = useState(1.0)
  const [stockPrice, setStockPrice] = useState(20)

  // Mode 2: Total return with dividend reinvested
  const [initialInvestment, setInitialInvestment] = useState(100000)
  const [divYield, setDivYield] = useState(4)
  const [divGrowth, setDivGrowth] = useState(5)
  const [priceGrowth, setPriceGrowth] = useState(3)
  const [years, setYears] = useState(10)

  const forwardYield = useMemo(() => {
    if (stockPrice <= 0 || annualDps <= 0) return null
    return (annualDps / stockPrice) * 100
  }, [annualDps, stockPrice])

  const totalReturnSim = useMemo(() => {
    if (initialInvestment <= 0 || years <= 0) return null
    
    let totalShares = initialInvestment / stockPrice
    let totalIncome = 0
    let currentPrice = stockPrice
    let currentDps = annualDps
    const yearlyData: { year: number; price: number; dps: number; income: number; shareValue: number; totalValue: number }[] = []

    for (let y = 1; y <= years; y++) {
      const dividendIncome = totalShares * currentDps
      totalIncome += dividendIncome
      
      // Reinvest dividends at current price
      const newShares = dividendIncome / currentPrice
      totalShares += newShares
      
      // Grow price and dividend
      currentPrice *= (1 + priceGrowth / 100)
      currentDps *= (1 + divGrowth / 100)

      yearlyData.push({
        year: y,
        price: currentPrice,
        dps: currentDps,
        income: dividendIncome,
        shareValue: totalShares * currentPrice,
        totalValue: totalShares * currentPrice,
      })
    }

    return {
      finalShares: totalShares,
      finalValue: totalShares * currentPrice,
      totalDividends: totalIncome,
      totalReturn: totalShares * currentPrice - initialInvestment,
      totalReturnPercent: ((totalShares * currentPrice / initialInvestment) - 1) * 100,
      yearlyData,
    }
  }, [initialInvestment, stockPrice, annualDps, priceGrowth, divGrowth, years])

  const yieldQuality = useMemo(() => {
    if (!forwardYield) return null
    if (forwardYield >= 5) return { label: isZh ? "高收益" : "High Yield", color: "text-green-600 dark:text-green-400", desc: isZh ? "股息率 >5%，需确认可持续性" : "Yield >5%, verify sustainability" }
    if (forwardYield >= 3) return { label: isZh ? "中等收益" : "Moderate Yield", color: "text-amber-600 dark:text-amber-400", desc: isZh ? "股息率 3-5%，健康的收益水平" : "Yield 3-5%, healthy income level" }
    if (forwardYield >= 1) return { label: isZh ? "低收益" : "Low Yield", color: "text-muted-foreground", desc: isZh ? "股息率 1-3%，常见于成长型公司" : "Yield 1-3%, common for growth companies" }
    return { label: isZh ? "极低收益" : "Very Low Yield", color: "text-red-500", desc: isZh ? "股息率 <1%，可能是成长股或不分红" : "Yield <1%, growth stock or no dividend policy" }
  }, [forwardYield, isZh])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {isZh ? "股息率计算器" : "Dividend Yield Calculator"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isZh ? "计算股息率与股息再投资收益" : "Calculate dividend yield and reinvestment returns"}
        </p>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {isZh
            ? "股息率是衡量股票分红回报的核心指标。本工具支持股息率计算和股息再投资的长期收益模拟。"
            : "Dividend yield measures the annual dividend return of a stock. This tool calculates yield and simulates dividend reinvestment over time."
          }
        </p>
      </div>

      <Tabs defaultValue="yield" className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="yield">{isZh ? "股息率计算" : "Yield Calculator"}</TabsTrigger>
          <TabsTrigger value="reinvest">{isZh ? "股息再投资" : "Reinvestment Simulator"}</TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Yield */}
        <TabsContent value="yield" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-chart-2" />
                {isZh ? "输入参数" : "Input Parameters"}
              </CardTitle>
              <CardDescription>
                {isZh ? "输入每股分红和当前股价" : "Enter annual dividend per share and current stock price"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dps" className="flex items-center text-sm">
                    {isZh ? "每股年分红 (DPS)" : "Annual Dividend Per Share"}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="inline-flex items-center justify-center ml-1 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
                        {isZh ? "公司每年每股派发的现金分红总额。通常可以在财报或分红公告中找到。" : "Total cash dividends paid per share annually. Found in financial reports or dividend announcements."}
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input id="dps" type="number" value={annualDps} onChange={(e) => setAnnualDps(Number(e.target.value))} min={0} step={0.01} className="w-28" />
                    <span className="text-muted-foreground">{isZh ? "元" : "CNY"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sp" className="flex items-center text-sm">
                    {isZh ? "当前股价" : "Current Stock Price"}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="inline-flex items-center justify-center ml-1 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
                        {isZh ? "股票当前的市场交易价格。" : "Current market trading price of the stock."}
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input id="sp" type="number" value={stockPrice} onChange={(e) => setStockPrice(Number(e.target.value))} min={0} step={0.01} className="w-28" />
                    <span className="text-muted-foreground">{isZh ? "元" : "CNY"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-chart-1" />
                {isZh ? "计算结果" : "Results"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-muted/50">
                <div className="text-sm text-muted-foreground mb-2">
                  {isZh ? "股息率" : "Dividend Yield"}
                </div>
                <div className={`text-5xl font-bold ${yieldQuality?.color || ""}`}>
                  {forwardYield !== null ? `${forwardYield.toFixed(2)}%` : "—"}
                </div>
                {yieldQuality && (
                  <div className="mt-2 text-sm text-muted-foreground">{yieldQuality.desc}</div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="text-xs text-muted-foreground mb-1">{isZh ? "每股年分红" : "Annual DPS"}</div>
                  <div className="text-xl font-bold">{formatNumber(annualDps, locale, 2)} {isZh ? "元" : "CNY"}</div>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <div className="text-xs text-muted-foreground mb-1">{isZh ? "当前股价" : "Stock Price"}</div>
                  <div className="text-xl font-bold">{formatNumber(stockPrice, locale, 2)} {isZh ? "元" : "CNY"}</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                <div className="text-sm font-semibold mb-2">
                  {isZh ? "股息率速查表" : "Yield Reference"}
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div>
                    <div className="text-muted-foreground">{isZh ? "高股息" : "High"}</div>
                    <div className="font-bold text-green-600 dark:text-green-400">{isZh ? "≥5%" : "≥5%"}</div>
                    <div className="text-xs text-muted-foreground">{isZh ? "银行/电力/红利" : "Banks/Utilities"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">{isZh ? "中等" : "Medium"}</div>
                    <div className="font-bold text-amber-600 dark:text-amber-400">3-5%</div>
                    <div className="text-xs text-muted-foreground">{isZh ? "消费/制造" : "Consumer/Manufacturing"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">{isZh ? "低股息" : "Low"}</div>
                    <div className="font-bold text-muted-foreground">{"<3%"}</div>
                    <div className="text-xs text-muted-foreground">{isZh ? "科技/成长" : "Tech/Growth"}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Reinvestment Simulator */}
        <TabsContent value="reinvest" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-chart-2" />
                {isZh ? "股息再投资模拟" : "Dividend Reinvestment Simulation"}
              </CardTitle>
              <CardDescription>
                {isZh ? "假设每年分红再投资，模拟长期收益" : "Simulate long-term returns assuming dividends are reinvested annually"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="investAmt" className="text-sm">{isZh ? "初始投资" : "Initial Investment"}</Label>
                  <div className="flex items-center gap-2">
                    <Input id="investAmt" type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(Number(e.target.value))} min={0} step={1000} className="w-28" />
                    <span className="text-muted-foreground">{isZh ? "元" : "CNY"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="divY" className="text-sm">{isZh ? "初始股息率" : "Initial Yield"}</Label>
                  <div className="flex items-center gap-2">
                    <Input id="divY" type="number" value={divYield} onChange={(e) => setDivYield(Number(e.target.value))} min={0} step={0.1} className="w-24" />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reinvestY" className="text-sm">{isZh ? "投资年限" : "Years"}</Label>
                  <div className="flex items-center gap-2">
                    <Input id="reinvestY" type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} min={1} max={50} step={1} className="w-24" />
                    <span className="text-muted-foreground">{isZh ? "年" : "yrs"}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="divG" className="flex items-center text-sm">
                    {isZh ? "分红年增长率" : "Dividend Growth Rate"}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="inline-flex items-center justify-center ml-1 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
                        {isZh ? "每股分红每年的增长比率。成熟公司通常3-8%，红利贵族可达10%以上。" : "Annual growth rate of dividend per share. Mature companies typically 3-8%, dividend aristocrats can reach 10%+."}
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input id="divG" type="number" value={divGrowth} onChange={(e) => setDivGrowth(Number(e.target.value))} min={0} step={0.5} className="w-24" />
                    <span className="text-muted-foreground">%{isZh ? "每年" : "/yr"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceG" className="flex items-center text-sm">
                    {isZh ? "股价年增长率" : "Price Growth Rate"}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="inline-flex items-center justify-center ml-1 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
                        {isZh ? "股价每年的预期增长率。高股息公司通常股价增长较慢（3-5%），成长型公司可能更高。" : "Expected annual stock price appreciation. High-dividend stocks typically grow slower (3-5%), growth stocks may be higher."}
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input id="priceG" type="number" value={priceGrowth} onChange={(e) => setPriceGrowth(Number(e.target.value))} min={-20} max={50} step={0.5} className="w-24" />
                    <span className="text-muted-foreground">%{isZh ? "每年" : "/yr"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-chart-1" />
                {isZh ? "模拟结果" : "Simulation Results"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {totalReturnSim && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 text-center">
                      <div className="text-xs text-muted-foreground mb-1">{isZh ? "最终总资产" : "Final Portfolio Value"}</div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatNumber(totalReturnSim.finalValue, locale, 0)}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-center">
                      <div className="text-xs text-muted-foreground mb-1">{isZh ? "总分红收入" : "Total Dividend Income"}</div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatNumber(totalReturnSim.totalDividends, locale, 0)}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-center">
                      <div className="text-xs text-muted-foreground mb-1">{isZh ? "总回报率" : "Total Return"}</div>
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{totalReturnSim.totalReturnPercent.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">{isZh ? `${years}年` : `${years} years`}</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm font-semibold mb-3">{isZh ? "逐年明细" : "Year-by-Year Growth"}</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-muted-foreground">
                            <th className="text-left py-2 pr-4">{isZh ? "年份" : "Year"}</th>
                            <th className="text-right py-2 pr-4">{isZh ? "股价" : "Price"}</th>
                            <th className="text-right py-2 pr-4">{isZh ? "每股分红" : "DPS"}</th>
                            <th className="text-right py-2 pr-4">{isZh ? "当年分红" : "Dividend"}</th>
                            <th className="text-right py-2">{isZh ? "总市值" : "Total Value"}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {totalReturnSim.yearlyData.slice(0, 10).map((d) => (
                            <tr key={d.year} className="border-b border-gray-100 dark:border-gray-800">
                              <td className="py-2 pr-4 font-medium">{d.year}</td>
                              <td className="text-right py-2 pr-4">{formatNumber(d.price, locale, 2)}</td>
                              <td className="text-right py-2 pr-4">{formatNumber(d.dps, locale, 2)}</td>
                              <td className="text-right py-2 pr-4 text-green-600 dark:text-green-400">{formatNumber(d.income, locale, 0)}</td>
                              <td className="text-right py-2 font-medium">{formatNumber(d.totalValue, locale, 0)}</td>
                            </tr>
                          ))}
                          {years > 10 && (
                            <tr className="text-muted-foreground">
                              <td colSpan={5} className="text-center py-2 text-xs">
                                {isZh ? `... 共 ${years} 年，仅展示前 10 年` : `... ${years} years total, showing first 10`}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-sm font-semibold mb-1">
                      {isZh ? "核心结论" : "Key Insight"}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isZh
                        ? `初始投资 ${formatNumber(initialInvestment, locale, 0)} 元，在 ${divYield}% 股息率、每年分红增长 ${divGrowth}%、股价年增 ${priceGrowth}% 的条件下，${years} 年后总资产达到 ${formatNumber(totalReturnSim.finalValue, locale, 0)} 元。其中股息再投资贡献了 ${formatNumber(totalReturnSim.totalDividends, locale, 0)} 元的分红收入。`
                        : `An initial investment of ${formatNumber(initialInvestment, locale, 0)} at ${divYield}% yield, with ${divGrowth}% dividend growth and ${priceGrowth}% price appreciation, grows to ${formatNumber(totalReturnSim.finalValue, locale, 0)} over ${years} years. Dividend reinvestment contributed ${formatNumber(totalReturnSim.totalDividends, locale, 0)} in income.`
                      }
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <Card className="border-[hsl(var(--color-overvalued))]/30 bg-[hsl(var(--color-overvalued))]/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[hsl(var(--color-overvalued))] mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm mb-1">{isZh ? "风险提示" : "Risk Notice"}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isZh
                  ? "高股息率不一定代表好投资——股息可能因公司盈利下滑而削减。股息再投资模拟基于假设的增长率和历史数据，实际投资回报可能因市场波动、公司经营变化等因素而有所不同。本工具仅供学习参考，不构成投资建议。"
                  : "A high dividend yield doesn't always mean a good investment — dividends can be cut due to earnings decline. This simulation is based on assumed growth rates. Actual returns may vary. This tool is for educational purposes only."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
