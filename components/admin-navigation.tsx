"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { LogOut, User, Settings, Home } from "lucide-react"
import { authService } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface AdminNavigationItem {
  href: string
  label: string
  icon?: React.ReactNode
  description?: string
}

const adminNavigationItems: AdminNavigationItem[] = [
  { href: "/admin", label: "DASHBOARD", icon: <Home className="w-4 h-4" />, description: "Admin overview" },
  { href: "/admin/events", label: "EVENTS", icon: <Settings className="w-4 h-4" />, description: "Manage events" },
  { href: "/admin/news", label: "NEWS", icon: <Settings className="w-4 h-4" />, description: "Manage news" },
  { href: "/admin/membership", label: "MEMBERSHIP", icon: <User className="w-4 h-4" />, description: "Membership requests" },
  { href: "/admin/registrations", label: "REGISTRATIONS", icon: <User className="w-4 h-4" />, description: "Event registrations" },
]

export function AdminNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser())

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    authService.logout()
    router.push("/admin/login")
  }

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-gray-900/95 backdrop-blur-md shadow-lg" 
          : "bg-gray-900 shadow-sm"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="flex items-center gap-3">
              <motion.div 
                className="flex-shrink-0" 
                whileHover={{ rotate: 360 }} 
                transition={{ duration: 0.8 }}
              >
                <Image
                  src="/images/malankara-logo.png"
                  alt="Malankara Catholic Church Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </motion.div>
              <div className="flex flex-col">
                <motion.div
                  className="text-sm font-bold text-white tracking-wider group-hover:text-gray-300 transition-colors duration-200"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  ADMIN PANEL
                </motion.div>
                <motion.div
                  className="text-xs text-gray-400 tracking-[0.2em] font-medium group-hover:text-gray-300 transition-colors duration-200"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  St. Thomas Malankara
                </motion.div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav
          className="hidden md:flex items-center gap-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, staggerChildren: 0.1 }}
        >
          {adminNavigationItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              className="relative group"
            >
              <Link
                href={item.href}
                className={`text-sm font-medium tracking-wide transition-all duration-200 hover:text-white flex items-center gap-2 relative ${
                  isActive(item.href) 
                    ? "text-white" 
                    : "text-gray-300"
                }`}
              >
                {item.icon}
                {item.label}
                {/* Active indicator */}
                {isActive(item.href) && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white"
                    layoutId="adminActiveTab"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {/* Hover indicator */}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                />
              </Link>
              
              {/* Tooltip */}
              {item.description && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {item.description}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.nav>

        {/* Right Side Actions */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* User Info */}
          {currentUser && (
            <motion.div 
              className="hidden md:flex items-center gap-2 text-gray-300 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <User className="w-4 h-4" />
              <span>{currentUser.email}</span>
            </motion.div>
          )}
          
          {/* Logout Button */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  )
} 