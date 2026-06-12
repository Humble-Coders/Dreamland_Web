import MobileBottomNav from '../components/MobileBottomNav'
import SEO from '../../components/SEO'

export default function MobileBookings() {
  return (
    <div className="flex min-h-screen flex-col bg-forest-950 text-cream pb-20">
      <SEO title="Bookings | Dreamland Resort Karnal" description="Manage your bookings at Dreamland Resort." path="/bookings" noindex />
      {/* Header */}
      <div className="border-b border-cream/[0.06] px-5 pb-4 pt-12">
        <h1 className="font-display text-2xl text-cream">Bookings</h1>
        <p className="mt-0.5 text-sm text-cream/40">Your upcoming and past stays</p>
      </div>

      {/* Auth required state */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cream/[0.08] bg-forest-900/50">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            className="text-gold-400/60">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <div>
          <h2 className="font-display text-xl text-cream">Sign in to view bookings</h2>
          <p className="mt-2 text-sm leading-relaxed text-cream/45">
            Create an account or sign in to manage your reservations and stay history.
          </p>
        </div>

        <div className="w-full space-y-3">
          <button
            type="button"
            disabled
            className="w-full rounded-xl bg-gold-500/40 py-3.5 text-sm font-semibold text-forest-950/60 cursor-not-allowed"
          >
            Sign In
          </button>
          <button
            type="button"
            disabled
            className="w-full rounded-xl border border-cream/[0.1] py-3.5 text-sm font-medium text-cream/35 cursor-not-allowed"
          >
            Create Account
          </button>
        </div>

        <p className="text-xs text-cream/20">Authentication coming soon</p>
      </div>

      <MobileBottomNav />
    </div>
  )
}
