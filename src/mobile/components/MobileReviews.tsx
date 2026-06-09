import type { Hotel, HotelReview } from '../../services/landingService'

interface Props {
  hotel: Hotel
  reviews: HotelReview[]
}

interface BreakdownItem {
  label: string
  value: number
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-gold-400`}
          style={{ fontSize: size }}
        >
          {i < full ? '★' : i === full && half ? '⯨' : '☆'}
        </span>
      ))}
    </span>
  )
}

export default function MobileReviews({ hotel, reviews }: Props) {
  const avg = hotel.averageRating ?? 0
  const total = hotel.totalReviews ?? 0

  const breakdowns: BreakdownItem[] = [
    { label: 'Cleanliness', value: hotel.ratingCleanliness ?? hotel.ratingBreakdown?.cleanliness ?? 0 },
    { label: 'Food', value: hotel.ratingFood ?? hotel.ratingBreakdown?.food ?? 0 },
    { label: 'Staff', value: hotel.ratingStaff ?? hotel.ratingBreakdown?.staff ?? 0 },
    { label: 'Location', value: hotel.ratingLocation ?? hotel.ratingBreakdown?.location ?? 0 },
    { label: 'Value', value: hotel.ratingValue ?? hotel.ratingBreakdown?.value ?? 0 },
  ].filter((b) => b.value > 0)

  if (avg === 0 && total === 0 && reviews.length === 0) return null

  return (
    <div>
      {/* Summary card — matches Android's Column with big rating number + breakdown */}
      <div className="rounded-2xl border border-cream/[0.06] bg-forest-900/60 p-4">
        <div className="flex items-center gap-4">
          {/* Big rating number */}
          <span className="font-display text-5xl font-bold text-gold-400">{avg.toFixed(1)}</span>
          <div>
            <StarRow rating={avg} size={16} />
            <p className="mt-1 text-xs text-cream/45">{total} reviews</p>
          </div>
        </div>

        {/* Breakdown bars */}
        {breakdowns.length > 0 && (
          <div className="mt-4 space-y-2.5">
            {breakdowns.map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-xs text-cream/50">{label}</span>
                {/* Progress bar */}
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-forest-700/50">
                  <div
                    className="h-full rounded-full bg-gold-500 transition-all duration-700"
                    style={{ width: `${(value / 5) * 100}%` }}
                  />
                </div>
                <span className="w-7 shrink-0 text-right text-[11px] font-medium text-gold-400">
                  {value.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review cards */}
      {reviews.length > 0 && (
        <div className="mt-3 space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-cream/[0.06] bg-forest-900/60 p-4"
            >
              <div className="flex items-center justify-between">
                <StarRow rating={r.rating} size={13} />
                {r.createdAt && (
                  <span className="text-[11px] text-cream/35">
                    {new Date(
                      typeof r.createdAt === 'number'
                        ? r.createdAt
                        : (r.createdAt as { seconds?: number }).seconds
                          ? (r.createdAt as { seconds: number }).seconds * 1000
                          : Date.now(),
                    ).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
              {r.comment && (
                <p className="mt-2 text-sm leading-relaxed text-cream/75">{r.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
