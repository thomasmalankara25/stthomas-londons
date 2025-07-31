"use client"

import React from "react"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations"

interface AnimatedGridProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function AnimatedGrid({ children, className = "", staggerDelay = 0.1 }: AnimatedGridProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const containerVariants = {
    ...staggerContainerVariants,
    visible: {
      ...staggerContainerVariants.visible,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={staggerItemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
