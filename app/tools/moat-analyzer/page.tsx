import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { MoatAnalyzer } from "@/components/calculator/moat-analyzer"

export const metadata = {
  title: "护城河分析 — AI评估企业竞争优势",
  description: "AI-powered economic moat analysis. Free Moat Analyzer that identifies competitive advantages and assesses moat strength.",
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
