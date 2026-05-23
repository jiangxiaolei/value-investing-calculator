import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SZRCalculator } from "@/components/calculator/szr-calculator"

export default function SZRPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <SZRCalculator />
        </div>
      </main>
      <Footer />
    </div>
  )
}