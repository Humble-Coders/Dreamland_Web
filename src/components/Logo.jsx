export default function Logo({ className = '' }) {
  return (
    <img
      src="/logo.png"
      alt="Hotel Dreamland"
      className={`select-none drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] ${className}`}
      draggable={false}
    />
  )
}
