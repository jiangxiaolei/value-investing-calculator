import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { TenXTenYearsCalculator } from "@/components/calculator/tenx-ten-years"

export default function TenXTenYearsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <TenXTenYearsCalculator />
        </div>
      </main>
      <Footer />
    </div>
  )
}
