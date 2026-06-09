import type { TravelActivity } from '../../services/landingService'

interface Props {
  activities: TravelActivity[]
}

export default function MobileTravelActivities({ activities }: Props) {
  if (activities.length === 0) return null

  return (
    <div className="space-y-3">
      {activities.map((a) => (
        <div
          key={a.id}
          className="rounded-2xl border border-cream/[0.06] bg-forest-900/60 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="font-display text-base text-cream">{a.title}</h4>
              {a.category && (
                <span className="mt-1 inline-block rounded-full border border-gold-500/25 bg-gold-500/8 px-2.5 py-0.5 text-[10px] font-medium text-gold-400">
                  {a.category}
                </span>
              )}
            </div>
            {(a.price ?? 0) > 0 && (
              <div className="shrink-0 text-right">
                <p className="font-display text-lg font-bold text-gold-400">
                  ₹{Math.round(a.price!).toLocaleString('en-IN')}
                </p>
                {a.duration && (
                  <p className="text-[11px] text-cream/40">{a.duration}</p>
                )}
              </div>
            )}
          </div>

          {a.description && (
            <p className="mt-2 text-sm leading-relaxed text-cream/55 line-clamp-2">{a.description}</p>
          )}

          {a.included && a.included.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {a.included.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1 text-[11px] text-emerald-400"
                >
                  <span>✓</span> {item}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
