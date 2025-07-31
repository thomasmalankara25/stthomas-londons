import { supabase } from "../supabase"
import type { MembershipRegistration, AdditionalMember } from "../supabase"

export interface MembershipRegistrationData {
  email: string
  primaryMemberName: string
  contactNumber: string
  homeAddress: string
  dateOfBirth?: string
  dateOfBaptism?: string
  dateOfConfirmation?: string
  dateOfMarriage?: string
  spouseName?: string
  spouseEmail?: string
  spouseContactNumber?: string
  spouseDateOfBirth?: string
  spouseDateOfBaptism?: string
  spouseDateOfConfirmation?: string
  additionalMembers: AdditionalMember[]
}

export const membershipService = {
  async create(data: MembershipRegistrationData): Promise<MembershipRegistration> {
    const { data: result, error } = await supabase
      .from("membership_registrations")
      .insert({
        email: data.email,
        primary_member_name: data.primaryMemberName,
        contact_number: data.contactNumber,
        home_address: data.homeAddress,
        date_of_birth: data.dateOfBirth || null,
        date_of_baptism: data.dateOfBaptism || null,
        date_of_confirmation: data.dateOfConfirmation || null,
        date_of_marriage: data.dateOfMarriage || null,
        spouse_name: data.spouseName || null,
        spouse_email: data.spouseEmail || null,
        spouse_contact_number: data.spouseContactNumber || null,
        spouse_date_of_birth: data.spouseDateOfBirth || null,
        spouse_date_of_baptism: data.spouseDateOfBaptism || null,
        spouse_date_of_confirmation: data.spouseDateOfConfirmation || null,
        additional_members: data.additionalMembers,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create membership registration: ${error.message}`)
    }

    return result
  },

  async getAll(): Promise<MembershipRegistration[]> {
    const { data, error } = await supabase
      .from("membership_registrations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch membership registrations: ${error.message}`)
    }

    return data || []
  },

  async getById(id: number): Promise<MembershipRegistration | null> {
    const { data, error } = await supabase.from("membership_registrations").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // Not found
      }
      throw new Error(`Failed to fetch membership registration: ${error.message}`)
    }

    return data
  },

  async updateStatus(
    id: number,
    status: "pending" | "approved" | "rejected",
    processedBy?: number,
    notes?: string,
  ): Promise<MembershipRegistration> {
    const { data, error } = await supabase
      .from("membership_registrations")
      .update({
        registration_status: status,
        processed_by: processedBy || null,
        notes: notes || null,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update membership registration status: ${error.message}`)
    }

    return data
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase.from("membership_registrations").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete membership registration: ${error.message}`)
    }
  },

  async getByStatus(status: "pending" | "approved" | "rejected"): Promise<MembershipRegistration[]> {
    const { data, error } = await supabase
      .from("membership_registrations")
      .select("*")
      .eq("registration_status", status)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch membership registrations by status: ${error.message}`)
    }

    return data || []
  },
}
