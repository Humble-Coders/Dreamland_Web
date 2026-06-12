import { useParams, useNavigate } from 'react-router-dom'
import { useMobileHotelDetail } from '../hooks/useMobileHotelDetail'
import SEO, { SITE_URL, DEFAULT_IMAGE } from '../../components/SEO'
import MobileCollapsingHeader from '../components/MobileCollapsingHeader'
import MobileHeroCarousel from '../components/MobileHeroCarousel'
import MobileGallery from '../components/MobileGallery'
import MobileAmenities from '../components/MobileAmenities'
import MobileRoomCard from '../components/MobileRoomCard'
import MobileReviews from '../components/MobileReviews'
import MobileAttractions from '../components/MobileAttractions'
import MobileTravelActivities from '../components/MobileTravelActivities'
import MobileLocation from '../components/MobileLocation'
import MobileContact from '../components/MobileContact'

// Hero height used for collapsing-header scroll math (px equivalent of 55vw min-h-[280px])
const HERO_HEIGHT = 320

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="px-5 py-6 border-b border-cream/[0.06]">
      <h3 className="mb-4 font-display text-lg text-gold-400 tracking-wide">{title}</h3>
      {children}
    </section>
  )
}

export default function MobileHotelDetail() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const navigate = useNavigate()
  const { hotel, rooms, reviews, attractions, travelList, loading, error } = useMobileHotelDetail(hotelId ?? '')

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-forest-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-700 border-t-gold-400" />
      </div>
    )
  }

  if (error || !hotel) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-forest-950 px-8 text-center">
        <p className="text-4xl opacity-20">🏨</p>
        <p className="text-sm text-cream/45">{error ?? 'Hotel not found'}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full border border-gold-500/30 px-5 py-2 text-sm text-gold-400"
        >
          Go back
        </button>
      </div>
    )
  }

  const heroPhotos = hotel.photos ?? []
  const waNumber = hotel.contactPhone?.replace(/[\s+\-().]/g, '') ?? ''
  const waUrl = waNumber ? `https://wa.me/${waNumber}` : null
  const highlights = hotel.highlights ?? []

  return (
    <div className="min-h-screen bg-forest-950 text-cream pb-24">
      <SEO
        title={`${hotel.name} | Dreamland Resort Karnal`}
        description={hotel.description || `Discover ${hotel.name} in ${hotel.city ?? 'Karnal'} — explore rooms, amenities and book your stay at Dreamland Resort.`}
        path={`/hotel/${hotel.id}`}
        image={hotel.photos?.[0] ? `${SITE_URL}${hotel.photos[0]}` : DEFAULT_IMAGE}
        type="hotel"
      />
      <MobileCollapsingHeader
        hotelName={hotel.name}
        heroHeight={HERO_HEIGHT}
        onBack={() => navigate(-1)}
      />

      <main>
      {/* Hero photos carousel — 320px equivalent */}
      <div className="relative overflow-hidden" style={{ height: HERO_HEIGHT }}>
        <MobileHeroCarousel images={heroPhotos} />
      </div>

      {/* Hotel identity block */}
      <div className="px-5 pt-5 pb-4 border-b border-cream/[0.06]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-2xl text-cream leading-tight">{hotel.name}</h1>
            {(hotel.city || hotel.country) && (
              <p className="mt-1 text-sm text-cream/50">
                {[hotel.city, hotel.country].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
          {hotel.averageRating && (
            <div className="shrink-0 flex flex-col items-center rounded-xl border border-gold-500/30 bg-gold-500/8 px-3 py-2">
              <span className="font-display text-xl font-bold text-gold-400 leading-none">
                {hotel.averageRating.toFixed(1)}
              </span>
              <span className="text-[10px] text-cream/40 mt-0.5">
                {hotel.totalReviews ? `${hotel.totalReviews} reviews` : 'rating'}
              </span>
            </div>
          )}
        </div>

        {hotel.description && (
          <p className="mt-3 text-sm leading-relaxed text-cream/60 line-clamp-4">
            {hotel.description}
          </p>
        )}

        {/* Quick stats row */}
        <div className="mt-4 flex gap-3 flex-wrap">
          {hotel.starRating && (
            <span className="text-xs text-gold-400/70">
              {'★'.repeat(Math.round(hotel.starRating))}{hotel.hotelType ? ` ${hotel.hotelType}` : ''}
            </span>
          )}
          {hotel.totalRooms && (
            <span className="text-xs text-cream/35">{hotel.totalRooms} rooms</span>
          )}
          {hotel.checkInTime && (
            <span className="text-xs text-cream/35">Check-in {hotel.checkInTime}</span>
          )}
        </div>
      </div>

      {/* Gallery */}
      {heroPhotos.length > 1 && (
        <Section title="Gallery">
          <MobileGallery photos={heroPhotos} />
        </Section>
      )}

      {/* Amenities */}
      {highlights.length > 0 && (
        <Section title="Amenities">
          <MobileAmenities highlights={highlights} />
        </Section>
      )}

      {/* Rooms */}
      {rooms.length > 0 && (
        <Section title="Rooms">
          <div className="space-y-4">
            {rooms.map((room) => (
              <MobileRoomCard key={room.id} room={room} waUrl={waUrl} hotel={hotel} />
            ))}
          </div>
        </Section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <Section title="Guest Reviews">
          <MobileReviews reviews={reviews} hotel={hotel} />
        </Section>
      )}

      {/* Nearby Attractions */}
      {attractions.length > 0 && (
        <Section title="Nearby Attractions">
          <MobileAttractions attractions={attractions} />
        </Section>
      )}

      {/* Travel Activities */}
      {travelList.length > 0 && (
        <Section title="Travel Activities">
          <MobileTravelActivities activities={travelList} />
        </Section>
      )}

      {/* Location */}
      <Section title="Location">
        <MobileLocation hotel={hotel} />
      </Section>

      {/* Contact */}
      {(hotel.contactPhone || hotel.contactEmail) && (
        <Section title="Contact">
          <MobileContact hotel={hotel} />
        </Section>
      )}
      </main>

      {/* Sticky bottom CTA bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream/[0.08] bg-forest-950/95 px-5 py-4 backdrop-blur-sm">
        <div className="flex gap-3">
          {hotel.contactPhone && (
            <a
              href={`tel:${hotel.contactPhone}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-cream/[0.12] bg-forest-900/60 py-3 text-sm font-medium text-cream"
            >
              📞 Call
            </a>
          )}
          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-gold-500 py-3 text-sm font-semibold text-forest-950"
            >
              💬 Chat to Book
            </a>
          ) : (
            <button
              type="button"
              className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-gold-500 py-3 text-sm font-semibold text-forest-950"
              onClick={() =>
                document.querySelector('#mobile-contact')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Enquire Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
