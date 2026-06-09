// Shared Framer Motion variants used across all landing page sections.
// Use `staggerChildren()` on containers and the named variants on children.
import type { Variants } from 'framer-motion'

export const ease = [0.16, 1, 0.3, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease } },
}

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease } },
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.85, ease } },
}

// Returns a container variant that staggers its children.
export function staggerChildren(delay = 0.12, childDelay = 0.1): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: delay, delayChildren: childDelay } },
  }
}
