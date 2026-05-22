/**
 * 归估值 - 股票数据代理 Worker
 * 将东方财富 API 转为带 CORS 头的 JSON，绕过浏览器跨域限制
 * 
 * 使用方式:
 *   GET /?code=000001&exchange=sz   (A股深圳)
 *   GET /?code=600519&exchange=sh  (A股上海)
 *   GET /?code=00700&exchange=hk   (港股)
 *   GET /?code=AAPL&exchange=us    (美股)
 *   POST /api/ai { type: "moat" | "annual-report" | "risk-factors", text: "...", locale?: "zh-CN" | "en" }
 */

const EM_FIELDS = [
  'f43',  // 当前价格
  'f57',  // 股票代码
  'f58',  // 股票名称
  'f107', // 今日涨跌
  'f44',  // 今日开盘价
  'f45',  // 昨日收盘价
  'f46',  // 今日最高
  'f47',  // 今日最低
  'f48',  // 竞买价(卖一)
  'f49',  // 竞卖价(买一)
  'f50',  // 成交量(股)
  'f51',  // 成交额(元)
  'f52',  // 委托买一量
  'f53',  // 委托买二量
  'f54',  // 委托买三量
  'f55',  // 委托买一价
  'f56',  // 委托买二价
  'f57',  // 委托买三价
  'f58',  // 委托卖一量
  'f59',  // 委托卖二量
  'f60',  // 委托卖三量
  'f61',  // 委托卖一价
  'f62',  // 委托卖二价
  'f63',  // 委托卖三价
  'f116', // 总市值
  'f117', // 流通市值
  'f162', // 市盈率(动)
  'f163', // 市盈率(静)
  'f164', // 市净率
  'f167', // 市销率
  'f168', // 市现率
  'f173', // 流通股本
  'f191', // 每股收益
  'f234', // 每股净资产
  'f236', // 毛利率
  'f237', // 净利率
  'f238', // 资产负债率
  'f240', // 净资产收益率(ROE)
  'f251', // 净利润(万元)
  'f255', // 营业收入(万元)
  'f257', // 主营业务收入
  'f358', // 股息率
  'f370', // 自由现金流
].join(',')

const CORS_ORIGIN = env.CORS_ORIGIN || '*'

function addCorsHeaders(response: Response): Response {
  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', CORS_ORIGIN)
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type')
  headers.set('Access-Control-Max-Age', '86400')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

// ─── AI Analysis ───────────────────────────────────────────────

const MOAT_TYPES_INFO = [
  { type: "Network Effect", typeZh: "网络效应", desc: "产品随用户增多更有价值，护城河难以复制", descEn: "Product becomes more valuable as more users join" },
  { type: "Economies of Scale", typeZh: "规模经济", desc: "大规模运营降低单位成本，小竞争对手难以价格竞争", descEn: "Large scale lowers per-unit costs" },
  { type: "Brand Power", typeZh: "品牌优势", desc: "品牌认知度创造忠诚度，可溢价定价", descEn: "Strong brand creates customer loyalty and pricing power" },
  { type: "High Switching Costs", typeZh: "高转换成本", desc: "客户转换产品面临大量时间、精力或金钱成本", descEn: "Switching to competitors requires significant time/effort/money" },
  { type: "Regulatory Advantages", typeZh: "监管优势", desc: "政府法规、许可证或专利创造进入壁垒", descEn: "Government regulations create barriers to entry" },
  { type: "Proprietary Technology", typeZh: "专有技术", desc: "独特技术、专利或商业秘密提供竞争优势", descEn: "Unique technology or patents provide competitive advantage" },
  { type: "Cost Advantage", typeZh: "成本优势", desc: "获得更廉价资源或工艺，以低于竞争对手成本生产", descEn: "Access to cheaper resources enables lower production costs" },
  { type: "Intangible Assets", typeZh: "无形资产", desc: "许可证、认证或知识产权创造可持续竞争优势", descEn: "Licenses and IP create sustainable competitive advantages" },
]

function buildMoatPrompt(text: string, isZh: boolean): string {
  const typesList = MOAT_TYPES_INFO.map(t => 
    `  - ${isZh ? t.typeZh : t.type}: ${isZh ? t.desc : t.descEn}`
  ).join("\n")
  
  return isZh
    ? `你是一位专业投资分析师，分析企业竞争护城河。

请根据以下业务描述，分析该企业的竞争优势和护城河：

业务描述：
${text}

请从以下护城河类型中识别，并评估强度（strong/moderate/weak）：

${typesList}

请以纯JSON格式返回，不要包含其他文字：
{
  "overallMoatStrength": "strong" | "moderate" | "weak" | "none",
  "summary": "英文总结",
  "summaryZh": "中文总结",
  "moatTypes": [{"type": "英文", "typeZh": "中文", "strength": "strong|moderate|weak", "description": "英文", "descriptionZh": "中文"}],
  "investmentAdvice": "英文建议",
  "investmentAdviceZh": "中文建议",
  "riskFactors": ["英文风险"],
  "riskFactorsZh": ["中文风险"],
  "keyTakeaways": ["英文要点"],
  "keyTakeawaysZh": ["中文要点"]
}`
    : `You are a professional investment analyst. Analyze the competitive moat of this business.

Business description:
${text}

Identify moat types and assess strength (strong/moderate/weak):

${typesList}

Return ONLY valid JSON, no other text:
{
  "overallMoatStrength": "strong|moderate|weak|none",
  "summary": "English summary",
  "summaryZh": "Chinese summary",
  "moatTypes": [{"type": "English", "typeZh": "Chinese", "strength": "strong|moderate|weak", "description": "English", "descriptionZh": "Chinese"}],
  "investmentAdvice": "English advice",
  "investmentAdviceZh": "Chinese advice",
  "riskFactors": ["risk in English"],
  "riskFactorsZh": ["risk in Chinese"],
  "keyTakeaways": ["key takeaway in English"],
  "keyTakeawaysZh": ["key takeaway in Chinese"]
}`
}

function buildRiskPrompt(text: string, companyName: string, isZh: boolean): string {
  return isZh
    ? `你是一位专业投资分析师。分析以下文本，提取关键风险因素。

公司：${companyName || "未知名公司"}

文本内容：
${text}

请以纯JSON格式返回：
{
  "industryRisks": ["行业风险1", "行业风险2"],
  "competitiveRisks": ["竞争风险1"],
  "operationalRisks": ["运营风险1"],
  "financialRisks": ["财务风险1"],
  "macroRisks": ["宏观风险1"],
  "governanceRisks": ["治理风险1"],
  "riskLevel": "high|medium|low",
  "riskLevelZh": "高|中|低",
  "topConcerns": ["最需关注的风险1", "最需关注的风险2", "最需关注的风险3"]
}`
    : `You are a professional investment analyst. Extract key risk factors from the text below.

Company: ${companyName || "Unknown"}

Text:
${text}

Return ONLY valid JSON:
{
  "industryRisks": ["industry risk 1", "industry risk 2"],
  "competitiveRisks": ["competitive risk 1"],
  "operationalRisks": ["operational risk 1"],
  "financialRisks": ["financial risk 1"],
  "macroRisks": ["macro risk 1"],
  "governanceRisks": ["governance risk 1"],
  "riskLevel": "high|medium|low",
  "riskLevelZh": "高|中|低",
  "topConcerns": ["top concern 1", "top concern 2", "top concern 3"]
}`
}

function buildAnnualReportPrompt(text: string, companyName: string, year: number, isZh: boolean): string {
  return isZh
    ? `你是一位专业Equity Research分析师，总结以下年报。

公司：${companyName}
年份：${year}

年报内容：
${text}

请以纯JSON格式返回：
{
  "summary": "英文摘要",
  "summaryZh": "中文摘要",
  "businessOverview": "业务概览英文",
  "businessOverviewZh": "业务概览中文",
  "financialHighlights": [{"label": "指标名", "labelZh": "中文", "value": "数值", "change": "变化"}],
  "strategicDirection": "战略方向英文",
  "strategicDirectionZh": "战略方向中文",
  "riskFactors": ["风险1", "风险2"],
  "highlights": ["亮点1", "亮点2"],
  "redFlags": ["隐忧1", "隐忧2"],
  "investmentConclusion": "投资结论英文",
  "investmentConclusionZh": "投资结论中文"
}`
    : `You are a professional equity research analyst. Summarize this annual report.

Company: ${companyName}
Year: ${year}

Content:
${text}

Return ONLY valid JSON:
{
  "summary": "English summary",
  "summaryZh": "Chinese summary",
  "businessOverview": "Business overview in English",
  "businessOverviewZh": "Business overview in Chinese",
  "financialHighlights": [{"label": "Metric name", "labelZh": "Chinese", "value": "Value", "change": "Change"}],
  "strategicDirection": "Strategic direction in English",
  "strategicDirectionZh": "Strategic direction in Chinese",
  "riskFactors": ["risk 1", "risk 2"],
  "highlights": ["highlight 1", "highlight 2"],
  "redFlags": ["red flag 1", "red flag 2"],
  "investmentConclusion": "Investment conclusion in English",
  "investmentConclusionZh": "Investment conclusion in Chinese"
}`
}

async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  const apiUrl = "https://api.openai.com/v1/chat/completions"
  
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional investment analyst. Always respond with valid JSON only." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error("Invalid OpenAI response format")
  }
  return data.choices[0].message.content
}

function parseJSONResponse(content: string): any {
  // Handle markdown code blocks
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
  let jsonStr = jsonMatch ? jsonMatch[1] : content
  
  // Find JSON object
  const objectMatch = jsonStr.match(/\{[\s\S]*\}/)
  if (objectMatch) {
    jsonStr = objectMatch[0]
  }
  
  return JSON.parse(jsonStr)
}

async function handleAI(request: Request): Promise<Response> {
  const apiKey = env.OPENAI_API_KEY || env.LLM_API_KEY
  
  if (!apiKey) {
    return addCorsHeaders(new Response(
      JSON.stringify({ error: "API key not configured. Please set OPENAI_API_KEY in Cloudflare Worker settings.", isConfigurationError: true }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    ))
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return addCorsHeaders(new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    ))
  }

  const { type, text, locale = "en", companyName, reportYear } = body
  
  if (!text || text.trim().length < 50) {
    return addCorsHeaders(new Response(
      JSON.stringify({ error: locale === "zh-CN" ? "文本内容太少，至少需要50个字符" : "Text too short, minimum 50 characters required" }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    ))
  }

  const isZh = locale === "zh-CN"
  
  let prompt: string
  switch (type) {
    case "moat":
      prompt = buildMoatPrompt(text, isZh)
      break
    case "risk-factors":
      prompt = buildRiskPrompt(text, companyName || "", isZh)
      break
    case "annual-report":
      prompt = buildAnnualReportPrompt(text, companyName || "", reportYear || new Date().getFullYear(), isZh)
      break
    default:
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "Unknown analysis type. Use 'moat', 'risk-factors', or 'annual-report'." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ))
  }

  try {
    const result = await callOpenAI(prompt, apiKey)
    const parsed = parseJSONResponse(result)
    return addCorsHeaders(new Response(
      JSON.stringify(parsed),
      { headers: { 'Content-Type': 'application/json' } }
    ))
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return addCorsHeaders(new Response(
      JSON.stringify({ error: `AI analysis failed: ${message}` }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    ))
  }
}

// ─── Stock Data ─────────────────────────────────────────────────

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url)

  // AI analysis endpoint
  if (url.pathname === "/api/ai" && request.method === "POST") {
    return handleAI(request)
  }

  // CORS preflight
  if (request.method === "OPTIONS") {
    return addCorsHeaders(new Response(null, { status: 204 }))
  }

  // Only handle GET for stock data
  if (request.method !== "GET") {
    return addCorsHeaders(new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    ))
  }

  const code = url.searchParams.get("code")
  const exchange = url.searchParams.get("exchange") || "sz"

  if (!code) {
    return addCorsHeaders(new Response(
      JSON.stringify({ error: "Missing code parameter" }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    ))
  }

  // A股: exchange = sh(上海) 或 sz(深圳)
  // 港股: exchange = hk
  // 美股: exchange = us
  let secid = ""

  if (exchange === "sh") {
    secid = `1.${code.padStart(6, "0")}`
  } else if (exchange === "sz") {
    secid = `0.${code.padStart(6, "0")}`
  } else if (exchange === "hk") {
    secid = `116.${code.padStart(5, "0")}`
  } else if (exchange === "us") {
    return handleUsStock(code)
  }

  const emUrl = `https://push2.eastmoney.com/api/qt/stock/get?secid=${secid}&fields=${EM_FIELDS}&_=${Date.now()}`

  try {
    const emResponse = await fetch(emUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://finance.eastmoney.com/",
      },
    })

    if (!emResponse.ok) {
      throw new Error(`East Money API error: ${emResponse.status}`)
    }

    const data = await emResponse.json()

    if (!data.data) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "Stock not found", code, exchange }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      ))
    }

    const d = data.data
    const result = {
      code: d.f57 || code,
      name: d.f58 || "",
      price: d.f43 / 100 || 0,
      change: d.f107 / 100 || 0,
      open: d.f44 / 100 || 0,
      yesterdayClose: d.f45 / 100 || 0,
      high: d.f46 / 100 || 0,
      low: d.f47 / 100 || 0,
      volume: d.f50 || 0,
      amount: d.f51 || 0,
      marketCap: d.f116 ? d.f116 / 100000000 : 0,
      floatMarketCap: d.f117 ? d.f117 / 100000000 : 0,
      pe: d.f162 ? d.f162 / 100 : null,
      peStatic: d.f163 ? d.f163 / 100 : null,
      pb: d.f164 ? d.f164 / 100 : null,
      ps: d.f167 ? d.f167 / 100 : null,
      pcf: d.f168 ? d.f168 / 100 : null,
      eps: d.f191 ? d.f191 / 100 : null,
      nav: d.f234 ? d.f234 / 100 : null,
      grossMargin: d.f236 ? d.f236 / 100 : null,
      netMargin: d.f237 ? d.f237 / 100 : null,
      debtRatio: d.f238 ? d.f238 / 100 : null,
      roe: d.f240 ? d.f240 / 100 : null,
      netProfit: d.f251 ? d.f251 / 10000 : 0,
      revenue: d.f255 ? d.f255 / 10000 : 0,
      dividendYield: d.f358 ? d.f358 / 100 : null,
      fcf: d.f370 ? d.f370 / 100000000 : null,
    }

    return addCorsHeaders(new Response(
      JSON.stringify({ data: result }),
      { headers: { 'Content-Type': 'application/json' } }
    ))
  } catch (err) {
    console.error("Worker error:", err)
    return addCorsHeaders(new Response(
      JSON.stringify({ error: "Failed to fetch stock data", message: String(err) }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    ))
  }
}

async function handleUsStock(code: string): Promise<Response> {
  const symbol = code.toUpperCase()
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5y`

  try {
    const res = await fetch(yahooUrl, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" }
    })
    const json = await res.json()
    const result = json?.chart?.result?.[0]

    if (!result) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "US stock not found", code }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      ))
    }

    const meta = result.meta
    return addCorsHeaders(new Response(
      JSON.stringify({
        data: {
          code: meta.symbol,
          name: meta.shortName || meta.symbol || code,
          price: meta.regularMarketPrice || 0,
          change: meta.regularMarketChange || 0,
          changePercent: meta.regularMarketChangePercent || 0,
          high: meta.regularMarketDayHigh || 0,
          low: meta.regularMarketDayLow || 0,
          open: meta.regularMarketOpen || 0,
          yesterdayClose: meta.previousClose || 0,
          volume: meta.regularMarketVolume || 0,
          marketCap: meta.marketCap || 0,
          pe: null,
          pb: null,
          roe: null,
          grossMargin: null,
          debtRatio: null,
          dividendYield: null,
          eps: meta.epsTrailingTwwelveMonths || null,
          fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || null,
          fiftyTwoWeekLow: meta.fiftyTwoWeekLow || null,
        }
      }),
      { headers: { 'Content-Type': 'application/json' } }
    ))
  } catch (err) {
    return addCorsHeaders(new Response(
      JSON.stringify({ error: "Failed to fetch US stock", message: String(err) }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    ))
  }
}

export default {
  async fetch(request: Request): Promise<Response> {
    return handleRequest(request)
  }
}
