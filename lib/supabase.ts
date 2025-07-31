import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  image_url?: string
  published: boolean
  created_at: string
  updated_at: string
  created_by: number
}

export interface Event {
  id: number
  title: string
  description: string
  event_date: string
  location: string
  image_url?: string
  registration_required: boolean
  max_participants?: number
  published: boolean
  created_at: string
  updated_at: string
  created_by: number
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
