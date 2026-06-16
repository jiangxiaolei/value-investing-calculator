import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { CostBasisCalculator } from "@/components/calculator/cost-basis"

export const metadata = {
  title: "持仓成本计算器 — 多次买入的平均成本与盈亏分析",
  description: "计算多次买入同一只股票的加权平均成本，一眼看清浮盈浮亏。支持部分卖出后的已实现盈亏计算。免费在线持仓成本计算器。",
}

export default function CostBasisPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="cost-basis">
            <CostBasisCalculator />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}
