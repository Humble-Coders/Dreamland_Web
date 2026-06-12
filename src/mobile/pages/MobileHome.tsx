import { useState, useEffect } from 'react'
import { useMobileData } from '../hooks/useMobileData'
import { HEADER_PHOTOS } from '../../data/localImages'
import MobileHeroCarousel from '../components/MobileHeroCarousel'
import MobileHotelCard from '../components/MobileHotelCard'
import MobileHomeSuites from '../components/MobileHomeSuites'
import MobileHomeReviews from '../components/MobileHomeReviews'
import MobileHomeGallery from '../components/MobileHomeGallery'
import Logo from '../../components/Logo'
import MobileBottomNav from '../components/MobileBottomNav'
import SEO, { SITE_URL, DEFAULT_IMAGE } from '../../components/SEO'

const TRUST = [
  { icon: '✦', label: 'Verified Property' },
  { icon: '◈', label: 'Best Price' },
  { icon: '↺', label: 'Free Cancellation' },
  { icon: '◷', label: '24 / 7 Support' },
]

export default function MobileHome() {
  const { hotels, rooms, reviews, galleryPhotos, loading, error } = useMobileData()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const firstHotel = hotels[0]
  const waNumber = firstHotel?.contactPhone?.replace(/[\s+\-().]/g, '') ?? ''
  const waUrl = waNumber ? `https://wa.me/${waNumber}` : null

  return (
    <div className="min-h-screen bg-forest-950 text-cream">
      <SEO
        title="Dreamland Resort Karnal | Luxury Stay & Hospitality"
        description={firstHotel?.description || 'Dreamland Resort in Karnal, Haryana offers luxury rooms, fine dining and warm hospitality on GT Road. Book your stay at Hotel Dreamland today.'}
        path="/"
        image={firstHotel?.photos?.[0] ? `${SITE_URL}${firstHotel.photos[0]}` : DEFAULT_IMAGE}
      />
      {/* Sticky top nav */}
      <nav
        className={`fixed inset-x-0 top-0 z-40 flex items-center px-5 py-3 transition-all duration-300 ${
          scrolled
            ? 'border-b border-cream/[0.07] bg-forest-950/80 backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5"
        >
          <Logo className="h-8 w-8 rounded-lg object-contain" />
          {firstHotel?.name && (
            <span className="font-display text-base text-cream/90 tracking-wide">
              {firstHotel.name}
            </span>
          )}
        </button>
      </nav>

      {/* Hero carousel — static local images, rendered immediately (no Firestore wait) */}
      <MobileHeroCarousel
        images={HEADER_PHOTOS}
        title={'Your Next Stay\nAwaits'}
        subtitle="Experience curated luxury"
      />

      {/* ── Explore Stays ───────────────────────── */}
      <section className="px-5 pt-8 pb-6">
        <p className="text-[11px] font-medium tracking-[0.25em] text-gold-400/60 uppercase mb-1">Our Properties</p>
        <h2 className="font-display text-2xl text-cream mb-4">Explore Stays</h2>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-700 border-t-gold-400" />
          </div>
        )}

        {error && !loading && (
          <div className="py-12 text-center">
            <p className="text-sm text-cream/45">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full border border-gold-500/30 px-5 py-2 text-sm text-gold-400"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && hotels.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-4xl opacity-30">🏨</p>
            <p className="mt-3 text-sm text-cream/45">No hotels found</p>
          </div>
        )}

        {!loading && hotels.length > 0 && (
          <div className="space-y-4">
            {hotels.map((hotel) => (
              <MobileHotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}

        {/* Trust pillars */}
        {!loading && (
          <div className="mt-8 grid grid-cols-2 gap-3">
            {TRUST.map((t) => (
              <div
                key={t.label}
                className="flex flex-col items-center gap-2.5 rounded-2xl border border-cream/[0.06] bg-forest-900/40 p-4 text-center"
              >
                <span className="text-xl text-gold-400">{t.icon}</span>
                <span className="text-xs font-medium text-cream/70">{t.label}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Featured Suites ─────────────────────── */}
      {!loading && rooms.length > 0 && (
        <MobileHomeSuites rooms={rooms} hotel={firstHotel} />
      )}

      {/* ── Reviews ─────────────────────────────── */}
      {!loading && reviews.length > 0 && (
        <MobileHomeReviews
          reviews={reviews}
          averageRating={firstHotel?.averageRating}
          totalReviews={firstHotel?.totalReviews}
        />
      )}

      {/* ── Gallery ─────────────────────────────── */}
      {!loading && galleryPhotos.length > 0 && (
        <MobileHomeGallery
          photos={galleryPhotos}
          hotelId={firstHotel?.id}
          hotelName={firstHotel?.name}
        />
      )}

      {/* Bottom padding — clears bottom nav + a little breathing room */}
      <div className="h-24" />

      {/* Floating WhatsApp CTA — sits above the bottom nav */}
      {waUrl && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-5 z-50 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-forest-950/90 px-4 py-3 text-sm font-medium text-emerald-400 shadow-lg backdrop-blur-sm active:scale-95 transition-transform"
        >
          <span className="text-base">💬</span>
          Chat to Book
        </a>
      )}

      <MobileBottomNav />
    </div>
  )
}
