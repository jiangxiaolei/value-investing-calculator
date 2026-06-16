import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { DividendYieldCalculator } from "@/components/calculator/dividend-yield"

export const metadata = {
  title: "股息率计算器 — A股港股美股股息回报分析",
  description: "计算股息率与股息再投资收益。输入每股分红和股价自动计算，支持股息再投资长期模拟。免费在线股息率计算器。",
}

export default function DividendYieldPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="dividend-yield">
            <DividendYieldCalculator />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}