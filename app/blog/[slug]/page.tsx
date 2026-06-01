import Link from "next/link"
import { getPostBySlug, getAllPosts } from "@/lib/blog-posts"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  // Convert markdown-style content to HTML with simple rendering
  const renderContent = (text: string) => {
    const lines = text.split("\n")
    let html = ""
    for (const line of lines) {
      if (line.startsWith("## ")) {
        html += `<h2 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">${line.slice(3)}</h2>\n`
      } else if (line.startsWith("### ")) {
        html += `<h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">${line.slice(4)}</h3>\n`
      } else if (line.startsWith("---")) {
        html += `<hr class="my-8 border-gray-200 dark:border-gray-800" />\n`
      } else if (line.startsWith("> ")) {
        html += `<blockquote class="border-l-4 border-amber-400 pl-4 py-2 my-4 text-gray-600 dark:text-gray-400 italic">${line.slice(2)}</blockquote>\n`
      } else if (line.startsWith("| ")) {
        // Simple table handling
        if (line.includes("---")) continue
        const cells = line.split("|").filter(c => c.trim())
        const tag = line.includes("---") ? "" : 
          cells.length > 2 ? "td" : ""
        if (tag) {
          html += `<tr>${cells.map(c => `<${tag} class="px-4 py-2 border border-gray-200 dark:border-gray-700 text-sm">${c.trim()}</${tag}>`).join("")}</tr>\n`
        }
      } else if (line.startsWith("- **") || line.startsWith("* **")) {
        const boldEnd = line.indexOf("**", 4)
        const label = line.slice(4, boldEnd)
        const rest = line.slice(boldEnd + 2).replace("：", "")
        html += `<li class="flex items-start gap-2 text-gray-700 dark:text-gray-300 mb-2"><span class="font-semibold text-gray-900 dark:text-white">${label}：</span>${rest}</li>\n`
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        html += `<li class="text-gray-700 dark:text-gray-300 mb-1">${line.slice(2)}</li>\n`
      } else if (line.match(/^\d+\. /)) {
        html += `<li class="text-gray-700 dark:text-gray-300 mb-2 ml-4 list-decimal">${line.replace(/^\d+\. /, "")}</li>\n`
      } else if (line.trim() === "") {
        html += `<br />\n`
      } else if (line.startsWith("\\") && line.includes("\\text")) {
        // LaTeX-like formulas - skip for simplicity
        html += `<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center font-mono text-sm text-gray-700 dark:text-gray-300 my-4">${line.replace(/\\\\\\(|\\\\\\)/g, "").replace(/\\\\\\/g, "\\")}</div>\n`
      } else if (line.startsWith("\\\\\\(")) {
        continue // Skip LaTeX opening
      } else if (line.startsWith("\\\\\\)")) {
        continue // Skip LaTeX closing
      } else {
        // Regular text - check for links
        const linked = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-amber-600 dark:text-amber-400 hover:underline font-medium">$1</a>')
        html += `<p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">${linked}</p>\n`
      }
    }
    return html
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950/10">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
            归估值
          </Link>
          <nav className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400">工具</Link>
            <Link href="/blog" className="text-amber-600 dark:text-amber-400 font-medium">博客</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/blog" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 mb-6 transition-colors">
          ← 返回博客列表
        </Link>
        <article>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <time>{post.date}</time>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg">
                {tag}
              </span>
            ))}
          </div>
          <div 
            className="prose prose-amber max-w-none"
            dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
          />
          {/* Tool cross-promotion */}
          <div className="mt-12 p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10 rounded-2xl border border-amber-200 dark:border-amber-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🔧 免费工具推荐</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/tools/margin-of-safety" className="p-3 bg-white dark:bg-gray-800 rounded-xl text-sm hover:shadow-md transition-all">
                <span className="font-medium text-gray-900 dark:text-white">安全边际</span>
                <span className="block text-gray-500 dark:text-gray-400 text-xs mt-0.5">计算你的买入安全空间</span>
              </Link>
              <Link href="/tools/graham-number" className="p-3 bg-white dark:bg-gray-800 rounded-xl text-sm hover:shadow-md transition-all">
                <span className="font-medium text-gray-900 dark:text-white">格雷厄姆公式</span>
                <span className="block text-gray-500 dark:text-gray-400 text-xs mt-0.5">快速估算股票内在价值</span>
              </Link>
              <Link href="/tools/compound-interest" className="p-3 bg-white dark:bg-gray-800 rounded-xl text-sm hover:shadow-md transition-all">
                <span className="font-medium text-gray-900 dark:text-white">复利计算器</span>
                <span className="block text-gray-500 dark:text-gray-400 text-xs mt-0.5">规划你的财富增长</span>
              </Link>
              <Link href="/tools/pe-percentile" className="p-3 bg-white dark:bg-gray-800 rounded-xl text-sm hover:shadow-md transition-all">
                <span className="font-medium text-gray-900 dark:text-white">市盈率百分位</span>
                <span className="block text-gray-500 dark:text-gray-400 text-xs mt-0.5">判断估值高低</span>
              </Link>
            </div>
          </div>
        </article>
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>归估值 — 免费价值投资工具集</p>
          <p className="mt-1"><Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400">返回首页</Link> · <Link href="/blog" className="hover:text-amber-600 dark:hover:text-amber-400">所有文章</Link></p>
        </div>
      </footer>
    </div>
  )
}
