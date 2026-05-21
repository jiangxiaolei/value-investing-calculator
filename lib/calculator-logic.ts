export interface CalculatorInputs {
  expectedReturn: number
  currentProfit: number
  years: number
  growthRate: number
  futurePE: number
  currentMarketCap: number
}

export interface CalculatorResults {
  futureProfit: number
  futureMarketCap: number
  fairValuation: number
  goodPrice: number
  expensivePrice: number
  currentReturnRate: number
}

export type ValuationVerdict = "cheap" | "fair" | "expensive" | "veryExpensive"

export function calculateResults(inputs: CalculatorInputs): CalculatorResults {
  const { expectedReturn, currentProfit, years, growthRate, futurePE, currentMarketCap } = inputs

  const futureProfit = currentProfit * Math.pow(1 + growthRate / 100, years)
  const futureMarketCap = futureProfit * futurePE
  const fairValuation = futureMarketCap / Math.pow(1 + expectedReturn / 100, years)
  const goodPrice = fairValuation * 0.7
  const expensivePrice = fairValuation * 1.22
  const currentReturnRate =
    currentMarketCap > 0
      ? (Math.pow(futureMarketCap / currentMarketCap, 1 / years) - 1) * 100
      : 0

  return {
    futureProfit: Math.round(futureProfit * 10) / 10,
    futureMarketCap: Math.round(futureMarketCap),
    fairValuation: Math.round(fairValuation),
    goodPrice: Math.round(goodPrice),
    expensivePrice: Math.round(expensivePrice),
    currentReturnRate: Math.round(currentReturnRate * 10) / 10,
  }
}

export function getValuationVerdict(
  currentMarketCap: number,
  goodPrice: number,
  fairValuation: number,
  expensivePrice: number
): ValuationVerdict {
  if (currentMarketCap <= goodPrice) return "cheap"
  if (currentMarketCap <= fairValuation) return "fair"
  if (currentMarketCap <= expensivePrice) return "expensive"
  return "veryExpensive"
}

export function getPricePositionPercent(
  currentMarketCap: number,
  fairValuation: number
): number {
  if (fairValuation <= 0) return 0
  return Math.min(Math.round((currentMarketCap / fairValuation) * 100), 200)
}