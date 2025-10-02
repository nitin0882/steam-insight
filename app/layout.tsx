import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { FloatingSteamAwards } from "@/components/floating-steam-awards"
import { MenuProvider } from "@/components/menu-context"
import { PageTransition } from "@/components/page-transition"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://steaminsight.vercel.app/'),
  title: {
    default: "SteamInsight - Discover & Review Steam Games",
    template: "%s"
  },
  description:
    "The ultimate platform for Steam game reviews and discovery. Find your next favorite game with authentic community reviews, detailed analysis, and price tracking.",
  keywords: [
    "steam games",
    "game reviews",
    "pc gaming",
    "game discovery",
    "steam reviews",
    "game ratings",
    "indie games",
    "gaming community",
    "game prices",
    "steam store"
  ],
  authors: [{ name: "SteamInsight Team", url: "https://steaminsight.vercel.app/" }],
  creator: "SteamInsight",
  publisher: "SteamInsight",
  category: "Gaming",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://steaminsight.vercel.app/",
    title: "SteamInsight - Discover & Review Steam Games",
    description: "The ultimate platform for Steam game reviews and discovery. Find your next favorite game with authentic community reviews.",
    siteName: "SteamInsight",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SteamInsight - Game Reviews & Discovery Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SteamInsight - Discover & Review Steam Games",
    description: "The ultimate platform for Steam game reviews and discovery.",
    creator: "@SteamInsight",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://steaminsight.vercel.app/",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#06b6d4" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SteamInsight" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`font-sans ${inter.variable} antialiased`}>
        <MenuProvider>
          <div className="flex min-h-screen">

            <div className="flex-1 flex flex-col">
              <AppHeader />
              <PageTransition>
                <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
              </PageTransition>
              <AppFooter />
            </div>
          </div>
          <FloatingSteamAwards />
          <PerformanceMonitor />
          <Analytics />
        </MenuProvider>
      </body>
    </html>
  )
}
