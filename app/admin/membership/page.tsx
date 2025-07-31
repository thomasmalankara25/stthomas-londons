"use client"

import { useState, useEffect } from "react"
import { Calendar, Phone, Users, Eye, Check, X, User, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { membershipService } from "@/lib/api/membership"
import type { MembershipRegistration } from "@/lib/supabase"

export default function MembershipRegistrationsPage() {
  const [registrations, setRegistrations] = useState<MembershipRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedRegistration, setSelectedRegistration] = useState<MembershipRegistration | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    loadRegistrations()
  }, [])

  const loadRegistrations = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await membershipService.getAll()
      setRegistrations(data)
    } catch (error) {
      console.error("Error loading membership registrations:", error)
      setError("Failed to load membership registrations")
    } finally {
      setIsLoading(false)
    }
  }

  const updateRegistrationStatus = async (id: number, status: "pending" | "approved" | "rejected") => {
    try {
      setIsUpdating(true)
      await membershipService.updateStatus(id, status, 1, `${status} by admin`)
      setRegistrations((prev) => prev.map((reg) => (reg.id === id ? { ...reg, registration_status: status } : reg)))
      if (selectedRegistration?.id === id) {
        setSelectedRegistration((prev) => (prev ? { ...prev, registration_status: status } : null))
      }
    } catch (error) {
      console.error("Error updating registration status:", error)
      alert("Failed to update registration status")
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "pending":
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not provided"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getFamilySize = (reg: MembershipRegistration) => {
    let size = 1 // Primary member
    if (reg.spouse_name) size += 1 // Spouse
    if (reg.additional_members && reg.additional_members.length > 0) {
      size += reg.additional_members.length
    }
    return size
  }

  if (isLoading) {
    return (
      <AdminAuthGuard>
        <div className="min-h-screen bg-[#f8f4ef] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A67C52] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading membership registrations...</p>
          </div>
        </div>
      </AdminAuthGuard>
    )
  }

  const pendingCount = registrations.filter((r) => r.registration_status === "pending").length
  const approvedCount = registrations.filter((r) => r.registration_status === "approved").length
  const rejectedCount = registrations.filter((r) => r.registration_status === "rejected").length

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#f8f4ef]">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Membership Registrations</h1>
                <p className="text-gray-600">Manage church membership applications</p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={loadRegistrations}
                  variant="outline"
                  className="text-[#8B6F47] border-[#8B6F47] hover:bg-[#8B6F47] hover:text-white bg-transparent"
                >
                  Refresh
                </Button>
                <Button
                  onClick={() => window.history.back()}
                  variant="outline"
                  className="text-[#8B6F47] border-[#8B6F47] hover:bg-[#8B6F47] hover:text-white bg-transparent"
                >
                  Back to Admin
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 md:px-6 py-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
              <Button onClick={loadRegistrations} variant="outline" size="sm" className="ml-4 bg-transparent">
                Retry
              </Button>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <Users className="h-4 w-4 text-[#A67C52]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{registrations.length}</div>
                <p className="text-xs text-muted-foreground">All time registrations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <Check className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedCount}</div>
                <p className="text-xs text-muted-foreground">Active members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <X className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rejectedCount}</div>
                <p className="text-xs text-muted-foreground">Declined applications</p>
              </CardContent>
            </Card>
          </div>

          {/* Registrations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Membership Applications</CardTitle>
              <CardDescription>Review and manage membership registration requests</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {registrations.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No membership registrations yet.</p>
                  <p className="text-sm text-gray-400">Applications will appear here when submitted.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-700">Primary Member</th>
                        <th className="text-left p-4 font-medium text-gray-700">Contact</th>
                        <th className="text-left p-4 font-medium text-gray-700">Family Size</th>
                        <th className="text-left p-4 font-medium text-gray-700">Applied Date</th>
                        <th className="text-left p-4 font-medium text-gray-700">Status</th>
                        <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((registration) => (
                        <tr key={registration.id} className="border-t hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#A67C52] rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{registration.primary_member_name}</p>
                                <p className="text-sm text-gray-500">{registration.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{registration.contact_number}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="truncate max-w-[200px]">{registration.home_address}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium">{getFamilySize(registration)} members</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">{formatDate(registration.created_at)}</span>
                            </div>
                          </td>
                          <td className="p-4">{getStatusBadge(registration.registration_status)}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedRegistration(registration)}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {registration.registration_status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateRegistrationStatus(registration.id, "approved")}
                                    disabled={isUpdating}
                                    className="text-green-600 hover:text-green-700"
                                    title="Approve"
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateRegistrationStatus(registration.id, "rejected")}
                                    disabled={isUpdating}
                                    className="text-red-600 hover:text-red-700"
                                    title="Reject"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
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
        </div>

        {/* Detail Modal */}
        {selectedRegistration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Membership Application Details</h2>
                    <p className="text-gray-600">
                      {selectedRegistration.primary_member_name} • Applied {formatDate(selectedRegistration.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(selectedRegistration.registration_status)}
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedRegistration(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Primary Member Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Primary Member</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <p className="text-gray-800">{selectedRegistration.primary_member_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-800">{selectedRegistration.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Contact Number</label>
                      <p className="text-gray-800">{selectedRegistration.contact_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                      <p className="text-gray-800">{formatDate(selectedRegistration.date_of_birth)}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">Home Address</label>
                      <p className="text-gray-800">{selectedRegistration.home_address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date of Baptism</label>
                      <p className="text-gray-800">{formatDate(selectedRegistration.date_of_baptism)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date of Confirmation</label>
                      <p className="text-gray-800">{formatDate(selectedRegistration.date_of_confirmation)}</p>
                    </div>
                  </div>
                </div>

                {/* Spouse Information */}
                {selectedRegistration.spouse_name && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Spouse Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Full Name</label>
                        <p className="text-gray-800">{selectedRegistration.spouse_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-800">{selectedRegistration.spouse_email || "Not provided"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Contact Number</label>
                        <p className="text-gray-800">{selectedRegistration.spouse_contact_number || "Not provided"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                        <p className="text-gray-800">{formatDate(selectedRegistration.spouse_date_of_birth)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Date of Baptism</label>
                        <p className="text-gray-800">{formatDate(selectedRegistration.spouse_date_of_baptism)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Date of Confirmation</label>
                        <p className="text-gray-800">{formatDate(selectedRegistration.spouse_date_of_confirmation)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Date of Marriage</label>
                        <p className="text-gray-800">{formatDate(selectedRegistration.date_of_marriage)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Family Members */}
                {selectedRegistration.additional_members && selectedRegistration.additional_members.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Family Members</h3>
                    <div className="space-y-4">
                      {selectedRegistration.additional_members.map((member, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-2">Member {index + 1}</h4>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">Name</label>
                              <p className="text-gray-800">{member.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                              <p className="text-gray-800">{formatDate(member.dateOfBirth)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Date of Baptism</label>
                              <p className="text-gray-800">{formatDate(member.dateOfBaptism)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Date of Confirmation</label>
                              <p className="text-gray-800">{formatDate(member.dateOfConfirmation)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Registration Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Registration Information</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Registration Date</label>
                      <p className="text-gray-800">{formatDate(selectedRegistration.created_at)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Last Updated</label>
                      <p className="text-gray-800">{formatDate(selectedRegistration.updated_at)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedRegistration.registration_status)}</div>
                    </div>
                  </div>
                  {selectedRegistration.notes && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-600">Admin Notes</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-md mt-1">{selectedRegistration.notes}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {selectedRegistration.registration_status === "pending" && (
                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button
                      onClick={() => updateRegistrationStatus(selectedRegistration.id, "rejected")}
                      disabled={isUpdating}
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <X className="w-4 h-4 mr-2" />
                      {isUpdating ? "Rejecting..." : "Reject Application"}
                    </Button>
                    <Button
                      onClick={() => updateRegistrationStatus(selectedRegistration.id, "approved")}
                      disabled={isUpdating}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {isUpdating ? "Approving..." : "Approve Application"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminAuthGuard>
  )
}
