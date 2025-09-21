"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Calendar, MapPin, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ImageModal } from "@/components/image-modal"
import { motion } from "framer-motion"
import { getEventById } from "@/lib/api/events"
import type { Event } from "@/lib/supabase"
import Link from "next/link"

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const eventData = await getEventById(eventId)
        setEvent(eventData)
      } catch (err) {
        setError("Failed to load event details")
        console.error("Error fetching event:", err)
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

  const formatEventDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatEventTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get the date to display (prefer event_date, fallback to date)
  const getEventDate = () => {
    if (!event) return ""
    return event.event_date || event.date || ""
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
            <Link href="/events">
              <Button className="bg-[#A67C52] hover:bg-[#8B6F47]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/events" className="inline-flex items-center text-[#A67C52] hover:text-[#8B6F47] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Event Header */}
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 bg-[#A67C52] text-white">
              {event.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {event.title}
            </h1>
          
          </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
             {/* Left Side - Full Size Image */}
             <div className="lg:col-span-1">
               <motion.div 
                 className="relative h-[400px] md:h-[500px] lg:h-[700px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                 onClick={() => setIsImageModalOpen(true)}
                 whileHover={{ scale: 1.02 }}
                 transition={{ duration: 0.2 }}
               >
                 <Image
                   src={event.image_url || "/placeholder.svg?height=700&width=600"}
                   alt={event.title}
                   fill
                   className="object-cover group-hover:scale-105 transition-transform duration-300"
                   priority
                 />
                 {/* Overlay with click hint */}
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                   <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                       <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                       </svg>
                     </div>
                   </div>
                 </div>
               </motion.div>
             </div>

             {/* Right Side - Description and Details */}
             <div className="lg:col-span-1">
               {/* Event Details */}
               <Card className="mb-8">
                 <CardHeader>
                   <CardTitle className="text-2xl text-gray-900">Event Details</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                   {/* Event Description */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                     <div 
                       className="rich-text-content text-gray-600 leading-relaxed"
                       dangerouslySetInnerHTML={{ __html: event.description || '' }}
                     />
                   </div>
                 </CardContent>
               </Card>

               {/* Event Information */}
               <Card>
                 <CardHeader>
                   <CardTitle className="text-xl text-gray-900">Event Information</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                   {/* Date & Time */}
                   {event.date && (
                   <div className="flex items-start gap-3">
                     <Calendar className="w-5 h-5 text-[#A67C52] mt-1 flex-shrink-0" />
                     <div>
                       <p className="font-medium text-gray-900">{formatEventDate(getEventDate())}</p>
                       <p className="text-sm text-gray-600">{formatEventTime(getEventDate())}</p>
                     </div>
                   </div>
                   )}
                   <Separator />

                   {/* Location */}
                   {event.location && (
                     <>
                       <div className="flex items-start gap-3">
                         <MapPin className="w-5 h-5 text-[#A67C52] mt-1 flex-shrink-0" />
                         <div>
                           <p className="font-medium text-gray-900">Location</p>
                           <p className="text-sm text-gray-600">{event.location}</p>
                         </div>
                       </div>
                       <Separator />
                     </>
                   )}

                   {/* Registration */}
                   {event.registration_form?.enabled ? (
                     <div className="pt-4">
                       <Link href={`/events/${event.id}/register`}>
                         <Button className="w-full bg-[#A67C52] hover:bg-[#8B6F47] text-white">
                           Register for Event
                         </Button>
                       </Link>
                     </div>
                   ) : event.external_link ? (
                     <div className="pt-4">
                       <a 
                         href={event.external_link} 
                         target="_blank" 
                         rel="noopener noreferrer"
                       >
                         <Button className="w-full bg-[#A67C52] hover:bg-[#8B6F47] text-white">
                           Register for Event
                         </Button>
                       </a>
                     </div>
                   ) : (
                     <div className="pt-4">
                       <p className="text-sm text-gray-600 text-center">
                         Registration is not required for this event
                       </p>
                     </div>
                   )}
                 </CardContent>
               </Card>
             </div>
           </div>
        </motion.div>
      </div>

      {/* Image Modal - Only render when event is loaded */}
      {event && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          imageUrl={event.image_url || "/placeholder.svg?height=700&width=600"}
          alt={event.title}
          title={event.title}
        />
      )}
    </div>
  )
}
