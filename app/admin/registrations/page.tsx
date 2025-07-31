"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Users, Download, Eye, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { eventsService } from "@/lib/api/events"
import { authService } from "@/lib/auth"
import type { Event, EventRegistration } from "@/lib/supabase"

interface EventWithRegistrations extends Event {
  registrations: EventRegistration[]
  registrationCount: number
}

export default function RegistrationsPage() {
  const [eventsWithRegistrations, setEventsWithRegistrations] = useState<EventWithRegistrations[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EventWithRegistrations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "draft">("all")

  useEffect(() => {
    loadRegistrations()
  }, [])

  const loadRegistrations = async () => {
    try {
      setIsLoading(true)
      const events = await eventsService.getAll()

      // Load registrations for each event
      const eventsWithRegs = await Promise.all(
        events.map(async (event) => {
          const registrations = await eventsService.getEventRegistrations(event.id)
          return {
            ...event,
            registrations,
            registrationCount: registrations.length,
          }
        }),
      )

      setEventsWithRegistrations(eventsWithRegs)
    } catch (error) {
      console.error("Error loading registrations:", error)
      setError("Failed to load registrations")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await authService.logout()
    window.location.href = "/admin/login"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatEventDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const exportRegistrations = (event: EventWithRegistrations) => {
    if (!event.registration_form?.fields || event.registrations.length === 0) {
      alert("No registration data to export")
      return
    }

    // Create CSV content
    const headers = event.registration_form.fields.map((field) => field.label)
    const csvHeaders = ["Registration Date", ...headers].join(",")

    const csvRows = event.registrations.map((registration) => {
      const registrationDate = formatDate(registration.created_at)
      const values = event.registration_form!.fields.map((field) => registration.registration_data[field.id] || "")
      return [registrationDate, ...values].map((value) => `"${value}"`).join(",")
    })

    const csvContent = [csvHeaders, ...csvRows].join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${event.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_registrations.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const filteredEvents = eventsWithRegistrations.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || event.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalRegistrations = eventsWithRegistrations.reduce((sum, event) => sum + event.registrationCount, 0)
  const eventsWithRegistrationsCount = eventsWithRegistrations.filter((event) => event.registrationCount > 0).length

  if (isLoading) {
    return (
      <AdminAuthGuard>
        <div className="min-h-screen bg-[#f8f4ef] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A67C52] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading registrations...</p>
          </div>
        </div>
      </AdminAuthGuard>
    )
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#f8f4ef]">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2 text-[#8B6F47] hover:text-[#A67C52]">
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back to Admin</span>
              </Link>
              <div className="flex items-center gap-3">
                <Image
                  src="/images/malankara-logo.png"
                  alt="Malankara Catholic Church Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <div className="flex flex-col">
                  <div className="text-sm font-bold text-[#8B6F47] tracking-wider">St. Thomas Malankara</div>
                  <div className="text-xs text-[#8B6F47] tracking-[0.2em] font-medium">REGISTRATIONS</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="outline"
                  className="text-[#8B6F47] border-[#8B6F47] hover:bg-[#8B6F47] hover:text-white"
                >
                  View Website
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
              >
                Logout
              </Button>
              <div className="w-8 h-8 bg-[#A67C52] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {authService.getCurrentUser()?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Event Registrations</h1>
            <p className="text-gray-600">View and manage event registrations</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
              <Button onClick={loadRegistrations} variant="outline" size="sm" className="ml-4">
                Retry
              </Button>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                <Users className="h-4 w-4 text-[#A67C52]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRegistrations}</div>
                <p className="text-xs text-muted-foreground">Across all events</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Events with Registrations</CardTitle>
                <Calendar className="h-4 w-4 text-[#A67C52]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{eventsWithRegistrationsCount}</div>
                <p className="text-xs text-muted-foreground">Out of {eventsWithRegistrations.length} total events</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average per Event</CardTitle>
                <div className="h-4 w-4 text-[#A67C52]">📊</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {eventsWithRegistrationsCount > 0 ? Math.round(totalRegistrations / eventsWithRegistrationsCount) : 0}
                </div>
                <p className="text-xs text-muted-foreground">Registrations per event</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | "upcoming" | "draft")}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Events List */}
          <div className="grid gap-6">
            {filteredEvents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    {searchTerm || filterStatus !== "all"
                      ? "No events match your search criteria."
                      : "No events with registrations found."}
                  </p>
                  {(searchTerm || filterStatus !== "all") && (
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setFilterStatus("all")
                      }}
                      variant="outline"
                    >
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                          <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>{event.status}</Badge>
                          {event.registrationCount > 0 && (
                            <Badge className="bg-green-100 text-green-800">
                              {event.registrationCount} registrations
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="mb-3">{event.description}</CardDescription>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatEventDate(event.date)} • {event.time}
                            </span>
                          </div>
                          <span>📍 {event.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.registrationCount > 0 && (
                          <Button
                            onClick={() => exportRegistrations(event)}
                            variant="outline"
                            size="sm"
                            className="text-[#A67C52] border-[#A67C52] hover:bg-[#A67C52] hover:text-white"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                          </Button>
                        )}
                        <Button
                          onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {selectedEvent?.id === event.id ? "Hide" : "View"} Details
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {selectedEvent?.id === event.id && (
                    <CardContent className="border-t bg-gray-50">
                      {event.registrationCount === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No registrations for this event yet.</p>
                          {!event.registration_form?.enabled && (
                            <p className="text-sm text-gray-400 mt-2">
                              Registration form is not enabled for this event.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-800">
                              Registration Details ({event.registrationCount} total)
                            </h4>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-white">
                                <tr>
                                  <th className="text-left p-3 font-medium text-gray-700 border-b">
                                    Registration Date
                                  </th>
                                  {event.registration_form?.fields.map((field) => (
                                    <th key={field.id} className="text-left p-3 font-medium text-gray-700 border-b">
                                      {field.label}
                                      {field.required && <span className="text-red-500 ml-1">*</span>}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="bg-white">
                                {event.registrations.map((registration, index) => (
                                  <tr key={registration.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                    <td className="p-3 border-b text-gray-600">
                                      {formatDate(registration.created_at)}
                                    </td>
                                    {event.registration_form?.fields.map((field) => (
                                      <td key={field.id} className="p-3 border-b text-gray-800">
                                        {registration.registration_data[field.id] || "-"}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  )
}
