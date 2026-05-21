import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '价值投资者思维工具 - 未来回报倒推估值器',
  description: '基于预期回报率、利润增长率和未来市盈率，计算公司的合理估值与理想买入价格',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
