"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { mobileMenuVariants, mobileMenuItemVariants, buttonVariants } from "@/lib/animations"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  // Close menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="md:hidden text-[#8B6F47]"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed right-0 top-0 w-[80%] max-w-sm bg-white shadow-xl p-6 z-50" style={{ height: "100vh" }}  
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div className="flex justify-between items-center mb-8" variants={mobileMenuItemVariants}>
                <div className="flex flex-col items-center">
                  <motion.div
                    className="text-lg font-bold text-[#8B6F47] tracking-wider"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    ST. THOMAS MALANKARA
                  </motion.div>
                  <motion.div
                    className="text-xs text-[#8B6F47] tracking-[0.2em] font-medium"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    CHURCH
                  </motion.div>
                  <motion.div
                    className="flex items-center mt-1"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <div className="w-6 h-px bg-[#8B6F47]"></div>
                    <div className="mx-1">
                      <Image
                        src="/images/malankara-logo.png"
                        alt="Malankara Catholic Church Logo"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                    <div className="w-6 h-px bg-[#8B6F47]"></div>
                  </motion.div>
                </div>
                <motion.button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </motion.div>

              <motion.nav className="flex flex-col space-y-6 mb-8" variants={mobileMenuItemVariants}>
                {[
                  { href: "/", label: "HOME" },
                  { href: "/about", label: "ABOUT US" },
                  { href: "/community", label: "COMMUNITY" },
                  { href: "/events", label: "EVENTS" },
                  { href: "/news", label: "NEWS" },
                  { href: "/gallery", label: "GALLERY" },
                ].map((item, index) => (
                  <motion.div key={item.href} variants={mobileMenuItemVariants} custom={index}>
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-[#8B6F47] text-base font-medium tracking-wide border-b border-gray-100 pb-2 block transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* Donate Button - Temporarily Hidden */}
              {/* <motion.div variants={mobileMenuItemVariants}>
                <Button
                  className="w-full bg-[#A67C52] hover:bg-[#8B6F47] text-white py-3 text-sm font-medium tracking-wide rounded-sm"
                  asChild
                >
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    DONATE FUND
                  </motion.div>
                </Button>
              </motion.div> */}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
