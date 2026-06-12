import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMobileHotelDetail } from '../mobile/hooks/useMobileHotelDetail'
import SEO, { SITE_URL, DEFAULT_IMAGE } from '../components/SEO'
import { imgUrl } from '../utils/imgUrl'
import LandingNav from '../components/landing/LandingNav'
import LandingAbout from '../components/landing/LandingAbout'
import LandingAmenities from '../components/landing/LandingAmenities'
import LandingRooms from '../components/landing/LandingRooms'
import LandingTestimonials from '../components/landing/LandingTestimonials'
import LandingGallery from '../components/landing/LandingGallery'
import LandingLocation from '../components/landing/LandingLocation'
import LandingFooter from '../components/landing/LandingFooter'
import type { Hotel } from '../hooks/useLandingData'

// ── Hero banner — full-width crossfade carousel with hotel identity overlay ──
function DetailHero({ hotel }: { hotel: Hotel }) {
  const navigate = useNavigate()
  const photos = hotel.photos ?? []
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (photos.length <= 1) return
    const id = setInterval(() => setCurrent((i) => (i + 1) % photos.length), 5000)
    return () => clearInterval(id)
  }, [photos.length])

  return (
    <section className="relative h-[75vh] min-h-[560px] w-full overflow-hidden bg-forest-950">
      {photos.length > 0 ? (
        photos.map((url, i) => (
          <div
            key={url}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ${i === current ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={imgUrl(url, 1920)}
              alt=""
              className="h-full w-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
            />
          </div>
        ))
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-forest-800 to-forest-950" />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/30 to-forest-950/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-forest-950/50 to-transparent" />

      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/hotels')}
        className="absolute left-6 top-28 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 bg-forest-950/50 text-cream backdrop-blur-sm transition-colors hover:border-gold-400/50 lg:left-10"
        aria-label="Back to hotels"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Identity overlay */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 bottom-0 px-6 pb-14 lg:px-10 lg:pb-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              {hotel.hotelType && (
                <p className="mb-3 text-xs font-medium tracking-[0.35em] text-gold-400/70 uppercase">{hotel.hotelType}</p>
              )}
              <h1 className="font-display text-5xl leading-tight text-cream sm:text-6xl lg:text-7xl">{hotel.name}</h1>
              {(hotel.address || hotel.city) && (
                <p className="mt-3 flex items-center gap-2 text-sm text-cream/60 lg:text-base">
                  <span>📍</span>
                  {[hotel.address, hotel.city, hotel.country].filter(Boolean).join(', ')}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {hotel.starRating && (
                <span className="rounded-full border border-gold-500/30 bg-forest-950/70 px-4 py-2 text-sm text-gold-400 backdrop-blur-sm">
                  {'★'.repeat(Math.round(hotel.starRating))}
                </span>
              )}
              {hotel.averageRating && (
                <span className="flex items-center gap-2 rounded-full border border-cream/20 bg-forest-950/70 px-4 py-2 text-sm text-gold-400 backdrop-blur-sm">
                  ★ {hotel.averageRating.toFixed(1)}
                  {hotel.totalReviews && <span className="text-cream/40">· {hotel.totalReviews} reviews</span>}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dot indicators */}
      {photos.length > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Image ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-gold-400' : 'w-1.5 bg-cream/30'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

// ── Sticky quick-nav + booking bar — distinguishes the detail page from the homepage scroll ──
function QuickInfoBar({ hotel, roomCount }: { hotel: Hotel; roomCount: number }) {
  const sections = [
    { label: 'Overview', href: '#about' },
    { label: 'Rooms', href: '#rooms' },
    ...(hotel.highlights?.length ? [{ label: 'Amenities', href: '#amenities' }] : []),
    { label: 'Gallery', href: '#gallery' },
    { label: 'Location', href: '#location' },
  ]

  const scrollTo = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="sticky top-20 z-30 border-y border-cream/8 bg-forest-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
        <div className="flex items-center gap-1 overflow-x-auto py-3">
          {sections.map((s) => (
            <button
              key={s.href}
              type="button"
              onClick={() => scrollTo(s.href)}
              className="shrink-0 rounded-full px-4 py-2 text-sm text-cream/60 transition-colors hover:bg-cream/5 hover:text-cream"
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          {hotel.averageRating && (
            <span className="flex items-center gap-1.5 text-sm text-cream/70">
              <span className="text-gold-400">★</span> {hotel.averageRating.toFixed(1)}
            </span>
          )}
          {roomCount > 0 && (
            <span className="text-sm text-cream/45">{roomCount} Room{roomCount > 1 ? 's' : ''}</span>
          )}
          <button
            type="button"
            onClick={() => scrollTo('#rooms')}
            className="rounded-full bg-gold-500 px-5 py-2 text-sm font-semibold text-forest-950 transition-colors hover:bg-gold-400"
          >
            Check Availability
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Compact contact strip — replaces the homepage's full "Get In Touch" section ──
function ContactStrip({ hotel }: { hotel: Hotel }) {
  const waNumber = hotel.contactPhone?.replace(/[\s+\-().]/g, '') ?? ''
  const waUrl = waNumber ? `https://wa.me/${waNumber}` : null

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-gold-500/15 bg-forest-900/40 px-8 py-10 text-center sm:flex-row sm:justify-between sm:text-left lg:px-12">
          <div>
            <h3 className="font-display text-2xl text-cream sm:text-3xl">Ready to book your stay?</h3>
            <p className="mt-2 text-sm text-cream/55">Reach out directly — our team replies fast.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-6 py-3 text-sm font-medium text-emerald-300 transition-all hover:bg-emerald-500/15"
              >
                💬 WhatsApp
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            )}
            {hotel.contactPhone && (
              <a
                href={`tel:${hotel.contactPhone}`}
                className="flex items-center gap-2 rounded-full border border-cream/15 px-6 py-3 text-sm font-medium text-cream/80 transition-all hover:border-gold-400/50 hover:text-gold-300"
              >
                📞 Call Hotel
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HotelDetail() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const navigate = useNavigate()
  const { hotel, rooms, reviews, attractions, loading, error } = useMobileHotelDetail(hotelId ?? '')

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-forest-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-700 border-t-gold-400" />
      </div>
    )
  }

  if (error || !hotel) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-forest-950 px-8 text-center text-cream">
        <p className="text-5xl opacity-20">🏨</p>
        <p className="text-sm text-cream/45">{error ?? 'Hotel not found'}</p>
        <button
          type="button"
          onClick={() => navigate('/hotels')}
          className="rounded-full border border-gold-500/30 px-5 py-2 text-sm text-gold-400"
        >
          Back to hotels
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-forest-950 text-cream">
      <SEO
        title={`${hotel.name} | Dreamland Resort Karnal`}
        description={hotel.description || `Discover ${hotel.name} in ${hotel.city ?? 'Karnal'} — explore rooms, amenities and book your stay at Dreamland Resort.`}
        path={`/hotel/${hotel.id}`}
        image={hotel.photos?.[0] ? `${SITE_URL}${hotel.photos[0]}` : DEFAULT_IMAGE}
        type="hotel"
      />
      <LandingNav hotel={hotel} />
      <DetailHero hotel={hotel} />
      <QuickInfoBar hotel={hotel} roomCount={rooms?.length ?? 0} />
      <LandingAbout hotel={hotel} />
      <LandingRooms rooms={rooms} hotel={hotel} />
      {(hotel.highlights?.length ?? 0) > 0 && <LandingAmenities hotel={hotel} />}
      <LandingGallery photos={hotel.photos} />
      <LandingTestimonials reviews={reviews} />
      <LandingLocation hotel={hotel} attractions={attractions} />
      <ContactStrip hotel={hotel} />
      <LandingFooter hotel={hotel} />
    </div>
  )
}
