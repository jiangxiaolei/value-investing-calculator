"use client"

import type { CalculatorResults, ValuationVerdict } from "@/lib/calculator-logic"
import { formatCurrency } from "@/lib/formatters"
import { useLocale } from "@/lib/i18n/i18n-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BarChart3 } from "lucide-react"
import { PriceGauge } from "./price-gauge"
import { ResultsChart } from "./results-chart"

interface ResultsSummaryProps {
  results: CalculatorResults
  years: number
  expectedReturn: number
  verdict: ValuationVerdict
  currentMarketCap: number
}

export function ResultsSummary({
  results,
  years,
  expectedReturn,
  verdict,
  currentMarketCap,
}: ResultsSummaryProps) {
  const { t, locale } = useLocale()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-chart-1" />
          {t("section.result")}
        </CardTitle>
        <CardDescription>{t("section.result.desc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Gauge */}
        <PriceGauge
          currentMarketCap={currentMarketCap}
          goodPrice={results.goodPrice}
          fairValuation={results.fairValuation}
          expensivePrice={results.expensivePrice}
          verdict={verdict}
          currentReturnRate={results.currentReturnRate}
        />

        <Separator />

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard
            label={t("result.goodPrice")}
            value={formatCurrency(results.goodPrice, locale)}
            unit={t("unit.billion")}
            color="cheap"
            desc={t("result.goodPrice.desc")}
          />
          <MetricCard
            label={t("result.fairValue")}
            value={formatCurrency(results.fairValuation, locale)}
            unit={t("unit.billion")}
            color="fair"
            desc={t("result.fairValue.desc").replace("{n}", String(expectedReturn))}
          />
          <MetricCard
            label={t("result.expensivePrice")}
            value={`> ${formatCurrency(results.expensivePrice, locale)}`}
            unit={t("unit.billion")}
            color="overvalued"
            desc={t("result.expensivePrice.desc")}
          />
          <MetricCard
            label={t("result.futureMarketCap")}
            value={formatCurrency(results.futureMarketCap, locale)}
            unit={t("unit.billion")}
            color="chart-2"
            desc={`${years} ${t("unit.year")}${locale === "zh-CN" ? "后" : " later"}`}
          />
        </div>

        <Separator />

        {/* Chart */}
        <ResultsChart
          goodPrice={results.goodPrice}
          fairValuation={results.fairValuation}
          expensivePrice={results.expensivePrice}
          currentMarketCap={currentMarketCap}
        />
      </CardContent>
    </Card>
  )
}

function MetricCard({
  label,
  value,
  unit,
  color,
  desc,
}: {
  label: string
  value: string
  unit: string
  color: "cheap" | "fair" | "expensive" | "overvalued" | "chart-2"
  desc: string
}) {
  const colorMap: Record<string, string> = {
    cheap: "text-[hsl(var(--color-cheap))]",
    fair: "text-[hsl(var(--color-fair))]",
    expensive: "text-[hsl(var(--color-expensive))]",
    overvalued: "text-[hsl(var(--color-overvalued))]",
    "chart-2": "text-[hsl(var(--chart-2))]",
  }
  return (
    <div className="p-3 rounded-lg bg-muted/50 space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-lg font-bold ${colorMap[color]}`}>
        {value}
        <span className="text-xs font-normal text-muted-foreground ml-0.5">{unit}</span>
      </div>
      <div className="text-[10px] text-muted-foreground leading-tight">{desc}</div>
    </div>
  )
}