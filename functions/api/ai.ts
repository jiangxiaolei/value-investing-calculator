// pages/api/ai — AI analysis endpoint (DeepSeek-powered)
export async function onRequest(context: EventContext) {
  const { request, env } = context

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { "Content-Type": "application/json" }
    })
  }

  const apiKey = env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({
      error: "API未配置。请在 Pages 设置中配置 DEEPSEEK_API_KEY。",
      isConfigurationError: true
    }), { status: 500, headers: { "Content-Type": "application/json" } })
  }

  let body: any
  try { body = await request.json() }
  catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400, headers: { "Content-Type": "application/json" }
    })
  }

  const { type, text, locale = "en", companyName, reportYear } = body

  if (!text || text.trim().length < 50) {
    return new Response(JSON.stringify({
      error: locale === "zh-CN" ? "文本内容太少" : "Text too short"
    }), { status: 400, headers: { "Content-Type": "application/json" } })
  }

  const isZh = locale === "zh-CN"
  let prompt: string

  switch (type) {
    case "moat":
      prompt = buildMoatPrompt(text, isZh); break
    case "risk-factors":
      prompt = buildRiskPrompt(text, companyName || "", isZh); break
    case "annual-report":
      prompt = buildAnnualReportPrompt(text, companyName || "", reportYear || new Date().getFullYear(), isZh); break
    default:
      return new Response(JSON.stringify({ error: "Unknown type" }), {
        status: 400, headers: { "Content-Type": "application/json" }
      })
  }

  try {
    const result = await callDeepSeek(prompt, apiKey)
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    return new Response(JSON.stringify({ error: `AI analysis failed: ${msg}` }), {
      status: 502, headers: { "Content-Type": "application/json" }
    })
  }
}

async function callDeepSeek(prompt: string, apiKey: string) {
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a professional investment analyst. Always respond with valid JSON only." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4096,
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`DeepSeek API error: ${response.status} - ${err}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error("Invalid DeepSeek response")

  // Parse JSON from response (handle markdown code blocks)
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
  let jsonStr = jsonMatch ? jsonMatch[1] : content
  const objectMatch = jsonStr.match(/\{[\s\S]*\}/)
  if (objectMatch) jsonStr = objectMatch[0]

  return JSON.parse(jsonStr)
}

function buildMoatPrompt(text: string, isZh: boolean): string {
  const types = [
    { name: "Network Effect", nameZh: "网络效应" },
    { name: "Economies of Scale", nameZh: "规模经济" },
    { name: "Brand Power", nameZh: "品牌优势" },
    { name: "High Switching Costs", nameZh: "高转换成本" },
    { name: "Regulatory Advantages", nameZh: "监管优势" },
    { name: "Cost Advantage", nameZh: "成本优势" },
  ]

  const typesList = types.map(t => isZh ? `  - ${t.nameZh}` : `  - ${t.name}`).join("\n")
  const system = isZh
    ? `分析企业的竞争护城河。忽略所有不相关的描述。请以纯JSON格式返回。`
    : `Analyze the business moat. Provide the response as pure JSON.`

  return isZh
    ? `${system}\n\n业务描述：${text}\n\n从以下维度评估：\n${typesList}\n\nJSON格式：{"overallMoatStrength":"strong|moderate|weak|none","summary":"英文总结","summaryZh":"中文总结","moatTypes":[{"type":"英文","typeZh":"中文","strength":"strong|moderate|weak","description":"英文","descriptionZh":"中文"}],"keyTakeaways":["英文"],"keyTakeawaysZh":["中文"]}`
    : `${system}\n\nBusiness: ${text}\n\nAssess these moat types:\n${typesList}\n\nJSON: {"overallMoatStrength":"strong|moderate|weak|none","summary":"summary","summaryZh":"Chinese summary","moatTypes":[{"type":"name","typeZh":"Chinese","strength":"strong|moderate|weak","description":"desc","descriptionZh":"Chinese desc"}],"keyTakeaways":["key takeaway"],"keyTakeawaysZh":["Chinese"]}`
}

function buildRiskPrompt(text: string, companyName: string, isZh: boolean): string {
  return isZh
    ? `分析风险因素。公司：${companyName}\n\n文本：${text}\n\nJSON：{"industryRisks":["行业风险"],"competitiveRisks":["竞争风险"],"operationalRisks":["运营风险"],"financialRisks":["财务风险"],"macroRisks":["宏观风险"],"governanceRisks":["治理风险"],"riskLevel":"high|medium|low","riskLevelZh":"高|中|低","topConcerns":["最需关注风险1","最需关注风险2","最需关注风险3"]}`
    : `Analyze risk factors. Company: ${companyName}\n\nText: ${text}\n\nJSON: {"industryRisks":["risk1"],"competitiveRisks":["risk2"],"operationalRisks":["risk3"],"financialRisks":["risk4"],"macroRisks":["risk5"],"governanceRisks":["risk6"],"riskLevel":"high|medium|low","riskLevelZh":"高|中|低","topConcerns":["concern1","concern2","concern3"]}`
}

function buildAnnualReportPrompt(text: string, companyName: string, year: number, isZh: boolean): string {
  return isZh
    ? `总结年报。公司：${companyName} 年份：${year}\n\n内容：${text}\n\nJSON：{"summary":"英文摘要","summaryZh":"中文摘要","businessOverview":"业务概览英文","businessOverviewZh":"业务概览中文","financialHighlights":[{"label":"指标","labelZh":"中文","value":"数值","change":"变化"}],"strategicDirection":"英文","strategicDirectionZh":"中文","riskFactors":["风险1","风险2"],"highlights":["亮点1","亮点2"],"redFlags":["隐忧1","隐忧2"],"investmentConclusion":"英文","investmentConclusionZh":"中文"}`
    : `Summarize annual report. Company: ${companyName} Year: ${year}\n\nContent: ${text}\n\nJSON: {"summary":"summary","summaryZh":"Chinese summary","businessOverview":"overview","businessOverviewZh":"Chinese overview","financialHighlights":[{"label":"metric","labelZh":"Chinese","value":"value","change":"change"}],"strategicDirection":"direction","strategicDirectionZh":"Chinese direction","riskFactors":["risk1"],"highlights":["highlight1"],"redFlags":["flag1"],"investmentConclusion":"conclusion","investmentConclusionZh":"Chinese conclusion"}`
}
