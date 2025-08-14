"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { AdminNavigation } from "@/components/admin-navigation"
import { AdminAuthGuard } from "@/components/admin-auth-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  // Don't apply auth guard to login page
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  // Apply auth guard to all other admin routes
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminAuthGuard>
       
        <main className="flex-1">
          {children}
        </main>
      </AdminAuthGuard>
    </div>
  )
} 