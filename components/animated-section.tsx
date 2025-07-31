"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import type React from "react"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  variants?: any
  delay?: number
  once?: boolean
}

export function AnimatedSection({ children, className = "", variants, delay = 0, once = true }: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-100px" })

  const defaultVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.0, 0.0, 0.2, 1],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants || defaultVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
