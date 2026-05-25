export type ToolCategory = "quant" | "ai" | "dashboard" | "calc"

export interface ToolMeta {
  id: string
  zh: string
  en: string
  zhDesc: string
  enDesc: string
  zhMetaDesc: string
  enMetaDesc: string
  category: ToolCategory
}

const tools: ToolMeta[] = [
  {
    id: "graham-number",
    zh: "格雷厄姆数",
    en: "Graham Number",
    zhDesc: "计算股票内在价值的保守估值公式",
    enDesc: "Benjamin Graham's conservative intrinsic value formula",
    zhMetaDesc: "本杰明·格雷厄姆的保守估值公式 — 通过每股收益和每股净资产计算内在价值上限。免费在线格雷厄姆数计算器，价值投资者的核心估值工具。",
    enMetaDesc: "Benjamin Graham's conservative formula using EPS and book value per share to calculate intrinsic value. Free online Graham Number calculator for value investors.",
    category: "quant",
  },
  {
    id: "margin-of-safety",
    zh: "安全边际",
    en: "Margin of Safety",
    zhDesc: "判断当前价格是否具备安全边际",
    enDesc: "Calculate the gap between price and intrinsic value",
    zhMetaDesc: "计算当前价格与内在价值的差距，判断买入区域是否具备安全边际。免费在线安全边际计算器，帮助价值投资者控制下行风险。",
    enMetaDesc: "Calculate the gap between current price and intrinsic value to assess buy-zone safety. Free Margin of Safety calculator for value investors.",
    category: "quant",
  },
  {
    id: "pe-percentile",
    zh: "PE分位对比",
    en: "PE Percentile",
    zhDesc: "查看当前市盈率在历史估值中的分位位置",
    enDesc: "See where current P/E sits in the historical distribution",
    zhMetaDesc: "对比当前市盈率在历史估值中的分位位置，判断估值高低。免费在线PE分位对比工具，一眼看清估值处于历史什么水平。",
    enMetaDesc: "See where current P/E ratio sits in the historical distribution to assess valuation levels. Free PE Percentile tool for stock analysis.",
    category: "quant",
  },
  {
    id: "tenx-ten-years",
    zh: "十年十倍",
    en: "10x in 10 Years",
    zhDesc: "计算十年十倍需要的年化增速",
    enDesc: "Calculate required annual growth rate for 10x in 10 years",
    zhMetaDesc: "计算十年十倍所需的年化增速，评估个股增长预期是否匹配。免费在线十年十倍计算器，价值投资者评估长期回报的必备工具。",
    enMetaDesc: "Calculate required annual growth rate for 10x return in 10 years. Free online 10x in 10 Years calculator for long-term value investing.",
    category: "quant",
  },
  {
    id: "fcf-quality",
    zh: "FCF质量检测",
    en: "FCF Quality",
    zhDesc: "检验净利润是否由真实现金流支撑",
    enDesc: "Check if net profit is backed by real cash flow",
    zhMetaDesc: "检验净利润是否由真实现金流支撑，识别「纸面富贵」财务风险。免费在线自由现金流质量检测工具，排除盈利陷阱。",
    enMetaDesc: "Check if net profit is backed by real cash flow — identify financial fraud risk. Free FCF Quality tool for detecting earnings quality issues.",
    category: "quant",
  },
  {
    id: "reverse-calculator",
    zh: "倒推估值",
    en: "Reverse Valuation",
    zhDesc: "输入目标回报倒推合理估值与买入价格",
    enDesc: "Enter target return to reverse-engineer fair value",
    zhMetaDesc: "输入目标回报、利润增速和未来市盈率，倒推合理估值与买入价格区间。免费在线倒推估值工具，科学制定买入计划。",
    enMetaDesc: "Enter target return, growth rate, and future P/E to reverse-engineer fair value and ideal buy price. Free Reverse Valuation calculator.",
    category: "quant",
  },
  {
    id: "peg-ratio",
    zh: "PEG比率",
    en: "PEG Ratio",
    zhDesc: "市盈率与增长率比值衡量估值合理性",
    enDesc: "Price-to-Earnings to Growth ratio for valuation",
    zhMetaDesc: "通过市盈率与盈利增长率的比值判断估值是否合理。免费在线PEG比率计算器，彼得·林奇的估值利器。",
    enMetaDesc: "Calculate PEG Ratio — Price-to-Earnings divided by growth rate — to assess valuation fairness. Free PEG Ratio calculator for growth investors.",
    category: "quant",
  },
  {
    id: "szr-calculator",
    zh: "Siegel增长率",
    en: "SZR Calculator",
    zhDesc: "Siegel增长率公式计算合理市值增速",
    enDesc: "Siegel's sustainable growth rate formula",
    zhMetaDesc: "基于Jeremy Siegel的可持续增长率公式，计算合理市值增速。免费在线Siegel增长率计算器。",
    enMetaDesc: "Calculate sustainable growth rate using Jeremy Siegel's formula. Free SZR (Siegel's) calculator for long-term return estimation.",
    category: "quant",
  },
  {
    id: "inflation-calculator",
    zh: "通胀计算器",
    en: "Inflation Calculator",
    zhDesc: "通胀对购买力的影响——正向/反向计算，内置CPI历史数据",
    enDesc: "Inflation impact on purchasing power — forward/backward modes, built-in CPI history since 1913",
    zhMetaDesc: "计算通胀对购买力的真实影响。正向预测未来购买力，反向查询历史购买力。内置1913年至今美国CPI数据。免费在线通胀计算器。",
    enMetaDesc: "Calculate inflation's impact on purchasing power. Forward projections & historical lookups. Built-in US CPI data from 1913 to present. Free Inflation calculator.",
    category: "calc",
  },
  {
    id: "compound-interest",
    zh: "复利计算器",
    en: "Compound Interest",
    zhDesc: "定投复利计算——收益曲线、通胀调整、逐年明细",
    enDesc: "Compound interest with monthly contributions — growth chart, inflation adjustment, yearly breakdown",
    zhMetaDesc: "计算复利定投增长——每月定投、年化收益率、通胀调整，逐年明细表+对比分析曲线。免费在线复利计算器，理解雪球效应的最佳工具。",
    enMetaDesc: "Calculate compound interest growth with monthly contributions, inflation adjustment, and yearly breakdown. Free Compound Interest calculator — see the snowball effect.",
    category: "calc",
  },
  {
    id: "dashboard",
    zh: "个股仪表盘",
    en: "Stock Dashboard",
    zhDesc: "输入股票代码一览关键指标与走势",
    enDesc: "Enter stock code to view key metrics and trends",
    zhMetaDesc: "输入股票代码，一览关键估值指标与历史走势。免费在线A股/港股/美股个股仪表盘，快速评估目标公司。",
    enMetaDesc: "Enter stock code to view key valuation metrics and historical trends. Free stock dashboard for A-shares, HK, and US stocks.",
    category: "dashboard",
  },
  {
    id: "moat-analyzer",
    zh: "护城河分析",
    en: "Moat Analyzer",
    zhDesc: "AI分析企业护城河来源与可持续性",
    enDesc: "AI analyzes moat sources and sustainability",
    zhMetaDesc: "基于业务描述，AI自动分析企业竞争护城河来源与强度。免费在线AI护城河分析工具，评估企业长期竞争优势。",
    enMetaDesc: "AI-powered economic moat analysis — identify competitive advantages and assess moat strength. Free Moat Analyzer for value investors.",
    category: "ai",
  },
  {
    id: "annual-report",
    zh: "年报摘要",
    en: "Annual Report Summary",
    zhDesc: "AI提取年报关键业务数据与战略要点",
    enDesc: "AI extracts key data from annual reports",
    zhMetaDesc: "AI自动提取年报中的关键业务数据、财务亮点和战略方向。免费在线年报摘要工具，几分钟读完200页年报。",
    enMetaDesc: "AI extracts key financial highlights, strategic direction, and risks from annual reports. Free Annual Report Summarizer for investors.",
    category: "ai",
  },
  {
    id: "risk-factors",
    zh: "风险因素清单",
    en: "Risk Factors",
    zhDesc: "从年报中提取风险因素按重要性排序",
    enDesc: "Extract and rank risk factors from reports",
    zhMetaDesc: "从年报或公告中提取风险因素并按行业/竞争/财务等维度分类排序。免费在线AI风险分析工具，先看到地雷。",
    enMetaDesc: "Extract and rank risk factors from annual reports — categorized by industry, competition, financial, and macro risks. Free AI Risk Factor analyzer.",
    category: "ai",
  },
]

export function getToolMeta(id: string): ToolMeta | undefined {
  return tools.find(t => t.id === id)
}

export function getRelatedTools(id: string, maxCount = 4): ToolMeta[] {
  const current = getToolMeta(id)
  if (!current) return []
  
  return tools
    .filter(t => t.id !== id && t.category === current.category)
    .slice(0, maxCount)
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return tools.filter(t => t.category === category)
}

export function categoryLabel(category: ToolCategory, isZh: boolean): string {
  const labels: Record<ToolCategory, { zh: string; en: string }> = {
    quant: { zh: "量化计算工具", en: "Quantitative Tools" },
    ai: { zh: "AI 分析工具", en: "AI Analysis Tools" },
    dashboard: { zh: "综合仪表盘", en: "Dashboard" },
    calc: { zh: "投资计算器", en: "Investment Calculators" },
  }
  return isZh ? labels[category].zh : labels[category].en
}

export default tools