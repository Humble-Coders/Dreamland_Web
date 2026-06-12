import { useNavigate } from 'react-router-dom'
import { imgUrl } from '../../utils/imgUrl'
import type { HotelRoom, Hotel } from '../../services/landingService'

interface Props {
  room: HotelRoom
  waUrl?: string | null
  hotel?: Hotel | null
}

interface Spec {
  label: string
  value: string
}

function buildSpecs(room: HotelRoom): Spec[] {
  return [
    room.bedType ? { label: 'BED', value: room.bedType } : null,
    (room.maxOccupancy ?? room.capacity)
      ? { label: 'GUESTS', value: String(room.maxOccupancy ?? room.capacity) }
      : null,
    room.view ? { label: 'VIEW', value: room.view } : null,
    room.roomSizeSqft ? { label: 'SIZE', value: `${Math.round(room.roomSizeSqft)} sqft` } : null,
  ].filter((s): s is Spec => s !== null)
}

export default function MobileRoomCard({ room, waUrl, hotel }: Props) {
  const navigate = useNavigate()
  const specs = buildSpecs(room)
  const highlights = room.amenities?.slice(0, 2) ?? []
  const image = room.media?.[0]

  const handleEnquire = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (waUrl) window.open(waUrl, '_blank', 'noopener,noreferrer')
    else document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/room/${room.id}`, { state: { room, hotel } })}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/room/${room.id}`, { state: { room, hotel } })}
      className="overflow-hidden rounded-2xl border border-cream/[0.06] bg-forest-900/60 cursor-pointer"
    >
      {/* Room image */}
      {image && (
        <div className="relative h-40 w-full overflow-hidden bg-forest-900">
          <img
            src={imgUrl(image, 700)}
            alt={room.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-4">
        {/* Room name */}
        <h3 className="font-display text-xl text-gold-400 capitalize">{room.name.toLowerCase()}</h3>

        {/* Spec strip — matches Android RoomSpecStrip */}
        {specs.length > 0 && (
          <div className="mt-3 flex items-center rounded-xl border border-cream/[0.06] bg-forest-950/40 py-3">
            {specs.map((spec, i) => (
              <div key={spec.label} className="flex flex-1 items-stretch">
                {i > 0 && <div className="w-px bg-gold-500/20" />}
                <div className="flex flex-1 flex-col items-center gap-1 px-2">
                  <span className="text-[10px] font-medium tracking-[0.08em] text-cream/40">
                    {spec.label}
                  </span>
                  <span className="max-w-full truncate text-xs font-semibold text-cream">
                    {spec.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Highlights — free cancellation + amenity pills */}
        {(room.freeCancellation || highlights.length > 0) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {room.freeCancellation && (
              <span className="rounded-full border border-emerald-500/50 bg-emerald-500/8 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                Free Cancellation
              </span>
            )}
            {highlights.map((h) => (
              <span
                key={h}
                className="rounded-full border border-cream/15 bg-forest-950/50 px-2.5 py-1 text-[11px] text-cream/60"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {room.description && (
          <p className="mt-3 text-sm leading-relaxed text-cream/55 line-clamp-2">{room.description}</p>
        )}

        {/* Divider */}
        <div className="my-4 h-px w-full bg-cream/[0.06]" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          {(room.price ?? 0) > 0 ? (
            <div>
              <p className="font-display text-2xl font-bold text-gold-400">
                ₹{Math.round(room.price!).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-cream/40">
                {(room.tax ?? 0) > 0 ? `per night + ${Math.round(room.tax!)}% tax` : 'per night'}
              </p>
            </div>
          ) : (
            <p className="text-sm text-cream/40">Price on request</p>
          )}
          <button
            type="button"
            onClick={handleEnquire}
            className="rounded-full bg-gold-500 px-5 py-2 text-sm font-semibold text-forest-950 transition-opacity active:opacity-80"
          >
            Enquire
          </button>
        </div>
      </div>
    </div>
  )
}
