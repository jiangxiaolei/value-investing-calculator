import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MoatAnalyzer } from "@/components/calculator/moat-analyzer"

export default function MoatAnalyzerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <MoatAnalyzer />
        </div>
      </main>
      <Footer />
    </div>
  )
}
