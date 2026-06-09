import { signOut } from 'firebase/auth'
import { auth } from '../firebase.js'
import Card from './Card.jsx'

export default function Success({ user }) {
  return (
    <Card className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-3xl text-emerald-300 ring-1 ring-emerald-500/30">
        ✓
      </div>
      <p className="font-display text-sm tracking-[0.3em] text-gold-400 uppercase">
        Checked in
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-cream">
        Successfully logged in
      </h1>
      <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-cream/70">
        Welcome to Hotel Dreamland. Your stay is verified and you&apos;re all set. We hope you have
        a wonderful time with us.
      </p>

      <div className="mt-6 rounded-2xl border border-cream/10 bg-forest-800/40 px-4 py-3 text-center">
        <p className="text-[11px] tracking-wide text-cream/40 uppercase">Signed in as</p>
        <p className="mt-1 font-mono text-sm text-cream/85">{user.phoneNumber || user.uid}</p>
      </div>

      <button
        type="button"
        onClick={() => signOut(auth)}
        className="mt-6 text-sm text-cream/50 underline-offset-4 transition-colors hover:text-gold-300 hover:underline"
      >
        Sign out
      </button>
    </Card>
  )
}
