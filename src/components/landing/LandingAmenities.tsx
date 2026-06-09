import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionHeading from './ui/SectionHeading'
import { staggerChildren, scaleIn, fadeUp } from './ui/MotionVariants'
import type { Hotel } from '../../hooks/useLandingData'

interface Amenity {
  icon: string
  title: string
  desc: string
}

const AMENITY_ICON_MAP: Record<string, string> = {
  wifi: '📶',
  internet: '📶',
  parking: '🅿️',
  pool: '🏊',
  swimming: '🏊',
  spa: '🧖',
  gym: '🏋️',
  fitness: '🏋️',
  bar: '🍸',
  restaurant: '🍴',
  dining: '🍽️',
  roomservice: '🛎️',
  laundry: '👔',
  concierge: '🤵',
  housekeeping: '🧹',
  ac: '❄️',
  airconditioning: '❄️',
  conference: '🤝',
  business: '💼',
  pet: '🐾',
  transport: '🚗',
}

function toIcon(amenityType: string): string {
  const key = amenityType.toLowerCase().replace(/[^a-z]/g, '')
  return AMENITY_ICON_MAP[key] ?? '✦'
}

function buildAmenities(hotel: Hotel): Amenity[] {
  const cards: Amenity[] = []

  if (hotel.highlights?.length) {
    for (const h of hotel.highlights) {
      cards.push({ icon: toIcon(h.amenityType || h.category), title: h.title, desc: '' })
    }
  }

  if (hotel.parkingAvailable) {
    cards.push({
      icon: '🅿️',
      title: hotel.parkingType ? `${hotel.parkingType} Parking` : 'Secure Parking',
      desc: hotel.parkingSpots ? `${hotel.parkingSpots} spots available for resident guests.` : '',
    })
  }

  if (hotel.foodInclusivity === true) {
    cards.push({ icon: '🍽️', title: 'Food Inclusive', desc: '' })
  }

  if (hotel.mealPlansAvailable?.length) {
    const plans = hotel.mealPlansAvailable.map((p) => p.value).join(', ')
    cards.push({ icon: '🍴', title: 'Meal Plans', desc: plans })
  }

  return cards
}

interface Props {
  hotel?: Hotel | null
}

export default function LandingAmenities({ hotel }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  const amenities = hotel ? buildAmenities(hotel) : []

  return (
    <section id="amenities" ref={ref} className="relative py-28 lg:py-36 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(212,175,55,0.04),transparent)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          variants={staggerChildren(0.12)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading
            label="Amenities & Experiences"
            title="Everything You Need"
            subtitle="Every amenity at Hotel Dreamland is curated to enhance your stay — nothing left to chance."
          />
        </motion.div>

        {amenities.length > 0 && (
          <motion.div
            variants={staggerChildren(0.1, 0.2)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {amenities.map((a) => (
              <motion.div
                key={a.title}
                variants={scaleIn}
                className="group relative overflow-hidden rounded-2xl border border-cream/8 bg-forest-900/40 p-7 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/25 hover:bg-forest-900/60"
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-500/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-500/20 bg-gold-500/8 text-2xl transition-transform duration-300 group-hover:scale-110">
                    {a.icon}
                  </div>
                  <h3 className="mb-2 font-display text-xl text-cream">{a.title}</h3>
                  {a.desc && <p className="text-sm leading-relaxed text-cream/50">{a.desc}</p>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-20 flex items-center justify-center gap-4 text-gold-500/30"
        >
          <div className="h-px w-24 bg-gold-500/20" />
          <span className="text-sm">✦ ◈ ✦</span>
          <div className="h-px w-24 bg-gold-500/20" />
        </motion.div>
      </div>
    </section>
  )
}
