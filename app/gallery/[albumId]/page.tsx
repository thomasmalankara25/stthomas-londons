"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowLeft, Camera, Share2, Download } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ImageModal } from "@/components/image-modal"

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

interface AlbumImage {
  id: string
  image_url: string
  image_order: number
}

export default function AlbumPage() {
  const params = useParams()
  const router = useRouter()
  const albumId = params.albumId as string
  
  const [album, setAlbum] = useState<Album | null>(null)
  const [albumImages, setAlbumImages] = useState<AlbumImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (albumId) {
      loadAlbumData()
    }
  }, [albumId])

  const loadAlbumData = async () => {
    try {
      setIsLoading(true)
      
      // Load album details
      const { data: albumData, error: albumError } = await supabase
        .from("albums")
        .select("id, title, description, date, category, image_url, image_count, created_at")
        .eq("id", albumId)
        .single()

      if (albumError) {
        console.error("Album error:", albumError)
        throw albumError
      }

      setAlbum(albumData)

      // Load album images
      const { data: imagesData, error: imagesError } = await supabase
        .from("album_images")
        .select("id, image_url, image_order")
        .eq("album_id", albumId)
        .order("image_order")

      if (imagesError) {
        console.error("Images error:", imagesError)
        throw imagesError
      }

      setAlbumImages(imagesData || [])
      
    } catch (err) {
      console.error("Failed to load album data:", err)
      router.push("/gallery")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (value: string) => {
    const d = new Date(value)
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
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

  const handleShare = async () => {
    if (navigator.share && album) {
      try {
        await navigator.share({
          title: album.title,
          text: album.description,
          url: window.location.href,
        })
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f4ef]">
        <Navigation />
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-[#f8f4ef]">
        <Navigation />
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Album not found</h2>
          <p className="text-gray-600 mb-6">The album you're looking for doesn't exist or has been removed.</p>
          <Link href="/gallery">
            <Button className="bg-[#8B6F47] hover:bg-[#A67C52] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f4ef]">

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Back Button */}
        <Link href="/gallery" className="inline-flex items-center gap-2 text-[#8B6F47] hover:text-[#A67C52] mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to Gallery</span>
        </Link>

        {/* Album Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {album.category && (
                  <Badge variant="secondary" className="bg-[#8B6F47] text-white">
                    {getCategoryDisplayName(album.category)}
                  </Badge>
                )}
                <Badge variant="outline">
                  {album.image_count || 0} photos
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {album.title}
              </h1>
              
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(album.date || album.created_at)}</span>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                {album.description}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleShare}
                className="text-[#8B6F47] border-[#8B6F47] hover:bg-[#8B6F47] hover:text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        {albumImages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No photos yet</h3>
            <p className="text-gray-600">Photos will be added to this album soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {albumImages.map((image, index) => (
              <div 
                key={image.id} 
                className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedImage(image.image_url)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={image.image_url}
                    alt={`${album.title} - Photo ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Download className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
          albumTitle={album.title}
        />
      )}
    </div>
  )
}
