"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { AdminNavigation } from "@/components/admin-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus,ArrowLeft, Edit, Trash2, Calendar, Camera, Upload, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { authService } from "@/lib/auth"

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

export default function AdminAlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)
  const [albumImages, setAlbumImages] = useState<AlbumImage[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    category: ""
  })
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  
  // Edit form state
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    date: "",
    category: ""
  })
  const [newImages, setNewImages] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([])

  useEffect(() => {
    loadAlbums()
  }, [])

  const loadAlbums = async () => {
    try {
      setIsLoading(true)
      console.log("Loading albums...")
      const { data, error } = await supabase
        .from("albums")
        .select("id, title, description, date, category, image_url, image_count, created_at")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }
      
      console.log("Albums loaded:", data)
      setAlbums(data || [])
    } catch (err) {
      console.error("Failed to fetch albums:", err)
      setAlbums([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (albumId: string) => {
    try {
      setDeletingId(albumId)
      // Best-effort delete images first (if table exists and FK not cascading)
      await supabase.from("album_images").delete().eq("album_id", albumId)
      const { error } = await supabase.from("albums").delete().eq("id", albumId)
      if (error) throw error
      setAlbums((prev) => prev.filter((a) => a.id !== albumId))
    } catch (err) {
      console.error("Failed to delete album:", err)
      alert("Failed to delete album. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (value: string) => {
    const d = new Date(value + "T00:00:00")
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }
  const handleLogout = async () => {
    await authService.logout()
    window.location.href = "/admin/login"
  }
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setSelectedImages(prev => [...prev, ...files])
      
      // Create previews
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImageToS3 = async (file: File): Promise<string> => {
    const contentType = file.type || 'application/octet-stream'

    // 1) Ask server for a presigned URL
    const presignRes = await fetch('/api/s3/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, contentType })
    })

    if (!presignRes.ok) {
      throw new Error('Failed to get presigned URL')
    }

    const { presignedUrl } = await presignRes.json()
    if (!presignedUrl) throw new Error('Missing presigned URL in response')

    // 2) Upload the file to S3 using the presigned URL
    const putRes = await fetch(presignedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: file
    })

    if (!putRes.ok) {
      throw new Error('Failed to upload file to S3')
    }

    // 3) The public URL is the presignedUrl without the query string
    const publicUrl = presignedUrl.split('?')[0]
    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.date || selectedImages.length === 0) {
      toast.error("Please fill in all fields and select at least one image")
      return
    }

    try {
      setIsSubmitting(true)
      
      // Upload images to S3
      const imageUrls = await Promise.all(selectedImages.map(uploadImageToS3))
      
      // Create album in database
      const { data: album, error: albumError } = await supabase
        .from('albums')
        .insert({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          image_count: imageUrls.length,
          category: formData.category || null,
          image_url: imageUrls[0] // Use first image as thumbnail
        })
        .select()
        .single()

      if (albumError) throw albumError

      // Insert album images
      const albumImages = imageUrls.map((url, index) => ({
        album_id: album.id,
        image_url: url,
        image_order: index + 1
      }))

      const { error: imagesError } = await supabase
        .from('album_images')
        .insert(albumImages)

      if (imagesError) throw imagesError

      toast.success("Album created successfully!")
      setIsAddModalOpen(false)
      resetForm()
      loadAlbums() // Refresh the list
      
    } catch (error) {
      console.error('Error creating album:', error)
      toast.error("Failed to create album. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      category: ""
    })
    setSelectedImages([])
    setImagePreviews([])
  }

  const resetEditForm = () => {
    setEditFormData({
      title: "",
      description: "",
      date: "",
      category: ""
    })
    setNewImages([])
    setNewImagePreviews([])
    setImagesToRemove([])
    setAlbumImages([])
    setEditingAlbum(null)
  }

  const openEditModal = async (album: Album) => {
    try {
      setEditingAlbum(album)
      setEditFormData({
        title: album.title,
        description: album.description,
        date: album.date,
        category: album.category || ""
      })

      // Load album images
      const { data: images, error } = await supabase
        .from('album_images')
        .select('id, image_url, image_order')
        .eq('album_id', album.id)
        .order('image_order')

      if (error) {
        console.error('Error loading album images:', error)
        toast.error('Failed to load album images')
        return
      }

      setAlbumImages(images || [])
      setIsEditModalOpen(true)
    } catch (error) {
      console.error('Error opening edit modal:', error)
      toast.error('Failed to open edit modal')
    }
  }

  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setNewImages(prev => [...prev, ...files])
      
      // Create previews
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setNewImagePreviews(prev => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (imageId: string) => {
    setImagesToRemove(prev => [...prev, imageId])
    setAlbumImages(prev => prev.filter(img => img.id !== imageId))
  }

  const undoRemoveImage = (imageId: string) => {
    setImagesToRemove(prev => prev.filter(id => id !== imageId))
    // Note: We'd need to reload the image from the database to restore it
    // For now, this is a simplified implementation
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingAlbum) return

    if (!editFormData.title || !editFormData.description || !editFormData.date) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)
      
      // Upload new images to S3
      const newImageUrls = await Promise.all(newImages.map(uploadImageToS3))
      
      // Remove images that were marked for deletion first
      if (imagesToRemove.length > 0) {
        const { error: removeError } = await supabase
          .from('album_images')
          .delete()
          .in('id', imagesToRemove)

        if (removeError) throw removeError
      }

      // Add new images
      if (newImageUrls.length > 0) {
        const currentMaxOrder = Math.max(...albumImages.map(img => img.image_order), 0)
        const newAlbumImages = newImageUrls.map((url, index) => ({
          album_id: editingAlbum.id,
          image_url: url,
          image_order: currentMaxOrder + index + 1
        }))

        const { error: imagesError } = await supabase
          .from('album_images')
          .insert(newAlbumImages)

        if (imagesError) throw imagesError
      }

      // Calculate final image count: existing images - removed images + new images
      const remainingImages = albumImages.filter(img => !imagesToRemove.includes(img.id))
      const finalImageCount = remainingImages.length + newImageUrls.length

      // Update album in database with correct image count
      const { error: albumError } = await supabase
        .from('albums')
        .update({
          title: editFormData.title,
          description: editFormData.description,
          date: editFormData.date,
          image_count: finalImageCount,
          category: editFormData.category || null
        })
        .eq('id', editingAlbum.id)

      if (albumError) throw albumError

      // Update thumbnail if needed
      if (remainingImages.length > 0 || newImageUrls.length > 0) {
        const thumbnailUrl = remainingImages.length > 0 ? remainingImages[0].image_url : newImageUrls[0]
        await supabase
          .from('albums')
          .update({ image_url: thumbnailUrl })
          .eq('id', editingAlbum.id)
      }

      toast.success("Album updated successfully!")
      setIsEditModalOpen(false)
      resetEditForm()
      loadAlbums() // Refresh the list
      
    } catch (error) {
      console.error('Error updating album:', error)
      toast.error("Failed to update album. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#f8f4ef]">
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Albums</h1>
              <p className="text-gray-600">Manage photo albums for the gallery</p>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Album
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Album</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter album title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="events">Events</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                        <SelectItem value="festivals">Festivals</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter album description"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Images *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">Click to upload images or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                      </label>
                    </div>
                    
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              width={150}
                              height={150}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#A67C52] hover:bg-[#8B6F47] text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating..." : "Create Album"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Album</DialogTitle>
                </DialogHeader>
                {editingAlbum && (
                  <form onSubmit={handleEditSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-title">Title *</Label>
                        <Input
                          id="edit-title"
                          value={editFormData.title}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter album title"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-date">Date *</Label>
                        <Input
                          id="edit-date"
                          type="date"
                          value={editFormData.date}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, date: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Category</Label>
                      <Select value={editFormData.category} onValueChange={(value) => setEditFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="community">Community</SelectItem>
                          <SelectItem value="festivals">Festivals</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description *</Label>
                      <Textarea
                        id="edit-description"
                        value={editFormData.description}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter album description"
                        rows={3}
                        required
                      />
                    </div>

                    {/* Existing Images */}
                    {albumImages.length > 0 && (
                      <div className="space-y-2">
                        <Label>Current Images</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {albumImages.map((image) => (
                            <div key={image.id} className="relative group">
                              <Image
                                src={image.image_url}
                                alt={`Album image ${image.image_order}`}
                                width={150}
                                height={150}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeExistingImage(image.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add New Images */}
                    <div className="space-y-2">
                      <Label>Add New Images</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleEditImageSelect}
                          className="hidden"
                          id="edit-image-upload"
                        />
                        <label htmlFor="edit-image-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">Click to upload new images or drag and drop</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                        </label>
                      </div>
                      
                      {newImagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          {newImagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <Image
                                src={preview}
                                alt={`New image preview ${index + 1}`}
                                width={150}
                                height={150}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeNewImage(index)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditModalOpen(false)
                          resetEditForm()
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#A67C52] hover:bg-[#8B6F47] text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6">
                    <div className="h-4 w-2/3 bg-gray-200 rounded mb-3" />
                    <div className="h-3 w-full bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-3/4 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : albums.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="py-12 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No albums found. Create your first album.</p>
                <div className="text-xs text-gray-500 mb-4">
                  Debug: Albums count = {albums.length}, Loading = {isLoading.toString()}
                </div>
                <div className="flex gap-2 justify-center">
                  <Button 
                    className="bg-[#A67C52] hover:bg-[#8B6F47] text-white"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Album
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={loadAlbums}
                  >
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <Card key={album.id} className="overflow-hidden">
                  <div className="relative h-48 bg-gray-100">
                    {album.image_url ? (
                      <Image src={album.image_url} alt={album.title} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Camera className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-black/60 text-white">
                        {album.image_count || 0} photos
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">{album.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(album.date || album.created_at)}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{album.description}</p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => openEditModal(album)}
                      >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={deletingId === album.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Album</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{album.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(album.id)} className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminAuthGuard>
  )
}
