import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { MarginOfSafetyCalculator } from "@/components/calculator/margin-of-safety"

export const metadata = {
  title: "安全边际计算器 — 买入区间分析 | 归估值",
  description: "Calculate the gap between current price and intrinsic value. Free Margin of Safety calculator for value investors.",
}

export default function MarginOfSafetyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="margin-of-safety">
            <MarginOfSafetyCalculator />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}
