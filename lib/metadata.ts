import type { Metadata } from "next"

const BASE_URL = "https://value.chengyi.chat"

export const siteMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "归估值 — 价值投资思维工具",
    template: "%s | 归估值",
  },
  description:
    "输入目标回报率、利润增速和未来市盈率，计算公司合理估值与理想买入价格。价值投资者的思维辅助工具，免费使用。",
  keywords: [
    "归估值",
    "价值投资",
    "DCF估值",
    "内在价值",
    "合理估值",
    "安全边际",
    "市盈率",
    "股票估值计算器",
    "价值投资工具",
    "A股估值",
    "港股估值",
    "估值器",
    "value investing",
    "DCF calculator",
    "intrinsic value",
    "fair value",
    "margin of safety",
  ],
  authors: [{ name: "归估值" }],
  creator: "归估值",
  publisher: "归估值",
  openGraph: {
    type: "website",
    siteName: "归估值",
    title: "归估值 — 价值投资思维工具",
    description: "输入目标回报率、利润增速和未来市盈率，计算公司合理估值与理想买入价格。",
    locale: "zh_CN",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "归估值 — Value Investing Tools",
    description: "Calculate intrinsic value and ideal buy prices for value investing.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
  },
}
