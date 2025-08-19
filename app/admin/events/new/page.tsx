"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Upload, X, Calendar, Clock, MapPin, Users, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { eventsService } from "@/lib/api/events"
import type { FormField } from "@/lib/supabase"
import { uploadFileToS3 } from "@/lib/s3-upload"
import { normalizeDateForDatabase } from "@/lib/utils"

const eventCategories = [
  "Celebration",
  "Liturgical",
  "Retreat",
  "Community Service",
  "Youth Ministry",
  "Education",
  "Prayer Meeting",
]

const defaultFormFields: FormField[] = [
  {
    id: "name",
    type: "text",
    label: "Full Name",
    required: true,
    placeholder: "Enter your full name",
  },
  {
    id: "phone",
    type: "tel",
    label: "Phone Number",
    required: true,
    placeholder: "Enter your phone number",
  },
  {
    id: "email",
    type: "email",
    label: "Email Address",
    required: false,
    placeholder: "Enter your email (optional)",
  },
  {
    id: "age",
    type: "number",
    label: "Age",
    required: true,
    placeholder: "Enter your age",
  },
]

export default function AddEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    attendees: "",
    status: "draft" as "draft" | "upcoming",
    image_url: "",
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [hasRegistrationForm, setHasRegistrationForm] = useState(false)
  const [useExternalLink, setUseExternalLink] = useState(false)
  const [externalLink, setExternalLink] = useState("")
  const [formFields, setFormFields] = useState<FormField[]>(defaultFormFields)
  const [customFields, setCustomFields] = useState<FormField[]>([])
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
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
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
    setSelectedFile(null)
  }

  const addCustomField = () => {
    const newField: FormField = {
      id: `custom_${Date.now()}`,
      type: "text",
      label: "",
      required: false,
      placeholder: "",
    }
    setCustomFields([...customFields, newField])
  }

  const updateCustomField = (index: number, field: Partial<FormField>) => {
    const updatedFields = [...customFields]
    updatedFields[index] = { ...updatedFields[index], ...field }
    setCustomFields(updatedFields)
  }

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index))
  }

  const updateDefaultField = (fieldId: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)))
  }

  const handleSubmit = async (e: React.FormEvent, status: "draft" | "upcoming") => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imageUrl = formData.image_url

      // Upload image to S3 if a file is selected
      if (selectedFile) {
        const uploadResult = await uploadFileToS3(selectedFile)
        if (uploadResult.success && uploadResult.s3Url) {
          imageUrl = uploadResult.s3Url
        } else {
          throw new Error(uploadResult.error || 'Failed to upload image')
        }
      }

      const finalData = {
        ...formData,
        date: normalizeDateForDatabase(formData.date),
        image_url: imageUrl,
        status,
        registration_form: hasRegistrationForm && !useExternalLink
          ? {
              enabled: true,
              fields: [...formFields, ...customFields],
            }
          : null,
        external_link: useExternalLink ? externalLink : null,
      }

      await eventsService.create(finalData)
      alert(`Event ${status === "upcoming" ? "published" : "saved as draft"} successfully!`)
      router.push("/admin")
    } catch (error) {
      console.error("Error creating event:", error)
      alert(error instanceof Error ? error.message : "Failed to create event. Please try again.")
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Event</h1>
            <p className="text-gray-600">Create a new event for your church community</p>
          </div>

          <form className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                  <CardDescription>Enter the main information for your event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Event Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter event title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Time *</label>
                      <input
                        type="text"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        placeholder="e.g., 6:00 PM - 9:00 PM"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Event location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Target Attendees</label>
                    <input
                      type="text"
                      name="attendees"
                      value={formData.attendees}
                      onChange={handleInputChange}
                      placeholder="e.g., All Welcome, Ages 16-30, Families"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                    />
                  </div>

                                     <div>
                     <label className="text-sm font-medium text-gray-700 mb-2 block">Description *</label>
                     <RichTextEditor
                       value={formData.description}
                       onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                       placeholder="Describe the event, what to expect, and any special instructions..."
                       className="w-full"
                     />
                   </div>
                </CardContent>
              </Card>

              {/* Registration Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Registration Options</CardTitle>
                  <CardDescription>Choose how attendees can register for this event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Radio Buttons */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="no-registration"
                        name="registration-type"
                        checked={!hasRegistrationForm && !useExternalLink}
                        onChange={() => {
                          setHasRegistrationForm(false)
                          setUseExternalLink(false)
                          setExternalLink("")
                          setFormFields(defaultFormFields)
                          setCustomFields([])
                        }}
                        className="w-4 h-4 text-[#A67C52] border-gray-300 focus:ring-[#A67C52]"
                      />
                      <label htmlFor="no-registration" className="text-sm font-medium text-gray-700">
                        No Registration Required
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="registration-form"
                        name="registration-type"
                        checked={hasRegistrationForm && !useExternalLink}
                        onChange={() => {
                          setHasRegistrationForm(true)
                          setUseExternalLink(false)
                          setExternalLink("")
                        }}
                        className="w-4 h-4 text-[#A67C52] border-gray-300 focus:ring-[#A67C52]"
                      />
                      <label htmlFor="registration-form" className="text-sm font-medium text-gray-700">
                        Use Registration Form
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="external-link"
                        name="registration-type"
                        checked={useExternalLink}
                        onChange={() => {
                          setHasRegistrationForm(false)
                          setUseExternalLink(true)
                          setFormFields(defaultFormFields)
                          setCustomFields([])
                        }}
                        className="w-4 h-4 text-[#A67C52] border-gray-300 focus:ring-[#A67C52]"
                      />
                      <label htmlFor="external-link" className="text-sm font-medium text-gray-700">
                        Use External Link
                      </label>
                    </div>
                  </div>

                  {/* External Link Input */}
                  {useExternalLink && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        External Registration Link *
                      </label>
                      <input
                        type="url"
                        value={externalLink}
                        onChange={(e) => setExternalLink(e.target.value)}
                        placeholder="https://example.com/register"
                        className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={useExternalLink}
                      />
                      <p className="text-xs text-blue-600 mt-1">
                        Enter the URL where attendees can register for this event
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Registration Form Builder */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Registration Form</CardTitle>
                      <CardDescription>Add a registration form for attendees (optional)</CardDescription>
                    </div>
                    <Switch 
                      checked={hasRegistrationForm} 
                      onCheckedChange={setHasRegistrationForm}
                      disabled={useExternalLink}
                    />
                  </div>
                </CardHeader>

                {hasRegistrationForm && !useExternalLink && (
                  <CardContent className="space-y-6">
                    {/* Default Fields */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-4">Default Fields</h4>
                      <div className="space-y-4">
                        {formFields.map((field) => (
                          <div key={field.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium">{field.label}</span>
                                {field.required && <span className="text-red-500 text-xs">*</span>}
                              </div>
                              <input
                                type={field.type}
                                placeholder={field.placeholder}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                disabled
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-gray-600">Required</label>
                              <Switch
                                checked={field.required}
                                onCheckedChange={(checked) => updateDefaultField(field.id, { required: checked })}
                                disabled={field.id === "name" || field.id === "phone" || field.id === "age"} // Keep name, phone, age as required
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Custom Fields */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-700">Custom Fields</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addCustomField}
                          className="text-[#A67C52] border-[#A67C52] hover:bg-[#A67C52] hover:text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Field
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {customFields.map((field, index) => (
                          <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-medium text-gray-700">Custom Field {index + 1}</h5>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCustomField(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-600 mb-1 block">Field Label</label>
                                <input
                                  type="text"
                                  value={field.label}
                                  onChange={(e) => updateCustomField(index, { label: e.target.value })}
                                  placeholder="Enter field label"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                                />
                              </div>

                              <div>
                                <label className="text-xs text-gray-600 mb-1 block">Field Type</label>
                                <select
                                  value={field.type}
                                  onChange={(e) =>
                                    updateCustomField(index, { type: e.target.value as FormField["type"] })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                                >
                                  <option value="text">Text</option>
                                  <option value="email">Email</option>
                                  <option value="tel">Phone</option>
                                  <option value="number">Number</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="text-xs text-gray-600 mb-1 block">Placeholder</label>
                              <input
                                type="text"
                                value={field.placeholder}
                                onChange={(e) => updateCustomField(index, { placeholder: e.target.value })}
                                placeholder="Enter placeholder text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <Switch
                                checked={field.required}
                                onCheckedChange={(checked) => updateCustomField(index, { required: checked })}
                              />
                              <label className="text-xs text-gray-600">Required field</label>
                            </div>

                            {/* Preview */}
                            <div className="pt-2 border-t border-gray-200">
                              <label className="text-xs text-gray-500 mb-1 block">Preview:</label>
                              <input
                                type={field.type}
                                placeholder={field.placeholder || field.label}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                disabled
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Form Preview */}
                    <div className="border-t pt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-4">Registration Form Preview</h4>
                      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                        <h5 className="font-medium text-gray-800">Event Registration</h5>
                        {[...formFields, ...customFields].map((field) => (
                          <div key={field.id}>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <input
                              type={field.type}
                              placeholder={field.placeholder}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              disabled
                            />
                          </div>
                        ))}
                        <Button disabled className="bg-[#A67C52] text-white">
                          Register for Event
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Event Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Image</CardTitle>
                  <CardDescription>Upload an image for your event</CardDescription>
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
                      <p className="text-gray-600 mb-4">Click to upload an event image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        ref={(input) => {
                          if (input) {
                            input.onclick = () => input.click();
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="cursor-pointer"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Settings</CardTitle>
                  <CardDescription>Configure event settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      {eventCategories.map((category) => (
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
                        {formData.status === "draft" ? "Draft" : "Upcoming"}
                      </Badge>
                    </div>
                  </div>

                  {hasRegistrationForm && !useExternalLink && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Registration Form Enabled</span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        {[...formFields, ...customFields].length} fields configured
                      </p>
                    </div>
                  )}
                  {useExternalLink && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">External Link Enabled</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Registration via external link
                      </p>
                    </div>
                  )}

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
                      onClick={(e) => handleSubmit(e, "upcoming")}
                      className="w-full bg-[#A67C52] hover:bg-[#8B6F47] text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Publishing..." : "Publish Event"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How your event will appear</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-800">{formData.title || "Event Title"}</div>

                    {formData.category && (
                      <Badge variant="outline" className="text-xs">
                        {formData.category}
                      </Badge>
                    )}

                    <div className="space-y-2 text-xs text-gray-600">
                      {formData.date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-[#A67C52]" />
                          <span>
                            {new Date(formData.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      )}

                      {formData.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-[#A67C52]" />
                          <span>{formData.time}</span>
                        </div>
                      )}

                      {formData.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-[#A67C52]" />
                          <span>{formData.location}</span>
                        </div>
                      )}

                      {formData.attendees && (
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3 text-[#A67C52]" />
                          <span>{formData.attendees}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-600 line-clamp-3">
                      {formData.description || "Event description will appear here..."}
                    </div>

                    {hasRegistrationForm && !useExternalLink && (
                      <div className="pt-2 border-t border-gray-200">
                        <Button size="sm" className="w-full bg-[#A67C52] hover:bg-[#8B6F47] text-white text-xs">
                          Register Now
                        </Button>
                      </div>
                    )}
                    {useExternalLink && (
                      <div className="pt-2 border-t border-gray-200">
                        <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs">
                          Register via External Link
                        </Button>
                      </div>
                    )}
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
