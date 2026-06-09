import type { Attraction } from '../../services/landingService'

interface Props {
  attractions: Attraction[]
}

export default function MobileAttractions({ attractions }: Props) {
  if (attractions.length === 0) return null

  return (
    <div className="space-y-2">
      {attractions.map((a) => (
        <div
          key={a.id}
          className="flex items-center justify-between rounded-xl border border-cream/[0.06] bg-forest-900/40 px-4 py-3"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-cream">{a.name}</p>
            {a.description && (
              <p className="mt-0.5 text-xs text-cream/45 line-clamp-1">{a.description}</p>
            )}
          </div>
          {a.category && (
            <span className="ml-3 shrink-0 rounded-full border border-gold-500/25 bg-gold-500/8 px-2.5 py-0.5 text-[10px] font-medium text-gold-400">
              {a.category}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
