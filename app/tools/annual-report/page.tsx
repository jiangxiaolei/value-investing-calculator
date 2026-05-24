import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { AnnualReportSummarizer } from "@/components/calculator/annual-report"

export const metadata = {
  title: "年报摘要 — AI自动提取关键经营数据",
  description: "AI extracts key financial highlights, strategic direction, and risks from annual reports. Free Annual Report Summarizer.",
}

export default function AnnualReportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="annual-report">
            <AnnualReportSummarizer />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}
