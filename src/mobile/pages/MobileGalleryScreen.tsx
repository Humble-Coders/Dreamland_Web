import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { imgUrl } from '../../utils/imgUrl'
import SEO, { SITE_URL, DEFAULT_IMAGE } from '../../components/SEO'

export default function MobileGalleryScreen() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  // Photos passed via state for instant load, or fetch from hotel if needed
  const statePhotos = (location.state as { photos?: string[]; hotelName?: string } | null)
  const photos: string[] = statePhotos?.photos ?? []
  const hotelName = statePhotos?.hotelName ?? ''

  const [active, setActive] = useState(0)
  const [view, setView] = useState<'grid' | 'full'>('grid')

  const openFull = (i: number) => { setActive(i); setView('full') }

  const prev = useCallback(() => setActive((i) => (i - 1 + photos.length) % photos.length), [photos.length])
  const next = useCallback(() => setActive((i) => (i + 1) % photos.length), [photos.length])

  useEffect(() => {
    if (view !== 'full') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setView('grid')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, prev, next])

  if (photos.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-forest-950 text-cream">
        <p className="text-4xl opacity-20">📷</p>
        <p className="text-sm text-cream/45">No photos available</p>
        <button type="button" onClick={() => navigate(-1)}
          className="rounded-full border border-gold-500/30 px-5 py-2 text-sm text-gold-400">
          Go back
        </button>
      </div>
    )
  }

  /* ── Full-screen viewer ── */
  if (view === 'full') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0">
          <button type="button" onClick={() => setView('grid')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 bg-white/10 text-cream"
            aria-label="Back to grid">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-sm text-cream/60">{active + 1} / {photos.length}</span>
          <div className="w-9" />
        </div>

        {/* Image */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden">
          {photos.map((url, i) => (
            <div
              key={url}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-400 ${i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <img
                src={imgUrl(url, 1200)}
                alt=""
                className="max-h-full max-w-full object-contain"
                loading={i === active ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {/* Left / Right tap zones */}
          <button type="button" onClick={prev}
            className="absolute left-0 top-0 h-full w-[40%] opacity-0"
            aria-label="Previous" />
          <button type="button" onClick={next}
            className="absolute right-0 top-0 h-full w-[40%] opacity-0"
            aria-label="Next" />
        </div>

        {/* Dot strip */}
        {photos.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 py-4 shrink-0 overflow-x-auto px-4">
            {photos.map((_, i) => (
              <button key={i} type="button" onClick={() => setActive(i)} aria-label={`Photo ${i + 1}`}
                className="relative h-1.5 w-6 shrink-0 rounded-full">
                {/* Inactive track */}
                <span className="absolute inset-0 rounded-full bg-cream/30" />
                {/* Active fill — animates via transform only (composited) */}
                <span
                  className={`absolute inset-0 origin-left rounded-full bg-gold-400 transition-transform duration-300 ${
                    i === active ? 'scale-x-100' : 'scale-x-[0.25]'
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  /* ── Grid view ── */
  return (
    <div className="min-h-screen bg-forest-950 text-cream">
      <SEO
        title={`Photo Gallery${hotelName ? ` | ${hotelName}` : ''} | Dreamland Resort Karnal`}
        description={`Browse photos of ${hotelName || 'Dreamland Resort'} — rooms, amenities and surroundings in Karnal, Haryana.`}
        path={hotelId ? `/hotel/${hotelId}/gallery` : '/'}
        image={photos[0] ? `${SITE_URL}${photos[0]}` : DEFAULT_IMAGE}
      />
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-cream/[0.06] bg-forest-950/95 px-4 py-3 backdrop-blur-sm">
        <button type="button" onClick={() => navigate(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream/15 text-cream"
          aria-label="Go back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="font-display text-base text-cream truncate">
            {hotelName ? `${hotelName} — Gallery` : 'Gallery'}
          </h1>
          <p className="text-xs text-cream/40">{photos.length} photos</p>
        </div>
      </div>

      <main>
      {/* Masonry-style 2-col grid */}
      <div className="grid grid-cols-2 gap-0.5 p-0.5">
        {photos.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => openFull(i)}
            className={`overflow-hidden bg-forest-900 focus:outline-none ${
              /* Make every 5th card span full width for variety */
              i % 5 === 0 ? 'col-span-2 aspect-[16/7]' : 'aspect-square'
            }`}
          >
            <img
              src={imgUrl(url, i % 5 === 0 ? 800 : 500)}
              alt=""
              className="h-full w-full object-cover transition-opacity duration-300"
              loading={i < 4 ? 'eager' : 'lazy'}
            />
          </button>
        ))}
      </div>

      <div className="h-8" />
      </main>
    </div>
  )
}
