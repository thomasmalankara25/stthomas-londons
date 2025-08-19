"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { newsService } from "@/lib/api/news"
import { authService } from "@/lib/auth"
import { uploadFileToS3 } from "@/lib/s3-upload"

const categories = [
  "Church Development",
  "Events",
  "Youth Ministry",
  "Celebrations",
  "Community Service",
  "Education",
  "Liturgical",
]

export default function AddNews() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    author: authService.getCurrentUser()?.username || "",
    status: "draft" as "draft" | "published",
    image_url: "",
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>("")
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB')
        return
      }

      setSelectedFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedFile(null)
    setImagePreview(null)
    setFormData((prev) => ({
      ...prev,
      image_url: "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent, status: "draft" | "published") => {
    e.preventDefault()
    setIsSubmitting(true)
    setUploadProgress("")

    try {
      let imageUrl = formData.image_url

      // Upload image if a file is selected
      if (selectedFile) {
        setUploadProgress("Uploading image...")
        const uploadResult = await uploadFileToS3(selectedFile)
        
        if (!uploadResult.success) {
          throw new Error(`Image upload failed: ${uploadResult.error}`)
        }
        
        imageUrl = uploadResult.s3Url || ""
        setUploadProgress("Image uploaded successfully!")
      }

      const finalData = {
        ...formData,
        status,
        image_url: imageUrl,
      }

      await newsService.create(finalData)
      alert(`News ${status === "published" ? "published" : "saved as draft"} successfully!`)
      router.push("/admin")
    } catch (error) {
      console.error("Error creating news:", error)
      alert(`Failed to create news article: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
      setUploadProgress("")
    }
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
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New News Article</h1>
            <p className="text-gray-600">Create a new news article for your church website</p>
          </div>

          <form className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Article Content</CardTitle>
                  <CardDescription>Enter the main content for your news article</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter article title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Short Description *</label>
                    <RichTextEditor
                      value={formData.description}
                      onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                      placeholder="Brief description that will appear in news listings"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Full Content *</label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                      placeholder="Write the full article content here..."
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                  <CardDescription>Upload an image for your news article (Max 5MB, JPG, PNG, GIF)</CardDescription>
                </CardHeader>
                <CardContent>
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="relative w-full h-64 rounded-lg overflow-hidden">
                          <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                                             <div className="text-sm text-gray-600">
                         <p><strong>File:</strong> {selectedFile?.name}</p>
                         <p><strong>Size:</strong> {selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) : '0'} MB</p>
                         <p><strong>Type:</strong> {selectedFile?.type}</p>
                       </div>
                    </div>
                  ) : (
                                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                       <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                       <p className="text-gray-600 mb-4">Click to upload an image</p>
                       <p className="text-sm text-gray-500 mb-4">Supports JPG, PNG, GIF up to 5MB</p>
                       <input
                         type="file"
                         accept="image/*"
                         onChange={handleImageUpload}
                         className="hidden"
                         id="image-upload"
                       />
                       <label 
                         htmlFor="image-upload" 
                         className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A67C52] cursor-pointer transition-colors"
                       >
                         Choose File
                       </label>
                     </div>
                  )}
                  
                  {uploadProgress && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-700">{uploadProgress}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publish Settings</CardTitle>
                  <CardDescription>Configure publication settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Author *</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="Author name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                    <div className="flex items-center gap-2">
                      <Badge variant={formData.status === "draft" ? "default" : "secondary"}>
                        {formData.status === "draft" ? "Draft" : "Published"}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button
                      type="button"
                      onClick={(e) => handleSubmit(e, "draft")}
                      variant="outline"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save as Draft"}
                    </Button>
                    <Button
                      type="button"
                      onClick={(e) => handleSubmit(e, "published")}
                      className="w-full bg-[#A67C52] hover:bg-[#8B6F47] text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Publishing..." : "Publish Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How your article will appear</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {imagePreview && (
                      <div className="relative w-full h-32 rounded-md overflow-hidden">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      </div>
                    )}
                    <div className="text-sm font-medium text-gray-800">{formData.title || "Article Title"}</div>
                    <div className="text-xs text-gray-500">
                      {formData.author && `By ${formData.author} • `}
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    {formData.category && (
                      <Badge variant="outline" className="text-xs">
                        {formData.category}
                      </Badge>
                    )}
                    <div className="text-xs text-gray-600 line-clamp-3">
                      {formData.description || "Article description will appear here..."}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </AdminAuthGuard>
  )
}
