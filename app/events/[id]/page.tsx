"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Calendar, MapPin, ArrowLeft, Share2, Facebook, X, Mail, Link2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const [copied, setCopied] = useState(false)

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

  const getEventUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href
    }
    return ""
  }

  const handleShare = (platform: string) => {
    const url = getEventUrl()
    const title = event?.title || "Event"
    const description = event?.description?.replace(/<[^>]*>/g, '').substring(0, 100) || ""

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        break
      case "X":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          "_blank"
        )
        break
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
          `Check out this event: ${title}\n\n${description}\n\n${url}`
        )}`
        break
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${url}`)}`,
          "_blank"
        )
        break
      case "copy":
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
        break
    }
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
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-4 bg-[#A67C52] text-white">
                  {event.category}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {event.title}
                </h1>
              </div>
              
              {/* Share Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0 border-[#A67C52] text-[#A67C52] hover:bg-[#A67C52] hover:text-white"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleShare("facebook")} className="cursor-pointer">
                    <Facebook className="w-4 h-4 mr-2" />
                    Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("twitter")} className="cursor-pointer">
                    <X className="w-4 h-4 mr-2" />
                    Share on X
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("whatsapp")} className="cursor-pointer">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Share on WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("email")} className="cursor-pointer">
                    <Mail className="w-4 h-4 mr-2" />
                    Share via Email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("copy")} className="cursor-pointer">
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-green-600">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 mr-2" />
                        Copy Link
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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

      {/* Image Modal - Only render when modal is open */}
      {isImageModalOpen && event && (
        <ImageModal
          onClose={() => setIsImageModalOpen(false)}
          imageUrl={event.image_url || "/placeholder.svg?height=700&width=600"}
          albumTitle={event.title}
        />
      )}
    </div>
  )
}
