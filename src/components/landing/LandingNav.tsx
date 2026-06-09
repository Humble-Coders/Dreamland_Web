// Sticky transparent navbar that transitions to a frosted-glass panel on scroll.
// Includes a full mobile menu with AnimatePresence for smooth open/close.
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Logo from '../Logo'
import type { Hotel } from '../../hooks/useLandingData'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Rooms', href: '#rooms' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

interface Props {
  hotel?: Hotel | null
}

export default function LandingNav({ hotel }: Props) {
  const hotelName = hotel?.name ?? ''
  const hotelLocation = [hotel?.city, hotel?.country].filter(Boolean).join(', ')
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  // Switch from transparent to glass when user scrolls past 60 px.
  useEffect(() => {
    return scrollY.on('change', (v) => setScrolled(v > 60))
  }, [scrollY])

  // Close mobile menu on resize to desktop.
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const scrollTo = (href: string) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-cream/[0.06] bg-forest-950/90 backdrop-blur-xl shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          {/* Logo */}
          <button
            type="button"
            onClick={() => scrollTo('#hero')}
            className="flex items-center gap-3 group"
          >
            <Logo className="h-9 w-9 rounded-lg object-contain opacity-90 transition-opacity group-hover:opacity-100" />
            <div className="leading-tight">
              <p className="font-display text-base text-cream tracking-wide">{hotelName}</p>
              <p className="text-[9px] tracking-[0.3em] text-gold-400/70 uppercase">{hotelLocation}</p>
            </div>
          </button>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => scrollTo(link.href)}
                className="text-sm tracking-wide text-cream/65 transition-colors hover:text-gold-300"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => navigate('/app')}
              className="rounded-full border border-gold-500/40 bg-gold-500/10 px-5 py-2 text-sm font-medium text-gold-300 transition-all hover:bg-gold-500/20 hover:border-gold-400"
            >
              Guest App
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-px w-6 bg-cream origin-center transition-colors"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-px w-6 bg-cream"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-px w-6 bg-cream origin-center"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[65px] z-40 border-b border-cream/10 bg-forest-950/97 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => scrollTo(link.href)}
                  className="py-3 text-left text-base text-cream/70 transition-colors hover:text-gold-300 border-b border-cream/[0.06] last:border-0"
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => navigate('/app')}
                className="mt-4 w-full rounded-2xl bg-gold-500 py-3 font-semibold text-forest-950"
              >
                Open Guest App
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
