import Logo from '../Logo'
import { fadeUp, staggerChildren } from './ui/MotionVariants'
import { motion } from 'framer-motion'
import type { Hotel } from '../../hooks/useLandingData'

const EXPLORE_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Rooms', href: '#rooms' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Gallery', href: '#gallery' },
]

interface Props {
  hotel?: Hotel | null
}

const CONTACT_LINKS_BASE = [
  { label: 'Get In Touch', href: '#contact' },
  { label: 'Location', href: '#location' },
  { label: 'Guest App', href: '/app' },
]

const SOCIAL = [
  { label: 'Instagram', icon: '📸', href: '#' },
  { label: 'Facebook', icon: '📘', href: '#' },
  { label: 'X / Twitter', icon: '🐦', href: '#' },
]

const scrollTo = (href: string) => {
  if (href.startsWith('#')) {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.location.href = href
  }
}

export default function LandingFooter({ hotel }: Props) {
  const phone = hotel?.contactPhone ?? ''
  const email = hotel?.contactEmail ?? ''
  const waNumber = phone.replace(/[\s+\-().]/g, '')

  const CONTACT_LINKS = [
    ...CONTACT_LINKS_BASE,
    { label: 'WhatsApp', href: `https://wa.me/${waNumber}` },
  ]

  return (
    <footer className="relative border-t border-cream/[0.06] bg-forest-950 pt-20 pb-10">
      <div className="mb-16 flex items-center justify-center gap-4 text-gold-500/25">
        <div className="h-px w-24 bg-gold-500/15" />
        <span className="text-sm">✦ ◈ ✦</span>
        <div className="h-px w-24 bg-gold-500/15" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 md:gap-12 lg:grid-cols-4">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Logo className="h-10 w-10 rounded-xl object-contain opacity-80" />
              <div>
                <p className="font-display text-lg text-cream">Hotel Dreamland</p>
                <p className="text-[10px] tracking-[0.3em] text-gold-400/60 uppercase">Karnal, Haryana</p>
              </div>
            </div>
            <p className="font-display text-base italic text-cream/40 mb-5">
              Where Luxury Meets Tradition
            </p>
            <p className="text-sm leading-relaxed text-cream/35 max-w-sm">
              A world-class hospitality experience nestled along GT Road, Karnal.
              Thoughtfully designed for guests who demand the finest.
            </p>
            {(phone || email) && (
              <div className="mt-4 space-y-1 text-xs text-cream/30">
                {phone && <p>📞 {phone}</p>}
                {email && <p>✉️ {email}</p>}
              </div>
            )}
            <div className="mt-6 flex gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/10 text-sm transition-colors hover:border-gold-500/30 hover:bg-gold-500/8"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="mb-5 text-xs font-medium tracking-[0.3em] text-gold-400/60 uppercase">Explore</p>
            <ul className="space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-cream/40 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-5 text-xs font-medium tracking-[0.3em] text-gold-400/60 uppercase">Contact</p>
            <ul className="space-y-3">
              {CONTACT_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-cream/40 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cream/[0.06] pt-8 text-xs text-cream/25 sm:flex-row">
          <p>© {new Date().getFullYear()} {[hotel?.name, hotel?.city].filter(Boolean).join(', ')}. All rights reserved.</p>
          <p className="tracking-wide">
            {[hotel?.address, hotel?.city, hotel?.country].filter(Boolean).join(', ')}
          </p>
        </div>
      </div>
    </footer>
  )
}
