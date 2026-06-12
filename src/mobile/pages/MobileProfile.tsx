import MobileBottomNav from '../components/MobileBottomNav'
import SEO from '../../components/SEO'

export default function MobileProfile() {
  return (
    <div className="flex min-h-screen flex-col bg-forest-950 text-cream pb-20">
      <SEO title="Profile | Dreamland Resort Karnal" description="Manage your account at Dreamland Resort." path="/profile" noindex />
      {/* Header */}
      <div className="border-b border-cream/[0.06] px-5 pb-4 pt-12">
        <h1 className="font-display text-2xl text-cream">Profile</h1>
        <p className="mt-0.5 text-sm text-cream/40">Account &amp; preferences</p>
      </div>

      {/* Auth required state */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cream/[0.08] bg-forest-900/50">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            className="text-gold-400/60">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>

        <div>
          <h2 className="font-display text-xl text-cream">Sign in to your account</h2>
          <p className="mt-2 text-sm leading-relaxed text-cream/45">
            Access your profile, saved preferences, and loyalty rewards.
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

        {/* Feature preview list */}
        <div className="w-full space-y-2.5 rounded-2xl border border-cream/[0.06] bg-forest-900/40 p-4">
          {[
            { icon: '🗓', text: 'Manage bookings' },
            { icon: '⭐', text: 'Save favourite hotels' },
            { icon: '🎁', text: 'Loyalty rewards' },
            { icon: '🔔', text: 'Stay notifications' },
          ].map((f) => (
            <div key={f.text} className="flex items-center gap-3 text-sm text-cream/40">
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-cream/20">Authentication coming soon</p>
      </div>

      <MobileBottomNav />
    </div>
  )
}
