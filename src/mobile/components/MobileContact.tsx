import type { Hotel } from '../../services/landingService'

interface Props {
  hotel: Hotel
}

export default function MobileContact({ hotel }: Props) {
  const phone = hotel.contactPhone
  const email = hotel.contactEmail
  const waNumber = phone?.replace(/[\s+\-().]/g, '') ?? ''
  const waUrl = waNumber ? `https://wa.me/${waNumber}` : null

  if (!phone && !email) return null

  return (
    <div className="space-y-3">
      {/* Phone + Email cards side by side — matches Android's Row with ContactCard */}
      <div className="grid grid-cols-2 gap-2">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex flex-col gap-1.5 rounded-xl border border-cream/[0.06] bg-forest-900/60 p-3.5"
          >
            <span className="flex items-center gap-1.5 text-[11px] text-cream/40">
              <span className="text-xs text-gold-400">📞</span> Phone
            </span>
            <span className="text-sm font-medium text-cream leading-snug">{phone}</span>
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex flex-col gap-1.5 rounded-xl border border-cream/[0.06] bg-forest-900/60 p-3.5"
          >
            <span className="flex items-center gap-1.5 text-[11px] text-cream/40">
              <span className="text-xs text-gold-400">✉️</span> Email
            </span>
            <span className="text-sm font-medium text-cream leading-snug break-all">{email}</span>
          </a>
        )}
      </div>

      {/* WhatsApp CTA — full width, emerald green */}
      {waUrl && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/8 py-3.5 text-sm font-medium text-emerald-400 active:bg-emerald-500/15"
        >
          <span className="text-base">💬</span>
          Chat on WhatsApp
          <span className="text-sm">→</span>
        </a>
      )}
    </div>
  )
}
