const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { setGlobalOptions } = require('firebase-functions/v2')
const { defineSecret } = require('firebase-functions/params')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const crypto = require('crypto')

initializeApp()
const db = getFirestore()

// Co-locate with the rest of the project's callables.
setGlobalOptions({ region: 'asia-south1' })

// 32-byte symmetric key used to encrypt the per-option phone tokens.
// Set it with:  firebase functions:secrets:set CHECKIN_SECRET
const CHECKIN_SECRET = defineSecret('CHECKIN_SECRET')

// Tokens handed to the browser are only valid briefly — long enough for a guest
// to pick a number and tap "send code".
const TOKEN_TTL_MS = 10 * 60 * 1000

// --- token encryption (AES-256-GCM) -----------------------------------------
// The browser receives an opaque token, never the real number. Only this
// backend (which holds the secret) can decrypt it back to a phone number.
function keyFromSecret(secret) {
  return crypto.createHash('sha256').update(String(secret)).digest() // 32 bytes
}

function encryptToken(payload, secret) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', keyFromSecret(secret), iv)
  const data = Buffer.concat([
    cipher.update(JSON.stringify(payload), 'utf8'),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, data]).toString('base64url')
}

function decryptToken(token, secret) {
  const raw = Buffer.from(token, 'base64url')
  const iv = raw.subarray(0, 12)
  const tag = raw.subarray(12, 28)
  const data = raw.subarray(28)
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyFromSecret(secret), iv)
  decipher.setAuthTag(tag)
  const out = Buffer.concat([decipher.update(data), decipher.final()])
  return JSON.parse(out.toString('utf8'))
}

// Mask a phone number for display, e.g. +919876543210 -> +91 ••••• 3210
function maskPhone(phone) {
  if (!phone) return ''
  const digits = phone.replace(/[^\d]/g, '')
  const last4 = digits.slice(-4)
  const cc = phone.startsWith('+') ? phone.slice(0, phone.length - digits.length + 2) : ''
  return `${cc ? cc + ' ' : ''}••••• ${last4}`.trim()
}

// Normalize a possibly-local number to E.164. Defaults to India (+91) because
// numbers in the data are stored as bare 10-digit locals (e.g. "8685988991").
function normalizePhone(raw, defaultCc = '+91') {
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

// A stay counts as "currently active" when the hotel has flagged it ACTIVE and
// the guest has not yet checked out. Reception sets status=ACTIVE on real
// check-in and sets checkOutActual on checkout, so these two are the
// authoritative signals — and they exclude old/completed stays. We do NOT gate
// on checkInActual/expectedCheckOut: those are planned/standard times (e.g. the
// hotel's 5:30am check-in time) and can sit in the future or past relative to
// when the guest actually uses the app, wrongly locking them out.
function isActiveStay(s) {
  return !!s && s.status === 'ACTIVE' && !s.checkOutActual
}

// Collect distinct guest phone numbers (E.164) from a list of stay docs,
// reading ONLY each doc's `guests[]` array (with top-level guestPhone/guestName
// as a fallback). No users-collection lookup.
function collectGuestPhones(stayList) {
  const byPhone = new Map() // E.164 -> { phone, name }
  for (const s of stayList) {
    const candidates = []
    if (Array.isArray(s.guests)) {
      for (const g of s.guests) candidates.push({ phone: g?.phone, name: g?.name })
    }
    if (s.guestPhone) candidates.push({ phone: s.guestPhone, name: s.guestName })

    for (const c of candidates) {
      const e164 = normalizePhone(c.phone)
      if (!e164 || byPhone.has(e164)) continue
      byPhone.set(e164, { phone: e164, name: c.name || '' })
    }
  }
  return [...byPhone.values()]
}

// The room's ACTIVE stays PLUS every ACTIVE stay sharing their group booking
// (groupStayId), so a phone-bearing guest registered in a sibling room of the
// same group booking can authenticate for this room too (e.g. a room occupied
// only by guests without phones). Single-field queries — no composite index.
async function activeStaysForRoomGroup(roomInstanceId) {
  const roomSnap = await db.collection('stays').where('roomInstanceId', '==', roomInstanceId).get()
  const roomStays = roomSnap.docs.map((d) => d.data()).filter(isActiveStay)
  if (roomStays.length === 0) return []

  const all = [...roomStays]
  const groupIds = [...new Set(roomStays.map((s) => s.groupStayId).filter(Boolean))]
  for (const gid of groupIds) {
    const gSnap = await db.collection('stays').where('groupStayId', '==', gid).get()
    gSnap.docs.map((d) => d.data()).filter(isActiveStay).forEach((s) => all.push(s))
  }
  return all
}

async function guestPhonesForRoom(roomInstanceId) {
  return collectGuestPhones(await activeStaysForRoomGroup(roomInstanceId))
}

// --- callables ---------------------------------------------------------------

// Returns the masked numbers a guest can choose from, each paired with an
// encrypted token. No real phone number leaves the backend here.
exports.getRoomCheckInOptions = onCall({ secrets: [CHECKIN_SECRET] }, async (req) => {
  const roomInstanceId = String(req.data?.roomInstanceId || '').trim()
  if (!roomInstanceId) {
    throw new HttpsError('invalid-argument', 'roomInstanceId is required')
  }

  const guests = await guestPhonesForRoom(roomInstanceId)
  const secret = CHECKIN_SECRET.value()
  const exp = Date.now() + TOKEN_TTL_MS

  const options = guests
    .sort((a, b) => a.phone.localeCompare(b.phone))
    .map((g) => ({
      token: encryptToken({ phoneNumber: g.phone, roomInstanceId, exp }, secret),
      maskedPhone: maskPhone(g.phone),
      name: g.name,
    }))

  return { options }
})

// Exchanges a token for the real phone number, but only after re-verifying the
// number still belongs to an ACTIVE stay in that room. Used at the moment the
// guest taps "send code", immediately before Firebase phone auth.
exports.resolveCheckInPhone = onCall({ secrets: [CHECKIN_SECRET] }, async (req) => {
  const token = req.data?.token
  if (!token) {
    throw new HttpsError('invalid-argument', 'token is required')
  }

  let payload
  try {
    payload = decryptToken(token, CHECKIN_SECRET.value())
  } catch {
    throw new HttpsError('permission-denied', 'Invalid token')
  }

  if (!payload.exp || Date.now() > payload.exp) {
    throw new HttpsError('deadline-exceeded', 'This selection expired. Please try again.')
  }

  const guests = await guestPhonesForRoom(payload.roomInstanceId)
  const stillActive = guests.some((g) => g.phone === payload.phoneNumber)
  if (!stillActive) {
    throw new HttpsError('permission-denied', 'This stay is no longer active.')
  }

  return { phoneNumber: payload.phoneNumber }
})
