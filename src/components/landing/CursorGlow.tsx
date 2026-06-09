// Subtle gold radial glow that follows the cursor across the landing page.
// Uses useSpring for a smooth, slightly-lagged feel — hidden on touch/mobile.
// Rendered at z-[9999] so it floats above all content without blocking clicks.
import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const SIZE = 700

export default function CursorGlow() {
  // Start at screen centre so the first spring motion is imperceptible.
  const rawX = useMotionValue(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
  )
  const rawY = useMotionValue(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  )

  // Spring smoothing — mass < 1 keeps it snappy, damping prevents overshoot.
  const smoothX = useSpring(rawX, { stiffness: 90, damping: 22, mass: 0.4 })
  const smoothY = useSpring(rawY, { stiffness: 90, damping: 22, mass: 0.4 })

  // Subtract half the glow size so its centre tracks the cursor, not its corner.
  const x = useTransform(smoothX, (v) => v - SIZE / 2)
  const y = useTransform(smoothY, (v) => v - SIZE / 2)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  return (
    <motion.div
      aria-hidden="true"
      // Hidden on mobile — cursor doesn't exist on touch devices.
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
      style={{ x, y, width: SIZE, height: SIZE }}
    >
      <div
        className="h-full w-full rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 40%, transparent 70%)',
        }}
      />
    </motion.div>
  )
}
