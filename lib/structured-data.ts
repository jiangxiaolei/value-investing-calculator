const BASE_URL = "https://value.chengyi.chat"

export interface FaqItem {
  question: string
  answer: string
}

export interface Breadcrumb {
  name: string
  url: string
}

/** Extract FAQ pairs from markdown H2 headings */
export function extractFaqsFromContent(content: string, maxItems = 5): FaqItem[] {
  const lines = content.split("\n")
  const faqs: FaqItem[] = []
  let currentQuestion = ""
  let currentAnswer: string[] = []

  for (const line of lines) {
    const h2Match = line.match(/^## (.+)/)
    if (h2Match) {
      flush()
      currentQuestion = h2Match[1]
      currentAnswer = []
    } else if (currentQuestion && line.trim()) {
      if (line.startsWith("###") || line.startsWith("```") || line.startsWith("---")) continue
      currentAnswer.push(line)
    }
  }
  flush()

  function flush() {
    if (!currentQuestion || currentAnswer.length === 0) return
    const answer = cleanText(currentAnswer.join(" "))
    if (answer.length > 15) {
      faqs.push({ question: currentQuestion, answer: answer.slice(0, 500) })
    }
  }

  return faqs.slice(0, maxItems)
}

function cleanText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\n{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Global WebSite + Organization schema */
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "归估值",
    alternateName: "Value Investing Tools",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

/** Organization schema for E-E-A-T */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "归估值",
    url: BASE_URL,
    description: "免费价值投资思维工具集 — 市盈率百分位、安全边际、格雷厄姆公式等计算器与AI分析工具。",
    sameAs: [
      "https://value.chengyi.chat",
      "https://aitools.chengyi.chat",
    ],
  }
}

/** BreadcrumbList schema */
export function getBreadcrumbSchema(crumbs: Breadcrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  }
}

/** FAQPage schema */
export function getFaqSchema(faqs: FaqItem[]) {
  if (faqs.length === 0) return null
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  }
}

/** Article schema for blog posts */
export function getArticleSchema(
  title: string,
  description: string,
  date: string,
  slug: string,
  tags: string[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    datePublished: date,
    dateModified: date,
    author: {
      "@type": "Organization",
      name: "归估值",
    },
    publisher: {
      "@type": "Organization",
      name: "归估值",
    },
    tags: tags,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${slug}`,
    },
  }
}

/** WebApplication schema for tool pages */
export function getToolSchema(
  name: string,
  description: string,
  slug: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: name,
    description: description,
    url: `${BASE_URL}/tools/${slug}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CNY",
    },
    browserRequirements: "Requires JavaScript",
  }
}
