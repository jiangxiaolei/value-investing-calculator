import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GrahamNumberCalculator } from "@/components/calculator/graham-number"

export default function GrahamNumberPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <GrahamNumberCalculator />
        </div>
      </main>
      <Footer />
    </div>
  )
}
