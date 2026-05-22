import { NextRequest, NextResponse } from "next/server"

interface AnnualReportRequest {
  reportText: string
  companyName: string
  reportYear: number
  locale?: string
}

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

function buildPrompt(reportText: string, companyName: string, reportYear: number, isZh: boolean): string {
  return isZh ? `你是一位专业的投资分析师，负责分析和总结公司年度报告的关键信息。

你的任务是从给定的年报文本中提取和生成结构化的摘要信息。

公司名称：${companyName}
报告年份：${reportYear}

年报文本内容：
${reportText}

请以JSON格式返回以下结构化的分析结果：

{
  "companyName": "${companyName}",
  "reportYear": ${reportYear},
  "summary": "英文报告总摘要（3-5句话概括年报核心内容）",
  "summaryZh": "中文报告总摘要（3-5句话概括年报核心内容）",
  "businessOverview": {
    "summary": "英文业务概览摘要",
    "summaryZh": "中文业务概览摘要",
    "keyProducts": ["英文主要产品/服务列表"],
    "keyProductsZh": ["中文主要产品/服务列表"],
    "targetMarkets": ["英文目标市场列表"],
    "targetMarketsZh": ["中文目标市场列表"]
  },
  "financialHighlights": [
    {
      "label": "英文指标名称",
      "labelZh": "中文指标名称",
      "value": "数值（如：$119.58B 或 45.9%）",
      "change": "同比变化（如：+2% YoY 或 较上年增长）"
    }
  ],
  "operationProgress": [
    {
      "highlight": "英文经营亮点标题",
      "highlightZh": "中文经营亮点标题",
      "details": "英文详细说明",
      "detailsZh": "中文详细说明"
    }
  ],
  "futureOutlook": "英文未来展望（2-3句话）",
  "futureOutlookZh": "中文未来展望（2-3句话）",
  "riskFactors": [
    {
      "category": "英文风险类别",
      "categoryZh": "中文风险类别",
      "description": "英文风险描述",
      "descriptionZh": "中文风险描述"
    }
  ],
  "investmentHighlights": ["英文投资亮点列表"],
  "investmentHighlightsZh": ["中文投资亮点列表"]
}

请确保返回的是有效的JSON格式，不要包含任何其他文字。如果年报文本中没有提供某些信息，请在相应字段中返回"未提供"或"Not provided"。` : `You are a professional investment analyst specializing in analyzing and summarizing key information from company annual reports.

Your task is to extract and generate structured summary information from the given annual report text.

Company Name: ${companyName}
Report Year: ${reportYear}

Annual Report Text Content:
${reportText}

Please return the following structured analysis result in JSON format:

{
  "companyName": "${companyName}",
  "reportYear": ${reportYear},
  "summary": "English report summary (3-5 sentences summarizing the core content of the annual report)",
  "summaryZh": "Chinese report summary (3-5 sentences summarizing the core content of the annual report)",
  "businessOverview": {
    "summary": "English business overview summary",
    "summaryZh": "Chinese business overview summary",
    "keyProducts": ["English list of key products/services"],
    "keyProductsZh": ["Chinese list of key products/services"],
    "targetMarkets": ["English list of target markets"],
    "targetMarketsZh": ["Chinese list of target markets"]
  },
  "financialHighlights": [
    {
      "label": "English metric name",
      "labelZh": "Chinese metric name",
      "value": "Value (e.g., $119.58B or 45.9%)",
      "change": "Year-over-year change (e.g., +2% YoY or Increased from prior year)"
    }
  ],
  "operationProgress": [
    {
      "highlight": "English operation highlight title",
      "highlightZh": "Chinese operation highlight title",
      "details": "English detailed description",
      "detailsZh": "Chinese detailed description"
    }
  ],
  "futureOutlook": "English future outlook (2-3 sentences)",
  "futureOutlookZh": "Chinese future outlook (2-3 sentences)",
  "riskFactors": [
    {
      "category": "English risk category",
      "categoryZh": "Chinese risk category",
      "description": "English risk description",
      "descriptionZh": "Chinese risk description"
    }
  ],
  "investmentHighlights": ["English list of investment highlights"],
  "investmentHighlightsZh": ["Chinese list of investment highlights"]
}

Please ensure the response is valid JSON format only, without any other text. If certain information is not provided in the annual report text, return "Not provided" or "未提供" in the corresponding fields.`
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
      max_tokens: 8000
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

function parseJSONResponse(content: string): AnnualReportResult {
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

  const result = JSON.parse(jsonStr) as AnnualReportResult

  // Validate required fields
  if (!result.summary || !result.businessOverview) {
    throw new Error("Invalid response format: missing required fields")
  }

  // Ensure arrays have default values if not provided
  if (!result.financialHighlights) {
    result.financialHighlights = []
  }
  if (!result.operationProgress) {
    result.operationProgress = []
  }
  if (!result.riskFactors) {
    result.riskFactors = []
  }
  if (!result.investmentHighlights) {
    result.investmentHighlights = []
  }
  if (!result.investmentHighlightsZh) {
    result.investmentHighlightsZh = []
  }

  return result
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as AnnualReportRequest
    const { reportText, companyName, reportYear, locale = "en" } = body

    if (!reportText || reportText.trim().length < 100) {
      return NextResponse.json(
        { error: locale === "zh-CN"
          ? "请提供至少100个字符的年报内容，以便进行有意义的分析。"
          : "Please provide annual report content of at least 100 characters for meaningful analysis."
        },
        { status: 400 }
      )
    }

    if (!companyName || companyName.trim().length === 0) {
      return NextResponse.json(
        { error: locale === "zh-CN"
          ? "请提供公司名称。"
          : "Please provide the company name."
        },
        { status: 400 }
      )
    }

    if (!reportYear || reportYear < 1900 || reportYear > 2100) {
      return NextResponse.json(
        { error: locale === "zh-CN"
          ? "请提供有效的报告年份（1900-2100）。"
          : "Please provide a valid report year (1900-2100)."
        },
        { status: 400 }
      )
    }

    if (reportText.length > 50000) {
      return NextResponse.json(
        { error: locale === "zh-CN"
          ? "年报内容过长，请控制在50000个字符以内。"
          : "Annual report content is too long. Please limit to 50000 characters."
        },
        { status: 400 }
      )
    }

    const isZh = locale === "zh-CN"
    const prompt = buildPrompt(reportText, companyName.trim(), reportYear, isZh)

    const llmResponse = await callLLM(prompt)
    const result = parseJSONResponse(llmResponse)

    // Ensure company name and year are set correctly
    result.companyName = companyName.trim()
    result.reportYear = reportYear

    return NextResponse.json(result)
  } catch (error) {
    console.error("Annual report analysis error:", error)

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
      message: "Annual Report Summarizer API",
      description: "POST endpoint to summarize annual report content using AI",
      requestBody: {
        reportText: "string (required, min 100 characters, max 50000 characters)",
        companyName: "string (required)",
        reportYear: "number (required, between 1900 and 2100)",
        locale: "string (optional, 'en' or 'zh-CN', default: 'en')"
      },
      response: {
        companyName: "string",
        reportYear: "number",
        summary: "string (English summary)",
        summaryZh: "string (Chinese summary)",
        businessOverview: {
          summary: "string",
          summaryZh: "string",
          keyProducts: "array of strings (English)",
          keyProductsZh: "array of strings (Chinese)",
          targetMarkets: "array of strings (English)",
          targetMarketsZh: "array of strings (Chinese)"
        },
        financialHighlights: "array of financial metric objects",
        operationProgress: "array of operation progress objects",
        futureOutlook: "string (English)",
        futureOutlookZh: "string (Chinese)",
        riskFactors: "array of risk factor objects",
        investmentHighlights: "array of strings (English)",
        investmentHighlightsZh: "array of strings (Chinese)"
      }
    }
  )
}
