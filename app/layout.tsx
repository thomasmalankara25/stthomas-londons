"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          {!isAdminRoute && <Navigation />}
          <main className="flex-1">{children}</main>
          {!isAdminRoute && <Footer />}
        </div>
      </body>
    </html>
  )
}
