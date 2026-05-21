"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer, Cell } from "recharts"
import { useLocale } from "@/lib/i18n/i18n-context"
import { formatCurrency } from "@/lib/formatters"

interface ResultsChartProps {
  goodPrice: number
  fairValuation: number
  expensivePrice: number
  currentMarketCap: number
}

const BAR_COLORS = {
  goodPrice: "hsl(var(--color-cheap))",
  fairValuation: "hsl(var(--color-fair))",
  expensivePrice: "hsl(var(--color-overvalued))",
  currentMarketCap: "hsl(var(--color-expensive))",
}

export function ResultsChart({
  goodPrice,
  fairValuation,
  expensivePrice,
  currentMarketCap,
}: ResultsChartProps) {
  const { t, locale } = useLocale()

  const data = [
    { name: t("chart.goodPrice"), value: goodPrice, color: BAR_COLORS.goodPrice },
    { name: t("chart.fairValue"), value: fairValuation, color: BAR_COLORS.fairValuation },
    { name: t("chart.expensivePrice"), value: expensivePrice, color: BAR_COLORS.expensivePrice },
    { name: t("chart.currentPrice"), value: currentMarketCap, color: BAR_COLORS.currentMarketCap },
  ]

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">{t("chart.title")}</h4>
      <div className="h-[200px] sm:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(v) => formatCurrency(v, locale)}
              className="text-xs"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              className="text-xs"
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
            {/* Reference line at current market cap on Y axis doesn't make sense in horizontal layout */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}