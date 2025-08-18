import { supabase } from "../supabase"

export interface MassSettings {
  id?: number
  church_name: string
  email: string
  mass_time: string
  address: string
  created_at?: string
  updated_at?: string
}

export class MassService {
  async getSettings(): Promise<MassSettings | null> {
    try {
      const { data, error } = await supabase
        .from("mass")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.error("Error fetching mass settings:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in getSettings:", error)
      return null
    }
  }

  async saveSettings(settings: Omit<MassSettings, "id" | "created_at" | "updated_at">): Promise<MassSettings> {
    try {
      // Check if settings already exist
      const existingSettings = await this.getSettings()
      
      if (existingSettings) {
        // Update existing settings
        const { data, error } = await supabase
          .from("mass")
          .update({
            ...settings,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSettings.id)
          .select()
          .single()

        if (error) {
          console.error("Error updating mass settings:", error)
          throw new Error("Failed to update mass settings")
        }

        return data
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from("mass")
          .insert([{
            ...settings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }])
          .select()
          .single()

        if (error) {
          console.error("Error creating mass settings:", error)
          throw new Error("Failed to create mass settings")
        }

        return data
      }
    } catch (error) {
      console.error("Error in saveSettings:", error)
      throw error
    }
  }
}

export const massService = new MassService()
