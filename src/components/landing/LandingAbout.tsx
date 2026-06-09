import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionHeading from './ui/SectionHeading'
import { staggerChildren, slideLeft, slideRight, fadeUp } from './ui/MotionVariants'
import Img from './ui/Img'
import { imgUrl } from '../../utils/imgUrl'
import type { Hotel } from '../../hooks/useLandingData'

interface Props {
  hotel?: Hotel | null
}

export default function LandingAbout({ hotel }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const image = hotel?.photos?.[0]
  const locationLabel = hotel?.address
  const locationSub = [hotel?.city, hotel?.country].filter(Boolean).join(', ')

  const stats = [
    hotel?.totalRooms != null ? { value: `${hotel.totalRooms}+`, label: 'Rooms & Suites' } : null,
    hotel?.starRating != null ? { value: `${hotel.starRating}★`, label: 'Service Standard' } : null,
    { value: '24/7', label: 'Attentive Care' },
  ].filter(Boolean) as { value: string; label: string }[]

  return (
    <section id="about" ref={ref} className="py-16 sm:py-24 lg:py-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">

        {/* Left: image */}
        <motion.div
          variants={slideLeft}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative"
        >
          <div className="absolute -top-4 -left-4 h-full w-full rounded-2xl border border-gold-500/20 hidden sm:block" />
          {image && (
            <Img
              src={imgUrl(image, 800)}
              alt={hotel?.name ?? ''}
              className="relative z-10 aspect-[4/5] w-full rounded-2xl object-cover shadow-[0_32px_80px_rgba(0,0,0,0.6)] bg-forest-900"
              loading="lazy"
            />
          )}
          {(locationLabel || locationSub) && (
            <div className="absolute bottom-4 right-4 z-20 rounded-2xl border border-gold-500/25 bg-forest-900/90 px-4 py-3 backdrop-blur-sm sm:-bottom-6 sm:-right-6 sm:px-6 sm:py-4">
              {locationLabel && <p className="font-display text-lg sm:text-2xl text-gold-400">{locationLabel}</p>}
              {locationSub && <p className="text-xs tracking-widest text-cream/50 uppercase">{locationSub}</p>}
            </div>
          )}
        </motion.div>

        {/* Right: text */}
        <motion.div
          variants={staggerChildren(0.12, 0.1)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col gap-8"
        >
          <SectionHeading
            label="Our Story"
            title={`A World of\nRefined Luxury`}
            align="left"
          />

          {hotel?.description && (
            <motion.div variants={fadeUp} className="space-y-4 text-cream/60 text-base leading-relaxed">
              <p>{hotel.description}</p>
            </motion.div>
          )}

          {stats.length > 0 && (
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-6 border-t border-cream/10 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl text-gold-400">{s.value}</p>
                  <p className="mt-1 text-xs tracking-wide text-cream/45 uppercase">{s.label}</p>
                </div>
              ))}
            </motion.div>
          )}

          <motion.button
            variants={fadeUp}
            type="button"
            onClick={() => document.querySelector('#rooms')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex w-fit items-center gap-2 text-sm font-medium text-gold-400 transition-colors hover:text-gold-300"
          >
            Explore our rooms
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
