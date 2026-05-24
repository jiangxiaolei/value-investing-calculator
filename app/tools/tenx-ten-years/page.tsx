import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { TenXTenYearsCalculator } from "@/components/calculator/tenx-ten-years"

export const metadata = {
  title: "十年十倍计算器 — 长期回报增速 | 归估值",
  description: "Calculate required annual growth rate for 10x return in 10 years. Free value investing calculator.",
}

export default function TenXTenYearsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="tenx-ten-years">
            <TenXTenYearsCalculator />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}
