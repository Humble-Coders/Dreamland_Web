import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useLandingData } from '../hooks/useLandingData'
import SEO from '../components/SEO'
import LandingNav from '../components/landing/LandingNav'
import LandingFooter from '../components/landing/LandingFooter'
import { imgUrl } from '../utils/imgUrl'
import type { Hotel } from '../hooks/useLandingData'

// ── Featured hero card (first hotel, full-width) ───────────────────────────
function HeroHotelCard({ hotel }: { hotel: Hotel }) {
  const navigate = useNavigate()
  const photo = hotel.photos?.[2] ?? hotel.photos?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-[60vh] min-h-[480px] w-full cursor-pointer overflow-hidden rounded-3xl"
      onClick={() => navigate(`/hotel/${hotel.id}`)}
    >
      {photo ? (
        <img
          src={imgUrl(photo, 1600)}
          alt={hotel.name}
          className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-forest-800 to-forest-950" />
      )}

      {/* Multi-stop gradient overlay */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(5,32,23,0.95) 0%, rgba(5,32,23,0.4) 50%, transparent 100%)' }} />

      {/* Top badges */}
      <div className="absolute left-6 top-6 flex gap-2">
        {hotel.isLuxury && (
          <span className="rounded-full border border-gold-500/60 bg-forest-950/70 px-4 py-1.5 text-xs font-medium text-gold-400 backdrop-blur-sm">
            ✦ Featured Property
          </span>
        )}
        {hotel.averageRating && (
          <span className="flex items-center gap-1.5 rounded-full border border-cream/20 bg-forest-950/70 px-4 py-1.5 text-xs text-gold-400 backdrop-blur-sm">
            ★ {hotel.averageRating.toFixed(1)}
            {hotel.totalReviews && <span className="text-cream/40">· {hotel.totalReviews} reviews</span>}
          </span>
        )}
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-8 lg:p-10">
        <div className="flex items-end justify-between">
          <div>
            {hotel.hotelType && (
              <p className="mb-2 text-[10px] font-medium tracking-[0.35em] text-gold-400/70 uppercase">
                {hotel.hotelType}
              </p>
            )}
            <h2 className="font-display text-4xl lg:text-5xl text-cream leading-tight">
              {hotel.name}
            </h2>
            {(hotel.address || hotel.city) && (
              <p className="mt-2 flex items-center gap-2 text-sm text-cream/55">
                <span>📍</span>
                {[hotel.address, hotel.city, hotel.country].filter(Boolean).join(', ')}
              </p>
            )}
            {hotel.description && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/50 line-clamp-2">
                {hotel.description}
              </p>
            )}
          </div>

          <motion.div
            className="shrink-0 ml-8"
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="flex items-center gap-3 rounded-full border border-gold-500/40 bg-forest-950/60 px-6 py-3 backdrop-blur-sm group-hover:border-gold-400/70 transition-colors">
              <span className="font-medium text-sm text-gold-300">Explore Hotel</span>
              <span className="text-gold-400">→</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Secondary hotel card ───────────────────────────────────────────────────
function HotelCard({ hotel, index }: { hotel: Hotel; index: number }) {
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const photo = hotel.photos?.[index % (hotel.photos?.length ?? 1)]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-cream/[0.07] bg-forest-900/40 transition-all duration-500 hover:border-gold-500/25 hover:bg-forest-900/70"
      onClick={() => navigate(`/hotel/${hotel.id}`)}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-forest-900">
        {photo ? (
          <img src={imgUrl(photo, 800)} alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-forest-800 to-forest-950" />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-forest-950/70 to-transparent" />
        {hotel.averageRating && (
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-gold-500/30 bg-forest-950/80 px-3 py-1 backdrop-blur-sm">
            <span className="text-xs text-gold-400">★ {hotel.averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="mb-1 text-[10px] tracking-[0.3em] text-gold-400/50 uppercase">{hotel.hotelType ?? 'Hotel'}</p>
        <h3 className="font-display text-2xl text-cream transition-colors group-hover:text-gold-300">
          {hotel.name}
        </h3>
        {(hotel.city || hotel.address) && (
          <p className="mt-1.5 text-xs text-cream/40">
            📍 {[hotel.address, hotel.city].filter(Boolean).join(', ')}
          </p>
        )}
        {hotel.description && (
          <p className="mt-3 text-sm leading-relaxed text-cream/45 line-clamp-2">{hotel.description}</p>
        )}
        <div className="mt-5 flex items-center justify-between border-t border-cream/[0.06] pt-4">
          <div className="flex gap-3">
            {hotel.totalRooms && (
              <span className="text-xs text-cream/30">{hotel.totalRooms} rooms</span>
            )}
            {hotel.checkInTime && (
              <span className="text-xs text-cream/30">Check-in {hotel.checkInTime}</span>
            )}
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
            View Details →
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function Hotels() {
  const { hotel: firstHotel, loading } = useLandingData()
  const [query, setQuery] = useState('')

  const hotels = firstHotel ? [firstHotel] : []
  const filtered = query.trim()
    ? hotels.filter((h) =>
        h.name.toLowerCase().includes(query.toLowerCase()) ||
        h.city?.toLowerCase().includes(query.toLowerCase()),
      )
    : hotels

  return (
    <div className="min-h-screen bg-forest-950 text-cream">
      <SEO
        title="Our Hotels | Dreamland Resort Karnal"
        description="Browse hotels and rooms available at Dreamland Resort, Karnal. Find your perfect stay with luxury amenities and warm hospitality."
        path="/hotels"
      />
      <LandingNav hotel={firstHotel} />

      <main>
      {/* Page header */}
      <div className="pt-36 pb-12 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-3 text-[11px] font-medium tracking-[0.35em] text-gold-400/60 uppercase"
              >
                Curated Properties
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-6xl lg:text-7xl text-cream"
              >
                Our Hotels
              </motion.h1>
            </div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-3 rounded-xl border border-cream/[0.08] bg-forest-900/60 px-5 py-3 min-w-[280px]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" className="shrink-0 text-cream/30">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input type="search" placeholder="Search hotels…" value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-cream placeholder-cream/25 outline-none" />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="text-cream/30 hover:text-cream/60">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-28 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-6">
          {loading && (
            <div className="flex justify-center py-32">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-700 border-t-gold-400" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-32 text-center">
              <p className="font-display text-6xl opacity-[0.06]">🏨</p>
              <p className="mt-6 text-cream/35">{query ? `No results for "${query}"` : 'No hotels available'}</p>
            </div>
          )}

          {/* Featured (first hotel) — full-width hero */}
          {!loading && filtered[0] && <HeroHotelCard hotel={filtered[0]} />}

          {/* Remaining hotels — grid */}
          {!loading && filtered.length > 1 && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.slice(1).map((hotel, i) => (
                <HotelCard key={hotel.id} hotel={hotel} index={i + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
      </main>

      <LandingFooter hotel={firstHotel} />
    </div>
  )
}
