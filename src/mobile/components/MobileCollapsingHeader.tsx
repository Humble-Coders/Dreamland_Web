import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Props {
  hotelName: string
  heroHeight: number   // px — header solidifies after scrolling past this
  onBack: () => void
}

// Ken Perlin's smootherstep — same easing used in the Android collapsing header
function smootherstep(t: number): number {
  const x = Math.max(0, Math.min(1, t))
  return x * x * x * (x * (x * 6 - 15) + 10)
}

export default function MobileCollapsingHeader({ hotelName, heroHeight, onBack }: Props) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const delay = 100 // px — start collapsing after this much scroll
    const onScroll = () => {
      const scroll = Math.max(0, window.scrollY)
      const raw = (scroll - delay) / Math.max(1, (heroHeight - delay) * 0.72)
      setProgress(smootherstep(Math.min(1, Math.max(0, raw))))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [heroHeight])

  const bgOpacity = progress
  const nameOpacity = progress > 0.6 ? (progress - 0.6) / 0.4 : 0

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 transition-none"
      style={{
        background: `rgba(5, 32, 23, ${bgOpacity * 0.95})`,
        backdropFilter: bgOpacity > 0.1 ? 'blur(12px)' : undefined,
        borderBottom: bgOpacity > 0.5 ? `1px solid rgba(251,246,233,${bgOpacity * 0.06})` : undefined,
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Back button — always visible */}
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream/20 bg-forest-950/60 text-cream transition-colors active:bg-forest-900"
          aria-label="Go back"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Hotel name — fades in as user scrolls */}
        <motion.h1
          className="min-w-0 flex-1 truncate font-display text-lg text-gold-400"
          style={{ opacity: nameOpacity }}
          aria-hidden={nameOpacity < 0.1}
        >
          {hotelName}
        </motion.h1>
      </div>
    </div>
  )
}
