"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Plus, Edit, Trash2, Eye, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { newsService } from "@/lib/api/news"
import { eventsService } from "@/lib/api/events"
import { massService } from "@/lib/api/mass"
import { membershipService } from "@/lib/api/membership"
import { authService } from "@/lib/auth"
import type { News, Event, MassSettings } from "@/lib/supabase"

export default function AdminPanel() {
  const [news, setNews] = useState<News[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [totalMemberships, setTotalMemberships] = useState(0)
  
  // Mass settings state
  const [massSettings, setMassSettings] = useState<MassSettings>({
    church_name: "St. Thomas Malankara Catholic Church",
    email: "jobin.thomas@MCCNA.org",
    mass_time: "04:00 PM EST",
    address: "1669 Richmond St, Dorchester, ON N0L 1G4"
  })
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError("")

      const [newsData, eventsData, massData] = await Promise.all([
        newsService.getAll().catch((err) => {
          console.error("Error loading news:", err)
          return []
        }),
        eventsService.getAll().catch((err) => {
          console.error("Error loading events:", err)
          return []
        }),
        massService.getSettings().catch((err) => {
          console.error("Error loading mass settings:", err)
          return null
        }),
      ])

      setNews(newsData)
      setEvents(eventsData)
      
      // Load mass settings if they exist
      if (massData) {
        setMassSettings(massData)
      }

      // Load total membership registrations count with better error handling
      try {
        const allMemberships = await membershipService.getAll()
        setTotalMemberships(allMemberships.length)
      } catch (error) {
        console.error("Error loading membership count:", error)
        setTotalMemberships(0)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Failed to load some data. Some features may not be available.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteNews = async (id: number) => {
    if (confirm("Are you sure you want to delete this news article?")) {
      try {
        await newsService.delete(id)
        setNews(news.filter((item) => item.id !== id))
      } catch (error) {
        console.error("Error deleting news:", error)
        alert("Failed to delete news article")
      }
    }
  }

  const handleDeleteEvent = async (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await eventsService.delete(id)
        setEvents(events.filter((item) => item.id !== id))
      } catch (error) {
        console.error("Error deleting event:", error)
        alert("Failed to delete event")
      }
    }
  }

  const handleLogout = async () => {
    await authService.logout()
    window.location.href = "/admin/login"
  }

  const handleSaveMassSettings = async () => {
    try {
      setIsSavingSettings(true)
      const savedSettings = await massService.saveSettings(massSettings)
      setMassSettings(savedSettings)
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 3000) // Hide after 3 seconds
    } catch (error) {
      console.error("Error saving mass settings:", error)
      alert("Failed to save settings. Please try again.")
    } finally {
      setIsSavingSettings(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
      case "upcoming":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <AdminAuthGuard>
        <div className="min-h-screen bg-[#f8f4ef] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A67C52] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin panel...</p>
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
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/images/malankara-logo.png"
                  alt="Malankara Catholic Church Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <div className="flex flex-col">
                  <div className="text-sm font-bold text-[#8B6F47] tracking-wider">St. Thomas Malankara</div>
                  <div className="text-xs text-[#8B6F47] tracking-[0.2em] font-medium">ADMIN PANEL</div>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/admin/registrations">
                <Button
                  variant="outline"
                  className="text-[#8B6F47] border-[#8B6F47] hover:bg-[#8B6F47] hover:text-white bg-transparent"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Registrations
                </Button>
              </Link>
              <Link href="/admin/membership">
                <Button
                  variant="outline"
                  className="text-[#8B6F47] border-[#8B6F47] hover:bg-[#8B6F47] hover:text-white bg-transparent"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Membership
                </Button>
              </Link>
              <Link href="/admin/albums">
                <Button
                  variant="outline"
                  className="text-[#8B6F47] border-[#8B6F47] hover:bg-[#8B6F47] hover:text-white bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Album
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="text-[#8B6F47] border-[#8B6F47] hover:bg-[#8B6F47] hover:text-white bg-transparent"
                >
                  View Website
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white bg-transparent"
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your church website content</p>
          </div>

          {error && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
              {error}
              <Button onClick={loadData} variant="outline" size="sm" className="ml-4 bg-transparent">
                Retry
              </Button>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total News</CardTitle>
                    <div className="h-4 w-4 text-[#A67C52]">📰</div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{news.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {news.filter((n) => n.status === "published").length} published
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <div className="h-4 w-4 text-[#A67C52]">📅</div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{events.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {events.filter((e) => e.status === "upcoming").length} upcoming
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Memberships</CardTitle>
                    <Users className="h-4 w-4 text-[#A67C52]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalMemberships}</div>
                    <p className="text-xs text-muted-foreground">Total membership registrations</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Draft Items</CardTitle>
                    <div className="h-4 w-4 text-[#A67C52]">📝</div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {news.filter((n) => n.status === "draft").length +
                        events.filter((e) => e.status === "draft").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Needs review</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                    <div className="h-4 w-4 text-[#A67C52]">📊</div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        [...news, ...events].filter((item) => {
                          const itemDate = new Date(item.created_at)
                          const now = new Date()
                          return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
                        }).length
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">New posts</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/admin/news/new">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="w-10 h-10 bg-[#A67C52] rounded-lg flex items-center justify-center">
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Add News</p>
                        <p className="text-xs text-gray-500">Create new article</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/events/new">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="w-10 h-10 bg-[#A67C52] rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Add Event</p>
                        <p className="text-xs text-gray-500">Create new event</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/admin/registrations">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="w-10 h-10 bg-[#A67C52] rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Registrations</p>
                        <p className="text-xs text-gray-500">View event registrations</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="w-10 h-10 bg-[#A67C52] rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">View Site</p>
                        <p className="text-xs text-gray-500">Visit public website</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates to your content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...news.slice(0, 3), ...events.slice(0, 2)]
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .slice(0, 5)
                      .map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-[#A67C52] rounded-full"></div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.title}</p>
                            <p className="text-xs text-gray-500">
                              {"author" in item ? `By ${item.author}` : `Event on ${item.date}`} •{" "}
                              {formatDate(item.created_at)}
                            </p>
                          </div>
                          {getStatusBadge(item.status)}
                        </div>
                      ))}
                    {news.length === 0 && events.length === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        No content yet. Start by creating your first post!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* News Tab */}
            <TabsContent value="news" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">News Management</h2>
                  <p className="text-gray-600">Create and manage news articles</p>
                </div>
                <Link href="/admin/news/new">
                  <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add News
                  </Button>
                </Link>
              </div>

              <Card>
                <CardContent className="p-0">
                  {news.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">No news articles yet.</p>
                      <Link href="/admin/news/new">
                        <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Article
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-4 font-medium text-gray-700">Title</th>
                            <th className="text-left p-4 font-medium text-gray-700">Category</th>
                            <th className="text-left p-4 font-medium text-gray-700">Author</th>
                            <th className="text-left p-4 font-medium text-gray-700">Date</th>
                            <th className="text-left p-4 font-medium text-gray-700">Status</th>
                            <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {news.map((item) => (
                            <tr key={item.id} className="border-t">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                                    <Image
                                      src={item.image_url || "/placeholder.svg"}
                                      alt={item.title}
                                      width={48}
                                      height={48}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">{item.title}</p>
                                    <div 
                                      className="text-sm text-gray-500 line-clamp-1 rich-text-content"
                                      dangerouslySetInnerHTML={{ __html: item.description || '' }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge variant="outline">{item.category}</Badge>
                              </td>
                              <td className="p-4 text-gray-600">{item.author}</td>
                              <td className="p-4 text-gray-600">{formatDate(item.created_at)}</td>
                              <td className="p-4">{getStatusBadge(item.status)}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <Link href={`/news/${item.id}`} target="_blank">
                                    <Button variant="ghost" size="sm" title="View Article">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                  <Link href={`/admin/news/${item.id}/edit`}>
                                    <Button variant="ghost" size="sm" title="Edit Article">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteNews(item.id)}
                                    className="text-red-600 hover:text-red-700"
                                    title="Delete Article"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Events Management</h2>
                  <p className="text-gray-600">Create and manage church events</p>
                </div>
                <Link href="/admin/events/new">
                  <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </Link>
              </div>

              <Card>
                <CardContent className="p-0">
                  {events.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">No events yet.</p>
                      <Link href="/admin/events/new">
                        <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Event
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-4 font-medium text-gray-700">Event</th>
                            <th className="text-left p-4 font-medium text-gray-700">Date & Time</th>
                            <th className="text-left p-4 font-medium text-gray-700">Location</th>
                            <th className="text-left p-4 font-medium text-gray-700">Category</th>
                            <th className="text-left p-4 font-medium text-gray-700">Status</th>
                            <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.map((item) => (
                            <tr key={item.id} className="border-t">
                              <td className="p-4">
                                <div>
                                  <p className="font-medium text-gray-800">{item.title}</p>
                                  <div 
                                    className="text-sm text-gray-500 line-clamp-1 rich-text-content"
                                    dangerouslySetInnerHTML={{ __html: item.description || '' }}
                                  />
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  <div>
                                    <p className="text-sm font-medium">{item.date}</p>
                                    <p className="text-xs text-gray-500">{item.time}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-sm">{item.location}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge variant="outline">{item.category}</Badge>
                              </td>
                              <td className="p-4">{getStatusBadge(item.status)}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <Link href={`/events`} target="_blank">
                                    <Button variant="ghost" size="sm" title="View Events Page">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                  <Link href={`/admin/events/${item.id}/edit`}>
                                    <Button variant="ghost" size="sm" title="Edit Event">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteEvent(item.id)}
                                    className="text-red-600 hover:text-red-700"
                                    title="Delete Event"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                <p className="text-gray-600">Manage your website settings</p>
              </div>

              {/* Success Message */}
              {settingsSaved && (
                <div className="col-span-full">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Settings saved successfully!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Basic website configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Church Name</label>
                      <input
                        type="text"
                        value={massSettings.church_name}
                        onChange={(e) => setMassSettings({ ...massSettings, church_name: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Contact Email</label>
                      <input
                        type="email"
                        value={massSettings.email}
                        onChange={(e) => setMassSettings({ ...massSettings, email: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                      />
                    </div>
                    <Button 
                      onClick={handleSaveMassSettings}
                      disabled={isSavingSettings}
                      className="bg-[#A67C52] hover:bg-[#8B6F47] text-white disabled:opacity-50"
                    >
                      {isSavingSettings ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mass Schedule</CardTitle>
                    <CardDescription>Update service times and location</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Sunday Mass Time</label>
                      <input
                        type="text"
                        value={massSettings.mass_time}
                        onChange={(e) => setMassSettings({ ...massSettings, mass_time: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Church Address</label>
                      <textarea
                        value={massSettings.address}
                        onChange={(e) => setMassSettings({ ...massSettings, address: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                        rows={3}
                      />
                    </div>
                    <Button 
                      onClick={handleSaveMassSettings}
                      disabled={isSavingSettings}
                      className="bg-[#A67C52] hover:bg-[#8B6F47] text-white disabled:opacity-50"
                    >
                      {isSavingSettings ? "Saving..." : "Update Schedule"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminAuthGuard>
  )
}
