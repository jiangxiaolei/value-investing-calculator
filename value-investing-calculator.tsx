"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calculator, TrendingUp, AlertTriangle } from "lucide-react"

export default function ValueInvestingCalculator() {
  const [expectedReturn, setExpectedReturn] = useState(15)
  const [currentProfit, setCurrentProfit] = useState(45)
  const [years, setYears] = useState(5)
  const [growthRate, setGrowthRate] = useState(20)
  const [futurePE, setFuturePE] = useState(25)
  const [currentMarketCap, setCurrentMarketCap] = useState(1876)

  const [results, setResults] = useState({
    futureProfit: 0,
    futureMarketCap: 0,
    fairValuation: 0,
    goodPrice: 0,
    expensivePrice: 0,
    currentReturnRate: 0,
  })

  const calculateResults = () => {
    // 计算未来利润
    const futureProfit = currentProfit * Math.pow(1 + growthRate / 100, years)

    // 计算未来市值
    const futureMarketCap = futureProfit * futurePE

    // 计算合理估值（现值）
    const fairValuation = futureMarketCap / Math.pow(1 + expectedReturn / 100, years)

    // 计算理想买入价格（30%安全边际）
    const goodPrice = fairValuation * 0.7

    // 计算昂贵价格阈值
    const expensivePrice = fairValuation * 1.22

    // 计算当前市价对应的回报率
    const currentReturnRate =
      currentMarketCap > 0 ? (Math.pow(futureMarketCap / currentMarketCap, 1 / years) - 1) * 100 : 0

    setResults({
      futureProfit: Math.round(futureProfit * 10) / 10,
      futureMarketCap: Math.round(futureMarketCap),
      fairValuation: Math.round(fairValuation),
      goodPrice: Math.round(goodPrice),
      expensivePrice: Math.round(expensivePrice),
      currentReturnRate: Math.round(currentReturnRate * 10) / 10,
    })
  }

  useEffect(() => {
    calculateResults()
  }, [expectedReturn, currentProfit, years, growthRate, futurePE, currentMarketCap])

  const getPriceStatus = () => {
    if (currentMarketCap <= results.goodPrice) {
      return { status: "理想买入价格", color: "text-green-600", bgColor: "bg-green-50" }
    } else if (currentMarketCap <= results.fairValuation) {
      return { status: "合理估值区间", color: "text-blue-600", bgColor: "bg-blue-50" }
    } else if (currentMarketCap <= results.expensivePrice) {
      return { status: "略显昂贵", color: "text-yellow-600", bgColor: "bg-yellow-50" }
    } else {
      return { status: "昂贵价格", color: "text-red-600", bgColor: "bg-red-50" }
    }
  }

  const priceStatus = getPriceStatus()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">价值投资者思维工具</h1>
        <p className="text-lg text-gray-600">未来回报倒推估值器</p>
      </div>

      {/* 第一部分：锚定投资标尺 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            锚定你的投资标尺
          </CardTitle>
          <CardDescription>明确你的投资目标，这个数字决定了你对价格的"苛刻"程度</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="expectedReturn">我期望的长期年化回报率是：</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="expectedReturn"
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-lg">%</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
              <strong>提示：</strong>保守投资者可设为8-10%，积极投资者可设为15%或更高。
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 第二部分：描绘公司现在与未来 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            描绘公司的现在与未来
          </CardTitle>
          <CardDescription>这是整个工具的"心脏"，输入的质量决定了输出的参考价值</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currentProfit">公司当前/今年的净利润是：</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="currentProfit"
                  type="number"
                  value={currentProfit}
                  onChange={(e) => setCurrentProfit(Number(e.target.value))}
                  className="w-24"
                />
                <span>亿元</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="years">预测年限：</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-20"
                />
                <span>年</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="growthRate">我预测未来 {years} 年内，公司利润的年均复合增长率为：</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="growthRate"
                    type="number"
                    value={growthRate}
                    onChange={(e) => setGrowthRate(Number(e.target.value))}
                    className="w-20"
                  />
                  <span>%</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                <strong>提示：</strong>这是对公司"成长性"的核心判断。请基于公司的护城河、行业空间、扩张计划等综合判断。
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="futurePE">在 {years} 年后，我认为市场会给予它一个市盈率为：</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="futurePE"
                    type="number"
                    value={futurePE}
                    onChange={(e) => setFuturePE(Number(e.target.value))}
                    className="w-20"
                  />
                  <span>倍</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                <strong>提示：</strong>这是对公司"永续价值"的判断。当公司进入成熟期，增速放缓，市盈率通常会从高位回落。
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 第三部分：获取合理价格范围 */}
      <Card>
        <CardHeader>
          <CardTitle>获取你的合理价格范围</CardTitle>
          <CardDescription>基于你的预测，为你计算出理性的投资决策框架</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 计算结果 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">基于您的预测，该公司{years}年后的价值将达到：</h4>
              <div className="space-y-2 pl-4">
                <div className="flex justify-between">
                  <span>预测期末年利润：</span>
                  <span className="font-semibold">{results.futureProfit} 亿元</span>
                </div>
                <div className="flex justify-between">
                  <span>预测期末总市值：</span>
                  <span className="font-semibold">{results.futureMarketCap} 亿元</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">为了实现您 {expectedReturn}% 的年化回报目标：</h4>
              <div className="space-y-3 pl-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800 font-medium">锚定合理估值：</span>
                    <span className="text-blue-900 font-bold text-lg">{results.fairValuation} 亿元</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    在此价格买入，如果未来发展如您所料，您的长期年化回报率将正好是{expectedReturn}%
                  </p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-green-800 font-medium">理想买入价格：</span>
                    <span className="text-green-900 font-bold text-lg">{results.goodPrice} 亿元</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">增加了30%的安全边际，能更好地抵御预测不准确的风险</p>
                </div>

                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-red-800 font-medium">注意昂贵价格：</span>
                    <span className="text-red-900 font-bold text-lg">
                      {">"} {results.expensivePrice} 亿元
                    </span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">价格高于此区域，很可能无法实现期望的回报率</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 互动模块 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">快速检验当前市价：</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="currentMarketCap">请输入该公司当前的总市值：</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="currentMarketCap"
                    type="number"
                    value={currentMarketCap}
                    onChange={(e) => setCurrentMarketCap(Number(e.target.value))}
                    className="w-32"
                  />
                  <span>亿元</span>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${priceStatus.bgColor}`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`h-4 w-4 ${priceStatus.color}`} />
                  <span className={`font-semibold ${priceStatus.color}`}>动态反馈</span>
                </div>
                <p className={`text-sm ${priceStatus.color}`}>
                  当前市值 <strong>{currentMarketCap}</strong> 亿元，处于"<strong>{priceStatus.status}</strong>"区间。
                  在此价格投资，假设您的其他预测不变，您的预期长期年化回报率大约为{" "}
                  <strong>{results.currentReturnRate}%</strong>。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 重要提示 */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-red-800">
              <p className="font-semibold mb-2">请注意：</p>
              <p className="text-sm leading-relaxed">
                本工具是一个思维辅助工具，而不是一个答案生成器。其输出结果的可靠性，完全取决于您输入参数的质量。
                它最大的价值，是迫使您深入思考一家公司的未来成长性和内在价值，并为您提供一个理性的决策框架，而非精准预测股价。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
