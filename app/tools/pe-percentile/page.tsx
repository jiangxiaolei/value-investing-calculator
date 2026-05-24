import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { PEPortfolioCalculator } from "@/components/calculator/pe-percentile"

export const metadata = {
  title: "PE分位对比 — 历史估值分位分析",
  description: "See where current P/E ratio sits in the historical distribution. Free PE Percentile tool for stock analysis.",
}

export default function PEPortfolioPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="pe-percentile">
            <PEPortfolioCalculator />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}
