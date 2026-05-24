import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { GrahamNumberCalculator } from "@/components/calculator/graham-number"

export const metadata = {
  title: "格雷厄姆数计算器 — 股票内在价值估值",
  description: "Benjamin Graham's conservative formula using EPS and book value per share. Free online Graham Number calculator for value investors.",
}

export default function GrahamNumberPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="graham-number">
            <GrahamNumberCalculator />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}
