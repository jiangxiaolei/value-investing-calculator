import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { RiskFactorsExtractor } from "@/components/calculator/risk-factors"

export const metadata = {
  title: "风险因素分析 — AI识别投资风险清单 | 归估值",
  description: "Extract and rank risk factors from annual reports. Free AI Risk Factor analyzer for value investors.",
}

export default function RiskFactorsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="risk-factors">
            <RiskFactorsExtractor />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}
