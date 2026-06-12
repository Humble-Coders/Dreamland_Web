import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getHotelDetailById } from '../services/landingService'
import SEO, { SITE_URL, DEFAULT_IMAGE } from '../components/SEO'
import LandingNav from '../components/landing/LandingNav'
import LandingFooter from '../components/landing/LandingFooter'
import LandingGallery from '../components/landing/LandingGallery'
import type { Hotel } from '../services/landingService'

export default function GalleryScreen() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  // Photos passed via state for instant load, or fetched from the hotel
  const statePhotos = (location.state as { photos?: string[]; hotelName?: string } | null)
  const [photos, setPhotos] = useState<string[]>(statePhotos?.photos ?? [])
  const [hotelName, setHotelName] = useState(statePhotos?.hotelName ?? '')
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(!statePhotos?.photos && !!hotelId)

  useEffect(() => {
    if (statePhotos?.photos || !hotelId) return
    getHotelDetailById(hotelId).then((data) => {
      setHotel(data.hotel)
      setPhotos(data.hotel?.photos ?? [])
      setHotelName(data.hotel?.name ?? '')
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-forest-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-700 border-t-gold-400" />
      </div>
    )
  }

  return (
    <div className="min-h-full bg-forest-950 text-cream">
      <SEO
        title={`Photo Gallery${hotelName ? ` | ${hotelName}` : ''} | Dreamland Resort Karnal`}
        description={`Browse photos of ${hotelName || 'Dreamland Resort'} — rooms, amenities and surroundings in Karnal, Haryana.`}
        path={hotelId ? `/hotel/${hotelId}/gallery` : '/'}
        image={photos[0] ? `${SITE_URL}${photos[0]}` : DEFAULT_IMAGE}
      />
      <LandingNav hotel={hotel} />

      <main>
      <div className="mx-auto max-w-7xl px-6 pt-28 lg:px-10 lg:pt-32">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-cream/50 transition-colors hover:text-gold-300"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        {hotelName && (
          <p className="text-xs font-medium tracking-[0.35em] text-gold-400/60 uppercase">
            {hotelName} · {photos.length} photos
          </p>
        )}
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 px-8 py-32 text-center">
          <p className="text-5xl opacity-20">📷</p>
          <p className="text-sm text-cream/45">No photos available</p>
        </div>
      ) : (
        <LandingGallery photos={photos} />
      )}
      </main>

      <LandingFooter hotel={hotel} />
    </div>
  )
}
