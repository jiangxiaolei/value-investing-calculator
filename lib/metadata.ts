import type { Metadata } from "next"

export const siteMetadata: Metadata = {
  title: "Value Investing Calculator - DCF Fair Value Estimator",
  description:
    "Calculate intrinsic stock value using DCF-based valuation. Set your target return, project growth, and determine the ideal buy price with a margin of safety. Free online tool for value investors.",
  keywords: [
    "value investing",
    "DCF calculator",
    "intrinsic value",
    "fair value estimator",
    "stock valuation",
    "margin of safety",
    "investment calculator",
    "value investing tool",
  ],
  authors: [{ name: "Value Investing Calculator" }],
  creator: "Value Investing Calculator",
  publisher: "Value Investing Calculator",
  openGraph: {
    title: "Value Investing Calculator - DCF Fair Value Estimator",
    description:
      "Calculate intrinsic stock value. Set your return target, project growth, and find the ideal buy price with a margin of safety.",
    type: "website",
    siteName: "Value Investing Calculator",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Value Investing Calculator - DCF Fair Value Estimator",
    description:
      "Calculate intrinsic stock value. Set your return target, project growth, and find the ideal buy price.",
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
}