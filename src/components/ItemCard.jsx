import { formatINR, unitPrice } from '../orders.js'

// A single orderable item (food or service) with an add / quantity stepper.
export default function ItemCard({ item, qty, onChange }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-cream/10 bg-forest-900/50 p-4 transition-colors hover:border-gold-500/30">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-cream">{item.name}</p>
        <p className="mt-0.5 text-sm text-gold-300">{formatINR(unitPrice(item))}</p>
        {item.taxPercentage > 0 && (
          <p className="mt-0.5 text-[11px] text-cream/40">incl. {item.taxPercentage}% tax</p>
        )}
      </div>

      {qty > 0 ? (
        <div className="flex items-center gap-3 rounded-full border border-gold-500/40 bg-gold-500/10 px-2 py-1.5">
          <button
            type="button"
            aria-label={`Remove one ${item.name}`}
            onClick={() => onChange(qty - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-lg text-gold-300 transition-colors hover:bg-gold-500/20 active:scale-95"
          >
            −
          </button>
          <span className="min-w-5 text-center font-semibold tabular-nums text-cream">{qty}</span>
          <button
            type="button"
            aria-label={`Add one ${item.name}`}
            onClick={() => onChange(qty + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-lg text-gold-300 transition-colors hover:bg-gold-500/20 active:scale-95"
          >
            +
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onChange(1)}
          className="shrink-0 rounded-full border border-gold-500/40 bg-gold-500/10 px-5 py-2 text-sm font-semibold text-gold-300 transition-all hover:bg-gold-500/20 active:scale-95"
        >
          Add
        </button>
      )}
    </div>
  )
}
