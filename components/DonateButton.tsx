"use client"

import { useState, useCallback } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { useLocale } from "@/lib/i18n/i18n-context"

const USDT_ADDRESS = "TWA9CT2t2oWZexVKWmgfCQKBoj5N6LNFd4"
const PRESETS = [
  { usdt: 1, label: "☕ 1", sub: "≈ $1" },
  { usdt: 3, label: "☕☕☕ 3", sub: "≈ $3" },
  { usdt: 5, label: "☕☕☕☕☕ 5", sub: "≈ $5" },
]

export default function DonateButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(PRESETS[0])
  const { locale } = useLocale()
  const isZh = locale === "zh-CN"

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(USDT_ADDRESS)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = USDT_ADDRESS
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-2xl group"
        aria-label={isZh ? "支持我们" : "Support us"}
      >
        <span className="group-hover:scale-110 transition-transform duration-200">☕</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false)
          }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-sm w-full p-8 relative">
            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <div className="text-center mb-6">
              <span className="text-4xl block mb-3">☕</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {isZh ? "请我们喝杯咖啡" : "Buy us a coffee"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isZh ? "支持归估值，让我们做出更多好工具！" : "Support 归估值 — keep the tools coming!"}
              </p>
            </div>

            {/* Preset Amounts */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.usdt}
                  onClick={() => setSelectedAmount(preset)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    selectedAmount.usdt === preset.usdt
                      ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700"
                  }`}
                >
                  <div className="text-xs">{preset.label}</div>
                  <div className={`text-[11px] mt-0.5 ${selectedAmount.usdt === preset.usdt ? "text-amber-200" : "text-gray-400 dark:text-gray-500"}`}>
                    {preset.sub}
                  </div>
                </button>
              ))}
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-3">
              <div className="bg-white p-3 rounded-xl border border-gray-200 dark:border-gray-700 inline-block shadow-sm">
                <QRCodeCanvas
                  value={`usdt:${USDT_ADDRESS}?network=TRC20`}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#B8860B"
                  level="M"
                  includeMargin
                />
              </div>
            </div>

            {/* Steps */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-3 mb-4 text-center">
              {isZh ? (
                <>
                  <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                    扫码 → 输入 <span className="font-bold">{selectedAmount.usdt}</span> USDT → 发送
                  </p>
                  <p className="text-xs text-amber-600/70 dark:text-amber-400/60 mt-0.5">
                    就三步，10秒搞定
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                    Scan → Enter <span className="font-bold">{selectedAmount.usdt}</span> USDT → Send
                  </p>
                  <p className="text-xs text-amber-600/70 dark:text-amber-400/60 mt-0.5">
                    Just 3 steps, done in 10 seconds
                  </p>
                </>
              )}
            </div>

            {/* Network Badge */}
            <div className="text-center mb-4">
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                USDT (TRC20)
              </span>
            </div>

            {/* Address */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 text-center">
                {isZh ? "钱包地址" : "Wallet Address"}
              </div>
              <div className="text-sm font-mono text-gray-900 dark:text-white break-all text-center leading-relaxed select-all">
                {USDT_ADDRESS}
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                copied
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                  : "bg-amber-600 text-white hover:bg-amber-700 shadow-sm"
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isZh ? "已复制 ✓" : "Copied! ✓"}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {isZh ? "复制地址" : "Copy Address"}
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
              {isZh ? "用 OKX / Trust Wallet 等 TRC20 钱包扫码" : "Scan with OKX / Trust Wallet / any TRC20 wallet"}
            </p>
          </div>
        </div>
      )}
    </>
  )
}