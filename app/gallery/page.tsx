"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Camera, ArrowRight, Filter } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Album {
  id: string
  title: string
  description: string
  date: string
  category?: string
  image_url?: string | null
  image_count?: number
  created_at: string
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [filteredAlbums, setFilteredAlbums] = useState<Album[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    loadAlbums()
  }, [])

  useEffect(() => {
    filterAlbums()
  }, [albums, selectedCategory])

  const loadAlbums = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("albums")
        .select("id, title, description, date, category, image_url, image_count, created_at")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }
      
      setAlbums(data || [])
    } catch (err) {
      console.error("Failed to fetch albums:", err)
      setAlbums([])
    } finally {
      setIsLoading(false)
    }
  }

  const filterAlbums = () => {
    if (selectedCategory === "all") {
      setFilteredAlbums(albums)
    } else {
      setFilteredAlbums(albums.filter(album => album.category === selectedCategory))
    }
  }

  const formatDate = (value: string) => {
    const d = new Date(value + "T00:00:00")
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      events: "Events",
      services: "Services", 
      community: "Community",
      festivals: "Festivals",
      other: "Other"
    }
    return categoryMap[category] || category
  }

  const categories = ["all", "events", "services", "community", "festivals", "other"]

  return (
    <div className="min-h-screen bg-[#f8f4ef]">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#a67c52] py-16 md:py-24">
          {/* World map overlay */}
          <div className="absolute right-0 top-0 h-full w-full ">
            <Image
              src="https://www.vhv.rs/dpng/f/2-25283_wave-png.png"
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
                <span className="text-sm font-medium tracking-wide text-white/90">Church Memories</span>
                <span className="inline-block h-px w-12 bg-white/60" />
              </div>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                Gallery
              </h1>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90">
              A glimpse of our church life—worship, fellowship, and community moments captured in faith and love
              </p>
            </div>
          </div>
        </section>

      {/* Albums Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Photo Albums
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through our collection of memories from church services, community events, and special celebrations
            </p>
          </div>

          {/* Filter Section */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4 bg-white rounded-lg shadow-sm p-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">Filter by:</span>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Albums</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="festivals">Festivals</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Albums Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200" />
                  <div className="p-6">
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-3" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAlbums.length === 0 ? (
            <div className="text-center py-16">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedCategory === "all" ? "No albums found" : `No ${getCategoryDisplayName(selectedCategory).toLowerCase()} albums found`}
              </h3>
              <p className="text-gray-600">
                {selectedCategory === "all" 
                  ? "Check back soon for new photo albums!" 
                  : "Try selecting a different category or view all albums."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAlbums.map((album) => (
                <Card key={album.id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-64 bg-gray-100 overflow-hidden">
                    {album.image_url ? (
                      <Image 
                        src={album.image_url} 
                        alt={album.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Camera className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-black/70 text-white backdrop-blur-sm">
                        {album.image_count || 0} photos
                      </Badge>
                    </div>
                    {album.category && (
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-white/90 text-gray-800">
                          {getCategoryDisplayName(album.category)}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl text-gray-900 line-clamp-2 group-hover:text-[#8B6F47] transition-colors">
                      {album.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(album.date || album.created_at)}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {album.description}
                    </p>
                    <Link href={`/gallery/${album.id}`}>
                      <Button className="w-full bg-[#8B6F47] hover:bg-[#A67C52] text-white">
                        View Album
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

       
        </div>
      </section>

   
    </div>
  )
}
