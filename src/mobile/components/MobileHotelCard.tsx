import { useNavigate } from 'react-router-dom'
import { imgUrl, imgSrcSet } from '../../utils/imgUrl'
import { hotelBadge } from '../utils'
import type { Hotel } from '../../services/landingService'

interface Props {
  hotel: Hotel
}

export default function MobileHotelCard({ hotel }: Props) {
  const navigate = useNavigate()
  const badge = hotelBadge(hotel.isLuxury, hotel.averageRating)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/hotel/${hotel.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/hotel/${hotel.id}`)}
      className="cursor-pointer overflow-hidden rounded-2xl border border-cream/[0.06] bg-forest-900/60 transition-transform active:scale-[0.98]"
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-forest-900">
        {hotel.photos?.[0] ? (
          <img
            src={imgUrl(hotel.photos[0], 700)}
            srcSet={imgSrcSet(hotel.photos[0], [600, 1080])}
            sizes="90vw"
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-forest-800 to-forest-950" />
        )}

        {/* Badge — Featured / Recommended */}
        {badge && (
          <div
            className={`absolute left-3 top-3 rounded-full border px-3 py-1 text-[11px] font-medium backdrop-blur-sm ${
              badge === 'Featured'
                ? 'border-gold-500/60 bg-forest-950/75 text-gold-400'
                : 'border-cream/20 bg-forest-950/70 text-cream/70'
            }`}
          >
            {badge}
          </div>
        )}

        {/* Star rating overlay */}
        {(hotel.averageRating ?? 0) > 0 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-gold-500/30 bg-forest-950/80 px-2.5 py-1 backdrop-blur-sm">
            <span className="text-xs text-gold-400">★</span>
            <span className="text-xs font-semibold text-gold-400">{hotel.averageRating!.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-xl text-cream">{hotel.name}</h3>
            {(hotel.address || hotel.city) && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-cream/50">
                <span>📍</span>
                <span className="truncate">{[hotel.address, hotel.city].filter(Boolean).join(', ')}</span>
              </p>
            )}
          </div>
          {(hotel.totalReviews ?? 0) > 0 && (
            <span className="shrink-0 text-[11px] text-cream/35">
              {hotel.totalReviews} reviews
            </span>
          )}
        </div>

        {/* CTA row */}
        <div className="mt-3 flex items-center justify-between border-t border-cream/[0.06] pt-3">
          {hotel.hotelType && (
            <span className="text-[11px] text-cream/40 uppercase tracking-wide">{hotel.hotelType}</span>
          )}
          <span className="ml-auto flex items-center gap-1 text-xs font-medium text-gold-400">
            View Details <span className="text-sm">→</span>
          </span>
        </div>
      </div>
    </div>
  )
}
