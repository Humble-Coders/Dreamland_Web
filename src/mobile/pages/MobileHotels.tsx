import { useState } from 'react'
import { useMobileData } from '../hooks/useMobileData'
import MobileHotelCard from '../components/MobileHotelCard'
import MobileBottomNav from '../components/MobileBottomNav'
import SEO from '../../components/SEO'

export default function MobileHotels() {
  const { hotels, loading, error } = useMobileData()
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? hotels.filter(
        (h) =>
          h.name.toLowerCase().includes(query.toLowerCase()) ||
          h.city?.toLowerCase().includes(query.toLowerCase()) ||
          h.hotelType?.toLowerCase().includes(query.toLowerCase()),
      )
    : hotels

  return (
    <div className="min-h-screen bg-forest-950 text-cream pb-20">
      <SEO
        title="Our Hotels | Dreamland Resort Karnal"
        description="Browse hotels and rooms available at Dreamland Resort, Karnal. Find your perfect stay with luxury amenities and warm hospitality."
        path="/hotels"
      />
      <main>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-cream/[0.06] bg-forest-950/95 px-5 pb-4 pt-12 backdrop-blur-sm">
        <h1 className="font-display text-2xl text-cream">Hotels</h1>
        <p className="mt-0.5 text-sm text-cream/40">Find your perfect stay</p>

        {/* Search bar */}
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-cream/[0.08] bg-forest-900/60 px-4 py-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" className="shrink-0 text-cream/30">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="Search by name or city…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-cream placeholder-cream/25 outline-none"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="text-cream/30">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="px-5 pt-5">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-700 border-t-gold-400" />
          </div>
        )}

        {error && !loading && (
          <div className="py-16 text-center">
            <p className="text-sm text-cream/40">{error}</p>
            <button type="button" onClick={() => window.location.reload()}
              className="mt-4 rounded-full border border-gold-500/30 px-5 py-2 text-sm text-gold-400">
              Retry
            </button>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-3xl opacity-20">🏨</p>
            <p className="mt-3 text-sm text-cream/40">
              {query ? `No hotels matching "${query}"` : 'No hotels found'}
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            {query && (
              <p className="mb-4 text-xs text-cream/35">
                {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
              </p>
            )}
            <div className="space-y-4">
              {filtered.map((hotel) => (
                <MobileHotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </>
        )}
      </div>
      </main>

      <MobileBottomNav />
    </div>
  )
}
