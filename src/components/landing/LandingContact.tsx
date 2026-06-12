import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionHeading from './ui/SectionHeading'
import { staggerChildren, slideRight, fadeUp, scaleIn } from './ui/MotionVariants'
import Img from './ui/Img'
import { imgUrl } from '../../utils/imgUrl'
import type { Hotel } from '../../hooks/useLandingData'

interface Props {
  hotel?: Hotel | null
}

function buildMapsUrl(hotel?: Hotel | null): string {
  if (!hotel) return '#'
  if (hotel.latitude && hotel.longitude) return `https://maps.google.com/?q=${hotel.latitude},${hotel.longitude}`
  return `https://maps.google.com/?q=${encodeURIComponent([hotel.name, hotel.city, hotel.country].filter(Boolean).join(', '))}`
}

export default function LandingContact({ hotel }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  const contactInfo = [
    hotel?.contactPhone ? { icon: '📞', value: hotel.contactPhone } : null,
    hotel?.contactEmail ? { icon: '✉️', value: hotel.contactEmail } : null,
    hotel?.address || hotel?.city
      ? { icon: '📍', value: [hotel.address, hotel.city].filter(Boolean).join(', ') }
      : null,
  ].filter(Boolean) as { icon: string; value: string }[]

  const waNumber = hotel?.contactPhone?.replace(/[\s+\-().]/g, '') ?? ''
  const waUrl = waNumber ? `https://wa.me/${waNumber}` : null

  const quickActions = [
    waUrl ? { icon: '💬', label: 'WhatsApp', sub: 'Chat with us', href: waUrl, external: true } : null,
    hotel?.contactPhone ? { icon: '📞', label: 'Call Now', sub: hotel.contactPhone, href: `tel:${hotel.contactPhone}`, external: false } : null,
    hotel?.contactEmail ? { icon: '✉️', label: 'Email Us', sub: hotel.contactEmail, href: `mailto:${hotel.contactEmail}`, external: false } : null,
    { icon: '🧭', label: 'Get Directions', sub: 'Open in Maps', href: buildMapsUrl(hotel), external: true },
  ].filter(Boolean) as { icon: string; label: string; sub: string; href: string; external: boolean }[]

  const photo = hotel?.photos?.[2] ?? hotel?.photos?.[0]

  return (
    <section id="contact" ref={ref} className="py-16 sm:py-24 lg:py-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-2 lg:px-10">

        {/* Left */}
        <motion.div
          variants={staggerChildren(0.12)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col justify-center gap-8"
        >
          <SectionHeading
            label="Get In Touch"
            title={`We'd Love to\nHear From You`}
            subtitle="Whether you have a question about your stay, a special occasion to plan, or simply wish to learn more — our team is always within reach."
            align="left"
          />

          {contactInfo.length > 0 && (
            <motion.div variants={fadeUp} className="space-y-4 text-sm text-cream/55">
              {contactInfo.map((c) => (
                <p key={c.value} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-500/20 bg-gold-500/8 text-base">
                    {c.icon}
                  </span>
                  {c.value}
                </p>
              ))}
            </motion.div>
          )}

          {waUrl && (
            <motion.a
              variants={fadeUp}
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-fit items-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/8 px-6 py-3.5 text-sm font-medium text-emerald-300 transition-all hover:bg-emerald-500/15"
            >
              <span className="text-lg">💬</span>
              Chat on WhatsApp
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </motion.a>
          )}
        </motion.div>

        {/* Right: photo + quick contact actions */}
        <motion.div
          variants={staggerChildren(0.1)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col gap-5"
        >
          {photo && (
            <motion.div variants={slideRight} className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-cream/10">
              <Img src={imgUrl(photo, 1000)} alt={hotel?.name ?? ''} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-forest-950/10 to-transparent" />
              {(hotel?.checkInTime || hotel?.checkOutTime) && (
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-cream/10 bg-forest-950/60 px-4 py-3 backdrop-blur-sm">
                  <div>
                    <p className="text-[10px] tracking-[0.25em] text-gold-400/70 uppercase">Check-in</p>
                    <p className="text-sm text-cream">{hotel?.checkInTime ?? '—'}</p>
                  </div>
                  <div className="h-8 w-px bg-cream/15" />
                  <div className="text-right">
                    <p className="text-[10px] tracking-[0.25em] text-gold-400/70 uppercase">Check-out</p>
                    <p className="text-sm text-cream">{hotel?.checkOutTime ?? '—'}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quickActions.map((action) => (
              <motion.a
                key={action.label}
                variants={scaleIn}
                href={action.href}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-4 rounded-2xl border border-cream/8 bg-forest-900/40 p-5 transition-all hover:border-gold-500/30 hover:bg-forest-900/60"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-500/20 bg-gold-500/8 text-lg">
                  {action.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-cream">{action.label}</span>
                  <span className="block truncate text-xs text-cream/45">{action.sub}</span>
                </span>
                <span className="ml-auto shrink-0 text-cream/30 transition-transform group-hover:translate-x-1 group-hover:text-gold-300">→</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
