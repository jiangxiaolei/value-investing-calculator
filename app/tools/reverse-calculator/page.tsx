import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import ValueInvestingCalculator from "@/value-investing-calculator"

export default function ReverseCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ValueInvestingCalculator />
        </div>
      </main>
      <Footer />
    </div>
  )
}
