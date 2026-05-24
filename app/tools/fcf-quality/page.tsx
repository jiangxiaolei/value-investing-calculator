import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { FCFQCalculator } from "@/components/calculator/fcf-quality"

export const metadata = {
  title: "自由现金流质量检测 — 盈利真实性分析 | 归估值",
  description: "Check if net profit is backed by real cash flow. Free FCF Quality tool for detecting earnings quality issues.",
}

export default function FCFQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="fcf-quality">
            <FCFQCalculator />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}
