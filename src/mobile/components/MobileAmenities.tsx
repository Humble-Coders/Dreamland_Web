import { amenityEmoji, amenityLabel } from '../utils'
import type { HotelHighlight } from '../../services/landingService'

interface Props {
  highlights: HotelHighlight[]
}

export default function MobileAmenities({ highlights }: Props) {
  if (highlights.length === 0) return null

  // 3-column grid — matches Android's AmenityChip layout (cols = if maxWidth < 320 then 2 else 3)
  const rows: HotelHighlight[][] = []
  for (let i = 0; i < highlights.length; i += 3) {
    rows.push(highlights.slice(i, i + 3))
  }

  return (
    <div>
      <div className="space-y-2">
        {rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-3 gap-2">
            {row.map((h) => (
              <div
                key={h.title}
                className="flex flex-col items-center gap-2 rounded-xl border border-cream/[0.06] bg-forest-900/60 px-2 py-3.5"
              >
                {/* Icon box — matches Android's Box(GoldAlpha10, RoundedCornerShape(8dp)) */}
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10 text-lg">
                  {amenityEmoji(h.amenityType ?? h.category ?? h.title)}
                </div>
                <span className="text-center text-[11px] leading-tight text-cream/80 line-clamp-2">
                  {amenityLabel(h.title)}
                </span>
              </div>
            ))}
            {/* Fill empty cells in last row */}
            {row.length < 3 &&
              Array.from({ length: 3 - row.length }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
