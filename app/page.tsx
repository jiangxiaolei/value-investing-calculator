import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import ValueInvestingCalculator from "@/value-investing-calculator"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ValueInvestingCalculator />
      </main>
      <Footer />
    </div>
  )
}