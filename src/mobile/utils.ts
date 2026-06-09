export function amenityEmoji(type: string): string {
  const t = type.toLowerCase()
  if (t.includes('wifi') || t.includes('wi-fi')) return '📶'
  if (t.includes('parking')) return '🅿️'
  if (t.includes('restaurant') || t.includes('dining') || t.includes('food')) return '🍽️'
  if (t.includes('security') || t.includes('safe')) return '🔒'
  if (t.includes('shuttle') || t.includes('airport')) return '🚌'
  if (t.includes('ac') || t.includes('air') || t.includes('conditioning')) return '❄️'
  if (t.includes('tv') || t.includes('television')) return '📺'
  if (t.includes('bar') || t.includes('minibar')) return '🍸'
  if (t.includes('breakfast') || t.includes('coffee')) return '☕'
  if (t.includes('gym') || t.includes('fitness')) return '💪'
  if (t.includes('pool') || t.includes('swim')) return '🏊'
  if (t.includes('spa') || t.includes('massage')) return '💆'
  if (t.includes('laundry')) return '👕'
  if (t.includes('concierge') || t.includes('service')) return '🛎️'
  return '✓'
}

export function amenityLabel(raw: string): string {
  const lower = raw.toLowerCase().trim()
  if (lower === 'wifi' || lower === 'wi-fi') return 'Wi-Fi'
  if (lower === 'ac' || lower === 'air_conditioning') return 'AC'
  if (lower === 'tv') return 'TV'
  return raw
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

export function formatTime12h(time: string | undefined): string {
  if (!time) return '—'
  try {
    const [h, m] = time.split(':')
    const hour = parseInt(h, 10)
    const min = parseInt(m ?? '0', 10)
    const ampm = hour < 12 ? 'AM' : 'PM'
    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${h12}:${min.toString().padStart(2, '0')} ${ampm}`
  } catch {
    return time
  }
}

export function hotelBadge(isLuxury?: boolean, averageRating?: number): string | null {
  if (isLuxury || (averageRating ?? 0) >= 4.5) return 'Featured'
  if ((averageRating ?? 0) >= 3.5) return 'Recommended'
  return null
}

export function buildMapsUrl(hotel: {
  name?: string
  city?: string
  country?: string
  latitude?: number
  longitude?: number
}): string {
  if (hotel.latitude && hotel.longitude) {
    return `https://maps.google.com/?q=${hotel.latitude},${hotel.longitude}`
  }
  const q = [hotel.name, hotel.city, hotel.country].filter(Boolean).join(', ')
  return `https://maps.google.com/?q=${encodeURIComponent(q)}`
}
