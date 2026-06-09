import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionHeading from './ui/SectionHeading'
import { staggerChildren, fadeUp, slideLeft } from './ui/MotionVariants'
import type { HotelRoom } from '../../hooks/useLandingData'

interface Room {
  id: string
  category: string
  name: string
  desc: string
  image: string
  capacity: string
  type: string
  highlights: string[]
}

function toDisplayRoom(r: HotelRoom): Room {
  const guestCount = r.maxOccupancy ?? r.capacity
  return {
    id: r.id,
    category: r.name,
    name: r.name,
    desc: r.description ?? '',
    image: r.media?.[0] ?? '',
    capacity: guestCount ? `Up to ${guestCount} Guests` : '',
    type: r.bedType ?? '',
    highlights: r.amenities ?? [],
  }
}

interface Props {
  rooms?: HotelRoom[]
}

export default function LandingRooms({ rooms }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const displayRooms = rooms?.map(toDisplayRoom) ?? []

  return (
    <section id="rooms" ref={ref} className="py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          variants={staggerChildren(0.12)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-20"
        >
          <SectionHeading
            label="Featured Suites"
            title="Your Private Sanctuary"
            subtitle="Three distinct room categories — each a carefully considered world of calm, designed not just to be seen, but to be felt."
          />
        </motion.div>

        {displayRooms.length > 0 && (
          <div className="space-y-24">
            {displayRooms.map((room, index) => (
              <RoomCard key={room.id} room={room} index={index} isInView={isInView} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function RoomCard({ room, index, isInView }: { room: Room; index: number; isInView: boolean }) {
  const imageLeft = index % 2 === 0

  return (
    <motion.div
      variants={staggerChildren(0.12, 0.05)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
        !imageLeft ? 'lg:[&>*:first-child]:order-2' : ''
      }`}
    >
      {/* Image */}
      <motion.div variants={slideLeft} className="group relative overflow-hidden rounded-2xl">
        <div className="absolute top-5 left-5 z-10 rounded-full border border-gold-500/40 bg-forest-950/70 px-4 py-1.5 backdrop-blur-sm">
          <span className="text-xs font-medium tracking-[0.25em] text-gold-400 uppercase">{room.category}</span>
        </div>
        <div className="absolute top-5 right-5 z-10 flex flex-col items-end gap-1.5">
          {room.capacity && (
            <span className="rounded-full border border-cream/15 bg-forest-950/60 px-3 py-1 text-[11px] text-cream/70 backdrop-blur-sm">
              👥 {room.capacity}
            </span>
          )}
          {room.type && (
            <span className="rounded-full border border-cream/15 bg-forest-950/60 px-3 py-1 text-[11px] text-cream/70 backdrop-blur-sm">
              {room.type}
            </span>
          )}
        </div>
        {room.image && (
          <img
            src={room.image}
            alt={room.name}
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/30 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="flex flex-col gap-6">
        <motion.div variants={fadeUp}>
          <p className="mb-2 text-xs font-medium tracking-[0.35em] text-gold-400 uppercase">{room.category} Room</p>
          <h3 className="font-display text-4xl text-cream lg:text-5xl">{room.name}</h3>
        </motion.div>

        {room.desc && (
          <motion.p variants={fadeUp} className="text-base leading-relaxed text-cream/55">
            {room.desc}
          </motion.p>
        )}

        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <div className="h-px w-8 bg-gold-500/40" />
          <span className="text-[10px] text-gold-500/50">◈</span>
          <div className="h-px w-8 bg-gold-500/40" />
        </motion.div>

        {room.highlights.length > 0 && (
          <motion.div variants={fadeUp}>
            <p className="mb-3 text-[10px] font-medium tracking-[0.3em] text-cream/30 uppercase">Room Highlights</p>
            <div className="flex flex-wrap gap-2">
              {room.highlights.map((h) => (
                <span key={h} className="rounded-full border border-cream/10 bg-forest-900/50 px-3.5 py-1.5 text-xs text-cream/60">
                  {h}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button
          variants={fadeUp}
          type="button"
          onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="group mt-2 flex w-fit items-center gap-2 rounded-full border border-gold-500/35 bg-gold-500/8 px-7 py-3 text-sm font-medium text-gold-300 transition-all hover:bg-gold-500/18 hover:border-gold-400/60"
        >
          Enquire about this room
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </motion.button>
      </div>
    </motion.div>
  )
}
