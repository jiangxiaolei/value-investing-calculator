"use client"

import { type ReactNode } from "react"
import Link from "next/link"
import { ChevronRight, ArrowLeft, Calculator, Shield, Sparkles } from "lucide-react"
import { useLocale } from "@/lib/i18n/i18n-context"
import { getToolMeta, getRelatedTools, categoryLabel, type ToolCategory } from "@/lib/tools-metadata"

const categoryIcons: Record<ToolCategory, ReactNode> = {
  quant: <Calculator className="h-3 w-3" />,
  ai: <Sparkles className="h-3 w-3 text-purple-500" />,
  dashboard: <Shield className="h-3 w-3 text-blue-500" />,
}

function getFaqSchema(toolId: string, meta: ToolMeta): object {
  const faqs: Record<string, { q: string; a: string }[]> = {
    "graham-number": [
      { q: "格雷厄姆数是什么？", a: "格雷厄姆数是本杰明·格雷厄姆提出的保守估值公式，计算方式为 √(22.5 × 每股收益 × 每股净资产)。它给出了股票内在价值的上限，超过这个价格就不具备安全边际。" },
      { q: "What is the Graham Number?", a: "The Graham Number is Benjamin Graham's conservative intrinsic value formula: √(22.5 × EPS × BVPS). It represents the maximum price a defensive investor should pay for a stock." },
      { q: "How is the Graham Number calculated?", a: "Graham Number = √(22.5 × Earnings Per Share × Book Value Per Share). The 22.5 multiplier comes from Graham's rule that P/E should be under 15 and P/B under 1.5 (15 × 1.5 = 22.5)." },
    ],
    "margin-of-safety": [
      { q: "安全边际是什么？", a: "安全边际是当前股价与内在价值之间的差距。如果股价低于内在价值30%，则安全边际为30%。它衡量你买入的价格有多'安全'——差距越大，下行风险越小。" },
      { q: "What is Margin of Safety?", a: "Margin of Safety is the gap between current stock price and intrinsic value. If the price is 30% below intrinsic value, your margin of safety is 30%. It's your cushion against being wrong about the valuation." },
    ],
    "pe-percentile": [
      { q: "PE分位对比怎么用？", a: "输入股票代码和查看周期（5年/10年等），工具会显示当前市盈率在历史区间中的分位位置。80%分位意味着估值比历史80%的时间都高，20%分位则相反。" },
      { q: "How does PE Percentile work?", a: "Enter a stock code and lookback period. The tool shows where the current P/E ratio ranks in its historical range. 80th percentile means the stock is more expensive than 80% of its history." },
    ],
    "tenx-ten-years": [
      { q: "十年十倍需要多少年化增速？", a: "十年十倍需要约25.9%的年化增长率（72法则：72/7.2≈10年翻10倍实际需25.9%）。工具还支持自定义年限和倍数，让你自行评估目标是否合理。" },
      { q: "What growth rate is needed for 10x in 10 years?", a: "10x in 10 years requires approximately 25.9% annual growth. You can adjust the time horizon and multiple to evaluate different investment scenarios." },
    ],
    "fcf-quality": [
      { q: "自由现金流质量检测有什么用？", a: "很多公司利润好看但现金流很差——这是财务造假的常见信号。FCF质量检测对比净利润和自由现金流，帮你识别'纸面富贵'的风险。" },
      { q: "What is FCF Quality analysis?", a: "Companies can show strong profits while generating poor cash flow — a common red flag for earnings manipulation. FCF Quality compares net income to free cash flow to detect accounting risks." },
    ],
    "reverse-calculator": [
      { q: "倒推估值怎么用？", a: "设定你的目标年化收益（如15%）、预期的利润增速和未来市盈率，工具会倒推出现在合理的买入价格区间。这是科学制定买入计划的经典方法。" },
      { q: "How does Reverse Valuation work?", a: "Set your target annual return, expected profit growth rate, and future P/E ratio. The tool reverse-engineers what price you should pay today to achieve that return." },
    ],
    "peg-ratio": [
      { q: "PEG比率多少算合理？", a: "PEG = 市盈率 / 盈利增速。PEG < 1 通常被视为低估（价格低于增长价值），PEG > 2 可能高估。这是彼得·林奇最喜爱的估值指标之一。" },
      { q: "What is a good PEG Ratio?", a: "PEG = P/E ÷ Earnings Growth Rate. PEG under 1 suggests undervaluation (the price hasn't caught up to growth). PEG over 2 may indicate overvaluation." },
    ],
    "szr-calculator": [
      { q: "Siegel增长率是什么？", a: "由沃顿商学院Jeremy Siegel教授提出的可持续增长率公式，计算方式为 ROE × (1 - 分红率)。它估算公司在不改变财务杠杆前提下的合理长期增速。" },
      { q: "What is the SZR (Siegel's Growth Rate)?", a: "Developed by Wharton's Jeremy Siegel, SZR = ROE × (1 - Dividend Payout Ratio). It estimates a company's sustainable growth rate without changing financial leverage." },
    ],
    "moat-analyzer": [
      { q: "AI护城河分析准确吗？", a: "护城河分析基于你提供的业务描述，AI从品牌力、转换成本、网络效应、成本优势、规模经济五个维度评估。结果仅供参考，建议结合行业知识综合判断。" },
      { q: "How accurate is the AI Moat Analysis?", a: "The AI evaluates economic moats across five dimensions: brand power, switching costs, network effects, cost advantages, and economies of scale. Use it as a starting point, not a final verdict." },
    ],
    "annual-report": [
      { q: "AI年报摘要能代替读年报吗？", a: "AI摘要能帮你快速抓住年报核心——财务亮点、战略方向、风险提示。但重要决策前建议仍然阅读原始报告中的关键章节，尤其是管理层讨论和分析部分。" },
      { q: "Can AI replace reading full annual reports?", a: "AI summaries capture key financial highlights, strategic direction, and risks. For important investment decisions, still review the original report's MD&A section and footnotes." },
    ],
    "risk-factors": [
      { q: "风险因素清单怎么用？", a: "输入公司的年报或公告文本，AI会自动提取风险因素并按行业、竞争、财务、宏观等维度分类排序。这让你快速看到'地雷'在哪，优先评估最严重的风险。" },
      { q: "How does the Risk Factor analyzer work?", a: "Paste your company's annual report or filing text, and the AI extracts, categorizes, and ranks risk factors by severity — industry, competitive, financial, and macro risks." },
    ],
    "dashboard": [
      { q: "个股仪表盘支持哪些市场？", a: "支持A股、港股和美股。输入股票代码即可查看关键估值指标——市盈率、市净率、股息率等。数据来源为公开市场数据，仅供参考。" },
      { q: "Which markets does the Stock Dashboard support?", a: "The dashboard supports A-shares (China), Hong Kong, and US stocks. Enter a stock code to view key valuation metrics including P/E, P/B, and dividend yield." },
    ],
  }

  const toolFaqs = faqs[toolId]
  if (!toolFaqs || toolFaqs.length === 0) return null

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": toolFaqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a,
      },
    })),
  }
}

export function ToolPageLayout({
  toolId,
  children,
}: {
  toolId: string
  children: ReactNode
}) {
  const { locale } = useLocale()
  const isZh = locale === "zh-CN"
  const meta = getToolMeta(toolId)
  const related = getRelatedTools(toolId)

  if (!meta) return <>{children}</>

  const catLabel = categoryLabel(meta.category, isZh)
  const faqSchema = getFaqSchema(toolId, meta)

  return (
    <div className="space-y-6">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
          {isZh ? "首页" : "Home"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="flex items-center gap-1">
          {categoryIcons[meta.category]}
          <span>{catLabel}</span>
        </span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">
          {isZh ? meta.zh : meta.en}
        </span>
      </nav>

      {/* Back link (mobile) */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 hover:underline sm:hidden"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {isZh ? "返回全部工具" : "Back to all tools"}
      </Link>

      {/* Main tool content */}
      {children}

      {/* Related tools */}
      {related.length > 0 && (
        <section className="pt-6 border-t">
          <h2 className="text-lg font-semibold mb-4">
            {isZh ? "相关工具" : "Related Tools"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {related.map((rt) => {
              const href = rt.id === "dashboard" ? "/dashboard" : `/tools/${rt.id}`
              return (
                <Link
                  key={rt.id}
                  href={href}
                  className="group rounded-xl border p-4 hover:border-green-300 hover:shadow-md transition-all duration-200 bg-background"
                >
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {isZh ? rt.zh : rt.en}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                    {isZh ? rt.zhDesc : rt.enDesc}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}