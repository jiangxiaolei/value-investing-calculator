"use client"

import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/dictionaries"
import { formatCurrency, formatPercent } from "@/lib/formatters"
import type { ValuationVerdict } from "@/lib/calculator-logic"
import { useLocale } from "@/lib/i18n/i18n-context"

interface PriceGaugeProps {
  currentMarketCap: number
  goodPrice: number
  fairValuation: number
  expensivePrice: number
  verdict: ValuationVerdict
  currentReturnRate: number
}

const verdictStyles: Record<ValuationVerdict, { bar: string; badge: string; text: string }> = {
  cheap: {
    bar: "bg-[hsl(var(--color-cheap))]",
    badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    text: "text-[hsl(var(--color-cheap))]",
  },
  fair: {
    bar: "bg-[hsl(var(--color-fair))]",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    text: "text-[hsl(var(--color-fair))]",
  },
  expensive: {
    bar: "bg-[hsl(var(--color-expensive))]",
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    text: "text-[hsl(var(--color-expensive))]",
  },
  veryExpensive: {
    bar: "bg-[hsl(var(--color-overvalued))]",
    badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    text: "text-[hsl(var(--color-overvalued))]",
  },
}

export function PriceGauge({
  currentMarketCap,
  goodPrice,
  fairValuation,
  expensivePrice,
  verdict,
  currentReturnRate,
}: PriceGaugeProps) {
  const { t, locale } = useLocale()

  const maxVal = Math.max(expensivePrice, currentMarketCap) * 1.15
  const pct = maxVal > 0 ? (currentMarketCap / maxVal) * 100 : 0
  const goodPct = maxVal > 0 ? (goodPrice / maxVal) * 100 : 0
  const fairPct = maxVal > 0 ? (fairValuation / maxVal) * 100 : 0
  const expensivePct = maxVal > 0 ? (expensivePrice / maxVal) * 100 : 0

  const style = verdictStyles[verdict]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {t("label.currentMarketCap")}:{" "}
          <strong className="text-foreground">{formatCurrency(currentMarketCap, locale)}</strong>{" "}
          {t("unit.billion")}
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
            style.badge
          )}
        >
          {t(`result.verdict.${verdict}`)}
        </span>
      </div>

      {/* Price gauge bar */}
      <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
        {/* Good price zone */}
        <div
          className="absolute inset-y-0 left-0 bg-[hsl(var(--color-cheap))]/20 border-r border-dashed border-[hsl(var(--color-cheap))]/40"
          style={{ width: `${goodPct}%` }}
        />
        {/* Fair value marker */}
        <div
          className="absolute inset-y-0 w-0.5 bg-[hsl(var(--color-fair))] z-10"
          style={{ left: `${fairPct}%` }}
        />
        {/* Expensive marker */}
        <div
          className="absolute inset-y-0 w-0.5 bg-[hsl(var(--color-overvalued))] z-10"
          style={{ left: `${expensivePct}%` }}
        />
        {/* Current price marker */}
        <div
          className="absolute inset-y-0 w-1 bg-foreground z-20 rounded-sm shadow-lg transition-all duration-300"
          style={{ left: `${pct}%` }}
        />
      </div>

      {/* Labels */}
      <div className="relative text-[10px] text-muted-foreground">
        <span className="absolute" style={{ left: "0%" }}>
          {formatCurrency(goodPrice, locale)}
        </span>
        <span className="absolute -translate-x-1/2" style={{ left: `${fairPct}%` }}>
          {formatCurrency(fairValuation, locale)}
        </span>
        <span className="absolute -translate-x-1/2" style={{ left: `${expensivePct}%` }}>
          {formatCurrency(expensivePrice, locale)}
        </span>
      </div>

      <p className={cn("text-sm font-medium", style.text)}>
        {t("result.currentReturn")}: {formatPercent(currentReturnRate)}
      </p>
    </div>
  )
}