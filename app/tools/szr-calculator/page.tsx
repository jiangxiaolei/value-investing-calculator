import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { SZRCalculator } from "@/components/calculator/szr-calculator"

export const metadata = {
  title: "Siegel增长率计算器 — 合理市值增速 | 归估值",
  description: "Calculate sustainable growth rate using Jeremy Siegel's formula. Free SZR calculator for long-term return estimation.",
}

export default function SZRPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="szr-calculator">
            <SZRCalculator />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}
