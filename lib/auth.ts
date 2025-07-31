import { supabase } from "./supabase"

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUser {
  id: number
  username: string
  email: string
}

class AuthService {
  private currentUser: AuthUser | null = null

  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, username, email, password")
        .eq("email", credentials.email)
        .single()

      if (error || !data) {
        return { success: false, error: "Invalid email or password" }
      }

      // Simple password comparison (in production, use proper hashing)
      if (data.password !== credentials.password) {
        return { success: false, error: "Invalid email or password" }
      }

      const user: AuthUser = {
        id: data.id,
        username: data.username,
        email: data.email,
      }

      this.currentUser = user

      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("church_admin_user", JSON.stringify(user))
      }

      return { success: true, user }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "An error occurred during login" }
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("church_admin_user")
    }
  }

  getCurrentUser(): AuthUser | null {
    if (this.currentUser) {
      return this.currentUser
    }

    // Try to get from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("church_admin_user")
      if (stored) {
        try {
          this.currentUser = JSON.parse(stored)
          return this.currentUser
        } catch {
          localStorage.removeItem("church_admin_user")
        }
      }
    }

    return null
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}

export const authService = new AuthService()
