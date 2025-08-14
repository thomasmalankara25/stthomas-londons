"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { motion } from "framer-motion"

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb() {
  const pathname = usePathname()
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    
    // Add home for admin pages
    if (pathname.startsWith('/admin')) {
      breadcrumbs.push({ label: 'Dashboard', href: '/admin' })
    }
    
    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      const label = segment.charAt(0).toUpperCase() + segment.slice(1)
      
      // Don't add duplicate dashboard
      if (segment === 'admin' && breadcrumbs.length > 0) return
      
      breadcrumbs.push({
        label,
        href: index === segments.length - 1 ? undefined : href
      })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbs = generateBreadcrumbs()
  
  if (breadcrumbs.length <= 1) return null
  
  return (
    <motion.nav
      className="flex items-center space-x-2 text-sm text-gray-600 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          )}
          
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-gray-900 transition-colors duration-200 flex items-center gap-1"
            >
              {index === 0 && <Home className="w-4 h-4" />}
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium flex items-center gap-1">
              {index === 0 && <Home className="w-4 h-4" />}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </motion.nav>
  )
} 