import { motion } from 'framer-motion'
import { useLandingData } from '../hooks/useLandingData'
import LandingNav from '../components/landing/LandingNav'
import SEO from '../components/SEO'
import { imgUrl } from '../utils/imgUrl'
import { LOCAL_PHOTOS } from '../data/localImages'

const PERKS = [
  { icon: '⭐', label: 'Saved Hotels',      desc: 'Bookmark and revisit favourite properties' },
  { icon: '🎁', label: 'Loyalty Points',    desc: 'Earn and redeem on every stay' },
  { icon: '💳', label: 'Exclusive Rates',   desc: 'Member-only pricing and early access' },
  { icon: '📞', label: 'Priority Support',  desc: 'Dedicated concierge for members' },
  { icon: '🔐', label: 'Secure Account',    desc: 'Your data, always protected' },
  { icon: '🔔', label: 'Stay Alerts',       desc: 'Notifications for your bookings' },
]

export default function Profile() {
  const { hotel } = useLandingData()
  const bgPhoto = LOCAL_PHOTOS[6]

  return (
    <div className="min-h-screen bg-forest-950 text-cream">
      <SEO title="Profile | Dreamland Resort Karnal" description="Manage your account at Dreamland Resort." path="/profile" noindex />
      <LandingNav hotel={hotel} />

      <main className="flex min-h-screen">
        {/* ── Right panel — image (flipped vs Bookings) ── */}
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-32 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm"
          >
            {/* Avatar placeholder */}
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-cream/[0.08] bg-forest-900/60">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
                className="text-gold-400/60">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>

            <h1 className="font-display text-4xl text-cream">Profile</h1>
            <p className="mt-2 text-sm leading-relaxed text-cream/45">
              Sign in to access your account, preferences, and loyalty programme.
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

            {/* Perks — 2-col grid */}
            <div className="mt-12 grid grid-cols-2 gap-3">
              {PERKS.map((p) => (
                <div key={p.label}
                  className="rounded-xl border border-cream/[0.06] bg-forest-900/40 p-4">
                  <span className="text-xl">{p.icon}</span>
                  <p className="mt-2.5 text-sm font-medium text-cream/55 leading-snug">{p.label}</p>
                  <p className="mt-1 text-xs text-cream/25 leading-snug">{p.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right panel — atmospheric image ── */}
        <div className="relative hidden w-1/2 lg:block">
          <img
            src={imgUrl(bgPhoto, 1200)}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-forest-950/45" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-forest-950 to-transparent" />

          {/* Branding copy */}
          <div className="absolute bottom-16 left-12 right-12">
            <p className="mb-3 text-[10px] font-medium tracking-[0.35em] text-gold-400/70 uppercase">
              Member Experience
            </p>
            <h2 className="font-display text-5xl leading-tight text-cream">
              More than<br />just a stay.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-cream/50 max-w-sm">
              Unlock exclusive privileges, personalised service, and rewards designed around you.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
