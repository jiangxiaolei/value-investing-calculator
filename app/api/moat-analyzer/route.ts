import { NextRequest, NextResponse } from "next/server"

interface MoatAnalysisRequest {
  businessDescription: string
  locale?: string
}

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

const MOAT_TYPES = [
  {
    type: "Network Effect",
    typeZh: "网络效应",
    description: "The product or service becomes more valuable as more people use it, creating a powerful moat that's difficult for competitors to replicate.",
    descriptionZh: "产品或服务随着用户增多而变得更有价值，创造了一个竞争对手难以复制的强大护城河。"
  },
  {
    type: "Economies of Scale",
    typeZh: "规模经济",
    description: "Large-scale operations allow for lower per-unit costs, making it harder for smaller competitors to compete on price.",
    descriptionZh: "大规模运营能够降低单位成本，使较小的竞争对手难以在价格上竞争。"
  },
  {
    type: "Brand Power",
    typeZh: "品牌优势",
    description: "Strong brand recognition creates customer loyalty and allows for premium pricing compared to generic alternatives.",
    descriptionZh: "强大的品牌认知度创造客户忠诚度，并允许相比普通替代品收取溢价。"
  },
  {
    type: "High Switching Costs",
    typeZh: "高转换成本",
    description: "Customers face significant time, effort, or monetary costs when switching to a competitor's product or service.",
    descriptionZh: "客户在转换到竞争对手的产品或服务时面临大量时间、精力或金钱成本。"
  },
  {
    type: "Regulatory Advantages",
    typeZh: "监管优势",
    description: "Government regulations, licenses, or patents create barriers to entry that protect the company from competition.",
    descriptionZh: "政府法规、许可证或专利创造了进入壁垒，保护公司免受竞争。"
  },
  {
    type: "Proprietary Technology",
    typeZh: "专有技术",
    description: "Unique technology, patents, or trade secrets provide a competitive advantage that's protected from direct copying.",
    descriptionZh: "独特的技术、专利或商业秘密提供了受保护免受直接抄袭的竞争优势。"
  },
  {
    type: "Cost Advantage",
    typeZh: "成本优势",
    description: "Access to cheaper resources, locations, or processes allows the company to produce at lower costs than competitors.",
    descriptionZh: "获得更廉价的资源、区位或工艺，使公司能够以低于竞争对手的成本生产。"
  },
  {
    type: "Toll Bridge",
    typeZh: "收费桥模式",
    description: "The company controls access to a essential resource or platform that others must pay to use.",
    descriptionZh: "公司控制对必要资源或平台的访问，他人必须付费才能使用。"
  },
  {
    type: "Intangible Assets",
    typeZh: "无形资产",
    description: "Valuable intangible assets like licenses, certifications, or intellectual property create sustainable competitive advantages.",
    descriptionZh: "许可证、认证或知识产权等有价值的无形资产创造可持续的竞争优势。"
  },
  {
    type: "First-Mover Advantage",
    typeZh: "先发优势",
    description: "Early entry into a market allows the company to establish customer relationships, brand recognition, and distribution channels before competitors.",
    descriptionZh: "提前进入市场使公司能够在竞争对手之前建立客户关系、品牌认知度和分销渠道。"
  }
]

function buildPrompt(businessDescription: string, isZh: boolean): string {
  const moatTypesList = MOAT_TYPES.map(m => 
    `  - ${isZh ? m.typeZh : m.type}: ${isZh ? m.descriptionZh : m.description}`
  ).join("\n")

  return isZh ? `你是一位专业的投资分析师，负责分析企业的竞争护城河。

请根据以下业务描述，分析该企业的竞争优势和护城河：

业务描述：
${businessDescription}

请从以下护城河类型中识别该企业可能拥有的护城河，并评估其强度：

${moatTypesList}

请以JSON格式返回分析结果，格式如下：
{
  "overallMoatStrength": "strong" | "moderate" | "weak" | "none",
  "summary": "英文总结",
  "summaryZh": "中文总结",
  "moatTypes": [
    {
      "type": "英文类型名称",
      "typeZh": "中文类型名称",
      "strength": "strong" | "moderate" | "weak",
      "description": "英文描述",
      "descriptionZh": "中文描述"
    }
  ],
  "investmentAdvice": "英文投资建议",
  "investmentAdviceZh": "中文投资建议",
  "riskFactors": ["英文风险因素"],
  "riskFactorsZh": ["中文风险因素"],
  "keyTakeaways": ["英文关键要点"],
  "keyTakeawaysZh": ["中文关键要点"]
}

请确保返回的是有效的JSON格式，不要包含任何其他文字。` : `You are a professional investment analyst specializing in analyzing competitive moats of businesses.

Please analyze the competitive advantages and moat of the following business based on its description:

Business Description:
${businessDescription}

Identify and evaluate the moat types this business may have from the following categories:

${moatTypesList}

Please return the analysis result in JSON format as follows:
{
  "overallMoatStrength": "strong" | "moderate" | "weak" | "none",
  "summary": "Summary in English",
  "summaryZh": "Summary in Chinese",
  "moatTypes": [
    {
      "type": "English type name",
      "typeZh": "Chinese type name",
      "strength": "strong" | "moderate" | "weak",
      "description": "Description in English",
      "descriptionZh": "Description in Chinese"
    }
  ],
  "investmentAdvice": "Investment advice in English",
  "investmentAdviceZh": "Investment advice in Chinese",
  "riskFactors": ["Risk factors in English"],
  "riskFactorsZh": ["Risk factors in Chinese"],
  "keyTakeaways": ["Key takeaways in English"],
  "keyTakeawaysZh": ["Key takeaways in Chinese"]
}

Please ensure the response is valid JSON format only, without any other text.`
}

async function callLLM(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY
  
  if (!apiKey) {
    throw new Error("API key not configured. Please set OPENAI_API_KEY or LLM_API_KEY environment variable.")
  }

  const apiUrl = process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions"
  
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional investment analyst. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API request failed: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error("Invalid API response format")
  }

  return data.choices[0].message.content
}

function parseJSONResponse(content: string): MoatAnalysisResult {
  // Try to extract JSON from the response
  let jsonStr = content
  
  // Handle markdown code blocks
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonMatch) {
    jsonStr = jsonMatch[1]
  }
  
  // Try to find JSON object in the response
  const objectMatch = jsonStr.match(/\{[\s\S]*\}/)
  if (objectMatch) {
    jsonStr = objectMatch[0]
  }
  
  const result = JSON.parse(jsonStr) as MoatAnalysisResult
  
  // Validate required fields
  if (!result.overallMoatStrength || !result.summary || !result.moatTypes) {
    throw new Error("Invalid response format: missing required fields")
  }
  
  return result
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as MoatAnalysisRequest
    const { businessDescription, locale = "en" } = body

    if (!businessDescription || businessDescription.trim().length < 50) {
      return NextResponse.json(
        { error: locale === "zh-CN" 
          ? "请提供至少50个字符的业务描述，以便进行有意义的分析。" 
          : "Please provide a business description of at least 50 characters for meaningful analysis."
        },
        { status: 400 }
      )
    }

    if (businessDescription.length > 10000) {
      return NextResponse.json(
        { error: locale === "zh-CN"
          ? "业务描述过长，请控制在10000个字符以内。"
          : "Business description is too long. Please limit to 10000 characters."
        },
        { status: 400 }
      )
    }

    const isZh = locale === "zh-CN"
    const prompt = buildPrompt(businessDescription, isZh)
    
    const llmResponse = await callLLM(prompt)
    const result = parseJSONResponse(llmResponse)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Moat analysis error:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const isLocaleError = errorMessage.includes("not configured") || errorMessage.includes("API key")
    
    return NextResponse.json(
      { 
        error: errorMessage,
        isConfigurationError: isLocaleError
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: "Moat Analyzer API",
      description: "POST endpoint to analyze competitive moat from business description",
      requestBody: {
        businessDescription: "string (required, min 50 characters)",
        locale: "string (optional, 'en' or 'zh-CN', default: 'en')"
      },
      response: {
        overallMoatStrength: "strong | moderate | weak | none",
        summary: "string",
        summaryZh: "string",
        moatTypes: "array of moat type objects",
        investmentAdvice: "string",
        investmentAdviceZh: "string",
        riskFactors: "array of strings",
        riskFactorsZh: "array of strings",
        keyTakeaways: "array of strings",
        keyTakeawaysZh: "array of strings"
      }
    }
  )
}
