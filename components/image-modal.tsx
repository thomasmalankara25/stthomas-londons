"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  alt: string
  title?: string
}

export function ImageModal({ isOpen, onClose, imageUrl, alt, title }: ImageModalProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Debug logging
  useEffect(() => {
    if (isOpen) {
      console.log("ImageModal opened with:", { imageUrl, alt, title })
      setImageError(false)
      setImageLoading(true)
    }
  }, [isOpen, imageUrl, alt, title])

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dark blurry background */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            className="relative z-10 max-w-7xl max-h-[100vh]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 z-20 text-white hover:text-gray-300 hover:bg-white/10"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Image container */}
            <div className="relative w-full h-full max-h-[90vh] flex items-center justify-center">
              <div className="relative w-full h-full max-w-5xl max-h-[80vh] bg-gray-700 overflow-y-auto">
                {/* Debug info */}
              
                
                {imageError ? (
                  <div className="flex flex-col items-center justify-center h-full text-white">
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-lg mb-2">Image could not be loaded</p>
                    <p className="text-sm opacity-75">URL: {imageUrl}</p>
                  </div>
                ) : (
                  <>
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                      </div>
                    )}
                    {/* Test with regular img tag first */}
                    <img
                      src={imageUrl}
                      alt={alt}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        console.error("Image failed to load:", imageUrl, e)
                        setImageError(true)
                        setImageLoading(false)
                      }}
                      onLoad={() => {
                        console.log("Image loaded successfully:", imageUrl)
                        setImageLoading(false)
                      }}
                    />
                    
                   
                  </>
                )}
              </div>
            </div>

        
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
