import { supabase } from "../supabase"
import type { News } from "../supabase"

export interface CreateNewsData {
  title: string
  description: string
  content: string
  category: string
  author: string
  status: "draft" | "published"
  image_url?: string
}

export interface UpdateNewsData extends Partial<CreateNewsData> {
  id: number
}

export class NewsService {
  async getAll(): Promise<News[]> {
    const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching news:", error)
      throw new Error("Failed to fetch news")
    }

    return data || []
  }

  async getPublished(): Promise<News[]> {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })

    if (error) {
      console.error("Error fetching published news:", error)
      throw new Error("Failed to fetch published news")
    }

    return data || []
  }

  async getById(id: number): Promise<News | null> {
    const { data, error } = await supabase.from("news").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching news by id:", error)
      return null
    }

    return data
  }

  async create(newsData: CreateNewsData): Promise<News> {
    const dataToInsert = {
      ...newsData,
      published_at: newsData.status === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("news").insert([dataToInsert]).select().single()

    if (error) {
      console.error("Error creating news:", error)
      throw new Error("Failed to create news")
    }

    return data
  }

  async update(updateData: UpdateNewsData): Promise<News> {
    const { id, ...dataToUpdate } = updateData

    const finalData = {
      ...dataToUpdate,
      updated_at: new Date().toISOString(),
      ...(dataToUpdate.status === "published" && { published_at: new Date().toISOString() }),
    }

    const { data, error } = await supabase.from("news").update(finalData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating news:", error)
      throw new Error("Failed to update news")
    }

    return data
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabase.from("news").delete().eq("id", id)

    if (error) {
      console.error("Error deleting news:", error)
      throw new Error("Failed to delete news")
    }
  }

  async getByCategory(category: string): Promise<News[]> {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("category", category)
      .eq("status", "published")
      .order("published_at", { ascending: false })

    if (error) {
      console.error("Error fetching news by category:", error)
      throw new Error("Failed to fetch news by category")
    }

    return data || []
  }
}

export const newsService = new NewsService()
