export function getStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "归估值",
    description:
      "输入目标回报率、利润增速和未来市盈率，计算公司合理估值与理想买入价格。价值投资者的思维辅助工具。",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CNY",
    },
    author: {
      "@type": "Organization",
      name: "归估值",
    },
    browserRequirements: "Requires JavaScript",
  }
}
