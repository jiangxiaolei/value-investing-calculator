import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { MoatAnalyzer } from "@/components/calculator/moat-analyzer"

export const metadata = {
  title: "护城河评分 — 基于真实财务数据的竞争壁垒评估",
  description: "Enter a stock code to automatically assess competitive moat through ROE, gross margin, debt ratio, and market cap analysis. Free moat rating tool.",
}

export default function MoatAnalyzerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="moat-analyzer">
            <MoatAnalyzer />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}
