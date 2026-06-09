const ROOM_STORAGE_KEY = 'dreamland.roomInstanceId'

// Read the room identifier handed to us by the room's QR code.
// Supported forms: ?roomInstanceId=XXX  (also accepts ?room= / ?r= as aliases).
// Falls back to the last room we saw, so a persisted session that reopens the
// bare URL still knows which room to guard.
export function getRoomInstanceId() {
  const params = new URLSearchParams(window.location.search)
  const fromUrl = (
    params.get('roomInstanceId') ||
    params.get('room') ||
    params.get('r') ||
    ''
  ).trim()

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
export function normalizePhone(raw, defaultCc = '+91') {
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

// Mirror of the backend rule: a stay grants access while it is flagged ACTIVE
// and the guest has not yet checked out. We do NOT gate on checkInActual /
// expectedCheckOut — those are planned/standard times that can sit in the
// future or past relative to actual app use, wrongly locking the guest out.
export function isActiveStay(s) {
  return !!s && s.status === 'ACTIVE' && !s.checkOutActual
}
