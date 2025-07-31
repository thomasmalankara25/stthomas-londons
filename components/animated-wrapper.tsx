"use client"

import { motion } from "framer-motion"
import { pageVariants } from "@/lib/animations"
import type React from "react"

interface AnimatedWrapperProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedWrapper({ children, className = "" }: AnimatedWrapperProps) {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} className={className}>
      {children}
    </motion.div>
  )
}
