/**
 * 归估值 - 股票数据代理 Worker
 * 将东方财富 API 转为带 CORS 头的 JSON，绕过浏览器跨域限制
 * 
 * 使用方式:
 *   GET /?code=000001&exchange=sz   (A股深圳)
 *   GET /?code=600519&exchange=sh  (A股上海)
 *   GET /?code=00700&exchange=hk   (港股)
 *   GET /?code=AAPL&exchange=us    (美股)
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
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type')
  headers.set('Access-Control-Max-Age', '86400')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const exchange = url.searchParams.get('exchange') || 'sz'

  if (!code) {
    return addCorsHeaders(new Response(
      JSON.stringify({ error: 'Missing code parameter' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    ))
  }

  // A股: exchange = sh(上海) 或 sz(深圳)
  // 港股: exchange = hk
  // 美股: exchange = us
  let secid = ''
  let emExchange = ''

  if (exchange === 'sh') {
    secid = `1.${code.padStart(6, '0')}` // 上海 = 1
  } else if (exchange === 'sz') {
    secid = `0.${code.padStart(6, '0')}` // 深圳 = 0
  } else if (exchange === 'hk') {
    // 港股: 0.代码 (东方财富格式)
    secid = `116.${code.padStart(5, '0')}`
  } else if (exchange === 'us') {
    // 美股使用 Yahoo Finance
    return handleUsStock(code)
  }

  const emUrl = `https://push2.eastmoney.com/api/qt/stock/get?secid=${secid}&fields=${EM_FIELDS}&_=${Date.now()}`

  try {
    const emResponse = await fetch(emUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://finance.eastmoney.com/',
      },
    })

    if (!emResponse.ok) {
      throw new Error(`East Money API error: ${emResponse.status}`)
    }

    const data = await emResponse.json()

    if (!data.data) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: 'Stock not found', code, exchange }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      ))
    }

    const d = data.data
    const result = {
      code: d.f57 || code,
      name: d.f58 || '',
      price: d.f43 / 100 || 0,
      change: d.f107 / 100 || 0,
      open: d.f44 / 100 || 0,
      yesterdayClose: d.f45 / 100 || 0,
      high: d.f46 / 100 || 0,
      low: d.f47 / 100 || 0,
      volume: d.f50 || 0,       // 成交量(股)
      amount: d.f51 || 0,      // 成交额(元)
      marketCap: d.f116 ? d.f116 / 100000000 : 0,  // 总市值(亿元)
      floatMarketCap: d.f117 ? d.f117 / 100000000 : 0, // 流通市值(亿元)
      pe: d.f162 ? d.f162 / 100 : null,
      peStatic: d.f163 ? d.f163 / 100 : null,
      pb: d.f164 ? d.f164 / 100 : null,
      ps: d.f167 ? d.f167 / 100 : null,
      pcf: d.f168 ? d.f168 / 100 : null,
      eps: d.f191 ? d.f191 / 100 : null,      // 每股收益
      nav: d.f234 ? d.f234 / 100 : null,      // 每股净资产
      grossMargin: d.f236 ? d.f236 / 100 : null,  // 毛利率
      netMargin: d.f237 ? d.f237 / 100 : null,   // 净利率
      debtRatio: d.f238 ? d.f238 / 100 : null,   // 资产负债率
      roe: d.f240 ? d.f240 / 100 : null,          // ROE
      netProfit: d.f251 ? d.f251 / 10000 : 0,    // 净利润(亿元)
      revenue: d.f255 ? d.f255 / 10000 : 0,      // 营业收入(亿元)
      dividendYield: d.f358 ? d.f358 / 100 : null, // 股息率
      fcf: d.f370 ? d.f370 / 100000000 : null,     // 自由现金流(亿元)
    }

    return addCorsHeaders(new Response(
      JSON.stringify({ data: result }),
      { headers: { 'Content-Type': 'application/json' } }
    ))

  } catch (err) {
    console.error('Worker error:', err)
    return addCorsHeaders(new Response(
      JSON.stringify({ error: 'Failed to fetch stock data', message: String(err) }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    ))
  }
}

async function handleUsStock(code: string): Promise<Response> {
  // 美股使用 Yahoo Finance chart API
  const symbol = code.toUpperCase()
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5y`

  try {
    const res = await fetch(yahooUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
    })
    const json = await res.json()
    const result = json?.chart?.result?.[0]

    if (!result) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: 'US stock not found', code }),
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
          eps: meta.epsTrailingTwelveMonths || null,
          // 52周高低
          fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || null,
          fiftyTwoWeekLow: meta.fiftyTwoWeekLow || null,
        }
      }),
      { headers: { 'Content-Type': 'application/json' } }
    ))
  } catch (err) {
    return addCorsHeaders(new Response(
      JSON.stringify({ error: 'Failed to fetch US stock', message: String(err) }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    ))
  }
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return addCorsHeaders(new Response(null, { status: 204 }))
    }
    return handleRequest(request)
  }
}
