import { motion } from 'framer-motion'
import { useLandingData } from '../hooks/useLandingData'
import LandingNav from '../components/landing/LandingNav'
import { imgUrl } from '../utils/imgUrl'
import { LOCAL_PHOTOS } from '../data/localImages'

const FEATURES = [
  { icon: '🗓', title: 'Manage Reservations',  desc: 'View, modify or cancel bookings any time' },
  { icon: '📋', title: 'Stay History',          desc: 'Access past stays and download receipts' },
  { icon: '🔔', title: 'Real-time Updates',     desc: 'Instant notifications on booking status' },
  { icon: '🎁', title: 'Loyalty Rewards',       desc: 'Earn points redeemable on every stay' },
]

export default function Bookings() {
  const { hotel } = useLandingData()
  const bgPhoto = LOCAL_PHOTOS[3]

  return (
    <div className="min-h-screen bg-forest-950 text-cream">
      <LandingNav hotel={hotel} />

      <div className="flex min-h-screen">
        {/* ── Left panel — atmospheric image ── */}
        <div className="relative hidden w-1/2 lg:block">
          <img
            src={imgUrl(bgPhoto, 1200)}
            alt=""
            className="h-full w-full object-cover"
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-forest-950/50" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-forest-950 to-transparent" />

          {/* Branding copy */}
          <div className="absolute bottom-16 left-12 right-12">
            <p className="mb-3 text-[10px] font-medium tracking-[0.35em] text-gold-400/70 uppercase">
              Your Journeys
            </p>
            <h2 className="font-display text-5xl leading-tight text-cream">
              Every stay,<br />perfectly managed.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-cream/50 max-w-sm">
              From reservation to check-out, your bookings are always at your fingertips.
            </p>
          </div>
        </div>

        {/* ── Right panel — auth content ── */}
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-32 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm"
          >
            {/* Lock icon */}
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-cream/[0.08] bg-forest-900/60">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
                className="text-gold-400/60">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h1 className="font-display text-4xl text-cream">Bookings</h1>
            <p className="mt-2 text-sm leading-relaxed text-cream/45">
              Sign in to view and manage your reservations and stay history.
            </p>

            <div className="mt-8 space-y-3">
              <button type="button" disabled
                className="w-full rounded-xl bg-gold-500/25 py-3.5 text-sm font-semibold text-cream/30 cursor-not-allowed">
                Sign In
              </button>
              <button type="button" disabled
                className="w-full rounded-xl border border-cream/[0.09] py-3.5 text-sm font-medium text-cream/25 cursor-not-allowed">
                Create Account
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-cream/20 tracking-wide">
              Authentication coming soon
            </p>

            {/* Feature grid */}
            <div className="mt-12 grid grid-cols-2 gap-3">
              {FEATURES.map((f) => (
                <div key={f.title}
                  className="rounded-xl border border-cream/[0.06] bg-forest-900/40 p-4">
                  <span className="text-xl">{f.icon}</span>
                  <p className="mt-2.5 text-sm font-medium text-cream/55 leading-snug">{f.title}</p>
                  <p className="mt-1 text-xs text-cream/25 leading-snug">{f.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
