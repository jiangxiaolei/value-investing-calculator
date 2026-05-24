import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { PEGRatioCalculator } from "@/components/calculator/peg-ratio"

export const metadata = {
  title: "PEG比率计算器 — P/E与增长比值 | 归估值",
  description: "Calculate PEG Ratio — Price-to-Earnings divided by growth rate. Free PEG ratio calculator for growth investors.",
}

export default function PEGRatioPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="peg-ratio">
            <PEGRatioCalculator />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}
