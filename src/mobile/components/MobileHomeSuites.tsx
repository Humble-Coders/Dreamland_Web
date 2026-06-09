import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { imgUrl } from '../../utils/imgUrl'
import type { HotelRoom, Hotel } from '../../services/landingService'

interface Props {
  rooms: HotelRoom[]
  hotel?: Hotel | null
}

export default function MobileHomeSuites({ rooms, hotel }: Props) {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  // Track which card is centered via scroll position
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const cardWidth = el.scrollWidth / rooms.length
      const idx = Math.round(el.scrollLeft / cardWidth)
      setActiveIdx(Math.max(0, Math.min(rooms.length - 1, idx)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [rooms.length])

  const goTo = (i: number) => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.scrollWidth / rooms.length
    el.scrollTo({ left: cardWidth * i, behavior: 'smooth' })
  }

  const openRoom = (room: HotelRoom) => {
    navigate(`/room/${room.id}`, { state: { room, hotel } })
  }

  if (rooms.length === 0) return null

  return (
    <section className="py-8 border-t border-cream/[0.05]">
      {/* Header */}
      <div className="px-5 mb-5">
        <p className="text-[11px] font-medium tracking-[0.25em] text-gold-400/60 uppercase mb-1">Accommodation</p>
        <h2 className="font-display text-2xl text-cream">Featured Suites</h2>
      </div>

      {/* Carousel — peek of next card via padding + card width */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory px-5 pb-2 scrollbar-none"
        style={{ scrollPaddingLeft: '20px' }}
      >
        {rooms.map((room) => {
          const thumb = room.media?.[0]
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => openRoom(room)}
              className="w-[78vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-cream/[0.08] bg-forest-900/70 text-left active:scale-[0.97] transition-transform"
            >
              {/* Photo */}
              <div className="relative h-48 w-full overflow-hidden bg-forest-900">
                {thumb ? (
                  <img src={imgUrl(thumb, 600)} alt={room.name} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl opacity-10">🛏</div>
                )}
                {/* Bottom scrim */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-forest-950/80 to-transparent" />
                {/* Badges */}
                {room.freeCancellation && (
                  <span className="absolute left-3 top-3 rounded-full border border-emerald-500/40 bg-forest-950/75 px-2 py-0.5 text-[10px] font-medium text-emerald-400 backdrop-blur-sm">
                    Free Cancel
                  </span>
                )}
                {(room.price ?? 0) > 0 && (
                  <div className="absolute bottom-3 right-3">
                    <span className="font-display text-base font-bold text-gold-400 drop-shadow-lg">
                      ₹{Math.round(room.price!).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-cream/50"> /night</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-display text-base capitalize text-cream leading-snug">
                  {room.name.toLowerCase()}
                </h3>
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
                  {room.bedType && <span className="text-[11px] text-cream/45">{room.bedType}</span>}
                  {(room.maxOccupancy ?? room.capacity) && (
                    <span className="text-[11px] text-cream/45">{room.maxOccupancy ?? room.capacity} guests</span>
                  )}
                  {room.view && <span className="text-[11px] text-cream/45">{room.view} view</span>}
                  {room.roomSizeSqft && (
                    <span className="text-[11px] text-cream/45">{Math.round(room.roomSizeSqft)} sqft</span>
                  )}
                </div>
                {/* CTA hint */}
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-gold-400/80">
                  View details
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </button>
          )
        })}
        {/* Trailing spacer so last card doesn't clip */}
        <div className="w-3 shrink-0" />
      </div>

      {/* Dot indicators */}
      {rooms.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {rooms.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIdx ? 'h-1.5 w-6 bg-gold-400' : 'h-1.5 w-1.5 bg-cream/25'
              }`}
              aria-label={`Room ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
