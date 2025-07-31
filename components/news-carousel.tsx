"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import type { News } from "@/lib/supabase"

interface NewsCarouselProps {
  news: News[]
}

export function NewsCarousel({ news = [] }: NewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextSlide = () => {
    if (news.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, news.length - itemsPerView + 1))
    }
  }

  const prevSlide = () => {
    if (news.length > 0) {
      setCurrentIndex(
        (prev) =>
          (prev - 1 + Math.max(1, news.length - itemsPerView + 1)) % Math.max(1, news.length - itemsPerView + 1),
      )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!news || news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">No news articles available at the moment.</p>
        <p className="text-gray-400">Check back soon for updates!</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      {news.length > itemsPerView && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
            onClick={prevSlide}
            aria-label="Previous news"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
            onClick={nextSlide}
            aria-label="Next news"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Carousel Container */}
      <div className="overflow-hidden mx-8">
        <motion.div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {news.map((article, index) => (
            <motion.div
              key={article.id}
              className={`flex-shrink-0 px-4 ${itemsPerView === 1 ? "w-full" : itemsPerView === 2 ? "w-1/2" : "w-1/3"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={article.image_url || "/placeholder.svg?height=200&width=400"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="mb-2">
                    <span className="text-xs text-[#A67C52] font-medium uppercase tracking-wide">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {article.published_at ? formatDate(article.published_at) : formatDate(article.created_at)}
                    </span>
                    <Link href={`/news/${article.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#A67C52] border-[#A67C52] hover:bg-[#A67C52] hover:text-white bg-transparent"
                      >
                        Read More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Dots Indicator */}
      {news.length > itemsPerView && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.max(1, news.length - itemsPerView + 1) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex ? "bg-[#A67C52]" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
