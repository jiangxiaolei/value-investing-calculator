import Link from "next/link"
import { getAllPosts } from "@/lib/blog-posts"

export const metadata = {
  title: "价值投资博客 — 归估值",
  description: "价值投资学习资源：安全边际、格雷厄姆公式、复利计算、护城河分析等实用内容。",
}

export default function BlogPage() {
  const posts = getAllPosts()
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
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">价值投资博客</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">学习价值投资的核心概念，结合免费工具进行实操。</p>
        </div>
        <div className="space-y-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="block p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <time>{post.date}</time>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>归估值 — 免费价值投资工具集 · 数据仅供参考，不构成投资建议</p>
          <p className="mt-1"><Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400">返回首页</Link></p>
        </div>
      </footer>
    </div>
  )
}
