import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { LandingPage } from "@/components/landing/landing-page"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <LandingPage />
      </main>
      <Footer />
    </div>
  )
}
