import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RiskFactorsExtractor } from "@/components/calculator/risk-factors"

export default function RiskFactorsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <RiskFactorsExtractor />
        </div>
      </main>
      <Footer />
    </div>
  )
}
