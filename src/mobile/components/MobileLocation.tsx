import { motion } from 'framer-motion'
import { buildMapsUrl, formatTime12h } from '../utils'
import type { Hotel } from '../../services/landingService'

interface Props {
  hotel: Hotel
}

export default function MobileLocation({ hotel }: Props) {
  const mapsUrl = buildMapsUrl(hotel)
  const modes = hotel.modes ?? []
  const hasCheckTimes = hotel.checkInTime || hotel.checkOutTime

  return (
    <div className="space-y-3">
      {/* Animated map placeholder — matches Android's dot-grid + pulse pin */}
      <div className="relative h-48 overflow-hidden rounded-2xl border border-gold-500/15 bg-forest-900/60">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.5) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Pulsing location pin */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 -m-4 rounded-full bg-gold-500/20"
          />
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
            className="absolute inset-0 -m-2.5 rounded-full bg-gold-500/30"
          />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-forest-950 shadow-[0_0_20px_rgba(212,175,55,0.5)]">
            📍
          </div>
        </div>
        {/* Hotel name tag */}
        {(hotel.name || hotel.city) && (
          <div className="absolute inset-x-4 bottom-4 rounded-xl border border-gold-500/20 bg-forest-950/85 px-4 py-3 backdrop-blur-sm">
            {hotel.name && <p className="font-display text-base text-cream">{hotel.name}</p>}
            {hotel.city && <p className="text-xs text-cream/50">{[hotel.city, hotel.country].filter(Boolean).join(', ')}</p>}
          </div>
        )}
      </div>

      {/* Get Directions button */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold-500/30 bg-gold-500/8 py-3.5 text-sm font-medium text-gold-300 active:bg-gold-500/15"
      >
        Get Directions <span>→</span>
      </a>

      {/* Check-in / Check-out */}
      {hasCheckTimes && (
        <div className="grid grid-cols-2 gap-2">
          {hotel.checkInTime && (
            <div className="rounded-xl border border-cream/[0.06] bg-forest-900/40 px-4 py-3">
              <p className="text-[10px] font-medium tracking-wider text-cream/35 uppercase">Check-in</p>
              <p className="mt-1 text-base font-semibold text-cream">{formatTime12h(hotel.checkInTime)}</p>
            </div>
          )}
          {hotel.checkOutTime && (
            <div className="rounded-xl border border-cream/[0.06] bg-forest-900/40 px-4 py-3">
              <p className="text-[10px] font-medium tracking-wider text-cream/35 uppercase">Check-out</p>
              <p className="mt-1 text-base font-semibold text-cream">{formatTime12h(hotel.checkOutTime)}</p>
            </div>
          )}
        </div>
      )}

      {/* Getting here — transport modes */}
      {modes.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-medium tracking-[0.25em] text-gold-400/60 uppercase">Getting Here</p>
          {modes.map((m, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-cream/[0.06] bg-forest-900/40 px-4 py-3"
            >
              <div>
                <span className="text-sm text-cream/70">{m.name}</span>
                {m.category && (
                  <span className="ml-2 text-xs text-cream/30">({m.category})</span>
                )}
              </div>
              {m.distance && (
                <span className="text-xs text-gold-400/70">{m.distance}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
