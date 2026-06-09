export default function Card({ children, className = '' }) {
  return (
    <div
      className={`animate-fade-up w-full max-w-md rounded-3xl border border-gold-500/25 bg-forest-900/70 p-7 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-8 ${className}`}
    >
      {children}
    </div>
  )
}
