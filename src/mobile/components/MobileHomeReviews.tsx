import { useRef, useState, useEffect } from 'react'
import type { HotelReview } from '../../services/landingService'

interface Props {
  reviews: HotelReview[]
  averageRating?: number
  totalReviews?: number
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(Math.min(5, Math.max(0, rating)))
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i < full ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2"
          className={i < full ? 'text-gold-400' : 'text-cream/20'}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  )
}

function initials(userId: string) {
  return userId.slice(0, 2).toUpperCase()
}

export default function MobileHomeReviews({ reviews, averageRating, totalReviews }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const cardWidth = el.scrollWidth / reviews.length
      const idx = Math.round(el.scrollLeft / cardWidth)
      setActiveIdx(Math.max(0, Math.min(reviews.length - 1, idx)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [reviews.length])

  const goTo = (i: number) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: (el.scrollWidth / reviews.length) * i, behavior: 'smooth' })
  }

  if (reviews.length === 0) return null

  return (
    <section className="py-8 border-t border-cream/[0.05]">
      {/* Header */}
      <div className="px-5 mb-5 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-medium tracking-[0.25em] text-gold-400/60 uppercase mb-1">What Guests Say</p>
          <h2 className="font-display text-2xl text-cream">Reviews</h2>
        </div>
        {averageRating && (
          <div className="flex flex-col items-end">
            <span className="font-display text-3xl font-bold text-gold-400 leading-none">
              {averageRating.toFixed(1)}
            </span>
            {totalReviews && (
              <span className="text-[11px] text-cream/40 mt-0.5">{totalReviews} reviews</span>
            )}
          </div>
        )}
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory px-5 pb-2 scrollbar-none"
        style={{ scrollPaddingLeft: '20px' }}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="w-[82vw] max-w-[320px] shrink-0 snap-start rounded-2xl border border-cream/[0.08] bg-forest-900/60 p-5"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/12 font-display text-sm text-gold-400">
                  {initials(review.userId)}
                </div>
                <div>
                  <p className="text-sm font-medium text-cream/85">Verified Guest</p>
                  <Stars rating={review.rating} />
                </div>
              </div>
              <span className="font-display text-4xl leading-none text-cream/[0.07] mt-0.5">"</span>
            </div>

            {/* Comment */}
            <p className="text-sm leading-relaxed text-cream/65 line-clamp-4">
              {review.comment}
            </p>

            {/* Sub-ratings */}
            {(review.cleanliness || review.food || review.staff || review.location) && (
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-cream/[0.06] pt-4">
                {[
                  { label: 'Cleanliness', val: review.cleanliness },
                  { label: 'Food',        val: review.food },
                  { label: 'Staff',       val: review.staff },
                  { label: 'Location',    val: review.location },
                ].filter((r) => r.val).map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-cream/35">{r.label}</span>
                    <span className="text-[11px] font-medium text-gold-400/80">{r.val!.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="w-3 shrink-0" />
      </div>

      {/* Dot indicators */}
      {reviews.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {reviews.map((_, i) => (
            <button key={i} type="button" onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIdx ? 'h-1.5 w-6 bg-gold-400' : 'h-1.5 w-1.5 bg-cream/25'
              }`}
              aria-label={`Review ${i + 1}`} />
          ))}
        </div>
      )}
    </section>
  )
}
