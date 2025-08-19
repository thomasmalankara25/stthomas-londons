"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authService } from "@/lib/auth"

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("") // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await authService.login(formData)

      if (result.success) {
        router.push("/admin")
      } else {
        setError(result.error || "Login failed")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f4ef] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Image
                src="/images/malankara-logo.png"
                alt="Malankara Catholic Church Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-[#8B6F47]">Admin Login</CardTitle>
              <CardDescription className="text-gray-600">Sign in to access the church admin panel</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#A67C52] hover:bg-[#8B6F47] text-white py-2"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-[#A67C52] hover:text-[#8B6F47]">
                ← Back to Website
              </Link>
            </div>

            {/* <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-600 text-center">
                <strong>Demo Credentials:</strong>
                <br />
                Email: admin@church.com
                <br />
                Password: admin123
              </p>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
