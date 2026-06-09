import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionHeading from './ui/SectionHeading'
import { staggerChildren, slideLeft, slideRight, fadeUp } from './ui/MotionVariants'
import type { Hotel, Attraction } from '../../hooks/useLandingData'

interface Detail {
  icon: string
  label: string
  value: string
}

function buildDetails(hotel: Hotel): Detail[] {
  const details: Detail[] = []
  const addressParts = [hotel.address, hotel.city, hotel.country, hotel.pincode].filter(Boolean)
  if (addressParts.length) details.push({ icon: '📍', label: 'Address', value: addressParts.join(', ') })
  if (hotel.contactPhone) details.push({ icon: '📞', label: 'Phone', value: hotel.contactPhone })
  if (hotel.contactEmail) details.push({ icon: '✉️', label: 'Email', value: hotel.contactEmail })
  if (hotel.checkInTime || hotel.checkOutTime) {
    details.push({
      icon: '🕐',
      label: 'Check-in / out',
      value: `${hotel.checkInTime ?? '—'} / ${hotel.checkOutTime ?? '—'}`,
    })
  }
  return details
}

function buildMapsUrl(hotel: Hotel): string {
  if (hotel.latitude && hotel.longitude) return `https://maps.google.com/?q=${hotel.latitude},${hotel.longitude}`
  const q = [hotel.name, hotel.city, hotel.country].filter(Boolean).join(', ')
  return `https://maps.google.com/?q=${encodeURIComponent(q)}`
}

interface Props {
  hotel?: Hotel | null
  attractions?: Attraction[]
}

export default function LandingLocation({ hotel, attractions }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const details = hotel ? buildDetails(hotel) : []
  const mapsUrl = hotel ? buildMapsUrl(hotel) : '#'
  const cityLabel = [hotel?.city, hotel?.country].filter(Boolean).join(', ')
  const hotelName = hotel?.name ?? ''
  const modes = hotel?.modes ?? []

  return (
    <section id="location" ref={ref} className="py-16 sm:py-24 lg:py-36 bg-forest-900/20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 px-6 lg:grid-cols-2 lg:px-10">

        {/* Left: map visual */}
        <motion.div
          variants={slideLeft}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative order-2 lg:order-1"
        >
          <div className="relative h-80 overflow-hidden rounded-2xl border border-gold-500/15 bg-forest-900/60 lg:h-[420px]">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.4) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute h-16 w-16 rounded-full bg-gold-500/20"
                />
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  className="absolute h-10 w-10 rounded-full bg-gold-500/30"
                />
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 text-forest-950 text-lg shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                  📍
                </div>
              </div>
            </div>
            {(hotelName || cityLabel) && (
              <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-gold-500/20 bg-forest-950/80 px-5 py-4 backdrop-blur-sm">
                {hotelName && <p className="font-display text-lg text-cream">{hotelName}</p>}
                {cityLabel && <p className="text-xs text-cream/50">{cityLabel}</p>}
              </div>
            )}
          </div>

          <motion.a
            variants={fadeUp}
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gold-500/30 bg-gold-500/8 py-3.5 text-sm font-medium text-gold-300 transition-all hover:bg-gold-500/15"
          >
            Get Directions
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </motion.a>
        </motion.div>

        {/* Right: details */}
        <motion.div
          variants={staggerChildren(0.12)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="order-1 lg:order-2"
        >
          <SectionHeading
            label="Find Us"
            title="In the Heart of Karnal"
            subtitle="Conveniently located on GT Road, Hotel Dreamland is easily accessible from all major points in Haryana."
            align="left"
          />

          {details.length > 0 && (
            <div className="mt-10 space-y-4">
              {details.map((d) => (
                <motion.div
                  key={d.label}
                  variants={slideRight}
                  className="flex items-start gap-4 rounded-xl border border-cream/8 bg-forest-900/30 px-5 py-4"
                >
                  <span className="mt-0.5 text-xl">{d.icon}</span>
                  <div>
                    <p className="text-xs tracking-widest text-gold-400/70 uppercase">{d.label}</p>
                    <p className="mt-0.5 text-sm text-cream/70">{d.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Nearby Attractions — from attractions collection */}
          {attractions && attractions.length > 0 && (
            <motion.div variants={slideRight} className="mt-8">
              <p className="mb-4 text-xs font-medium tracking-[0.3em] text-gold-400/70 uppercase">Nearby Attractions</p>
              <div className="space-y-2.5">
                {attractions.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg border border-cream/[0.06] bg-forest-900/20 px-4 py-3">
                    <span className="text-sm text-cream/65">{a.name}</span>
                    <span className="text-xs text-gold-400/70">{a.category}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Getting Here — from hotel.modes[] */}
          {modes.length > 0 && (
            <motion.div variants={slideRight} className="mt-8">
              <p className="mb-4 text-xs font-medium tracking-[0.3em] text-gold-400/70 uppercase">Getting Here</p>
              <div className="space-y-2.5">
                {modes.map((m, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-cream/[0.06] bg-forest-900/20 px-4 py-3">
                    <div>
                      <span className="text-sm text-cream/65">{m.name}</span>
                      {m.category && <span className="ml-2 text-xs text-cream/35">({m.category})</span>}
                    </div>
                    {m.distance && <span className="text-xs text-gold-400/70">{m.distance}</span>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
