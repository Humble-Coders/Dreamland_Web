import type { Stay } from './types/firestore'

const ROOM_STORAGE_KEY = 'dreamland.roomInstanceId'

// Read the room identifier handed to us by the room's QR code.
// Supported forms: ?roomInstanceId=XXX  (also accepts ?room= / ?r= as aliases).
// Falls back to the last room we saw, so a persisted session that reopens the
// bare URL still knows which room to guard.
// QR codes may link to either / or /app — if a roomInstanceId is detected on /,
// the app redirects to /app automatically so the guest lands on the right screen.
export function getRoomInstanceId(): string {
  const params = new URLSearchParams(window.location.search)
  const fromUrl = (
    params.get('roomInstanceId') ||
    params.get('room') ||
    params.get('r') ||
    ''
  ).trim()

  // Old QR codes pointing to / are silently forwarded to /app.
  if (fromUrl && window.location.pathname === '/') {
    window.location.replace(`/app?roomInstanceId=${encodeURIComponent(fromUrl)}`)
    return fromUrl
  }

  if (fromUrl) {
    try {
      localStorage.setItem(ROOM_STORAGE_KEY, fromUrl)
    } catch {
      /* ignore storage failures */
    }
    return fromUrl
  }

  try {
    return localStorage.getItem(ROOM_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

// Normalize a possibly-local number to E.164. Defaults to India (+91) because
// guest phones in the data are stored as bare 10-digit locals (e.g. "8685988991").
// Mirrors the backend normalizePhone in functions/index.js.
export function normalizePhone(raw: string | null | undefined, defaultCc = '+91'): string {
  if (raw == null) return ''
  let s = String(raw).trim()
  if (!s) return ''
  if (s.startsWith('+')) return '+' + s.slice(1).replace(/\D/g, '')
  s = s.replace(/\D/g, '')
  if (!s) return ''
  if (s.startsWith('00')) return '+' + s.slice(2)
  if (s.length === 10) return defaultCc + s
  if (s.length === 11 && s.startsWith('0')) return defaultCc + s.slice(1)
  if (s.length === 12 && s.startsWith('91')) return '+' + s
  if (s.length > 10) return '+' + s
  return defaultCc + s
}

// Returns true when a Firebase Storage (or any) URL points to a video file.
// Used to separate photos from videos in the gallery and hero sections.
export function isVideoUrl(url: string): boolean {
  const lower = url.toLowerCase().split('?')[0] // strip query params before checking extension
  return ['.mp4', '.mov', '.webm', '.avi', '.mkv', '.m4v'].some((ext) => lower.endsWith(ext))
}

// Format a 24-hour "HH:MM" time string (as stored in Firestore) to "H:MM AM/PM".
export function formatTime(t: string | undefined): string {
  if (!t) return ''
  const [hStr, mStr = '00'] = t.split(':')
  const h = parseInt(hStr, 10)
  if (isNaN(h)) return t
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${mStr} ${ampm}`
}

// Format a raw digit string (e.g. "9876543210") to "+91 XXXXX XXXXX" for display.
// If the number already has a country code or is in an unexpected format, returns it as-is.
export function formatDisplayPhone(raw: string | undefined): string {
  if (!raw) return ''
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}`
  return raw
}

// Mirror of the backend rule: a stay grants access while it is flagged ACTIVE
// and the guest has not yet checked out. We do NOT gate on checkInActual /
// expectedCheckOut — those are planned/standard times that can sit in the
// future or past relative to actual app use, wrongly locking the guest out.
export function isActiveStay(s: Partial<Stay> | null | undefined): boolean {
  return !!s && s.status === 'ACTIVE' && !s.checkOutActual
}
