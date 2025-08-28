"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface MemberData {
  name: string
  dateOfBirth: string
  dateOfBaptism: string
  dateOfConfirmation: string
}

export default function RegisterPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    primaryMemberName: "",
    contactNumber: "",
    homeAddress: "",
    dateOfBirth: "",
    dateOfBaptism: "",
    dateOfConfirmation: "",
    dateOfMarriage: "",
    spouseName: "",
    spouseEmail: "",
    spouseContactNumber: "",
    spouseDateOfBirth: "",
    spouseDateOfBaptism: "",
    spouseDateOfConfirmation: "",
  })

  const [additionalMembers, setAdditionalMembers] = useState<MemberData[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMemberChange = (index: number, field: keyof MemberData, value: string) => {
    setAdditionalMembers((prev) => prev.map((member, i) => (i === index ? { ...member, [field]: value } : member)))
  }

  const addMember = () => {
    setAdditionalMembers((prev) => [...prev, { name: "", dateOfBirth: "", dateOfBaptism: "", dateOfConfirmation: "" }])
  }

  const removeMember = (index: number) => {
    setAdditionalMembers((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const registrationData = {
        email: formData.email,
        primaryMemberName: formData.primaryMemberName,
        contactNumber: formData.contactNumber,
        homeAddress: formData.homeAddress,
        dateOfBirth: formData.dateOfBirth || undefined,
        dateOfBaptism: formData.dateOfBaptism || undefined,
        dateOfConfirmation: formData.dateOfConfirmation || undefined,
        dateOfMarriage: formData.dateOfMarriage || undefined,
        spouseName: formData.spouseName || undefined,
        spouseEmail: formData.spouseEmail || undefined,
        spouseContactNumber: formData.spouseContactNumber || undefined,
        spouseDateOfBirth: formData.spouseDateOfBirth || undefined,
        spouseDateOfBaptism: formData.spouseDateOfBaptism || undefined,
        spouseDateOfConfirmation: formData.spouseDateOfConfirmation || undefined,
        additionalMembers: additionalMembers.filter((member) => member.name.trim() !== ""),
      }

      const response = await fetch("/api/membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit registration")
      }

      const result = await response.json()

      toast({
        title: "Registration Request Submitted Successfully!",
        description:
          "Your membership registration request has been received. We will review your application and contact you soon.",
        duration: 5000,
      })

      // Reset form
      setFormData({
        email: "",
        primaryMemberName: "",
        contactNumber: "",
        homeAddress: "",
        dateOfBirth: "",
        dateOfBaptism: "",
        dateOfConfirmation: "",
        dateOfMarriage: "",
        spouseName: "",
        spouseEmail: "",
        spouseContactNumber: "",
        spouseDateOfBirth: "",
        spouseDateOfBaptism: "",
        spouseDateOfConfirmation: "",
      })
      setAdditionalMembers([])
    } catch (error) {
      console.error("Error submitting registration:", error)
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while submitting your registration. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#2c1810] hover:text-[#d4af37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
        <Card>
          <CardHeader className="text-center bg-[#2c1810] text-white">
            <CardTitle className="text-2xl font-bold">Church Membership Registration Form</CardTitle>
            <div className="mt-4 space-y-2">
              <h2 className="text-xl text-[#d4af37]">ST. THOMAS MALANKARA CATHOLIC CHURCH, LONDON ON</h2>
              <p className="text-sm">Address: 1669 Richmond St Dorchester ON</p>
              <p className="text-sm">Contact: 226-347-4903 | jobin.thomas@MCCNA.org</p>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Primary Member Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#2c1810] border-b pb-2">Primary Member Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="primaryMemberName" className="text-sm font-medium">
                      Primary Member Name *
                    </Label>
                    <Input
                      id="primaryMemberName"
                      required
                      value={formData.primaryMemberName}
                      onChange={(e) => handleInputChange("primaryMemberName", e.target.value)}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactNumber" className="text-sm font-medium">
                      Contact Number *
                    </Label>
                    <Input
                      id="contactNumber"
                      type="tel"
                      required
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="homeAddress" className="text-sm font-medium">
                    Home Address *
                  </Label>
                  <Input
                    id="homeAddress"
                    required
                    value={formData.homeAddress}
                    onChange={(e) => handleInputChange("homeAddress", e.target.value)}
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateOfBaptism" className="text-sm font-medium">
                      Date of Baptism
                    </Label>
                    <Input
                      id="dateOfBaptism"
                      type="date"
                      value={formData.dateOfBaptism}
                      onChange={(e) => handleInputChange("dateOfBaptism", e.target.value)}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateOfConfirmation" className="text-sm font-medium">
                      Date of Confirmation
                    </Label>
                    <Input
                      id="dateOfConfirmation"
                      type="date"
                      value={formData.dateOfConfirmation}
                      onChange={(e) => handleInputChange("dateOfConfirmation", e.target.value)}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateOfMarriage" className="text-sm font-medium">
                      Date of Marriage
                    </Label>
                    <Input
                      id="dateOfMarriage"
                      type="date"
                      value={formData.dateOfMarriage}
                      onChange={(e) => handleInputChange("dateOfMarriage", e.target.value)}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Spouse Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#2c1810] border-b pb-2">Spouse Information (If Married)</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="spouseName" className="text-sm font-medium">
                      Spouse Name
                    </Label>
                    <Input
                      id="spouseName"
                      value={formData.spouseName}
                      onChange={(e) => handleInputChange("spouseName", e.target.value)}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="spouseEmail" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="spouseEmail"
                      type="email"
                      value={formData.spouseEmail}
                      onChange={(e) => handleInputChange("spouseEmail", e.target.value)}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="spouseContactNumber" className="text-sm font-medium">
                      Contact Number
                    </Label>
                    <Input
                      id="spouseContactNumber"
                      type="tel"
                      value={formData.spouseContactNumber}
                      onChange={(e) => handleInputChange("spouseContactNumber", e.target.value)}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="spouseDateOfBirth" className="text-sm font-medium">
                      Date of Birth
                    </Label>
                    <Input
                      id="spouseDateOfBirth"
                      type="date"
                      value={formData.spouseDateOfBirth}
                      onChange={(e) => handleInputChange("spouseDateOfBirth", e.target.value)}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="spouseDateOfBaptism" className="text-sm font-medium">
                      Date of Baptism
                    </Label>
                    <Input
                      id="spouseDateOfBaptism"
                      type="date"
                      value={formData.spouseDateOfBaptism}
                      onChange={(e) => handleInputChange("spouseDateOfBaptism", e.target.value)}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="spouseDateOfConfirmation" className="text-sm font-medium">
                      Date of Confirmation
                    </Label>
                    <Input
                      id="spouseDateOfConfirmation"
                      type="date"
                      value={formData.spouseDateOfConfirmation}
                      onChange={(e) => handleInputChange("spouseDateOfConfirmation", e.target.value)}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Family Members */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#2c1810] border-b pb-2">Additional Family Members</h3>
                  <Button
                    type="button"
                    onClick={addMember}
                    className="bg-[#d4af37] hover:bg-[#b8941f] text-white flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    <Plus className="w-4 h-4" />
                    Add Member
                  </Button>
                </div>

                {additionalMembers.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Click "Add Member" to add additional family members</p>
                )}

                {additionalMembers.map((member, index) => (
                  <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-[#2c1810]">Member {index + 3}</h4>
                      <Button
                        type="button"
                        onClick={() => removeMember(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Name</Label>
                        <Input
                          value={member.name}
                          onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                          className="mt-1"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Date of Birth</Label>
                        <Input
                          type="date"
                          value={member.dateOfBirth}
                          onChange={(e) => handleMemberChange(index, "dateOfBirth", e.target.value)}
                          className="mt-1"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Date of Baptism</Label>
                        <Input
                          type="date"
                          value={member.dateOfBaptism}
                          onChange={(e) => handleMemberChange(index, "dateOfBaptism", e.target.value)}
                          className="mt-1"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Date of Confirmation</Label>
                        <Input
                          type="date"
                          value={member.dateOfConfirmation}
                          onChange={(e) => handleMemberChange(index, "dateOfConfirmation", e.target.value)}
                          className="mt-1"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  className="bg-[#2c1810] hover:bg-[#3d2318] text-white px-8 py-3 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
