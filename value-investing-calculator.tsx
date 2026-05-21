"use client"

import { useState, useMemo } from "react"
import { AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { InputSection } from "@/components/calculator/input-section"
import { ResultsSummary } from "@/components/calculator/results-summary"
import { calculateResults, getValuationVerdict } from "@/lib/calculator-logic"
import { useLocale } from "@/lib/i18n/i18n-context"

export default function ValueInvestingCalculator() {
  const { t } = useLocale()

  const [expectedReturn, setExpectedReturn] = useState(15)
  const [currentProfit, setCurrentProfit] = useState(45)
  const [years, setYears] = useState(5)
  const [growthRate, setGrowthRate] = useState(20)
  const [futurePE, setFuturePE] = useState(25)
  const [currentMarketCap, setCurrentMarketCap] = useState(1876)

  const results = useMemo(
    () =>
      calculateResults({
        expectedReturn,
        currentProfit,
        years,
        growthRate,
        futurePE,
        currentMarketCap,
      }),
    [expectedReturn, currentProfit, years, growthRate, futurePE, currentMarketCap]
  )

  const verdict = useMemo(
    () =>
      getValuationVerdict(
        currentMarketCap,
        results.goodPrice,
        results.fairValuation,
        results.expensivePrice
      ),
    [currentMarketCap, results.goodPrice, results.fairValuation, results.expensivePrice]
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("app.title")}</h1>
        <p className="text-lg text-muted-foreground">{t("app.subtitle")}</p>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">{t("app.description")}</p>
      </div>

      <InputSection
        expectedReturn={expectedReturn}
        currentProfit={currentProfit}
        years={years}
        growthRate={growthRate}
        futurePE={futurePE}
        currentMarketCap={currentMarketCap}
        onExpectedReturnChange={setExpectedReturn}
        onCurrentProfitChange={setCurrentProfit}
        onYearsChange={setYears}
        onGrowthRateChange={setGrowthRate}
        onFuturePEChange={setFuturePE}
        onCurrentMarketCapChange={setCurrentMarketCap}
      />

      <ResultsSummary
        results={results}
        years={years}
        expectedReturn={expectedReturn}
        verdict={verdict}
        currentMarketCap={currentMarketCap}
      />

      {/* Disclaimer */}
      <Card className="border-[hsl(var(--color-overvalued))]/30 bg-[hsl(var(--color-overvalued))]/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[hsl(var(--color-overvalued))] mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm mb-1">{t("disclaimer.title")}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("disclaimer.text")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}