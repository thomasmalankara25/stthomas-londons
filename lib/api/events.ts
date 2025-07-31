import { supabase } from "../supabase"
import type { Event, EventRegistration } from "../supabase"

export interface CreateEventData {
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  attendees: string
  status: "draft" | "upcoming"
  image_url?: string
  registration_form?: {
    enabled: boolean
    fields: any[]
  }
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: number
}

export interface RegistrationData {
  event_id: number
  registration_data: Record<string, string>
}

export class EventsService {
  async getAll(): Promise<Event[]> {
    const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching events:", error)
      throw new Error("Failed to fetch events")
    }

    return data || []
  }

  async getUpcoming(): Promise<Event[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "upcoming")
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching upcoming events:", error)
      throw new Error("Failed to fetch upcoming events")
    }

    return data || []
  }

  async getById(id: number): Promise<Event | null> {
    const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching event by id:", error)
      return null
    }

    return data
  }

  async create(eventData: CreateEventData): Promise<Event> {
    const dataToInsert = {
      ...eventData,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("events").insert([dataToInsert]).select().single()

    if (error) {
      console.error("Error creating event:", error)
      throw new Error("Failed to create event")
    }

    return data
  }

  async update(updateData: UpdateEventData): Promise<Event> {
    const { id, ...dataToUpdate } = updateData

    const finalData = {
      ...dataToUpdate,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("events").update(finalData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating event:", error)
      throw new Error("Failed to update event")
    }

    return data
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabase.from("events").delete().eq("id", id)

    if (error) {
      console.error("Error deleting event:", error)
      throw new Error("Failed to delete event")
    }
  }

  async registerForEvent(registrationData: RegistrationData): Promise<EventRegistration> {
    const { data, error } = await supabase.from("event_registrations").insert([registrationData]).select().single()

    if (error) {
      console.error("Error registering for event:", error)
      throw new Error("Failed to register for event")
    }

    return data
  }

  async getEventRegistrations(eventId: number): Promise<EventRegistration[]> {
    try {
      const { data, error } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching event registrations:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getEventRegistrations:", error)
      return []
    }
  }

  async getAllRegistrations(): Promise<EventRegistration[]> {
    try {
      const { data, error } = await supabase
        .from("event_registrations")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching all event registrations:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getAllRegistrations:", error)
      return []
    }
  }

  async getByCategory(category: string): Promise<Event[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("category", category)
      .eq("status", "upcoming")
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching events by category:", error)
      throw new Error("Failed to fetch events by category")
    }

    return data || []
  }
}

export const eventsService = new EventsService()
