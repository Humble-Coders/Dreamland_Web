import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../Logo'
import type { Hotel } from '../../hooks/useLandingData'

const TABS = [
  { label: 'Home',     path: '/' },
  { label: 'Hotels',   path: '/hotels' },
  { label: 'Bookings', path: '/bookings', auth: true },
  { label: 'Profile',  path: '/profile',  auth: true },
]

// Anchor links shown as sub-nav only on the home page
const HOME_ANCHORS = [
  { label: 'About',   href: '#about' },
  { label: 'Rooms',   href: '#rooms' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

interface Props {
  hotel?: Hotel | null
}

export default function LandingNav({ hotel }: Props) {
  const hotelName     = hotel?.name ?? ''
  const hotelLocation = [hotel?.city, hotel?.country].filter(Boolean).join(', ')
  const navigate      = useNavigate()
  const location      = useLocation()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const { scrollY } = useScroll()

  const isHome = location.pathname === '/'
  const activeTab = TABS.find((t) =>
    t.path === '/' ? location.pathname === '/' : location.pathname.startsWith(t.path),
  )?.path ?? '/'

  useEffect(() => scrollY.on('change', (v) => setScrolled(v > 60)), [scrollY])

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const scrollTo = (href: string) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const goTo = (path: string) => {
    setMenuOpen(false)
    navigate(path)
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
            onClick={() => goTo('/')}
            className="flex items-center gap-3 group"
          >
            <Logo className="h-9 w-9 rounded-lg object-contain opacity-90 transition-opacity group-hover:opacity-100" />
            <div className="leading-tight">
              <p className="font-display text-base text-cream tracking-wide">{hotelName}</p>
              {hotelLocation && (
                <p className="text-[9px] tracking-[0.3em] text-gold-400/70 uppercase">{hotelLocation}</p>
              )}
            </div>
          </button>

          {/* Desktop tabs */}
          <div className="hidden items-center gap-1 md:flex">
            {TABS.map((tab) => {
              const active = activeTab === tab.path
              return (
                <button
                  key={tab.path}
                  type="button"
                  onClick={() => goTo(tab.path)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    active
                      ? 'text-gold-400'
                      : 'text-cream/50 hover:text-cream/80'
                  }`}
                >
                  {tab.label}
                  {tab.auth && !active && (
                    <span className="absolute right-3 top-2 h-1 w-1 rounded-full bg-cream/25" />
                  )}
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-lg bg-gold-500/10 border border-gold-500/20"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </button>
              )
            })}

            {/* Divider */}
            {isHome && (
              <>
                <div className="mx-2 h-4 w-px bg-cream/15" />
                {HOME_ANCHORS.map((link) => (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    className="px-3 py-2 text-sm text-cream/45 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Toggle menu"
          >
            <motion.span animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-px w-6 bg-cream origin-center transition-colors" />
            <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-px w-6 bg-cream" />
            <motion.span animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-px w-6 bg-cream origin-center" />
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
              {/* Route tabs */}
              {TABS.map((tab) => {
                const active = activeTab === tab.path
                return (
                  <button
                    key={tab.path}
                    type="button"
                    onClick={() => goTo(tab.path)}
                    className={`py-3 text-left text-base border-b border-cream/[0.06] last:border-0 transition-colors ${
                      active ? 'text-gold-400' : 'text-cream/70 hover:text-gold-300'
                    }`}
                  >
                    {tab.label}
                    {tab.auth && <span className="ml-2 text-[10px] text-cream/25">Sign in required</span>}
                  </button>
                )
              })}

              {/* Anchor links when on home */}
              {isHome && (
                <>
                  <div className="my-2 h-px bg-cream/[0.06]" />
                  {HOME_ANCHORS.map((link) => (
                    <button
                      key={link.href}
                      type="button"
                      onClick={() => scrollTo(link.href)}
                      className="py-3 text-left text-sm text-cream/45 transition-colors hover:text-gold-300 border-b border-cream/[0.04] last:border-0"
                    >
                      {link.label}
                    </button>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
