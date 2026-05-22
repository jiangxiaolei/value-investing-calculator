"use client"

import { useState } from "react"
import { 
  Shield, 
  AlertTriangle, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  XCircle,
  MinusCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useLocale } from "@/lib/i18n/i18n-context"

interface MoatType {
  type: string
  typeZh: string
  strength: "strong" | "moderate" | "weak"
  description: string
  descriptionZh: string
}

interface MoatAnalysisResult {
  overallMoatStrength: "strong" | "moderate" | "weak" | "none"
  overallMoatStrengthZh: string
  summary: string
  summaryZh: string
  moatTypes: MoatType[]
  investmentAdvice: string
  investmentAdviceZh: string
  riskFactors: string[]
  riskFactorsZh: string[]
  keyTakeaways: string[]
  keyTakeawaysZh: string[]
}

interface ApiError {
  error: string
  isConfigurationError?: boolean
}

function getMoatStrengthInfo(strength: "strong" | "moderate" | "weak" | "none", isZh: boolean) {
  const strengthMap = {
    strong: {
      label: isZh ? "强大护城河" : "Strong Moat",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700",
      icon: CheckCircle,
      borderColor: "border-green-500"
    },
    moderate: {
      label: isZh ? "中等护城河" : "Moderate Moat",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-700",
      icon: MinusCircle,
      borderColor: "border-yellow-500"
    },
    weak: {
      label: isZh ? "较弱护城河" : "Weak Moat",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/40 border-orange-300 dark:border-orange-700",
      icon: AlertCircle,
      borderColor: "border-orange-500"
    },
    none: {
      label: isZh ? "无护城河" : "No Moat",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700",
      icon: XCircle,
      borderColor: "border-red-500"
    }
  }
  return strengthMap[strength]
}

function getTypeStrengthInfo(strength: "strong" | "moderate" | "weak") {
  const strengthMap = {
    strong: {
      label: "强",
      color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
      borderColor: "border-green-300 dark:border-green-700"
    },
    moderate: {
      label: "中",
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
      borderColor: "border-yellow-300 dark:border-yellow-700"
    },
    weak: {
      label: "弱",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
      borderColor: "border-orange-300 dark:border-orange-700"
    }
  }
  return strengthMap[strength]
}

export function MoatAnalyzer() {
  const { t, locale } = useLocale()
  const isZh = locale === "zh-CN"

  const [businessDescription, setBusinessDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<MoatAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedMoatTypes, setExpandedMoatTypes] = useState<Set<number>>(new Set())
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (businessDescription.trim().length < 50) {
      setError(isZh ? "请提供至少50个字符的业务描述。" : "Please provide at least 50 characters.")
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/moat-analyzer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          businessDescription: businessDescription.trim(),
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
          setError(errorData.error || (isZh ? "分析失败" : "Analysis failed"))
        }
        return
      }

      setResult(data as MoatAnalysisResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : (isZh ? "发生错误" : "An error occurred"))
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMoatType = (index: number) => {
    const newExpanded = new Set(expandedMoatTypes)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedMoatTypes(newExpanded)
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

  const strengthInfo = result ? getMoatStrengthInfo(result.overallMoatStrength, isZh) : null
  const StrengthIcon = strengthInfo?.icon

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
          {isZh ? "护城河分析器" : "Moat Analyzer"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isZh ? "AI驱动的企业竞争优势分析" : "AI-Powered Competitive Advantage Analysis"}
        </p>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {isZh 
            ? "输入公司业务描述，让AI分析其竞争护城河的强度和类型，帮助您评估企业的长期投资价值。"
            : "Enter a company's business description and let AI analyze the strength and types of its competitive moat, helping you evaluate the company's long-term investment value."
          }
        </p>
      </div>

      {/* Input Card */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-chart-2" />
            {isZh ? "输入业务描述" : "Enter Business Description"}
          </CardTitle>
          <CardDescription>
            {isZh 
              ? "详细描述公司的业务模式、产品或服务、目标市场等关键信息"
              : "Provide a detailed description of the company's business model, products/services, target market, and other key information"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessDescription" className="flex items-center text-sm">
              {isZh ? "业务描述" : "Business Description"}
              <span className="text-destructive ml-1">*</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center ml-1 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[300px] text-xs leading-relaxed">
                  {isZh 
                    ? "建议包含：公司主营业务、盈利模式、竞争对手、客户群体、市场份额等信息。描述越详细，分析越准确。"
                    : "Suggested content: main business, revenue model, competitors, customer base, market share, etc. More details lead to more accurate analysis."
                  }
                </TooltipContent>
              </Tooltip>
            </Label>
            <Textarea
              id="businessDescription"
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              placeholder={
                isZh 
                  ? "例如：苹果公司设计、开发和销售消费电子产品、软件、服务和配件。主要产品包括iPhone智能手机、iPad平板电脑、Mac电脑、Apple Watch智能手表、AirPods无线耳机等。公司通过iOS、macOS等操作系统和App Store应用商店建立生态系统，增强用户粘性..."
                  : "Example: Apple designs, develops, and sells consumer electronics, software, services, and accessories. Main products include iPhone smartphones, iPad tablets, Mac computers, Apple Watch smartwatches, AirPods wireless earphones, etc. The company builds an ecosystem through iOS, macOS and App Store..."
              }
              className="min-h-[200px] resize-y"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{businessDescription.length} / 10,000 {isZh ? "字符" : "characters"}</span>
              <span className={businessDescription.length >= 50 ? "text-green-600" : "text-destructive"}>
                {businessDescription.length < 50 
                  ? `${50 - businessDescription.length} ${isZh ? "更多字符需要" : "more characters needed"}`
                  : isZh ? "✓ 足够分析" : "✓ Sufficient for analysis"
                }
              </span>
            </div>
          </div>

          <Button 
            onClick={handleAnalyze} 
            disabled={isLoading || businessDescription.trim().length < 50}
            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isZh ? "分析中..." : "Analyzing..."}
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                {isZh ? "分析护城河" : "Analyze Moat"}
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
      {result && strengthInfo && (
        <>
          {/* Overall Strength Card */}
          <Card className={`border-2 ${strengthInfo.borderColor}`}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-muted/50">
                <div className="text-sm text-muted-foreground mb-2">
                  {isZh ? "总体护城河强度" : "Overall Moat Strength"}
                </div>
                {StrengthIcon && (
                  <StrengthIcon className={`h-12 w-12 mb-3 ${strengthInfo.color}`} />
                )}
                <div className={`text-3xl font-bold ${strengthInfo.color}`}>
                  {isZh ? result.overallMoatStrengthZh : 
                    result.overallMoatStrength.charAt(0).toUpperCase() + result.overallMoatStrength.slice(1)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{isZh ? "分析总结" : "Analysis Summary"}</span>
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
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-muted/50 border">
                <p className="text-sm leading-relaxed">
                  {isZh ? result.summaryZh : result.summary}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Moat Types */}
          {result.moatTypes && result.moatTypes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {isZh ? "护城河类型" : "Moat Types"}
                </CardTitle>
                <CardDescription>
                  {isZh 
                    ? "识别出的主要竞争优势及其强度评估"
                    : "Identified competitive advantages and their strength assessment"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.moatTypes.map((moatType, index) => {
                  const typeStrength = getTypeStrengthInfo(moatType.strength)
                  const isExpanded = expandedMoatTypes.has(index)
                  
                  return (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border ${typeStrength.borderColor} transition-colors`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {isZh ? moatType.typeZh : moatType.type}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${typeStrength.color}`}>
                              {typeStrength.label}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {isZh ? moatType.descriptionZh : moatType.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleMoatType(index)}
                          className="h-8 px-2 shrink-0"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {/* Investment Advice */}
          <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                {isZh ? "投资建议" : "Investment Advice"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-background/80 border">
                <p className="text-sm leading-relaxed">
                  {isZh ? result.investmentAdviceZh : result.investmentAdvice}
                </p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Two Column Layout for Risk Factors and Key Takeaways */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  {isZh ? "风险因素" : "Risk Factors"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(isZh ? result.riskFactorsZh : result.riskFactors).map((risk, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span className="text-muted-foreground">{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Key Takeaways */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  {isZh ? "关键要点" : "Key Takeaways"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(isZh ? result.keyTakeawaysZh : result.keyTakeaways).map((takeaway, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span className="text-muted-foreground">{takeaway}</span>
                    </li>
                  ))}
                </ul>
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
                      ? "AI分析仅供参考，不构成投资建议。护城河分析应结合行业环境、管理层质量、财务状况等多方面因素综合考虑。投资决策需谨慎。"
                      : "AI analysis is for reference only and does not constitute investment advice. Moat analysis should be combined with industry environment, management quality, financial status and other factors. Investment decisions should be made carefully."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Example Descriptions */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{isZh ? "示例描述" : "Example Descriptions"}</CardTitle>
          <CardDescription>
            {isZh ? "点击使用示例快速体验分析功能" : "Click to use an example for quick demonstration"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start text-left h-auto py-3"
            onClick={() => setBusinessDescription(
              isZh 
                ? "茅台是中国最著名的白酒生产企业，拥有超过500年的酿造历史。其核心产品飞天茅台因独特的酿造工艺、稀缺性和强大的品牌影响力而供不应求。公司通过严格的渠道管控和限量供应策略维持产品的高端定位和溢价能力。茅台酒的需求持续超过供给，经销商需要提前数月预订，这体现了其强大的市场定价权。"
                : "Maotai is China's most famous baijiu (white liquor) producer with over 500 years of brewing history. Its core product Feitian Maotai is in short supply due to unique brewing craftsmanship, scarcity, and strong brand influence. The company maintains its premium positioning and pricing power through strict channel control and limited supply strategy. Maotai demand consistently exceeds supply, with dealers needing to book months in advance, demonstrating strong market pricing power."
            )}
          >
            <Shield className="mr-2 h-4 w-4 text-green-600 shrink-0" />
            <span className="text-sm">{isZh ? "茅台 - 白酒龙头企业" : "Maotai - Leading Baijiu Company"}</span>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-left h-auto py-3"
            onClick={() => setBusinessDescription(
              isZh
                ? "微信是腾讯旗下的超级社交应用，拥有超过13亿月活跃用户。它不仅是一个即时通讯工具，还集成了支付（微信支付）、小程序、公众号、朋友圈等功能，形成了一个完整的生态系统。用户迁移到其他社交平台的成本极高，因为所有的社交关系都在微信上，这使得微信拥有极强的用户粘性和网络效应护城河。"
                : "WeChat is a super social app under Tencent with over 1.3 billion monthly active users. It's not just an instant messaging tool but also integrates payment (WeChat Pay), mini programs, public accounts, Moments, forming a complete ecosystem. User migration to other platforms is extremely costly as all social relationships are on WeChat, giving WeChat strong user stickiness and network effect moat."
            )}
          >
            <Shield className="mr-2 h-4 w-4 text-green-600 shrink-0" />
            <span className="text-sm">{isZh ? "微信 - 社交生态系统" : "WeChat - Social Ecosystem"}</span>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-left h-auto py-3"
            onClick={() => setBusinessDescription(
              isZh
                ? "拼多多是一家电商平台，主要面向价格敏感的消费者，通过拼团和社交分享模式快速获客。公司早期投入大量资金进行用户补贴以建立用户习惯，虽然目前已经盈利但仍面临激烈的电商竞争。用户在不同电商平台之间的转换成本较低，商品同质化严重，护城河相对较弱，需要持续投入维持竞争力。"
                : "Pinduoduo is an e-commerce platform targeting price-sensitive consumers, acquiring customers quickly through group buying and social sharing. The company invested heavily in user subsidies early to build habits, and while profitable now, still faces intense e-commerce competition. Users have low switching costs between platforms, product homogenization is severe, and moat is relatively weak, requiring continuous investment to maintain competitiveness."
            )}
          >
            <Shield className="mr-2 h-4 w-4 text-orange-500 shrink-0" />
            <span className="text-sm">{isZh ? "拼多多 - 电商平台" : "Pinduoduo - E-commerce Platform"}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
