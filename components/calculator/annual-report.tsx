"use client"

import { useState } from "react"
import {
  FileText,
  Sparkles,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocale } from "@/lib/i18n/i18n-context"

interface FinancialHighlight {
  label: string
  labelZh: string
  value: string
  change?: string
  changeValue?: string
}

interface BusinessOverview {
  summary: string
  summaryZh: string
  keyProducts: string[]
  keyProductsZh: string[]
  targetMarkets: string[]
  targetMarketsZh: string[]
}

interface OperationProgress {
  highlight: string
  highlightZh: string
  details: string
  detailsZh: string
}

interface RiskFactor {
  category: string
  categoryZh: string
  description: string
  descriptionZh: string
}

interface AnnualReportResult {
  companyName: string
  reportYear: number
  summary: string
  summaryZh: string
  businessOverview: BusinessOverview
  financialHighlights: FinancialHighlight[]
  operationProgress: OperationProgress[]
  futureOutlook: string
  futureOutlookZh: string
  riskFactors: RiskFactor[]
  investmentHighlights: string[]
  investmentHighlightsZh: string[]
}

interface ApiError {
  error: string
  isConfigurationError?: boolean
}

function getChangeColor(change: string | undefined): string {
  if (!change) return "text-muted-foreground"
  const isPositive = change.includes("+") || change.toLowerCase().includes("increase") || change.toLowerCase().includes("增长")
  const isNegative = change.includes("-") || change.toLowerCase().includes("decrease") || change.toLowerCase().includes("下降")
  if (isPositive) return "text-green-600 dark:text-green-400"
  if (isNegative) return "text-red-600 dark:text-red-400"
  return "text-muted-foreground"
}

export function AnnualReportSummarizer() {
  const { t, locale } = useLocale()
  const isZh = locale === "zh-CN"

  const [reportText, setReportText] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [reportYear, setReportYear] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnnualReportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("summary")
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["financial", "operations", "risks"]))

  const handleSummarize = async () => {
    if (reportText.trim().length < 100) {
      setError(isZh ? "请提供至少100个字符的年报内容。" : "Please provide at least 100 characters of annual report content.")
      return
    }

    if (!companyName.trim()) {
      setError(isZh ? "请输入公司名称。" : "Please enter the company name.")
      return
    }

    if (!reportYear.trim()) {
      setError(isZh ? "请输入报告年份。" : "Please enter the report year.")
      return
    }

    const yearNum = parseInt(reportYear)
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      setError(isZh ? "请输入有效的年份（例如：2024）。" : "Please enter a valid year (e.g., 2024).")
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/annual-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          reportText: reportText.trim(),
          companyName: companyName.trim(),
          reportYear: yearNum,
          locale
        })
      })

      const data = await response.json()

      if (!response.ok) {
        const errorData = data as ApiError
        if (errorData.isConfigurationError) {
          setError(isZh
            ? "API未配置。请设置 OPENAI_API_KEY 或 LLM_API_KEY 环境变量。"
            : "API not configured. Please set OPENAI_API_KEY or LLM_API_KEY environment variable."
          )
        } else {
          setError(errorData.error || (isZh ? "摘要生成失败" : "Summary generation failed"))
        }
        return
      }

      setResult(data as AnnualReportResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : (isZh ? "发生错误" : "An error occurred"))
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      // Clipboard API failed
    }
  }

  const exportAsText = () => {
    if (!result) return

    let content = `${result.companyName} - ${result.reportYear} Annual Report Summary\n`
    content += "=".repeat(60) + "\n\n"

    content += `Summary:\n${isZh ? result.summaryZh : result.summary}\n\n`

    content += `Business Overview:\n${isZh ? result.businessOverview.summaryZh : result.businessOverview.summary}\n\n`

    content += `Financial Highlights:\n`
    result.financialHighlights.forEach(h => {
      content += `- ${isZh ? h.labelZh : h.label}: ${h.value}`
      if (h.change) content += ` (${h.change})`
      content += "\n"
    })
    content += "\n"

    content += `Future Outlook:\n${isZh ? result.futureOutlookZh : result.futureOutlook}\n\n`

    content += `Risk Factors:\n`
    result.riskFactors.forEach(r => {
      content += `- ${isZh ? r.categoryZh : r.category}: ${isZh ? r.descriptionZh : r.description}\n`
    })
    content += "\n"

    content += `Investment Highlights:\n`
    ;(isZh ? result.investmentHighlightsZh : result.investmentHighlights).forEach(h => {
      content += `- ${h}\n`
    })

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${result.companyName}_${result.reportYear}_annual_report_summary.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
          {isZh ? "年报摘要器" : "Annual Report Summarizer"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isZh ? "AI驱动的年报内容智能分析" : "AI-Powered Annual Report Analysis"}
        </p>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {isZh
            ? "输入公司年报内容，让AI提取关键财务指标、业务进展、风险因素和投资要点，帮助您快速了解企业状况。"
            : "Enter the company's annual report content and let AI extract key financial indicators, business progress, risk factors, and investment highlights to help you quickly understand the company's situation."
          }
        </p>
      </div>

      {/* Input Card */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-chart-2" />
            {isZh ? "输入年报内容" : "Enter Annual Report Content"}
          </CardTitle>
          <CardDescription>
            {isZh
              ? "粘贴公司年报文本、财报要点或管理层讨论与分析内容"
              : "Paste the company's annual report text, financial highlights, or MD&A content"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Name and Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="flex items-center text-sm">
                <Building2 className="h-4 w-4 mr-1" />
                {isZh ? "公司名称" : "Company Name"}
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={isZh ? "例如：苹果公司" : "Example: Apple Inc."}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportYear" className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                {isZh ? "报告年份" : "Report Year"}
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="reportYear"
                type="number"
                value={reportYear}
                onChange={(e) => setReportYear(e.target.value)}
                placeholder={isZh ? "例如：2024" : "Example: 2024"}
                min="1900"
                max="2100"
              />
            </div>
          </div>

          {/* Report Text Area */}
          <div className="space-y-2">
            <Label htmlFor="reportText" className="flex items-center text-sm">
              {isZh ? "年报内容" : "Annual Report Content"}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Textarea
              id="reportText"
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder={
                isZh
                  ? "请粘贴公司年报的相关内容，包括但不限于：\n• 业务概览与经营策略\n• 财务数据与指标分析\n• 管理层讨论与分析\n• 风险因素披露\n• 未来展望与预测\n\n支持直接粘贴PDF文字、网页内容或整理后的文本..."
                  : "Please paste the relevant content from the company's annual report, including but not limited to:\n• Business overview and operating strategies\n• Financial data and indicator analysis\n• Management discussion and analysis\n• Risk factor disclosures\n• Future outlook and projections\n\nSupports direct paste of PDF text, web content, or formatted text..."
              }
              className="min-h-[300px] resize-y font-mono text-sm"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{reportText.length} / 50,000 {isZh ? "字符" : "characters"}</span>
              <span className={reportText.length >= 100 ? "text-green-600" : "text-destructive"}>
                {reportText.length < 100
                  ? `${100 - reportText.length} ${isZh ? "更多字符需要" : "more characters needed"}`
                  : isZh ? "✓ 足够分析" : "✓ Sufficient for analysis"
                }
              </span>
            </div>
          </div>

          <Button
            onClick={handleSummarize}
            disabled={isLoading || reportText.trim().length < 100 || !companyName.trim() || !reportYear.trim()}
            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isZh ? "分析中..." : "Analyzing..."}
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                {isZh ? "生成摘要" : "Generate Summary"}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm text-destructive">{isZh ? "错误" : "Error"}</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {result && (
        <>
          {/* Header with Company Info */}
          <Card className="border-green-200 dark:border-green-900">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    {result.companyName}
                    <span className="text-muted-foreground font-normal">
                      {result.reportYear} {isZh ? "年度报告" : "Annual Report"}
                    </span>
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isZh ? "AI生成的摘要报告" : "AI-Generated Summary Report"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportAsText}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {isZh ? "导出" : "Export"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(
                      `${result.companyName} - ${result.reportYear}\n\n${isZh ? result.summaryZh : result.summary}`,
                      "header"
                    )}
                    className="flex items-center gap-2"
                  >
                    {copiedField === "header" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {isZh ? "复制" : "Copy"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for organized content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">{isZh ? "总览" : "Overview"}</TabsTrigger>
              <TabsTrigger value="financial">{isZh ? "财务" : "Financial"}</TabsTrigger>
              <TabsTrigger value="outlook">{isZh ? "展望" : "Outlook"}</TabsTrigger>
              <TabsTrigger value="risks">{isZh ? "风险" : "Risks"}</TabsTrigger>
            </TabsList>

            {/* Summary Tab */}
            <TabsContent value="summary" className="space-y-4">
              {/* Main Summary Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{isZh ? "报告摘要" : "Report Summary"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {isZh ? result.summaryZh : result.summary}
                    </p>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(isZh ? result.summaryZh : result.summary, "summary")}
                      className="h-8 px-2"
                    >
                      {copiedField === "summary" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Business Overview Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{isZh ? "业务概览" : "Business Overview"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <p className="text-sm leading-relaxed">
                      {isZh ? result.businessOverview.summaryZh : result.businessOverview.summary}
                    </p>
                  </div>

                  {/* Key Products */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">{isZh ? "主要产品/服务" : "Key Products/Services"}</h4>
                    <div className="flex flex-wrap gap-2">
                      {(isZh ? result.businessOverview.keyProductsZh : result.businessOverview.keyProducts).map((product, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-sm"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Target Markets */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">{isZh ? "目标市场" : "Target Markets"}</h4>
                    <div className="flex flex-wrap gap-2">
                      {(isZh ? result.businessOverview.targetMarketsZh : result.businessOverview.targetMarkets).map((market, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-sm"
                        >
                          {market}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Highlights Card */}
              <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                    {isZh ? "投资亮点" : "Investment Highlights"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(isZh ? result.investmentHighlightsZh : result.investmentHighlights).map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span className="text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-4">
              {/* Financial Highlights */}
              <Card
                className={`border-2 ${expandedSections.has("financial") ? "border-green-500" : "border-border"}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between cursor-pointer" onClick={() => toggleSection("financial")}>
                    <span className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                      {isZh ? "财务摘要" : "Financial Highlights"}
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      {expandedSections.has("financial") ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                {expandedSections.has("financial") && (
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {result.financialHighlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-muted/50 border"
                        >
                          <div className="text-xs text-muted-foreground mb-1">
                            {isZh ? highlight.labelZh : highlight.label}
                          </div>
                          <div className="text-lg font-semibold">
                            {highlight.value}
                          </div>
                          {highlight.change && (
                            <div className={`text-sm ${getChangeColor(highlight.change)}`}>
                              {highlight.change}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Operation Progress */}
              <Card
                className={`border-2 ${expandedSections.has("operations") ? "border-green-500" : "border-border"}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between cursor-pointer" onClick={() => toggleSection("operations")}>
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-chart-2" />
                      {isZh ? "经营进展" : "Operation Progress"}
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      {expandedSections.has("operations") ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                {expandedSections.has("operations") && (
                  <CardContent className="space-y-4">
                    {result.operationProgress.map((op, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/50 border">
                        <div className="font-medium text-sm mb-1">
                          {isZh ? op.highlightZh : op.highlight}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {isZh ? op.detailsZh : op.details}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            {/* Outlook Tab */}
            <TabsContent value="outlook" className="space-y-4">
              <Card className="border-green-200 dark:border-green-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                    {isZh ? "未来展望" : "Future Outlook"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {isZh ? result.futureOutlookZh : result.futureOutlook}
                    </p>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(isZh ? result.futureOutlookZh : result.futureOutlook, "outlook")}
                      className="h-8 px-2"
                    >
                      {copiedField === "outlook" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Risks Tab */}
            <TabsContent value="risks" className="space-y-4">
              <Card
                className={`border-2 ${expandedSections.has("risks") ? "border-orange-500" : "border-border"}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between cursor-pointer" onClick={() => toggleSection("risks")}>
                    <span className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      {isZh ? "风险因素" : "Risk Factors"}
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      {expandedSections.has("risks") ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                {expandedSections.has("risks") && (
                  <CardContent className="space-y-3">
                    {result.riskFactors.map((risk, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border border-orange-200 dark:border-orange-900"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {isZh ? risk.categoryZh : risk.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {isZh ? risk.descriptionZh : risk.description}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            </TabsContent>
          </Tabs>

          <Separator />

          {/* Disclaimer */}
          <Card className="border-[hsl(var(--color-overvalued))]/30 bg-[hsl(var(--color-overvalued))]/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-[hsl(var(--color-overvalued))] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1">{isZh ? "请注意" : "Important Note"}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isZh
                      ? "AI摘要仅供参考，不构成投资建议。年度报告分析应结合行业环境、宏观经济、竞争格局等多方面因素综合考虑。投资决策需谨慎，请以原始年报和官方披露为准。"
                      : "AI summary is for reference only and does not constitute investment advice. Annual report analysis should be combined with industry environment, macroeconomic conditions, competitive landscape, and other factors. Investment decisions should be made carefully, please refer to the original annual report and official disclosures."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Example Content */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{isZh ? "示例内容" : "Example Content"}</CardTitle>
          <CardDescription>
            {isZh ? "点击使用示例快速体验功能" : "Click to use an example for quick demonstration"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start text-left h-auto py-3"
            onClick={() => {
              setCompanyName(isZh ? "苹果公司" : "Apple Inc.")
              setReportYear("2024")
              setReportText(isZh
                ? `2024财年第一季度财务表现\n\n净销售额：1195.8亿美元，较上年同期增长2%\n产品收入：969.8亿美元\n服务收入：226亿美元，创历史新高\n毛利率：45.9%\n\n主要产品表现：\niPhone收入：690.5亿美元，同比增长5.5%\nMac收入：77.8亿美元，同比下降0.8%\niPad收入：67.4亿美元，同比增长7%\n可穿戴设备收入：79.7亿美元\n\n地区表现：\n美洲地区：509.8亿美元\n欧洲地区：310.1亿美元\n大中华区：235.1亿美元\n日本：77.8亿美元\n亚太其他地区：102.2亿美元\n\n战略进展：\n• 继续推进空间计算平台Vision Pro的生态系统建设\n• 强化服务业务，会员订阅服务持续增长\n• 加大在生成式AI领域的投资\n• 供应链多元化战略稳步推进\n\n未来展望：\n预计2024财年将继续保持稳健增长，服务业务有望延续强劲表现。`
                : `Q1 2024 Fiscal Year Financial Performance\n\nNet Sales: $119.58 billion, up 2% year-over-year\nProducts Revenue: $96.98 billion\nServices Revenue: $22.6 billion, record high\ngross Margin: 45.9%\n\nProduct Performance:\niPhone Revenue: $69.05 billion, up 5.5% YoY\nMac Revenue: $7.78 billion, down 0.8% YoY\niPad Revenue: $6.74 billion, up 7% YoY\nWearables Revenue: $7.97 billion\n\nRegional Performance:\nAmericas: $50.98 billion\nEurope: $31.01 billion\nGreater China: $23.51 billion\nJapan: $7.78 billion\nRest of Asia Pacific: $10.22 billion\n\nStrategic Progress:\n• Continued building the Vision Pro spatial computing platform ecosystem\n• Strengthened services business with continued growth in subscription services\n• Increased investment in generative AI\n• Steady progress in supply chain diversification strategy\n\nFuture Outlook:\nExpected to continue steady growth in FY2024, with services business expected to continue strong performance.`
              )
            }}
          >
            <FileText className="h-4 w-4 mr-2 shrink-0 text-green-600" />
            <span className="text-sm">
              {isZh ? "苹果公司 2024 Q1 财报节选" : "Apple Inc. 2024 Q1 Financial Results Excerpt"}
            </span>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
