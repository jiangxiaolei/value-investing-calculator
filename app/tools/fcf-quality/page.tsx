import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FCFQCalculator } from "@/components/calculator/fcf-quality"

export default function FCFQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <FCFQCalculator />
        </div>
      </main>
      <Footer />
    </div>
  )
}
