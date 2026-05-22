"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Building2,
  FileText,
  Lightbulb,
  TrendingDown,
  ShieldAlert,
  Globe,
  Users,
  DollarSign,
  Clock,
  Scale,
  Cpu,
  BarChart3,
  Leaf
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocale } from "@/lib/i18n/i18n-context"

interface RiskCategory {
  category: string
  categoryZh: string
  severity: "high" | "medium" | "low"
  risks: string[]
  risksZh: string[]
  mitigation?: string
  mitigationZh?: string
}

interface RiskAnalysisResult {
  companyName: string
  summary: string
  summaryZh: string
  overallRiskLevel: "high" | "medium" | "low"
  overallRiskLevelZh: string
  riskCategories: RiskCategory[]
  investmentCautions: string[]
  investmentCautionsZh: string[]
  positiveFactors: string[]
  positiveFactorsZh: string[]
}

interface ApiError {
  error: string
  isConfigurationError?: boolean
}

function getSeverityInfo(severity: "high" | "medium" | "low", isZh: boolean) {
  const severityMap = {
    high: {
      label: isZh ? "高风险" : "High Risk",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700",
      icon: AlertTriangle,
      borderColor: "border-red-500"
    },
    medium: {
      label: isZh ? "中等风险" : "Medium Risk",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-700",
      icon: AlertCircle,
      borderColor: "border-yellow-500"
    },
    low: {
      label: isZh ? "低风险" : "Low Risk",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700",
      icon: CheckCircle,
      borderColor: "border-green-500"
    }
  }
  return severityMap[severity]
}

function getCategoryIcon(category: string) {
  const iconMap: Record<string, typeof Building2> = {
    "Market Risk": Globe,
    "市场风险": Globe,
    "Operational Risk": Cpu,
    "运营风险": Cpu,
    "Financial Risk": DollarSign,
    "财务风险": DollarSign,
    "Regulatory Risk": Scale,
    "监管风险": Scale,
    "Competitive Risk": BarChart3,
    "竞争风险": BarChart3,
    "Technology Risk": Cpu,
    "技术风险": Cpu,
    "Reputational Risk": ShieldAlert,
    "声誉风险": ShieldAlert,
    "Legal Risk": Scale,
    "法律风险": Scale,
    "Supply Chain Risk": Globe,
    "供应链风险": Globe,
    "Human Capital Risk": Users,
    "人力资源风险": Users,
    "Environmental Risk": Leaf,
    "环境风险": Leaf,
    "Macroeconomic Risk": TrendingDown,
    "宏观经济风险": TrendingDown,
    "Currency Risk": DollarSign,
    "汇率风险": DollarSign,
    "Interest Rate Risk": Clock,
    "利率风险": Clock,
    "Credit Risk": DollarSign,
    "信用风险": DollarSign,
    "Liquidity Risk": Clock,
    "流动性风险": Clock,
    "Country Risk": Globe,
    "国家风险": Globe,
    "Industry Risk": BarChart3,
    "行业风险": BarChart3,
    "default": AlertTriangle
  }
  return iconMap[category] || iconMap["default"]
}

export function RiskFactorsExtractor() {
  const { t, locale } = useLocale()
  const isZh = locale === "zh-CN"

  const [companyName, setCompanyName] = useState("")
  const [companyText, setCompanyText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<RiskAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (companyText.trim().length < 50) {
      setError(isZh ? "请提供至少50个字符的公司描述。" : "Please provide at least 50 characters of company description.")
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AI_API_URL}/api/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "risk-factors",
          text: companyText.trim(),
          companyName: companyName.trim(),
          locale
        })
      })

      const data = await response.json()

      if (!response.ok) {
        const errorData = data as ApiError
        if (errorData.isConfigurationError) {
          setError(isZh
            ? "API未配置。请在 Cloudflare Worker 设置中配置 OPENAI_API_KEY，并在 Pages 项目中设置 NEXT_PUBLIC_AI_API_URL。"
            : "API not configured. Set OPENAI_API_KEY in Cloudflare Worker settings, and NEXT_PUBLIC_AI_API_URL in Pages environment variables."
          )
        } else {
          setError(errorData.error || (isZh ? "分析失败" : "Analysis failed"))
        }
        return
      }

      setResult(data as RiskAnalysisResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : (isZh ? "发生错误" : "An error occurred"))
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCategory = (index: number) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedCategories(newExpanded)
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

  const getOverallRiskIcon = (level: "high" | "medium" | "low") => {
    const info = getSeverityInfo(level, isZh)
    return info.icon
  }

  const highRiskCount = result?.riskCategories.filter(c => c.severity === "high").length || 0
  const mediumRiskCount = result?.riskCategories.filter(c => c.severity === "medium").length || 0
  const lowRiskCount = result?.riskCategories.filter(c => c.severity === "low").length || 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <ShieldAlert className="h-8 w-8 text-green-600 dark:text-green-400" />
          {isZh ? "风险因素清单" : "Risk Factors Extractor"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isZh ? "AI驱动的企业风险因素识别与分析" : "AI-Powered Company Risk Factor Identification & Analysis"}
        </p>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {isZh
            ? "输入公司信息，让AI识别和分类潜在风险因素，帮助您全面评估企业的风险状况，为投资决策提供参考依据。"
            : "Enter company information and let AI identify and categorize potential risk factors, helping you comprehensively assess the company's risk profile for investment decisions."
          }
        </p>
      </div>

      {/* Input Card */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-chart-2" />
            {isZh ? "输入公司信息" : "Enter Company Information"}
          </CardTitle>
          <CardDescription>
            {isZh
              ? "提供公司名称和相关文本描述，越详细分析越准确"
              : "Provide company name and relevant text description. More details lead to more accurate analysis."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Name Input */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="flex items-center text-sm">
              {isZh ? "公司名称" : "Company Name"}
              <span className="text-muted-foreground ml-1">({isZh ? "可选" : "Optional"})</span>
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={isZh ? "例如：苹果公司 (Apple Inc.)" : "e.g., Apple Inc."}
                className="pl-10"
              />
            </div>
          </div>

          {/* Company Text Input */}
          <div className="space-y-2">
            <Label htmlFor="companyText" className="flex items-center text-sm">
              {isZh ? "公司描述文本" : "Company Description Text"}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="companyText"
                value={companyText}
                onChange={(e) => setCompanyText(e.target.value)}
                placeholder={
                  isZh
                    ? "粘贴或输入公司的年报摘要、业务描述、新闻报道等文本内容。建议至少包含公司的主要业务、财务概况、竞争环境、运营挑战等信息..."
                    : "Paste or enter text from company annual reports, business descriptions, news articles, etc. It is recommended to include information about the company's main business, financial overview, competitive environment, operational challenges..."
                }
                className="min-h-[200px] resize-y pl-10"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{companyText.length} / 10,000 {isZh ? "字符" : "characters"}</span>
              <span className={companyText.length >= 50 ? "text-green-600" : "text-destructive"}>
                {companyText.length < 50
                  ? `${50 - companyText.length} ${isZh ? "更多字符需要" : "more characters needed"}`
                  : isZh ? "✓ 足够分析" : "✓ Sufficient for analysis"
                }
              </span>
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isLoading || companyText.trim().length < 50}
            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isZh ? "分析中..." : "Analyzing..."}
              </>
            ) : (
              <>
                <ShieldAlert className="mr-2 h-4 w-4" />
                {isZh ? "提取风险因素" : "Extract Risk Factors"}
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
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
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
          {/* Overall Risk Level Card */}
          <Card className={`border-2 ${getSeverityInfo(result.overallRiskLevel, isZh).borderColor}`}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-muted/50">
                <div className="text-sm text-muted-foreground mb-2">
                  {isZh ? "总体风险等级" : "Overall Risk Level"}
                  {result.companyName && (
                    <span className="ml-2 font-medium text-foreground">- {result.companyName}</span>
                  )}
                </div>
                {(() => {
                  const IconComponent = getOverallRiskIcon(result.overallRiskLevel)
                  const severityInfo = getSeverityInfo(result.overallRiskLevel, isZh)
                  return (
                    <>
                      <IconComponent className={`h-12 w-12 mb-3 ${severityInfo.color}`} />
                      <div className={`text-3xl font-bold ${severityInfo.color}`}>
                        {isZh ? result.overallRiskLevelZh : result.overallRiskLevel.charAt(0).toUpperCase() + result.overallRiskLevel.slice(1)}
                      </div>
                    </>
                  )
                })()}
                {/* Risk Summary */}
                <div className="mt-4 p-4 rounded-lg bg-background/80 border w-full">
                  <p className="text-sm leading-relaxed text-center">
                    {isZh ? result.summaryZh : result.summary}
                  </p>
                </div>
                {/* Risk Count Breakdown */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="text-xs text-muted-foreground">
                      {isZh ? "高风险" : "High"}: {highRiskCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                    <span className="text-xs text-muted-foreground">
                      {isZh ? "中风险" : "Medium"}: {mediumRiskCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground">
                      {isZh ? "低风险" : "Low"}: {lowRiskCount}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                {isZh ? "风险分类详情" : "Risk Categories Details"}
              </CardTitle>
              <CardDescription>
                {isZh
                  ? "识别出的主要风险类别及其具体风险项"
                  : "Identified risk categories and their specific risk items"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.riskCategories && result.riskCategories.length > 0 ? (
                result.riskCategories.map((category, index) => {
                  const severityInfo = getSeverityInfo(category.severity, isZh)
                  const CategoryIcon = getCategoryIcon(category.category)
                  const isExpanded = expandedCategories.has(index)

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${severityInfo.borderColor} transition-colors`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CategoryIcon className={`h-4 w-4 ${severityInfo.color}`} />
                            <span className="font-medium">
                              {isZh ? category.categoryZh : category.category}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${severityInfo.bgColor}`}>
                              {severityInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {isZh ? category.risksZh.join("；") : category.risks.join("; ")}
                          </p>
                          {category.mitigation && (
                            <div className="mt-2 p-2 rounded bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                              <p className="text-xs text-green-700 dark:text-green-400">
                                <span className="font-medium">{isZh ? "缓解建议：" : "Mitigation: "}</span>
                                {isZh ? category.mitigationZh : category.mitigation}
                              </p>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCategory(index)}
                          className="h-8 px-2 shrink-0"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {/* Expanded view with individual risks */}
                      {isExpanded && category.risks.length > 1 && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <ul className="space-y-2">
                            {(isZh ? category.risksZh : category.risks).map((risk, riskIndex) => (
                              <li key={riskIndex} className="flex items-start gap-2 text-sm">
                                <span className={`mt-0.5 ${severityInfo.color}`}>•</span>
                                <span className="text-muted-foreground">{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                  <p>{isZh ? "未发现明显风险因素" : "No significant risk factors identified"}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Investment Cautions */}
            <Card className="border-orange-200 dark:border-orange-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  {isZh ? "投资注意事项" : "Investment Cautions"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(isZh ? result.investmentCautionsZh : result.investmentCautions).map((caution, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-orange-500 mt-0.5">!</span>
                      <span className="text-muted-foreground">{caution}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Positive Factors */}
            <Card className="border-green-200 dark:border-green-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  {isZh ? "积极因素" : "Positive Factors"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.positiveFactors && result.positiveFactors.length > 0 ? (
                  <ul className="space-y-2">
                    {(isZh ? result.positiveFactorsZh : result.positiveFactors).map((factor, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span className="text-muted-foreground">{factor}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {isZh ? "暂无积极因素记录" : "No positive factors recorded"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <Card className="border-[hsl(var(--color-overvalued))]/30 bg-[hsl(var(--color-overvalued))]/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-[hsl(var(--color-overvalued))] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1">{isZh ? "请注意" : "Important Note"}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isZh
                      ? "AI分析仅供参考，不构成投资建议。风险因素分析应结合行业环境、宏观经济状况、管理层质量等多方面因素综合考虑。投资决策需谨慎，请咨询专业投资顾问。"
                      : "AI analysis is for reference only and does not constitute investment advice. Risk factor analysis should be combined with industry environment, macroeconomic conditions, management quality, and other factors. Investment decisions should be made carefully. Please consult a professional investment advisor."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Example Inputs */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{isZh ? "示例输入" : "Example Inputs"}</CardTitle>
          <CardDescription>
            {isZh ? "点击使用示例快速体验分析功能" : "Click to use an example for quick demonstration"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start text-left h-auto py-3"
            onClick={() => {
              setCompanyName(isZh ? "特斯拉公司" : "Tesla, Inc.")
              setCompanyText(isZh
                ? "特斯拉是一家美国的电动汽车及清洁能源公司，总部位于德克萨斯州奥斯汀。公司主要从事电动汽车的设计、开发、制造和销售，以及太阳能产品和储能系统的销售。特斯拉的Model 3、Model Y、Model S和Model X等车型在全球市场销售。公司还经营超级充电站网络。特斯拉面临的主要风险包括：1）电动汽车市场竞争加剧，传统车企和新兴电动车企都在加大对电动汽车的投入；2）原材料成本上涨，特别是锂、钴等电池关键材料的价格波动；3）供应链中断风险，全球芯片短缺曾对公司生产造成影响；4）自动驾驶技术的监管挑战和安全性争议；5）品牌形象风险，包括CEO马斯克的个人言论引发的争议；6）汇率波动对国际业务的影响。"
                : "Tesla, Inc. is an American electric vehicle and clean energy company based in Austin, Texas. The company designs, develops, manufactures, and sells electric vehicles, as well as solar products and energy storage systems. Tesla's Model 3, Model Y, Model S, and Model X are sold globally. The company also operates a Supercharger network. Tesla faces several key risks: 1) Intensifying competition in the EV market as traditional automakers and new EV startups increase investment; 2) Rising raw material costs, especially for lithium and cobalt essential for batteries; 3) Supply chain disruption risks, as the global chip shortage has affected production; 4) Regulatory challenges and safety controversies surrounding autonomous driving technology; 5) Brand reputation risks from CEO Elon Musk's public statements; 6) Foreign exchange volatility impacts on international operations."
              )
            }}
          >
            <div className="text-left">
              <div className="font-medium">{isZh ? "电动汽车制造商" : "Electric Vehicle Manufacturer"}</div>
              <div className="text-xs text-muted-foreground">{isZh ? "特斯拉公司示例" : "Tesla, Inc. example"}</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start text-left h-auto py-3"
            onClick={() => {
              setCompanyName(isZh ? "阿里巴巴集团" : "Alibaba Group")
              setCompanyText(isZh
                ? "阿里巴巴集团是一家中国电子商务巨头，业务涵盖零售电商、云计算、数字媒体和娱乐等领域。公司运营淘宝、天猫等电商平台，提供阿里云服务，拥有菜鸟物流网络。阿里巴巴面临的主要风险包括：1）监管风险，中国政府对互联网平台的监管加强，反垄断调查和处罚；2）竞争加剧，来自京东、拼多多等竞争对手的挑战，以及短视频平台抖音电商的崛起；3）宏观经济波动，中国消费经济增长放缓可能影响电商业务；4）地缘政治风险，中美贸易关系紧张可能影响公司国际业务；5）云计算市场竞争激烈，华为云、腾讯云等竞争对手不断追赶；6）用户数据安全和隐私保护压力；7）移动支付业务面临的金融监管风险。"
                : "Alibaba Group is a Chinese e-commerce giant with businesses spanning retail e-commerce, cloud computing, digital media, and entertainment. The company operates Taobao, Tmall e-commerce platforms, provides Alibaba Cloud services, and owns Cainiao logistics network. Alibaba faces key risks including: 1) Regulatory risks as Chinese government increases scrutiny on internet platforms, with antitrust investigations and penalties; 2) Intensifying competition from JD.com, Pinduoduo, and the rise of Douyin e-commerce; 3) Macroeconomic volatility as China's consumer spending growth slows; 4) Geopolitical risks from US-China trade tensions affecting international business; 5) Cloud computing market competition from Huawei Cloud and Tencent Cloud; 6) User data security and privacy protection pressures; 7) Financial regulatory risks for its mobile payment business."
              )
            }}
          >
            <div className="text-left">
              <div className="font-medium">{isZh ? "中国电商巨头" : "Chinese E-commerce Giant"}</div>
              <div className="text-xs text-muted-foreground">{isZh ? "阿里巴巴示例" : "Alibaba Group example"}</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start text-left h-auto py-3"
            onClick={() => {
              setCompanyName(isZh ? "苹果公司" : "Apple Inc.")
              setCompanyText(isZh
                ? "苹果公司是一家美国跨国科技公司，设计、开发和销售消费电子产品、软件、服务和配件。主要产品包括iPhone智能手机、iPad平板电脑、Mac电脑、Apple Watch智能手表、AirPods无线耳机等。公司通过iOS、macOS等操作系统和App Store应用商店建立强大生态系统。苹果面临的风险包括：1）iPhone销量增长放缓，智能手机市场趋于饱和；2）对中国市场的高度依赖，中国大陆销售额占比较高；3）全球供应链集中风险，特别是亚洲地区的制造合作伙伴；4）反垄断监管加强，App Store收费模式受到质疑；5）技术迭代加速，公司需要持续大量研发投入；6）品牌形象风险，涉及隐私保护、工作条件等方面的争议；7）外汇风险，海外销售收入面临汇率波动；8）知识产权纠纷和专利诉讼。"
                : "Apple Inc. designs, develops, and sells consumer electronics, software, services, and accessories. Main products include iPhone smartphones, iPad tablets, Mac computers, Apple Watch smartwatches, AirPods wireless earphones, and more. The company builds a strong ecosystem through iOS, macOS, and the App Store. Apple's risks include: 1) Slower iPhone sales growth as the smartphone market saturates; 2) High dependence on the Chinese market which accounts for significant revenue; 3) Global supply chain concentration risks, especially manufacturing partners in Asia; 4) Increased antitrust scrutiny on App Store pricing; 5) Rapid technology iteration requiring substantial R&D investment; 6) Brand reputation risks from privacy protection and labor condition controversies; 7) Foreign exchange risks on overseas revenue; 8) Intellectual property disputes and patent litigation."
              )
            }}
          >
            <div className="text-left">
              <div className="font-medium">{isZh ? "美国科技巨头" : "US Tech Giant"}</div>
              <div className="text-xs text-muted-foreground">{isZh ? "苹果公司示例" : "Apple Inc. example"}</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
