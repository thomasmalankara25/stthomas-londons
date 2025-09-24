"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"
import { eventsService } from "@/lib/api/events"
import type { Event } from "@/lib/supabase"
import { formatDateForDisplay } from "@/lib/utils"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setIsLoading(true)
      const eventsData = await eventsService.getUpcoming()
      setEvents(eventsData)
    } catch (error) {
      console.error("Error loading events:", error)
      setError("Failed to load events")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return formatDateForDisplay(dateString)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f4ef]">
      {/* Header */}
    

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#a67c52] py-16 md:py-24">
          {/* People silhouette overlay */}
          <div className="absolute right-0 bottom-0 h-full w-full opacity-5">
            <Image
              src="https://www.pngmart.com/files/7/Abstract-Lines-PNG-Pic.png"
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
                <span className="text-sm font-medium tracking-wide text-white/90">Church Events</span>
                <span className="inline-block h-px w-12 bg-white/60" />
              </div>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                Upcoming Events
              </h1>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90">
                Join us for meaningful gatherings, spiritual opportunities, and community celebrations designed to
                strengthen our faith and fellowship.
              </p>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 md:px-8">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <div className="mb-6 flex items-center justify-center gap-4">
                <span className="inline-block h-px w-12 bg-[#A67C52]" />
                <span className="text-sm font-medium tracking-wide text-[#A67C52]">Coming Soon</span>
                <span className="inline-block h-px w-12 bg-[#A67C52]" />
              </div>
              <h2 className="mb-6 text-3xl font-bold leading-tight text-gray-800 md:text-4xl">Upcoming Events</h2>
              <p className="text-lg leading-relaxed text-gray-600">
                Mark your calendars and join us for these upcoming occasions. Each event is an opportunity to grow in
                faith, connect with others, and serve our community.
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A67C52] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading events...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadEvents} className="bg-[#A67C52] hover:bg-[#8B6F47] text-white">
                  Try Again
                </Button>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No upcoming events at the moment.</p>
                <p className="text-gray-400">Check back soon for new events!</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
                  >
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
                      <h3 className="mb-3 text-xl font-semibold text-gray-800">{event.title}</h3>

                      <div className="mb-4 space-y-2 text-gray-600">
                      {event.date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#A67C52]" />
                          <span className="text-sm">{(event.date || event.event_date)}</span>
                        </div>
                      )}
                      {event.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#A67C52]" />
                          <span className="text-sm">{event.time}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#A67C52]" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                      )}
                      {event.attendees && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#A67C52]" />
                          <span className="text-sm">{event.attendees}</span>
                        </div>
                      )}
                      </div>

                      <p className="mb-4 text-sm leading-relaxed line-clamp-4 text-gray-600">
                        <span 
                          className="rich-text-content"
                          dangerouslySetInnerHTML={{ __html: event.description || '' }}
                        />
                      </p>

                     
                         <Link href={`/events/${event.id}`}>
                          <Button className="w-full rounded-sm bg-[#A67C52] py-2 text-sm font-medium tracking-wide text-white hover:bg-[#8B6F47]">
                            KNOW MORE
                          </Button>
                        </Link>
                     
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
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
              {/* Donate Button - Temporarily Hidden */}
              {/* <Button
                variant="outline"
                className="text-[#a67c52] border-white hover:bg-white/20 px-6 py-2.5 text-sm font-medium tracking-wide rounded-sm bg-transparent"
              >
                DONATE FUND
              </Button> */}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
