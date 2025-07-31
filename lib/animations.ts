"use client"

import type { Variants } from "framer-motion"

// Animation configuration
export const animationConfig = {
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 1.2,
  },
  delay: {
    none: 0,
    short: 0.1,
    medium: 0.2,
    long: 0.4,
  },
  easing: {
    easeOut: [0.0, 0.0, 0.2, 1],
    easeInOut: [0.4, 0.0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
  },
}

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.easing.easeOut,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.easing.easeInOut,
    },
  },
}

// Fade in variants
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.easing.easeOut,
    },
  },
}

// Slide up variants
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.easing.easeOut,
    },
  },
}

// Slide in from left variants
export const slideInLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.easing.easeOut,
    },
  },
}

// Slide in from right variants
export const slideInRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.easing.easeOut,
    },
  },
}

// Scale variants
export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.easing.bounce,
    },
  },
}

// Stagger container variants
export const staggerContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

// Stagger item variants
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.easing.easeOut,
    },
  },
}

// Mobile menu variants
export const mobileMenuVariants: Variants = {
  closed: {
    x: "100%",
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.easing.easeInOut,
    },
  },
  open: {
    x: 0,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.easing.easeOut,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Mobile menu item variants
export const mobileMenuItemVariants: Variants = {
  closed: {
    opacity: 0,
    x: 20,
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.easing.easeOut,
    },
  },
}

// Header variants
export const headerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.easing.easeOut,
    },
  },
}

// Card hover variants
export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.easing.easeOut,
    },
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.easing.easeOut,
    },
  },
}

// Button variants
export const buttonVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.easing.easeOut,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: animationConfig.easing.easeOut,
    },
  },
}

// Hero image variants
export const heroImageVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: animationConfig.duration.slow,
      ease: animationConfig.easing.easeOut,
    },
  },
}

// Floating animation variants
export const floatingVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}
