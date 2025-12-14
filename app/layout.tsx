import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShinX | Movie Recommendations",
  description:
    "Discover your next favorite movie with personalized recommendations, real-time reviews, and smart filtering powered by IMDb data.",
  keywords: ["movies", "recommendations", "IMDb", "film", "reviews", "ratings"],
  authors: [{ name: "ShinX" }],
  openGraph: {
    title: "ShinX | Movie Recommendations",
    description: "Discover your next favorite movie with personalized recommendations",
    type: "website",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a14" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider defaultTheme="dark" storageKey="shinx-theme">
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
