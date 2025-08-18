import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://bnnyldxlkpqxefvysagh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJubnlsZHhsa3BxeGVmdnlzYWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzA0MDksImV4cCI6MjA2NjAwNjQwOX0.iBisOaUAq_v6zJT5TtmRCyvFb65CWB5UQwV4Os9dDso"
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

// Types
export interface User {
  id: number
  email: string
  password_hash: string
  role: "admin" | "editor"
  created_at: string
  updated_at: string
}

export interface News {
  id: number
  title: string
  content: string
  excerpt: string
  description?: string
  image_url?: string
  category?: string
  author?: string
  published: boolean
  status?: string
  published_at?: string
  created_at: string
  updated_at: string
  created_by: number
}

export interface Event {
  id: number
  title: string
  description: string
  event_date: string
  date?: string
  time?: string
  location: string
  image_url?: string
  category?: string
  attendees?: string
  status?: "draft" | "upcoming"
  registration_required?: boolean
  max_participants?: number
  published?: boolean
  registration_form?: {
    enabled: boolean
    fields?: any[]
  } | null
  external_link?: string | null
  created_at: string
  updated_at: string
  created_by?: number
}

export interface EventRegistration {
  id: number
  event_id: number
  name: string
  email: string
  phone?: string
  message?: string
  created_at: string
}

export interface AdditionalMember {
  name: string
  dateOfBirth: string
  dateOfBaptism: string
  dateOfConfirmation: string
}

export interface FormField {
  id: string
  type: "text" | "email" | "tel" | "number"
  label: string
  required: boolean
  placeholder: string
}

export interface MembershipRegistration {
  id: number
  email: string
  primary_member_name: string
  contact_number: string
  home_address: string
  date_of_birth?: string
  date_of_baptism?: string
  date_of_confirmation?: string
  date_of_marriage?: string
  spouse_name?: string
  spouse_email?: string
  spouse_contact_number?: string
  spouse_date_of_birth?: string
  spouse_date_of_baptism?: string
  spouse_date_of_confirmation?: string
  additional_members: AdditionalMember[]
  registration_status: "pending" | "approved" | "rejected"
  processed_by?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface MassSettings {
  id?: number
  church_name: string
  email: string
  mass_time: string
  address: string
  created_at?: string
  updated_at?: string
}
