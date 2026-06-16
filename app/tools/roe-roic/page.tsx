import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToolPageLayout } from "@/components/layout/tool-page-layout"
import { RoeRoicCalculator } from "@/components/calculator/roe-roic"

export const metadata = {
  title: "ROE/ROIC分析器 — 衡量公司盈利能力的核心指标",
  description: "计算ROE（净资产收益率）和ROIC（投入资本回报率），附带杜邦分析拆解盈利驱动因素。免费在线ROE/ROIC计算器。",
}

export default function RoeRoicPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ToolPageLayout toolId="roe-roic">
            <RoeRoicCalculator />
          </ToolPageLayout>
        </div>
      </main>
      <Footer />
    </div>
  )
}
