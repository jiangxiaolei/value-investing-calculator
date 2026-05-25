import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { PortfolioRebalancer } from "@/components/calculator/portfolio-rebalancer"

export const metadata = {
  title: "投资组合再平衡工具 — 持仓分析/偏离计算/买卖指令",
  description: "分析当前持仓配比偏离，自动生成再平衡买卖指令。免费在线投资组合再平衡工具，帮你维持纪律性资产配置。",
}

export default function PortfolioRebalancerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="portfolio-rebalancer">
            <PortfolioRebalancer />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}