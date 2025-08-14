"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"
import { newsService } from "@/lib/api/news"
import type { News } from "@/lib/supabase"
import { formatDateForDisplay } from "@/lib/utils"

const categories = [
  "All",
  "Church Development",
  "Events",
  "Youth Ministry",
  "Celebrations",
  "Community Service",
  "Education",
  "Liturgical",
]

const ITEMS_PER_PAGE = 6

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [news, setNews] = useState<News[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setIsLoading(true)
      const newsData = await newsService.getPublished()
      setNews(newsData)
    } catch (error) {
      console.error("Error loading news:", error)
      setError("Failed to load news")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter articles based on selected category
  const filteredArticles =
    selectedCategory === "All" ? news : news.filter((article) => article.category === selectedCategory)

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentArticles = filteredArticles.slice(startIndex, endIndex)

  // Reset to page 1 when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of news section
    document.getElementById("news-section")?.scrollIntoView({ behavior: "smooth" })
  }

  const formatDate = (dateString: string) => {
    return formatDateForDisplay(dateString)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f4ef]">
      {/* Header */}
    

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#a67c52] py-16 md:py-24">
          {/* World map overlay */}
          <div className="absolute right-0 top-0 h-full w-full ">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/White-Map-PNG-Image-hZqmVoHdEEN72oz25Yvq0gbNnHBJ7J.png"
              alt=""
              fill
              className="object-cover object-center"
              style={{ mixBlendMode: "overlay" }}
            />
          </div>

          <div className="container relative z-10 mx-auto px-4 md:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 flex items-center justify-center gap-4">
                <span className="inline-block h-px w-12 bg-white/60" />
                <span className="text-sm font-medium tracking-wide text-white/90">Church News</span>
                <span className="inline-block h-px w-12 bg-white/60" />
              </div>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                Latest News & Updates
              </h1>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90">
                Stay informed about the latest happenings, announcements, and developments in our church community.
                Discover stories of faith, fellowship, and service that inspire our congregation.
              </p>
            </div>
          </div>
        </section>

        {/* News Runner */}
        <section className="bg-black py-4 overflow-hidden">
          <div className="flex items-center">
            {/* Breaking News Badge */}
            <div className="flex-shrink-0 bg-red-600 text-white px-4 py-3 font-bold text-base md:text-lg tracking-wide">
              BREAKING NEWS
            </div>

            {/* Running News Ticker */}
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee-mobile md:animate-marquee whitespace-nowrap text-white font-bold text-base md:text-lg py-3">
                {news.length > 0 ? (
                  news
                    .filter((article) => article.status === "published")
                    .slice(0, 5) // Show only latest 5 news items
                    .map((article, index) => (
                      <span key={article.id} className="inline-block">
                        <span className="mx-8"> </span>
                        <span className="hover:text-gray-300 transition-colors duration-200">{article.title}</span>
                        {index < Math.min(4, news.filter((n) => n.status === "published").length - 1) && (
                          <span className="mx-8">•</span>
                        )}
                      </span>
                    ))
                ) : (
                  <span className="mx-8">
                    • Welcome to St. Thomas Malankara Catholic Church News • Stay updated with our latest announcements
                    •
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section id="news-section" className="bg-white py-16">
          <div className="container mx-auto px-4 md:px-8">
            <div className="mb-12 text-center">
              <div className="mb-6 flex items-center justify-center gap-4">
                <span className="inline-block h-px w-12 bg-[#A67C52]" />
                <span className="text-sm font-medium tracking-wide text-[#A67C52]">Latest Updates</span>
                <span className="inline-block h-px w-12 bg-[#A67C52]" />
              </div>
              <h2 className="mb-6 text-3xl font-bold leading-tight text-gray-800 md:text-4xl">Church News</h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
                Explore the latest stories and updates from our vibrant church community.
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A67C52] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading news...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadNews} className="bg-[#A67C52] hover:bg-[#8B6F47] text-white">
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                {/* Category Filter */}
                <div className="mb-8 flex flex-wrap justify-center gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryChange(category)}
                      className={
                        selectedCategory === category
                          ? "bg-[#A67C52] text-white hover:bg-[#8B6F47]"
                          : "border-[#A67C52] text-[#A67C52] hover:bg-[#A67C52] hover:text-white"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* News Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
                  {currentArticles.map((article) => (
                    <Link key={article.id} href={`/news/${article.id}`}>
                      <div className="overflow-hidden rounded-[20px] bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                        <div className="relative h-48">
                          <Image
                            src={article.image_url || "/placeholder.svg?height=200&width=400"}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                          <span className="absolute left-4 top-4 rounded-full bg-[#A67C52] px-3 py-1 text-xs font-medium text-white">
                            {article.category}
                          </span>
                        </div>

                        <div className="p-6">
                          <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(article.published_at || article.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{article.author}</span>
                            </div>
                          </div>

                          <h3 className="mb-3 text-lg font-semibold text-gray-800 line-clamp-2 hover:text-[#A67C52] transition-colors duration-200">
                            {article.title}
                          </h3>

                          <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-3">
                            {article.description}
                          </p>

                          <Button
                            variant="ghost"
                            className="p-0 text-[#A67C52] hover:text-[#8B6F47] text-sm font-medium h-auto"
                          >
                            Read More →
                          </Button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-[#A67C52] text-[#A67C52] hover:bg-[#A67C52] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 ${
                            page === currentPage
                              ? "bg-[#A67C52] text-white hover:bg-[#8B6F47]"
                              : "border-[#A67C52] text-[#A67C52] hover:bg-[#A67C52] hover:text-white"
                          }`}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-[#A67C52] text-[#A67C52] hover:bg-[#A67C52] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* No results message */}
                {currentArticles.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">No news articles found for the selected category.</p>
                    <Button
                      onClick={() => handleCategoryChange("All")}
                      className="bg-[#A67C52] hover:bg-[#8B6F47] text-white"
                    >
                      View All News
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
         <section className="py-16 bg-gray-900 text-center relative overflow-hidden">
          <div className="absolute inset-0">
            <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-40 blur-sm">
              <source
                src="https://thomasbucket26.s3.us-east-2.amazonaws.com/5875505-uhd_3840_2160_24fps+(online-video-cutter.com).mov"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="container relative z-10">
            <h2 className="mb-6 text-2xl font-semibold text-white md:text-4xl">Join Our Community</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
              Be part of our growing church family and experience the joy of fellowship, spiritual growth, and service.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register">
                <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white px-6 py-2.5 text-sm font-medium tracking-wide rounded-sm">
                  REGISTER NOW
                </Button>
              </Link>
              <Button
                variant="outline"
                className="text-[#a67c52] border-white hover:bg-white/20 px-6 py-2.5 text-sm font-medium tracking-wide rounded-sm bg-transparent"
              >
                DONATE FUND
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
