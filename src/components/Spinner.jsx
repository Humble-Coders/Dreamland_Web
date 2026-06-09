export default function Spinner({ className = '' }) {
  return (
    <span
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-forest-950/30 border-t-forest-950 ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}
