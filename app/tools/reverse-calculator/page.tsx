import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import ValueInvestingCalculator from "@/value-investing-calculator"

export const metadata = {
  title: "倒推估值计算器 — 合理买入价分析",
  description: "输入目标回报、利润增速和未来市盈率，倒推合理估值与买入价格区间。免费在线倒推估值工具，科学制定买入计划。",
}

export default function ReverseCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="reverse-calculator">
            <ValueInvestingCalculator />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}
