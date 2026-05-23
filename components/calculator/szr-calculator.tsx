"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function SZRCalculator() {
  const [pe, setPe] = useState(15)
  const [roe, setRoe] = useState(15)

  // 市赚率 = PE / (ROE * 100) ... wait, actually:
  // Standard SZR formula: PE / (ROE * 100) where ROE is in decimal
  // More commonly: pe / roe (where roe is percentage, e.g. 15 means 15%)
  // If ROE% = 15, PE = 15, then SZR = 15/15 = 1 (fairly valued)
  const szr = roe > 0 ? (pe / roe).toFixed(2) : "∞"

  function getSZRVerdict(value: number): { label: string; color: string; description: string } {
    if (value <= 0.5) return { label: "极度低估", color: "text-green-600", description: "价格远低于价值，安全边际充足" }
    if (value <= 0.8) return { label: "低估", color: "text-green-500", description: "具备一定的安全边际，值得关注" }
    if (value <= 1.2) return { label: "合理", color: "text-yellow-500", description: "价格与价值基本匹配" }
    if (value <= 2.0) return { label: "偏高", color: "text-orange-500", description: "溢价偏高，需谨慎介入" }
    return { label: "高估", color: "text-red-500", description: "价格显著高于价值，风险较大" }
  }

  const numSZR = typeof szr === "string" ? Infinity : Number(szr)
  const verdict = getSZRVerdict(numSZR)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">市赚率 (SZR)</h1>
        <p className="text-muted-foreground">市盈率 / 净资产收益率 — 衡量价格与价值的匹配度</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* PE Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label>市盈率 (PE)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">公司当前市盈率，取自行情数据或财报</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                value={pe}
                onChange={(e) => setPe(Number(e.target.value) || 0)}
                className="w-24 text-right"
                min={1}
                max={200}
              />
            </div>
            <Slider value={[pe]} onValueChange={([v]) => setPe(v)} min={1} max={200} step={0.5} />
          </div>

          {/* ROE Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label>净资产收益率 ROE (%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">最近年报的 ROE（净资产收益率），通常在 5%-30% 之间</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                value={roe}
                onChange={(e) => setRoe(Number(e.target.value) || 0)}
                className="w-24 text-right"
                min={0}
                max={60}
              />
            </div>
            <Slider value={[roe]} onValueChange={([v]) => setRoe(v)} min={0} max={60} step={0.5} />
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      <Card className={`border-2 ${
        verdict.color.includes('green') ? 'border-green-200 dark:border-green-800' 
        : verdict.color.includes('red') ? 'border-red-200 dark:border-red-800' 
        : verdict.color.includes('orange') ? 'border-orange-200 dark:border-orange-800'
        : 'border-yellow-200 dark:border-yellow-800'
      }`}>
        <CardContent className="pt-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">市赚率 (SZR)</p>
          <p className={`text-5xl font-bold tabular-nums ${verdict.color}`}>
            {szr}
          </p>
          <p className={`text-lg font-semibold ${verdict.color}`}>{verdict.label}</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{verdict.description}</p>
        </CardContent>
      </Card>

      {/* Reference */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6 space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">参考标准</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 shrink-0" /> &lt; 0.5 极度低估</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-400 shrink-0" /> 0.5-0.8 低估</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-400 shrink-0" /> 0.8-1.2 合理</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-400 shrink-0" /> 1.2-2.0 偏高</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400 shrink-0" /> &gt; 2.0 高估</div>
          </div>
          <p className="pt-2 text-xs">
            公式：市赚率 = PE / ROE（ROE 取百分比值，如 15% 则输入 15）<br />
            SZR = 1 为合理估值，低于 0.8 进入低估区间，高于 1.2 偏高。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}