import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { InflationCalculator } from "@/components/calculator/inflation"

export const metadata = {
  title: "通胀计算器 — 购买力/CPI历史/正向反向计算",
  description: "计算通胀对购买力的影响——正向预测和反向历史计算。内置1913年至今美国CPI数据，免费在线通胀计算器。",
}

export default function InflationCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="inflation-calculator">
            <InflationCalculator />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}