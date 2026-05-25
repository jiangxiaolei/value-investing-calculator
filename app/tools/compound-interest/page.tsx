import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { CompoundInterestCalculator } from "@/components/calculator/compound-interest"

export const metadata = {
  title: "复利计算器 — 定投收益/通胀调整/逐年明细",
  description: "计算复利增长——支持定投、通胀调整、逐年明细和对比分析。免费在线复利计算器，看雪球效应在你面前展开。",
}

export default function CompoundInterestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="compound-interest">
            <CompoundInterestCalculator />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}