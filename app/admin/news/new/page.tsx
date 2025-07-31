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
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { newsService } from "@/lib/api/news"
import { authService } from "@/lib/auth"

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

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
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
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData((prev) => ({
          ...prev,
          image_url: result, // In production, you'd upload to Supabase Storage
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image_url: "",
    }))
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent, status: "draft" | "published") => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const finalData = {
        ...formData,
        status,
      }

      await newsService.create(finalData)
      alert(`News ${status === "published" ? "published" : "saved as draft"} successfully!`)
      router.push("/admin")
    } catch (error) {
      console.error("Error creating news:", error)
      alert("Failed to create news article. Please try again.")
    } finally {
      setIsSubmitting(false)
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
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Brief description that will appear in news listings"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Full Content *</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Write the full article content here..."
                      rows={12}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                  <CardDescription>Upload an image for your news article</CardDescription>
                </CardHeader>
                <CardContent>
                  {imagePreview ? (
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
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Click to upload an image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Button type="button" variant="outline" className="cursor-pointer">
                          Choose File
                        </Button>
                      </label>
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
