import type { Metadata } from "next"
import { siteMetadata } from "@/lib/metadata"
import { AppProviders } from "@/components/providers/app-providers"
import { StructuredData } from "./structured-data"
import "./globals.css"

export const metadata: Metadata = siteMetadata

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* TODO: Replace with your Plausible analytics domain after setup */}
        {/* <script defer data-domain="value.chengyi.chat" src="https://plausible.io/js/script.js"></script> */}
        <StructuredData />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}