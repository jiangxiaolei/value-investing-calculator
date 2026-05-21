import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { StockDashboard } from "@/components/dashboard/stock-dashboard"

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">价值投资仪表盘</h1>
            <p className="text-muted-foreground text-sm">输入股票代码，查看关键财务指标</p>
          </div>
          <StockDashboard />
        </div>
      </main>
      <Footer />
    </div>
  )
}
