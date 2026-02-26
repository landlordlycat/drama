import type { Metadata } from "next"

import { ThemeProvider } from "@/components/theme-provier"

import "@/styles/globals.css"

export const metadata: Metadata = {
  title: {
    default: "Drama - 精彩短剧在线观看",
    template: "%s | Drama",
  },
  description: "Drama 是一个优质的短剧观看平台，提供海量热门短剧、精选推荐、分类浏览，让您随时随地享受精彩内容。",
  keywords: ["短剧", "在线观看", "免费短剧", "热门短剧", "短剧推荐", "Drama"],
  authors: [{ name: "Drama Team" }],
  creator: "Drama",
  publisher: "Drama",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Drama",
    title: "Drama - 精彩短剧在线观看",
    description: "Drama 是一个优质的短剧观看平台，提供海量热门短剧、精选推荐、分类浏览，让您随时随地享受精彩内容。",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drama - 精彩短剧在线观看",
    description: "Drama 是一个优质的短剧观看平台，提供海量热门短剧、精选推荐、分类浏览。",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen max-w-300 mx-auto pb-16 md:pb-0">
            {modal}
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
