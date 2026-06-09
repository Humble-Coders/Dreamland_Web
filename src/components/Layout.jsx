import Logo from './Logo.jsx'

export default function Layout({ children }) {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-forest-950">
      {/* Ambient gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gold-500/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-forest-600/30 blur-[120px]"
      />

      <header className="relative z-10 flex flex-col items-center pt-10 pb-2">
        <Logo className="h-24 w-24 rounded-2xl object-contain" />
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-6">
        {children}
      </main>

      <footer className="relative z-10 pb-7 pt-4 text-center">
        <p className="font-display text-sm tracking-[0.35em] text-gold-400/70 uppercase">
          Hotel Dreamland
        </p>
        <p className="mt-1 text-[11px] tracking-wide text-cream/40">
          A warm welcome to a restful stay
        </p>
      </footer>
    </div>
  )
}
