import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { RiskScorecard } from "@/components/calculator/risk-factors"

export const metadata = {
  title: "股票风险评分 — 基于真实财务数据的多维度风险评估",
  description: "Enter a stock code to get risk scores across valuation, financial health, profitability, and size dimensions. Free stock risk analysis tool.",
}

export default function RiskFactorsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="risk-factors">
            <RiskScorecard />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}
