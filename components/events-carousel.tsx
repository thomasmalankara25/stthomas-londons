"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cardHoverVariants, buttonVariants } from "@/lib/animations"
import type { Event } from "@/lib/supabase"

interface EventsCarouselProps {
  events: Event[]
}

export function EventsCarousel({ events }: EventsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1)
      } else {
        setItemsPerView(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const formatEventDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const maxIndex = Math.max(0, events.length - itemsPerView)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => Math.min(maxIndex, prevIndex + 1))
  }

  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < maxIndex

  return (
    <div className="relative w-full">
      {/* Navigation Arrows - Hidden on mobile */}
      {events.length > itemsPerView && (
        <>
          <motion.button
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className={`absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-200 flex items-center justify-center ${
              canGoPrevious ? "text-[#A67C52] hover:bg-[#A67C52] hover:text-white" : "text-gray-300 cursor-not-allowed"
            }`}
            whileHover={canGoPrevious ? { scale: 1.1 } : {}}
            whileTap={canGoPrevious ? { scale: 0.95 } : {}}
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </motion.button>

          <motion.button
            onClick={goToNext}
            disabled={!canGoNext}
            className={`absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-200 flex items-center justify-center ${
              canGoNext ? "text-[#A67C52] hover:bg-[#A67C52] hover:text-white" : "text-gray-300 cursor-not-allowed"
            }`}
            whileHover={canGoNext ? { scale: 1.1 } : {}}
            whileTap={canGoNext ? { scale: 0.95 } : {}}
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
          </motion.button>
        </>
      )}

      {/* Carousel Container */}
      <div className="overflow-hidden px-12 md:mx-12">
        <motion.div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              className={`flex-shrink-0 ${itemsPerView === 1 ? "w-full px-2" : "w-1/3 px-3"}`}
              variants={cardHoverVariants}
              whileHover="hover"
              initial="rest"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 h-full">
                <div className="relative h-48">
                  <Image
                    src={event.image_url || "/placeholder.svg?height=200&width=400"}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[#A67C52] px-3 py-1 text-xs font-medium text-white">
                    {event.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <Calendar className="h-4 w-4 text-[#A67C52]" />
                    <span className="text-sm">{(event.date)}</span>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>

                  {event.registration_form?.enabled ? (
                    <Link href={`/events/${event.id}/register`}>
                      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Button className="w-full bg-[#A67C52] hover:bg-[#8B6F47] text-white text-sm font-medium tracking-wide rounded-sm">
                          REGISTER NOW
                        </Button>
                      </motion.div>
                    </Link>
                  ) : (
                    <Link href={`/events`}>
                      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Button
                          variant="outline"
                          className="w-full border-[#A67C52] text-[#A67C52] hover:bg-[#A67C52] hover:text-white text-sm font-medium tracking-wide rounded-sm bg-transparent"
                        >
                          READ MORE
                        </Button>
                      </motion.div>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Dots Indicator - Always visible */}
      {events.length > itemsPerView && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex ? "bg-[#A67C52]" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
