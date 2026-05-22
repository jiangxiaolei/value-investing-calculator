import { NextRequest, NextResponse } from "next/server"

interface RiskAnalysisRequest {
  companyName?: string
  companyText: string
  locale?: string
}

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

const RISK_CATEGORIES = [
  {
    category: "Market Risk",
    categoryZh: "市场风险",
    description: "Risks related to market conditions, demand fluctuations, and customer preferences.",
    descriptionZh: "与市场状况、需求波动和客户偏好相关的风险。"
  },
  {
    category: "Operational Risk",
    categoryZh: "运营风险",
    description: "Risks arising from internal processes, systems, and human factors.",
    descriptionZh: "由内部流程、系统和人为因素造成的风险。"
  },
  {
    category: "Financial Risk",
    categoryZh: "财务风险",
    description: "Risks related to financial management, debt, and capital structure.",
    descriptionZh: "与财务管理、债务和资本结构相关的风险。"
  },
  {
    category: "Regulatory Risk",
    categoryZh: "监管风险",
    description: "Risks from changes in laws, regulations, and government policies.",
    descriptionZh: "由法律、法规和政府政策变化带来的风险。"
  },
  {
    category: "Competitive Risk",
    categoryZh: "竞争风险",
    description: "Risks from competitors' actions, market share erosion, and industry disruption.",
    descriptionZh: "来自竞争对手行动、市场份额侵蚀和行业颠覆的风险。"
  },
  {
    category: "Technology Risk",
    categoryZh: "技术风险",
    description: "Risks from technological changes, obsolescence, and cybersecurity threats.",
    descriptionZh: "由技术变革、过时和网络安全威胁带来的风险。"
  },
  {
    category: "Reputational Risk",
    categoryZh: "声誉风险",
    description: "Risks from negative public perception, brand damage, and media scrutiny.",
    descriptionZh: "由负面公众认知、品牌损害和媒体审查带来的风险。"
  },
  {
    category: "Legal Risk",
    categoryZh: "法律风险",
    description: "Risks from litigation, contractual disputes, and legal compliance.",
    descriptionZh: "来自诉讼、合同纠纷和法律合规的风险。"
  },
  {
    category: "Supply Chain Risk",
    categoryZh: "供应链风险",
    description: "Risks from supplier failures, logistics disruptions, and inventory management.",
    descriptionZh: "来自供应商失败、物流中断和库存管理的风险。"
  },
  {
    category: "Human Capital Risk",
    categoryZh: "人力资源风险",
    description: "Risks from talent retention, labor disputes, and workforce skill gaps.",
    descriptionZh: "来自人才保留、劳资纠纷和劳动力技能差距的风险。"
  },
  {
    category: "Environmental Risk",
    categoryZh: "环境风险",
    description: "Risks from climate change, natural disasters, and environmental regulations.",
    descriptionZh: "来自气候变化、自然灾害和环境法规的风险。"
  },
  {
    category: "Macroeconomic Risk",
    categoryZh: "宏观经济风险",
    description: "Risks from economic cycles, inflation, and global economic conditions.",
    descriptionZh: "来自经济周期、通货膨胀和全球经济状况的风险。"
  },
  {
    category: "Currency Risk",
    categoryZh: "汇率风险",
    description: "Risks from foreign exchange rate fluctuations affecting international business.",
    descriptionZh: "来自影响国际业务的汇率波动风险。"
  },
  {
    category: "Interest Rate Risk",
    categoryZh: "利率风险",
    description: "Risks from interest rate changes affecting borrowing costs and valuations.",
    descriptionZh: "来自影响借款成本和估值的利率变化风险。"
  },
  {
    category: "Country Risk",
    categoryZh: "国家风险",
    description: "Risks specific to operating in certain countries including political instability.",
    descriptionZh: "特定国家运营特有的风险，包括政治不稳定。"
  },
  {
    category: "Industry Risk",
    categoryZh: "行业风险",
    description: "Risks affecting the entire industry such as regulatory changes or market shifts.",
    descriptionZh: "影响整个行业的风险，如监管变化或市场转移。"
  }
]

function buildPrompt(companyName: string, companyText: string, isZh: boolean): string {
  const companyInfo = companyName ? `${isZh ? "公司名称：" : "Company Name: "}${companyName}\n` : ""
  
  const categoriesList = RISK_CATEGORIES.map(c => 
    `  - ${isZh ? c.categoryZh : c.category}: ${isZh ? c.descriptionZh : c.description}`
  ).join("\n")

  return isZh ? `你是一位专业的投资风险分析师，负责识别和分析企业的潜在风险因素。

请根据以下公司信息，识别和分析该企业面临的主要风险：

${companyInfo}公司描述文本：
${companyText}

请从以下风险类别中识别该企业可能面临的风险，并为每个风险评估其严重程度（高/中/低）：

${categoriesList}

请以JSON格式返回分析结果，格式如下：
{
  "companyName": "公司名称",
  "summary": "英文总体风险概述",
  "summaryZh": "中文总体风险概述",
  "overallRiskLevel": "high" | "medium" | "low",
  "overallRiskLevelZh": "高风险" | "中等风险" | "低风险",
  "riskCategories": [
    {
      "category": "英文风险类别",
      "categoryZh": "中文风险类别",
      "severity": "high" | "medium" | "low",
      "risks": ["英文具体风险项1", "英文具体风险项2"],
      "risksZh": ["中文具体风险项1", "中文具体风险项2"],
      "mitigation": "英文风险缓解建议（可选）",
      "mitigationZh": "中文风险缓解建议（可选）"
    }
  ],
  "investmentCautions": ["英文投资注意事项1", "英文投资注意事项2"],
  "investmentCautionsZh": ["中文投资注意事项1", "中文投资注意事项2"],
  "positiveFactors": ["英文积极因素1", "英文积极因素2"],
  "positiveFactorsZh": ["中文积极因素1", "中文积极因素2"]
}

请确保返回的是有效的JSON格式，不要包含任何其他文字。每个风险类别应该有2-5个具体的风险项。` : `You are a professional investment risk analyst specializing in identifying and analyzing potential risk factors for businesses.

Based on the following company information, please identify and analyze the main risks faced by this company:

${companyInfo}Company Description Text:
${companyText}

Please identify risks this company may face from the following risk categories and evaluate the severity (high/medium/low) for each:

${categoriesList}

Please return the analysis result in JSON format as follows:
{
  "companyName": "Company Name",
  "summary": "Overall risk summary in English",
  "summaryZh": "Overall risk summary in Chinese",
  "overallRiskLevel": "high" | "medium" | "low",
  "overallRiskLevelZh": "High Risk" | "Medium Risk" | "Low Risk",
  "riskCategories": [
    {
      "category": "English risk category name",
      "categoryZh": "Chinese risk category name",
      "severity": "high" | "medium" | "low",
      "risks": ["Specific risk item 1 in English", "Specific risk item 2 in English"],
      "risksZh": ["Specific risk item 1 in Chinese", "Specific risk item 2 in Chinese"],
      "mitigation": "Risk mitigation suggestion in English (optional)",
      "mitigationZh": "Risk mitigation suggestion in Chinese (optional)"
    }
  ],
  "investmentCautions": ["Investment caution 1 in English", "Investment caution 2 in English"],
  "investmentCautionsZh": ["Investment caution 1 in Chinese", "Investment caution 2 in Chinese"],
  "positiveFactors": ["Positive factor 1 in English", "Positive factor 2 in English"],
  "positiveFactorsZh": ["Positive factor 1 in Chinese", "Positive factor 2 in Chinese"]
}

Please ensure the response is valid JSON format only, without any other text. Each risk category should have 2-5 specific risk items.`
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
          content: "You are a professional investment risk analyst. Always respond with valid JSON only."
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

function parseJSONResponse(content: string): RiskAnalysisResult {
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
  
  const result = JSON.parse(jsonStr) as RiskAnalysisResult
  
  // Validate required fields
  if (!result.summary || !result.overallRiskLevel || !result.riskCategories) {
    throw new Error("Invalid response format: missing required fields")
  }
  
  return result
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RiskAnalysisRequest
    const { companyName = "", companyText, locale = "en" } = body

    if (!companyText || companyText.trim().length < 50) {
      return NextResponse.json(
        { error: locale === "zh-CN"
          ? "请提供至少50个字符的公司描述文本，以便进行有意义的风险分析。"
          : "Please provide a company description text of at least 50 characters for meaningful risk analysis."
        },
        { status: 400 }
      )
    }

    if (companyText.length > 10000) {
      return NextResponse.json(
        { error: locale === "zh-CN"
          ? "公司描述文本过长，请控制在10000个字符以内。"
          : "Company description text is too long. Please limit to 10000 characters."
        },
        { status: 400 }
      )
    }

    const isZh = locale === "zh-CN"
    const prompt = buildPrompt(companyName, companyText, isZh)
    
    const llmResponse = await callLLM(prompt)
    const result = parseJSONResponse(llmResponse)

    // Ensure company name is included
    if (!result.companyName && companyName) {
      result.companyName = companyName
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Risk factors analysis error:", error)
    
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
      message: "Risk Factors Extractor API",
      description: "POST endpoint to identify and categorize risk factors from company text",
      requestBody: {
        companyName: "string (optional)",
        companyText: "string (required, min 50 characters)",
        locale: "string (optional, 'en' or 'zh-CN', default: 'en')"
      },
      response: {
        companyName: "string",
        summary: "string",
        summaryZh: "string",
        overallRiskLevel: "high | medium | low",
        overallRiskLevelZh: "string",
        riskCategories: "array of risk category objects",
        investmentCautions: "array of strings",
        investmentCautionsZh: "array of strings",
        positiveFactors: "array of strings",
        positiveFactorsZh: "array of strings"
      },
      riskCategories: RISK_CATEGORIES.map(c => ({
        category: c.category,
        categoryZh: c.categoryZh
      }))
    }
  )
}
