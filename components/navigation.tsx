"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"
import { motion } from "framer-motion"
import {
  headerVariants,
  buttonVariants,
} from "@/lib/animations"

interface NavigationItem {
  href: string
  label: string
  description?: string
}

const navigationItems: NavigationItem[] = [
  { href: "/", label: "HOME", description: "Welcome to our church" },
  { href: "/about", label: "ABOUT US", description: "Learn about our history" },
  { href: "/community", label: "COMMUNITY", description: "Join our community" },
  { href: "/events", label: "EVENTS", description: "Upcoming events" },
  { href: "/news", label: "NEWS", description: "Latest updates" },
]

export function Navigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg" 
          : "bg-white shadow-sm"
      }`}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-3">
             
                <Image
                  src="/images/malankara-logo.png"
                  alt="Malankara Catholic Church Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              
              <div className="flex flex-col">
                <motion.div
                  className="text-lg font-bold text-[#8B6F47] tracking-wider group-hover:text-[#A67C52] transition-colors duration-200"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  St. Thomas Malankara
                </motion.div>
                <motion.div
                  className="text-xs text-[#8B6F47] tracking-[0.2em] font-medium group-hover:text-[#A67C52] transition-colors duration-200"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  CATHOLIC CHURCH
                </motion.div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav
          className="hidden md:flex items-center gap-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, staggerChildren: 0.1 }}
        >
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              className="relative group"
            >
              <Link
                href={item.href}
                className={`text-sm font-medium tracking-wide transition-all duration-200 hover:text-[#8B6F47] relative ${
                  isActive(item.href) 
                    ? "text-[#8B6F47]" 
                    : "text-gray-700"
                }`}
              >
                {item.label}
                {/* Active indicator */}
                {isActive(item.href) && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#8B6F47]"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {/* Hover indicator */}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#A67C52] scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
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
          {/* Donate Button */}
          <motion.div 
            variants={buttonVariants} 
            whileHover="hover" 
            whileTap="tap"
            className="hidden md:block"
          >
            <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white px-4 md:px-6 py-2 text-sm font-medium tracking-wide rounded-sm transition-all duration-200 hover:shadow-lg">
              DONATE FUND
            </Button>
          </motion.div>
          
          {/* Mobile Menu */}
          <MobileMenu />
        </motion.div>
      </div>
    </motion.header>
  )
} 