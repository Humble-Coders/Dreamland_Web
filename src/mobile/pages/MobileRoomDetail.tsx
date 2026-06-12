import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getRoomById } from '../../services/landingService'
import SEO, { SITE_URL, DEFAULT_IMAGE } from '../../components/SEO'
import { imgUrl } from '../../utils/imgUrl'
import type { HotelRoom, Hotel } from '../../services/landingService'

interface Spec { label: string; value: string }

function buildSpecs(room: HotelRoom): Spec[] {
  return [
    room.bedType              ? { label: 'Bed',     value: room.bedType }                            : null,
    (room.maxOccupancy ?? room.capacity)
                              ? { label: 'Guests',  value: String(room.maxOccupancy ?? room.capacity) } : null,
    room.view                 ? { label: 'View',    value: room.view }                               : null,
    room.roomSizeSqft         ? { label: 'Size',    value: `${Math.round(room.roomSizeSqft)} sqft` } : null,
    room.floor                ? { label: 'Floor',   value: `${room.floor}F` }                        : null,
    room.bathroomType         ? { label: 'Bath',    value: room.bathroomType }                       : null,
  ].filter((s): s is Spec => s !== null)
}

export default function MobileRoomDetail() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  // Accept pre-loaded data from navigation state for instant display
  const stateRoom = (location.state as { room?: HotelRoom; hotel?: Hotel } | null)
  const [room, setRoom] = useState<HotelRoom | null>(stateRoom?.room ?? null)
  const [hotel, setHotel] = useState<Hotel | null>(stateRoom?.hotel ?? null)
  const [loading, setLoading] = useState(!stateRoom?.room)
  const [photoIdx, setPhotoIdx] = useState(0)

  useEffect(() => {
    if (stateRoom?.room || !roomId) return
    getRoomById(roomId).then((data) => {
      if (data) { setRoom(data.room); setHotel(data.hotel) }
      setLoading(false)
    })
  }, [roomId])

  const waNumber = hotel?.contactPhone?.replace(/[\s+\-().]/g, '') ?? ''
  const waUrl = waNumber ? `https://wa.me/${waNumber}` : null

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-forest-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-700 border-t-gold-400" />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-forest-950 px-8 text-center">
        <p className="text-4xl opacity-20">🛏</p>
        <p className="text-sm text-cream/45">Room not found</p>
        <button type="button" onClick={() => navigate(-1)}
          className="rounded-full border border-gold-500/30 px-5 py-2 text-sm text-gold-400">
          Go back
        </button>
      </div>
    )
  }

  const photos = room.media ?? []
  const specs = buildSpecs(room)

  return (
    <div className="min-h-screen bg-forest-950 text-cream">
      <SEO
        title={`${room.name} | ${hotel?.name ?? 'Dreamland Resort Karnal'}`}
        description={room.description || `Explore the ${room.name} room at ${hotel?.name ?? 'Dreamland Resort'} — view amenities, pricing and availability.`}
        path={`/room/${room.id}`}
        image={photos[0] ? `${SITE_URL}${photos[0]}` : DEFAULT_IMAGE}
      />

      <main>
      {/* ── Photo Carousel ── */}
      <div className="relative h-[55vw] min-h-[260px] max-h-[380px] w-full overflow-hidden bg-forest-900">
        {photos.length > 0 ? (
          <>
            {photos.map((url, i) => (
              <div
                key={url}
                className={`absolute inset-0 transition-opacity duration-500 ${i === photoIdx ? 'opacity-100' : 'opacity-0'}`}
              >
                <img src={imgUrl(url, 900)} alt="" className="h-full w-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
            ))}
            {/* Gradient */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-forest-950 to-transparent" />

            {/* Dot indicators */}
            {photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                {photos.map((_, i) => (
                  <button key={i} type="button" onClick={() => setPhotoIdx(i)} aria-label={`Photo ${i + 1}`}
                    className="relative h-1 w-6 rounded-full">
                    {/* Inactive track */}
                    <span className="absolute inset-0 rounded-full bg-cream/30" />
                    {/* Active fill — animates via transform only (composited) */}
                    <span
                      className={`absolute inset-0 origin-left rounded-full bg-gold-400 transition-transform duration-300 ${
                        i === photoIdx ? 'scale-x-100' : 'scale-x-[0.25]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* L/R tap zones */}
            {photos.length > 1 && (
              <>
                <button type="button" className="absolute left-0 top-0 h-full w-1/3 opacity-0" onClick={() => setPhotoIdx((i) => (i - 1 + photos.length) % photos.length)} aria-label="Previous photo" />
                <button type="button" className="absolute right-0 top-0 h-full w-1/3 opacity-0" onClick={() => setPhotoIdx((i) => (i + 1) % photos.length)} aria-label="Next photo" />
              </>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-5xl opacity-10">🛏</div>
        )}

        {/* Back button */}
        <button type="button" onClick={() => navigate(-1)}
          className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 bg-black/40 text-cream backdrop-blur-sm"
          aria-label="Go back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Photo counter */}
        {photos.length > 1 && (
          <div className="absolute right-4 top-4 rounded-full border border-cream/20 bg-black/40 px-2.5 py-1 text-xs text-cream/70 backdrop-blur-sm">
            {photoIdx + 1}/{photos.length}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="px-5 pb-32 pt-4">

        {/* Name + Price */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-2xl capitalize text-cream leading-tight">
              {room.name.toLowerCase()}
            </h1>
            {hotel?.name && (
              <p className="mt-0.5 text-sm text-cream/40">{hotel.name}</p>
            )}
          </div>
          {(room.price ?? 0) > 0 && (
            <div className="shrink-0 text-right">
              <p className="font-display text-2xl font-bold text-gold-400 leading-none">
                ₹{Math.round(room.price!).toLocaleString('en-IN')}
              </p>
              <p className="mt-0.5 text-xs text-cream/40">
                {(room.tax ?? 0) > 0 ? `+ ${Math.round(room.tax!)}% tax` : 'per night'}
              </p>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="mt-3 flex flex-wrap gap-2">
          {room.freeCancellation && (
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/8 px-3 py-1 text-xs font-medium text-emerald-400">
              ✓ Free Cancellation
            </span>
          )}
          {room.smokingAllowed === false && (
            <span className="rounded-full border border-cream/10 bg-forest-900/50 px-3 py-1 text-xs text-cream/45">
              No Smoking
            </span>
          )}
          {room.accessibilityFeatures && (
            <span className="rounded-full border border-cream/10 bg-forest-900/50 px-3 py-1 text-xs text-cream/45">
              ♿ Accessible
            </span>
          )}
          {room.minStayNights && room.minStayNights > 1 && (
            <span className="rounded-full border border-cream/10 bg-forest-900/50 px-3 py-1 text-xs text-cream/45">
              Min {room.minStayNights} nights
            </span>
          )}
        </div>

        {/* Specs strip */}
        {specs.length > 0 && (
          <div className="mt-5 flex items-stretch rounded-2xl border border-cream/[0.07] bg-forest-900/50 py-4">
            {specs.map((spec, i) => (
              <div key={spec.label} className="flex flex-1 items-stretch">
                {i > 0 && <div className="w-px bg-gold-500/20" />}
                <div className="flex flex-1 flex-col items-center gap-1.5 px-2">
                  <span className="text-[10px] font-medium tracking-[0.15em] text-cream/35 uppercase">{spec.label}</span>
                  <span className="max-w-full truncate text-xs font-semibold text-cream text-center leading-tight">{spec.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        {room.description && (
          <>
            <h2 className="mt-6 mb-2 text-[11px] font-medium tracking-[0.2em] text-gold-400/60 uppercase">About</h2>
            <p className="text-sm leading-relaxed text-cream/65">{room.description}</p>
          </>
        )}

        {/* Amenities */}
        {(room.amenities?.length ?? 0) > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-[11px] font-medium tracking-[0.2em] text-gold-400/60 uppercase">Amenities</h2>
            <div className="grid grid-cols-2 gap-2">
              {room.amenities!.map((a) => (
                <div key={a} className="flex items-center gap-2.5 rounded-xl border border-cream/[0.06] bg-forest-900/40 px-3 py-2.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400/60" />
                  <span className="text-xs text-cream/70 leading-snug">{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complimentary */}
        {(room.complimentaryBenefits?.length ?? 0) > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-[11px] font-medium tracking-[0.2em] text-gold-400/60 uppercase">Complimentary</h2>
            <div className="space-y-2">
              {room.complimentaryBenefits!.map((b) => (
                <div key={b} className="flex items-center gap-2.5 rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-3 py-2.5">
                  <span className="text-emerald-400 text-xs">✓</span>
                  <span className="text-xs text-cream/70">{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Purchasable add-ons */}
        {(room.purchasableBenefits?.length ?? 0) > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-[11px] font-medium tracking-[0.2em] text-gold-400/60 uppercase">Add-ons Available</h2>
            <div className="space-y-2">
              {room.purchasableBenefits!.map((b) => (
                <div key={b} className="flex items-center gap-2.5 rounded-xl border border-cream/[0.06] bg-forest-900/40 px-3 py-2.5">
                  <span className="text-gold-400/60 text-xs">+</span>
                  <span className="text-xs text-cream/60">{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extra charges info */}
        {(room.extraGuestCharge ?? 0) > 0 && (
          <p className="mt-4 text-xs text-cream/35">
            Extra guest charge: ₹{Math.round(room.extraGuestCharge!).toLocaleString('en-IN')} /night
          </p>
        )}
        {(room.tax ?? 0) > 0 && (
          <p className="mt-1 text-xs text-cream/35">
            GST / taxes: {Math.round(room.tax!)}% applicable
          </p>
        )}
      </div>
      </main>

      {/* ── Sticky CTA ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream/[0.08] bg-forest-950/95 px-5 py-4 backdrop-blur-sm">
        <div className="flex gap-3">
          {hotel?.contactPhone && (
            <a href={`tel:${hotel.contactPhone}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-cream/[0.12] bg-forest-900/60 py-3.5 text-sm font-medium text-cream">
              📞 Call
            </a>
          )}
          {waUrl ? (
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-gold-500 py-3.5 text-sm font-semibold text-forest-950 active:opacity-85">
              💬 Enquire on WhatsApp
            </a>
          ) : (
            <button type="button"
              className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-gold-500 py-3.5 text-sm font-semibold text-forest-950 active:opacity-85"
              onClick={() => navigate(-1)}>
              Enquire Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
