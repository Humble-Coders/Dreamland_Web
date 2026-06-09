import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { staggerChildren, fadeIn, fadeUp } from './ui/MotionVariants'
import type { Hotel } from '../../hooks/useLandingData'

interface Props {
  heroImages?: string[]
  hotel?: Hotel | null
}

export default function LandingHero({ heroImages, hotel }: Props) {
  const heroRef = useRef<HTMLElement>(null)
  const bgImage = heroImages?.[0]

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.6], ['0%', '-8%'])

  return (
    <section id="hero" ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10 scale-110">
        {bgImage && (
          <img
            src={bgImage}
            alt={hotel?.name ?? ''}
            className="h-full w-full object-cover"
            loading="eager"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/50 to-forest-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/40 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <motion.div
          variants={staggerChildren(0.15, 0.4)}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {(hotel?.name || hotel?.city) && (
            <motion.div variants={fadeIn} className="flex items-center gap-4">
              <div className="h-px w-12 bg-gold-500/40" />
              <span className="text-xs font-medium tracking-[0.5em] text-gold-400 uppercase">
                {[hotel.name, hotel.city].filter(Boolean).join(' · ')}
              </span>
              <div className="h-px w-12 bg-gold-500/40" />
            </motion.div>
          )}

          <motion.h1
            variants={fadeUp}
            className="font-display text-6xl leading-[0.95] text-cream sm:text-7xl lg:text-8xl xl:text-[104px]"
          >
            Your Next Stay
            <span className="block text-gold-400">Awaits</span>
          </motion.h1>

          {hotel?.name && (
            <motion.p variants={fadeUp} className="font-display text-lg italic text-cream/65 sm:text-xl">
              Experience curated luxury at {hotel.name}
            </motion.p>
          )}

          {hotel?.description && (
            <motion.p variants={fadeUp} className="mx-auto max-w-sm text-sm leading-relaxed text-cream/50 sm:text-base">
              {hotel.description}
            </motion.p>
          )}

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => document.querySelector('#rooms')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-forest-950 shadow-[0_8px_32px_rgba(212,175,55,0.35)] transition-all hover:bg-gold-400 hover:shadow-[0_12px_40px_rgba(212,175,55,0.45)]"
            >
              Explore Rooms
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </button>
            <button
              type="button"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center gap-2 rounded-full border border-cream/25 px-8 py-3.5 text-sm font-medium text-cream/80 transition-all hover:border-gold-400/50 hover:text-gold-300"
            >
              Contact Us
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/30"
      >
        <span className="text-[10px] tracking-[0.4em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
            <rect x="1" y="1" width="12" height="18" rx="6" stroke="currentColor" strokeWidth="1.2" />
            <motion.rect
              x="6" y="4" width="2" height="4" rx="1" fill="currentColor"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
