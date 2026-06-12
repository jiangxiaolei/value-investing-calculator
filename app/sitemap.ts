import { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog-posts"

const baseUrl = "https://value.chengyi.chat"

const toolSlugs = [
  "pe-percentile",
  "graham-number",
  "szr-calculator",
  "margin-of-safety",
  "fcf-quality",
  "reverse-calculator",
  "peg-ratio",
  "moat-analyzer",
  "annual-report",
  "risk-factors",
  "portfolio-rebalancer",
  "inflation-calculator",
  "compound-interest",
  "tenx-ten-years",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ]

  // Tool pages
  for (const slug of toolSlugs) {
    entries.push({
      url: `${baseUrl}/tools/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  }

  // Blog posts from dynamic data
  const posts = getAllPosts()
  for (const post of posts) {
    entries.push({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  }

  // AI tool category overview
  entries.push({
    url: `${baseUrl}/ai-tools`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  })

  return entries
}
