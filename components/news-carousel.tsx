"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { newsService } from "@/lib/api/news"
import type { News } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"

export function NewsCarousel() {
  const [news, setNews] = useState<News[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    loadNews()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(3)
      }
      setCurrentIndex(0) // Reset to first slide on resize
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const loadNews = async () => {
    try {
      setIsLoading(true)
      const data = await newsService.getPublished()
      setNews(data.slice(0, 9)) // Limit to 9 items for better performance
    } catch (error) {
      console.error("Error loading news:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const maxIndex = Math.max(0, news.length - itemsPerView)

  const goToNext = () => {
    if (isAnimating || currentIndex >= maxIndex) return
    setIsAnimating(true)
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const goToPrevious = () => {
    if (isAnimating || currentIndex <= 0) return
    setIsAnimating(true)
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return
    setIsAnimating(true)
    setCurrentIndex(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "Church News": "bg-blue-100 text-blue-800",
      Community: "bg-green-100 text-green-800",
      Events: "bg-purple-100 text-purple-800",
      Announcements: "bg-orange-100 text-orange-800",
      Spiritual: "bg-indigo-100 text-indigo-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A67C52]"></div>
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No news articles available at the moment.</p>
      </div>
    )
  }

  const totalSlides = Math.ceil(news.length / itemsPerView)

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      {news.length > itemsPerView && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevious}
            disabled={currentIndex === 0 || isAnimating}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full w-10 h-10 p-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNext}
            disabled={currentIndex >= maxIndex || isAnimating}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full w-10 h-10 p-0"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </>
      )}

      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div className="px-8 md:px-12 lg:px-16">
          <motion.div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
            }}
          >
            {news.map((article) => (
              <div
                key={article.id}
                className={`px-3 flex-shrink-0 ${
                  itemsPerView === 1 ? "w-full" : itemsPerView === 2 ? "w-1/2" : "w-1/3"
                }`}
              >
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.image_url || "/placeholder.svg?height=200&width=400"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>By {article.author}</span>
                          <span>{formatDate(article.created_at)}</span>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 leading-tight">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{article.description}</p>
                        <Link href={`/news/${article.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3 text-[#8B6F47] border-[#8B6F47] hover:bg-[#8B6F47] hover:text-white bg-transparent"
                          >
                            Read More
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Dot Indicators */}
      {news.length > itemsPerView && totalSlides > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-[#A67C52] w-6" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {news.length > itemsPerView && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-[#A67C52] h-1 rounded-full transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / totalSlides) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  )
}
