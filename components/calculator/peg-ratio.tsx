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

export function PEGRatioCalculator() {
  const [pe, setPe] = useState(20)
  const [growthRate, setGrowthRate] = useState(15)

  const peg = growthRate > 0 ? pe / growthRate : Infinity

  function getPEGVerdict(pegValue: number): { label: string; color: string; description: string } {
    if (pegValue <= 0.5) return { label: "极度低估", color: "text-green-600", description: "PEG < 0.5，市场严重低估了增长率" }
    if (pegValue <= 0.8) return { label: "低估", color: "text-green-500", description: "PEG < 0.8，股价低于其增长潜力" }
    if (pegValue <= 1.2) return { label: "合理", color: "text-yellow-500", description: "PEG ≈ 1，股价与增长预期基本匹配" }
    if (pegValue <= 2.0) return { label: "偏高", color: "text-orange-500", description: "PEG > 1.2，市场对增长预期较高" }
    return { label: "高估", color: "text-red-500", description: "PEG > 2，增长预期已被充分定价" }
  }

  const verdict = getPEGVerdict(peg)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">PEG 估值</h1>
        <p className="text-muted-foreground">市盈率相对盈利增长比率 — Price/Earnings to Growth Ratio</p>
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
                      <p className="text-xs max-w-xs">公司当前市盈率（动态或静态均可）</p>
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

          {/* Growth Rate Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label>盈利增速 (%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">预期未来3-5年的年化净利润增长率</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                value={growthRate}
                onChange={(e) => setGrowthRate(Number(e.target.value) || 0)}
                className="w-24 text-right"
                min={0}
                max={100}
              />
            </div>
            <Slider value={[growthRate]} onValueChange={([v]) => setGrowthRate(v)} min={0} max={100} step={0.5} />
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      <Card className={`border-2 ${verdict.color.includes('green') ? 'border-green-200 dark:border-green-800' : verdict.color.includes('red') ? 'border-red-200 dark:border-red-800' : 'border-yellow-200 dark:border-yellow-800'}`}>
        <CardContent className="pt-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">PEG 比率</p>
          <p className={`text-5xl font-bold tabular-nums ${verdict.color}`}>
            {peg === Infinity ? "∞" : peg.toFixed(2)}
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
          <p className="pt-2 text-xs">注：PEG 由彼得·林奇推广，适用于增长型企业。负盈利或无增长预期时 PEG 参考价值有限。</p>
        </CardContent>
      </Card>
    </div>
  )
}