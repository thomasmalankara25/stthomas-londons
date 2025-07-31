import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"
import { ScrollToTop } from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "St. Thomas Malankara Catholic Church",
  description: "Welcome to St. Thomas Malankara Catholic Church - A community of faith, hope, and love.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <PageTransition>
            <main className="flex-1">{children}</main>
            <Footer />
          </PageTransition>
        </div>
      </body>
    </html>
  )
}
