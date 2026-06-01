// pages/api/stock — Stock data proxy (East Money + Yahoo Finance)
export async function onRequest(context: EventContext) {
  const { request } = context
  const url = new URL(request.url)
  const code = url.searchParams.get("code")?.trim()
  const exchange = url.searchParams.get("exchange")?.trim().toLowerCase()

  if (!code || !exchange) {
    return new Response(JSON.stringify({ error: "Missing code or exchange" }), {
      status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    })
  }

  try {
    if (exchange === "us") {
      return await fetchUsStock(code.toUpperCase())
    }
    return await fetchCnStock(code, exchange)
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch stock data", message: String(err) }), {
      status: 502, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    })
  }
}

async function fetchCnStock(code: string, exchange: string) {
  let secid: string
  if (exchange === "sh") secid = `1.${code.padStart(6, "0")}`
  else if (exchange === "sz") secid = `0.${code.padStart(6, "0")}`
  else if (exchange === "hk") secid = `116.${code.padStart(5, "0")}`
  else return new Response(JSON.stringify({ error: "Invalid exchange" }), {
    status: 400, headers: { "Content-Type": "application/json" }
  })

  const emUrl = `https://push2.eastmoney.com/api/qt/stock/get?secid=${secid}&fields=f43,f57,f58,f107,f116,f117,f162,f164,f240,f236,f238,f191,f234,f251,f255,f358,f370&_=${Date.now()}`
  const emResponse = await fetch(emUrl, {
    headers: { "Referer": "https://finance.eastmoney.com/" }
  })

  if (!emResponse.ok) throw new Error(`East Money API error: ${emResponse.status}`)
  const data = await emResponse.json()
  if (!data.data) {
    return new Response(JSON.stringify({ error: "Stock not found", code, exchange }), {
      status: 404, headers: { "Content-Type": "application/json" }
    })
  }

  const d = data.data
  const result = {
    code: d.f57 || code, name: d.f58 || "", price: (d.f43 || 0) / 100,
    change: (d.f107 || 0) / 100,
    marketCap: d.f116 ? d.f116 / 100000000 : 0,
    floatMarketCap: d.f117 ? d.f117 / 100000000 : 0,
    pe: d.f162 ? d.f162 / 100 : null, pb: d.f164 ? d.f164 / 100 : null,
    roe: d.f240 ? d.f240 / 100 : null,
    grossMargin: d.f236 ? d.f236 / 100 : null,
    debtRatio: d.f238 ? d.f238 / 100 : null,
    eps: d.f191 ? d.f191 / 100 : null,
    nav: d.f234 ? d.f234 / 100 : null,
    netProfit: d.f251 ? d.f251 / 10000 : 0,
    revenue: d.f255 ? d.f255 / 10000 : 0,
    dividendYield: d.f358 ? d.f358 / 100 : null,
    fcf: d.f370 ? d.f370 / 100000000 : null,
  }

  return new Response(JSON.stringify({ data: result }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  })
}

async function fetchUsStock(symbol: string) {
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5y`
  const res = await fetch(yahooUrl, {
    headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" }
  })
  const json = await res.json()
  const result = json?.chart?.result?.[0]

  if (!result) {
    return new Response(JSON.stringify({ error: "US stock not found", code: symbol }), {
      status: 404, headers: { "Content-Type": "application/json" }
    })
  }

  const meta = result.meta
  return new Response(JSON.stringify({
    data: {
      code: meta.symbol, name: meta.shortName || meta.symbol || symbol,
      price: meta.regularMarketPrice || 0, change: meta.regularMarketChange || 0,
      marketCap: meta.marketCap || 0, pe: null, pb: null, roe: null,
      grossMargin: null, debtRatio: null, eps: meta.epsTrailingTwwelveMonths || null,
    }
  }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } })
}
