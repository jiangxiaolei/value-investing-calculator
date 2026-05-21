"use client"

import { useLocale } from "@/lib/i18n/i18n-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, Target, TrendingUp } from "lucide-react"

interface InputSectionProps {
  expectedReturn: number
  currentProfit: number
  years: number
  growthRate: number
  futurePE: number
  currentMarketCap: number
  onExpectedReturnChange: (v: number) => void
  onCurrentProfitChange: (v: number) => void
  onYearsChange: (v: number) => void
  onGrowthRateChange: (v: number) => void
  onFuturePEChange: (v: number) => void
  onCurrentMarketCapChange: (v: number) => void
}

function Hint({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center ml-1 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          <HelpCircle className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  )
}

export function InputSection({
  expectedReturn,
  currentProfit,
  years,
  growthRate,
  futurePE,
  currentMarketCap,
  onExpectedReturnChange,
  onCurrentProfitChange,
  onYearsChange,
  onGrowthRateChange,
  onFuturePEChange,
  onCurrentMarketCapChange,
}: InputSectionProps) {
  const { t, locale } = useLocale()

  return (
    <div className="space-y-6">
      {/* Section 1: Investment Target */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-chart-2" />
            {t("section.target")}
          </CardTitle>
          <CardDescription>{t("section.target.desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="expectedReturn" className="flex items-center text-sm">
                {t("label.expectedReturn")}
                <Hint text={t("label.expectedReturn.hint")} />
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="expectedReturn"
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => onExpectedReturnChange(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-muted-foreground">{t("unit.percent")}</span>
              </div>
            </div>
            <div className="sm:col-span-2">
              <Slider
                value={[expectedReturn]}
                onValueChange={([v]) => onExpectedReturnChange(v)}
                min={1}
                max={30}
                step={0.5}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Company Picture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-chart-4" />
            {t("section.company")}
          </CardTitle>
          <CardDescription>{t("section.company.desc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currentProfit" className="flex items-center text-sm">
                {t("label.currentProfit")}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="currentProfit"
                  type="number"
                  value={currentProfit}
                  onChange={(e) => onCurrentProfitChange(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-muted-foreground">{t("unit.billion")}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="years" className="flex items-center text-sm">
                {t("label.years")}
                <Hint text={t("label.years.hint")} />
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => onYearsChange(Number(e.target.value))}
                  min={1}
                  max={20}
                  className="w-20"
                />
                <span className="text-muted-foreground">{t("unit.year")}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="growthRate" className="flex items-center text-sm">
                {t("label.growthRate")}
                <Hint text={t("label.growthRate.hint")} />
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="growthRate"
                  type="number"
                  value={growthRate}
                  onChange={(e) => onGrowthRateChange(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-muted-foreground">{t("unit.percent")}</span>
              </div>
              <Slider
                value={[growthRate]}
                onValueChange={([v]) => onGrowthRateChange(v)}
                min={0}
                max={50}
                step={0.5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="futurePE" className="flex items-center text-sm">
                {t("label.futurePE")}
                <Hint text={t("label.futurePE.hint")} />
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="futurePE"
                  type="number"
                  value={futurePE}
                  onChange={(e) => onFuturePEChange(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-muted-foreground">{t("unit.times")}</span>
              </div>
              <Slider
                value={[futurePE]}
                onValueChange={([v]) => onFuturePEChange(v)}
                min={1}
                max={60}
                step={1}
              />
            </div>
          </div>

          <div className="pt-2">
            <Label htmlFor="currentMarketCap" className="flex items-center text-sm">
              {t("label.currentMarketCap")}
              <Hint text={t("label.currentMarketCap.hint")} />
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                id="currentMarketCap"
                type="number"
                value={currentMarketCap}
                onChange={(e) => onCurrentMarketCapChange(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-muted-foreground">{t("unit.billion")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}