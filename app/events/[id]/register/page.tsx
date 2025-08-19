"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { eventsService } from "@/lib/api/events"
import type { Event } from "@/lib/supabase"

export default function EventRegistration({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadEvent()
  }, [params.id])

  const loadEvent = async () => {
    try {
      setIsLoading(true)
      const eventData = await eventsService.getById(Number.parseInt(params.id))
      if (eventData) {
        setEvent(eventData)
      } else {
        setError("Event not found")
      }
    } catch (error) {
      console.error("Error loading event:", error)
      setError("Failed to load event")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event?.registration_form?.enabled) return

    setIsSubmitting(true)

    try {
      // Validate required fields
      const requiredFields = event.registration_form.fields.filter((field) => field.required)
      const missingFields = requiredFields.filter((field) => !formData[field.id]?.trim())

      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.map((f) => f.label).join(", ")}`)
        setIsSubmitting(false)
        return
      }

      await eventsService.registerForEvent({
        event_id: event.id,
        registration_data: formData,
      })

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting registration:", error)
      alert("Failed to submit registration. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f4ef] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A67C52] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#f8f4ef] flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The event you're looking for doesn't exist."}</p>
            <Link href="/events">
              <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white">View All Events</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!event.registration_form?.enabled) {
    return (
      <div className="min-h-screen bg-[#f8f4ef] flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Not Available</h2>
            <p className="text-gray-600 mb-6">This event does not require registration.</p>
            <Link href="/events">
              <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white">View All Events</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f8f4ef] flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for registering for <strong>{event.title}</strong>. We'll contact you with more details soon.
            </p>
            <div className="space-y-2">
              <Link href="/events">
                <Button className="w-full bg-[#A67C52] hover:bg-[#8B6F47] text-white">View All Events</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f4ef]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <Link href="/events" className="flex items-center gap-2 text-[#8B6F47] hover:text-[#A67C52]">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Events</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Event Details */}
            <div>
              <Card>
                <CardHeader>
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={event.image_url || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardTitle className="text-2xl">{event.title}</CardTitle>
                  <CardDescription>
                  <div 
                       className="rich-text-content text-gray-600 leading-relaxed"
                       dangerouslySetInnerHTML={{ __html: event.description || '' }}
                     />
                    
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-[#A67C52]" />
                      <span className="text-sm">{(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-[#A67C52]" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-[#A67C52]" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4 text-[#A67C52]" />
                      <span className="text-sm">{event.attendees}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registration Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Event Registration</CardTitle>
                  <CardDescription>Please fill out the form below to register for this event</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {event.registration_form.fields.map((field) => (
                      <div key={field.id}>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                          type={field.type}
                          value={formData[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:border-transparent"
                          required={field.required}
                        />
                      </div>
                    ))}

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#A67C52] hover:bg-[#8B6F47] text-white"
                      >
                        {isSubmitting ? "Registering..." : "Register for Event"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
