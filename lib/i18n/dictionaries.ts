export type Locale = "zh-CN" | "en"

export type TranslationKey =
  | "app.title"
  | "app.subtitle"
  | "app.description"
  | "app.disclaimer"
  | "section.target"
  | "section.target.desc"
  | "section.company"
  | "section.company.desc"
  | "section.result"
  | "section.result.desc"
  | "label.expectedReturn"
  | "label.expectedReturn.hint"
  | "label.currentProfit"
  | "label.years"
  | "label.years.hint"
  | "label.growthRate"
  | "label.growthRate.hint"
  | "label.futurePE"
  | "label.futurePE.hint"
  | "label.currentMarketCap"
  | "label.currentMarketCap.hint"
  | "result.futureProfit"
  | "result.futureMarketCap"
  | "result.fairValue"
  | "result.fairValue.desc"
  | "result.goodPrice"
  | "result.goodPrice.desc"
  | "result.expensivePrice"
  | "result.expensivePrice.desc"
  | "result.currentReturn"
  | "result.verdict.cheap"
  | "result.verdict.fair"
  | "result.verdict.expensive"
  | "result.verdict.veryExpensive"
  | "chart.title"
  | "chart.goodPrice"
  | "chart.fairValue"
  | "chart.expensivePrice"
  | "chart.currentPrice"
  | "disclaimer.title"
  | "disclaimer.text"
  | "footer.text"
  | "header.locale"
  | "header.theme"
  | "unit.billion"
  | "unit.year"
  | "unit.times"
  | "unit.percent"

export const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  "zh-CN": {
    "app.title": "归估值",
    "app.subtitle": "价值投资思维工具",
    "app.description":
      "基于预期回报率、利润增长率和未来市盈率，计算公司的合理估值与理想买入价格。帮助价值投资者做出理性的投资决策。",
    "app.disclaimer": "本工具仅供教育参考，不构成投资建议。投资有风险，决策需谨慎。",
    "section.target": "锚定你的投资标尺",
    "section.target.desc": "明确你的投资目标，这个数字决定了你对价格的“苛刻”程度",
    "section.company": "描绘公司的现在与未来",
    "section.company.desc": "这是整个工具的“心脏”，输入的质量决定了输出的参考价值",
    "section.result": "获取你的合理价格范围",
    "section.result.desc": "基于你的预测，为你计算出理性的投资决策框架",
    "label.expectedReturn": "期望长期年化回报率",
    "label.expectedReturn.hint":
      "保守投资者可设为8-10%，积极投资者可设为15%或更高。这是你对投资机会的“门槛”。",
    "label.currentProfit": "当前/今年的净利润",
    "label.years": "预测年限",
    "label.years.hint":
      "通常选择3-5年。时间越长，预测的不确定性越大。",
    "label.growthRate": "利润年均复合增长率",
    "label.growthRate.hint":
      "基于公司的护城河、行业空间、扩张计划等综合判断。这是最关键的假设。",
    "label.futurePE": "预测期末市盈率",
    "label.futurePE.hint":
      "公司进入成熟期后，增速放缓，市盈率通常会从高位回落。参考行业均值。",
    "label.currentMarketCap": "当前总市值",
    "label.currentMarketCap.hint":
      "输入公司当前的总市值，快速检验当前市价是否合理。",
    "result.futureProfit": "预测期末年利润",
    "result.futureMarketCap": "预测期末总市值",
    "result.fairValue": "锚定合理估值",
    "result.fairValue.desc": "在此价格买入，如果未来发展如你所料，长期年化回报率将正好达到目标",
    "result.goodPrice": "理想买入价格",
    "result.goodPrice.desc": "增加了30%的安全边际，能更好地抵御预测不准确的风险",
    "result.expensivePrice": "注意昂贵价格",
    "result.expensivePrice.desc": "价格高于此区域，很可能无法实现期望的回报率",
    "result.currentReturn": "预期长期年化回报率",
    "result.verdict.cheap": "理想买入区间",
    "result.verdict.fair": "合理估值区间",
    "result.verdict.expensive": "略显昂贵",
    "result.verdict.veryExpensive": "价格昂贵",
    "chart.title": "估值对比",
    "chart.goodPrice": "理想买入价",
    "chart.fairValue": "合理估值",
    "chart.expensivePrice": "昂贵价格",
    "chart.currentPrice": "当前市价",
    "disclaimer.title": "请注意",
    "disclaimer.text":
      "本工具是一个思维辅助工具，而不是一个答案生成器。其输出结果的可靠性，完全取决于你输入参数的质量。它最大的价值，是迫使你深入思考一家公司的未来成长性和内在价值，并为你提供一个理性的决策框架，而非精准预测股价。",
    "footer.text": "价值投资者思维工具 — 基于 DCF 估值框架的辅助决策工具",
    "header.locale": "语言",
    "header.theme": "主题",
    "unit.billion": "亿元",
    "unit.year": "年",
    "unit.times": "倍",
    "unit.percent": "%",
  },
  en: {
    "app.title": "Guigu",
    "app.subtitle": "Value Investing Tools",
    "app.description":
      "Calculate intrinsic value, ideal buy price, and expected returns based on your return target, growth assumptions, and future valuation multiples. Make rational investment decisions.",
    "app.disclaimer":
      "This tool is for educational purposes only and does not constitute investment advice. Investing involves risk. Make decisions carefully.",
    "section.target": "Set Your Investment Benchmark",
    "section.target.desc":
      'Define your return target — this determines how "demanding" you will be on price',
    "section.company": "Picture the Company's Present & Future",
    "section.company.desc":
      "The heart of this tool. The quality of your inputs determines the value of the output.",
    "section.result": "Your Fair Price Range",
    "section.result.desc":
      "Based on your projections, here is a rational decision-making framework",
    "label.expectedReturn": "Target Annual Return",
    "label.expectedReturn.hint":
      "Conservative investors: 8-10%. Aggressive investors: 15% or higher. This is your hurdle rate.",
    "label.currentProfit": "Current Annual Net Profit",
    "label.years": "Projection Period",
    "label.years.hint":
      "Typically 3-5 years. Longer periods introduce more uncertainty.",
    "label.growthRate": "Annual Profit Growth Rate",
    "label.growthRate.hint":
      "Based on the company's moat, industry outlook, and expansion plans. This is the most critical assumption.",
    "label.futurePE": "Future P/E Ratio",
    "label.futurePE.hint":
      "As companies mature and growth slows, P/E ratios typically contract. Use industry averages as reference.",
    "label.currentMarketCap": "Current Market Cap",
    "label.currentMarketCap.hint":
      "Enter the current market cap to quickly check if the current price is reasonable.",
    "result.futureProfit": "Future Annual Profit",
    "result.futureMarketCap": "Future Market Cap",
    "result.fairValue": "Fair Value",
    "result.fairValue.desc": "Buying at this price would deliver exactly your target annual return, if projections hold",
    "result.goodPrice": "Ideal Buy Price",
    "result.goodPrice.desc": "Includes a 30% margin of safety to protect against projection errors",
    "result.expensivePrice": "Too Expensive Above",
    "result.expensivePrice.desc": "Above this price, achieving your target return becomes unlikely",
    "result.currentReturn": "Expected Annual Return",
    "result.verdict.cheap": "Ideal Buy Zone",
    "result.verdict.fair": "Fair Value Zone",
    "result.verdict.expensive": "Slightly Expensive",
    "result.verdict.veryExpensive": "Overvalued",
    "chart.title": "Valuation Comparison",
    "chart.goodPrice": "Ideal Buy Price",
    "chart.fairValue": "Fair Value",
    "chart.expensivePrice": "Expensive Price",
    "chart.currentPrice": "Current Market Cap",
    "disclaimer.title": "Important Note",
    "disclaimer.text":
      "This is a thinking tool, not an answer generator. The reliability of the output depends entirely on the quality of your inputs. Its greatest value is forcing you to think deeply about a company's growth potential and intrinsic value, providing a rational decision-making framework — not a precise price prediction.",
    "footer.text":
      "Value Investing Calculator — A DCF-based decision support tool",
    "header.locale": "Language",
    "header.theme": "Theme",
    "unit.billion": "B Yuan",
    "unit.year": "Years",
    "unit.times": "×",
    "unit.percent": "%",
  },
}