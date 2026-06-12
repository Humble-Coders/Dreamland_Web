import { staggerChildren, fadeIn, fadeUp, slideRight } from './ui/MotionVariants'
import { motion } from 'framer-motion'
import Img from './ui/Img'
import { imgUrl } from '../../utils/imgUrl'
import type { Hotel, HotelRoom } from '../../hooks/useLandingData'

interface Props {
  heroImages?: string[]
  hotel?: Hotel | null
  rooms?: HotelRoom[]
}

export default function LandingHero({ heroImages, hotel, rooms }: Props) {
  const mainImage = heroImages?.[0]
  const accentImage = heroImages?.[1]

  return (
    <section id="hero" className="relative overflow-hidden bg-forest-950 pb-20 pt-24 lg:pb-28 lg:pt-28">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 right-0 -z-10 h-[560px] w-[560px] rounded-full bg-gold-500/[0.06] blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 -z-10 h-[480px] w-[480px] rounded-full bg-forest-700/30 blur-[140px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:px-10">
        {/* Content */}
        <motion.div
          variants={staggerChildren(0.15, 0.2)}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-5 text-center sm:gap-6 lg:items-start lg:text-left"
        >
          {(hotel?.name || hotel?.city) && (
            <motion.div variants={fadeIn} className="flex items-center gap-3">
              <div className="h-px w-8 shrink-0 bg-gold-500/40 sm:w-12" />
              <span className="text-[10px] font-medium tracking-[0.3em] text-gold-400 uppercase sm:text-xs sm:tracking-[0.5em]">
                {[hotel.name, hotel.city].filter(Boolean).join(' · ')}
              </span>
              <div className="h-px w-8 shrink-0 bg-gold-500/40 sm:w-12 lg:hidden" />
            </motion.div>
          )}

          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl leading-[0.95] text-cream sm:text-6xl lg:text-7xl xl:text-8xl"
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
            <motion.p variants={fadeUp} className="max-w-sm text-sm leading-relaxed text-cream/50 sm:text-base lg:max-w-md">
              {hotel.description}
            </motion.p>
          )}

          {/* Stats + booking card */}
          <motion.div
            variants={fadeUp}
            className="mt-2 flex w-full flex-col items-stretch gap-5 rounded-2xl border border-cream/10 bg-forest-900/40 px-6 py-5 backdrop-blur-xl sm:mt-4 sm:flex-row sm:items-center sm:gap-8 sm:px-8 sm:py-6 lg:w-auto"
          >
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-cream/75 lg:justify-start">
              {hotel?.averageRating && (
                <span className="flex items-center gap-1.5">
                  <span className="text-gold-400">★</span>
                  <span className="font-semibold text-cream">{hotel.averageRating.toFixed(1)}</span>
                  {hotel.totalReviews && <span className="text-cream/40">({hotel.totalReviews})</span>}
                </span>
              )}
              {hotel?.city && (
                <span className="flex items-center gap-1.5">
                  <span aria-hidden>📍</span> {hotel.city}
                </span>
              )}
              {(rooms?.length ?? 0) > 0 && (
                <span className="flex items-center gap-1.5">
                  <span aria-hidden>🛏</span> {rooms!.length} Room{rooms!.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="hidden h-9 w-px bg-cream/10 sm:block" />

            <button
              type="button"
              onClick={() => document.querySelector('#rooms')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-forest-950 shadow-[0_8px_32px_rgba(212,175,55,0.35)] transition-all hover:bg-gold-400 hover:shadow-[0_12px_40px_rgba(212,175,55,0.45)] sm:ml-auto sm:px-8 sm:py-3.5"
            >
              Check Availability
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          </motion.div>

          <motion.button
            variants={fadeUp}
            type="button"
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm font-medium text-cream/60 underline-offset-4 transition-colors hover:text-gold-300 hover:underline"
          >
            Have a question? Contact us
          </motion.button>
        </motion.div>

        {/* Photo */}
        <motion.div
          variants={slideRight}
          initial="hidden"
          animate="visible"
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-cream/10 bg-forest-900 shadow-[0_32px_80px_rgba(0,0,0,0.4)]">
            {mainImage && (
              <Img
                src={imgUrl(mainImage, 1200)}
                alt={hotel?.name ?? ''}
                className="h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-transparent" />
          </div>

          {accentImage && (
            <div className="absolute -bottom-8 -left-8 hidden aspect-[4/3] w-2/5 overflow-hidden rounded-2xl border-4 border-forest-950 shadow-[0_20px_50px_rgba(0,0,0,0.45)] sm:block">
              <Img
                src={imgUrl(accentImage, 600)}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Decorative accent */}
          <div className="pointer-events-none absolute -right-4 -top-4 -z-10 h-24 w-24 rounded-2xl border border-gold-500/25 sm:-right-6 sm:-top-6 sm:h-32 sm:w-32" />
        </motion.div>
      </div>
    </section>
  )
}
