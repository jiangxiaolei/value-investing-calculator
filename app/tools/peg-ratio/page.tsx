import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PEGRatioCalculator } from "@/components/calculator/peg-ratio"

export default function PEGRatioPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <PEGRatioCalculator />
        </div>
      </main>
      <Footer />
    </div>
  )
}