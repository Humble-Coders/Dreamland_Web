import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getRoomById } from '../services/landingService'
import SEO, { SITE_URL, DEFAULT_IMAGE } from '../components/SEO'
import { imgUrl } from '../utils/imgUrl'
import LandingNav from '../components/landing/LandingNav'
import LandingFooter from '../components/landing/LandingFooter'
import type { HotelRoom, Hotel } from '../services/landingService'

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

const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  // Accept pre-loaded data from navigation state for instant display
  const stateRoom = (location.state as { room?: HotelRoom; hotel?: Hotel } | null)
  const [room, setRoom] = useState<HotelRoom | null>(stateRoom?.room ?? null)
  const [hotel, setHotel] = useState<Hotel | null>(stateRoom?.hotel ?? null)
  const [loading, setLoading] = useState(!stateRoom?.room)
  const [activePhoto, setActivePhoto] = useState(0)

  useEffect(() => {
    if (stateRoom?.room || !roomId) return
    getRoomById(roomId).then((data) => {
      if (data) { setRoom(data.room); setHotel(data.hotel) }
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-forest-950 px-8 text-center text-cream">
        <p className="text-5xl opacity-20">🛏</p>
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
    <div className="min-h-full bg-forest-950 text-cream">
      <SEO
        title={`${room.name} | ${hotel?.name ?? 'Dreamland Resort Karnal'}`}
        description={room.description || `Explore the ${room.name} room at ${hotel?.name ?? 'Dreamland Resort'} — view amenities, pricing and availability.`}
        path={`/room/${room.id}`}
        image={photos[0] ? `${SITE_URL}${photos[0]}` : DEFAULT_IMAGE}
      />
      <LandingNav hotel={hotel} />

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-28 lg:px-10 lg:pt-32">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-cream/50 transition-colors hover:text-gold-300"
        >
          <BackIcon />
          Back
        </button>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          {/* ── Left: gallery + details ── */}
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest-900 lg:aspect-[16/10]">
              {photos.length > 0 ? (
                <img
                  src={imgUrl(photos[activePhoto], 1200)}
                  alt={room.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl opacity-10">🛏</div>
              )}
            </div>

            {photos.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {photos.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setActivePhoto(i)}
                    className={`aspect-[4/3] overflow-hidden rounded-xl border-2 transition-colors ${
                      i === activePhoto ? 'border-gold-400' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl(url, 300)} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            {room.description && (
              <div className="mt-10">
                <h2 className="mb-3 text-xs font-medium tracking-[0.3em] text-gold-400/60 uppercase">About this room</h2>
                <p className="text-base leading-relaxed text-cream/65">{room.description}</p>
              </div>
            )}

            {/* Amenities */}
            {(room.amenities?.length ?? 0) > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-xs font-medium tracking-[0.3em] text-gold-400/60 uppercase">Amenities</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {room.amenities!.map((a) => (
                    <div key={a} className="flex items-center gap-2.5 rounded-xl border border-cream/[0.06] bg-forest-900/40 px-4 py-3">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400/60" />
                      <span className="text-sm leading-snug text-cream/70">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complimentary + Add-ons */}
            {((room.complimentaryBenefits?.length ?? 0) > 0 || (room.purchasableBenefits?.length ?? 0) > 0) && (
              <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2">
                {(room.complimentaryBenefits?.length ?? 0) > 0 && (
                  <div>
                    <h2 className="mb-4 text-xs font-medium tracking-[0.3em] text-gold-400/60 uppercase">Complimentary</h2>
                    <div className="space-y-2.5">
                      {room.complimentaryBenefits!.map((b) => (
                        <div key={b} className="flex items-center gap-2.5 rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-3">
                          <span className="text-sm text-emerald-400">✓</span>
                          <span className="text-sm text-cream/70">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(room.purchasableBenefits?.length ?? 0) > 0 && (
                  <div>
                    <h2 className="mb-4 text-xs font-medium tracking-[0.3em] text-gold-400/60 uppercase">Add-ons Available</h2>
                    <div className="space-y-2.5">
                      {room.purchasableBenefits!.map((b) => (
                        <div key={b} className="flex items-center gap-2.5 rounded-xl border border-cream/[0.06] bg-forest-900/40 px-4 py-3">
                          <span className="text-sm text-gold-400/60">+</span>
                          <span className="text-sm text-cream/60">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right: sticky info card ── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-cream/[0.07] bg-forest-900/40 p-6 lg:p-8">
              {hotel?.name && <p className="text-sm text-cream/40">{hotel.name}</p>}
              <h1 className="mt-1 font-display text-3xl capitalize text-cream lg:text-4xl">{room.name.toLowerCase()}</h1>

              {(room.price ?? 0) > 0 && (
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="font-display text-3xl font-bold text-gold-400">
                    ₹{Math.round(room.price!).toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-cream/40">
                    {(room.tax ?? 0) > 0 ? `+ ${Math.round(room.tax!)}% tax` : 'per night'}
                  </p>
                </div>
              )}

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-2">
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

              {/* Specs */}
              {specs.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {specs.map((spec) => (
                    <div key={spec.label} className="rounded-xl border border-cream/[0.07] bg-forest-900/50 px-3 py-2.5">
                      <p className="text-[10px] font-medium tracking-[0.15em] text-cream/35 uppercase">{spec.label}</p>
                      <p className="mt-0.5 text-sm font-semibold text-cream">{spec.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Extra charges info */}
              {(room.extraGuestCharge ?? 0) > 0 && (
                <p className="mt-4 text-xs text-cream/35">
                  Extra guest charge: ₹{Math.round(room.extraGuestCharge!).toLocaleString('en-IN')} /night
                </p>
              )}
              {(room.tax ?? 0) > 0 && (
                <p className="mt-1 text-xs text-cream/35">GST / taxes: {Math.round(room.tax!)}% applicable</p>
              )}

              {/* CTAs */}
              <div className="mt-6 flex flex-col gap-3">
                {waUrl ? (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-gold-500 py-3.5 text-sm font-semibold text-forest-950 transition-colors hover:bg-gold-400"
                  >
                    💬 Enquire on WhatsApp
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate(`/hotel/${hotel?.id ?? ''}`)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gold-500 py-3.5 text-sm font-semibold text-forest-950 transition-colors hover:bg-gold-400"
                  >
                    Enquire Now
                  </button>
                )}
                {hotel?.contactPhone && (
                  <a
                    href={`tel:${hotel.contactPhone}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-cream/[0.12] bg-forest-900/60 py-3.5 text-sm font-medium text-cream transition-colors hover:border-cream/25"
                  >
                    📞 Call Hotel
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <LandingFooter hotel={hotel} />
    </div>
  )
}
