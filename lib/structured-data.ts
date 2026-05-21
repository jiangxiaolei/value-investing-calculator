export function getStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Value Investing Calculator",
    description:
      "Calculate intrinsic stock value using DCF-based valuation. Set your target return, project growth, and determine the ideal buy price with a margin of safety.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "Value Investing Calculator",
    },
    browserRequirements: "Requires JavaScript",
  }
}