import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase.js'
import { isActiveStay, normalizePhone } from '../utils.js'
import Layout from './Layout.jsx'
import Card from './Card.jsx'
import Spinner from './Spinner.jsx'
import InfoScreen from './InfoScreen.jsx'
import StayApp from './StayApp.jsx'

// Does this stay's guest list (or top-level guestPhone) include the given
// E.164 phone? Phones in the data are bare locals, so normalize both sides.
function stayHasPhone(stay, e164) {
  const match = (p) => normalizePhone(p) === e164
  if (Array.isArray(stay.guests) && stay.guests.some((g) => match(g?.phone))) return true
  return match(stay.guestPhone)
}

// The name registered against the given phone within a stay (so an order shows
// who actually placed it, even when they're in a sibling room of the group).
function matchedGuestName(stay, e164) {
  const g = (stay.guests || []).find((x) => normalizePhone(x?.phone) === e164)
  if (g?.name) return g.name
  if (normalizePhone(stay.guestPhone) === e164) return stay.guestName || ''
  return ''
}

// Real-time access guard for group bookings:
//  - The SCANNED room must have an active stay (drives orders + room validity).
//  - The signed-in phone must belong to an active stay anywhere in that room's
//    group booking (groupStayId) — so a phone-bearing guest in a sibling room
//    can authenticate for a room occupied only by guests without phones.
// Fully client-side (catch-all rule allows authenticated stay reads).
export default function AccessGuard({ user, roomInstanceId }) {
  const [roomStay, setRoomStay] = useState(undefined) // undefined=loading | null=none | doc
  const [authorized, setAuthorized] = useState(undefined) // undefined=checking | bool
  const [requesterName, setRequesterName] = useState('')
  const [errored, setErrored] = useState(false)

  const myPhone = normalizePhone(user.phoneNumber)

  // A) The scanned room's active stay.
  useEffect(() => {
    if (!roomInstanceId) {
      setErrored(true)
      return
    }
    const q = query(collection(db, 'stays'), where('roomInstanceId', '==', roomInstanceId))
    return onSnapshot(
      q,
      (snap) => {
        const doc = snap.docs.find((d) => isActiveStay(d.data()))
        setRoomStay(doc ? { id: doc.id, ...doc.data() } : null)
      },
      (err) => {
        console.error('Room stay listener error', err)
        setErrored(true)
      },
    )
  }, [roomInstanceId])

  // B) Is my phone authorized — in this room, or anywhere in its group booking?
  useEffect(() => {
    if (roomStay === undefined) return // still loading the room
    if (roomStay === null) {
      setAuthorized(false)
      return
    }
    if (stayHasPhone(roomStay, myPhone)) {
      setAuthorized(true) // registered in this very room
      setRequesterName(matchedGuestName(roomStay, myPhone))
      return
    }
    const groupId = roomStay.groupStayId
    if (!groupId) {
      setAuthorized(false)
      return
    }
    // Phone may belong to a sibling room of the same group booking.
    setAuthorized(undefined)
    const q = query(collection(db, 'stays'), where('groupStayId', '==', groupId))
    return onSnapshot(
      q,
      (snap) => {
        let name = ''
        const ok = snap.docs.some((d) => {
          const data = d.data()
          if (isActiveStay(data) && stayHasPhone(data, myPhone)) {
            name = matchedGuestName(data, myPhone)
            return true
          }
          return false
        })
        setAuthorized(ok)
        if (ok) setRequesterName(name)
      },
      (err) => {
        console.error('Group stay listener error', err)
        setErrored(true)
      },
    )
  }, [roomStay, myPhone])

  let access
  if (errored) access = 'error'
  else if (roomStay === undefined || authorized === undefined) access = 'checking'
  else if (roomStay && authorized) access = 'granted'
  else access = 'revoked'

  if (access === 'checking') {
    return (
      <Layout>
        <Card className="flex flex-col items-center py-12 text-center">
          <Spinner className="h-7 w-7 border-gold-400/30 border-t-gold-400" />
          <p className="mt-5 font-display text-xl text-cream">Confirming your stay…</p>
        </Card>
      </Layout>
    )
  }

  if (access === 'revoked') {
    return (
      <Layout>
        <InfoScreen
          tone="error"
          icon="🔒"
          title="Access unavailable"
          message="Your stay is no longer active, so access has been paused. If you believe this is a mistake, please contact the front desk."
        >
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="rounded-2xl border border-gold-500/30 bg-gold-500/10 px-6 py-3 text-sm font-medium text-gold-300 transition-colors hover:bg-gold-500/20"
          >
            Sign out
          </button>
        </InfoScreen>
      </Layout>
    )
  }

  if (access === 'error') {
    return (
      <Layout>
        <InfoScreen
          tone="error"
          icon="⚠️"
          title="We hit a snag"
          message="We couldn’t verify your stay just now. Please check your connection and try again."
        />
      </Layout>
    )
  }

  return <StayApp user={user} stay={roomStay} guestName={requesterName} />
}
