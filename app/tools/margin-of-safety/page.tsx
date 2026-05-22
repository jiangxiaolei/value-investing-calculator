import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MarginOfSafetyCalculator } from "@/components/calculator/margin-of-safety"

export default function MarginOfSafetyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <MarginOfSafetyCalculator />
        </div>
      </main>
      <Footer />
    </div>
  )
}
