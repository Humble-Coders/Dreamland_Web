import { useEffect, useRef, useState } from 'react'
import { httpsCallable } from 'firebase/functions'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth, functions } from '../firebase.js'
import Layout from './Layout.jsx'
import Card from './Card.jsx'
import Spinner from './Spinner.jsx'
import InfoScreen from './InfoScreen.jsx'
import PhoneSelect from './PhoneSelect.jsx'
import OtpVerify from './OtpVerify.jsx'

// Map raw Firebase auth errors to friendly, guest-appropriate messages.
function friendlyAuthError(err) {
  switch (err?.code) {
    case 'auth/invalid-verification-code':
      return 'That code doesn’t look right. Please check and try again.'
    case 'auth/code-expired':
      return 'That code has expired. Please request a new one.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a little while before trying again.'
    case 'auth/invalid-phone-number':
      return 'This number could not be verified. Please contact the front desk.'
    default:
      return 'Something went wrong. Please try again or contact the front desk.'
  }
}

export default function RoomEntry({ roomInstanceId }) {
  const [stage, setStage] = useState('loading') // loading | select | otp | empty | error
  const [guests, setGuests] = useState([])
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')

  const recaptchaRef = useRef(null)
  const confirmationRef = useRef(null)

  // 1) Ask the backend for the registered numbers on this room's ACTIVE stays.
  //    The Cloud Function returns ONLY masked numbers plus an encrypted,
  //    short-lived token per option — the real number never reaches the client
  //    here, and Firestore is never read directly from the browser.
  useEffect(() => {
    let cancelled = false

    async function loadGuests() {
      try {
        const getOptions = httpsCallable(functions, 'getRoomCheckInOptions')
        const res = await getOptions({ roomInstanceId })
        const options = res.data?.options ?? []

        if (cancelled) return
        if (options.length === 0) {
          setStage('empty')
        } else {
          setGuests(options) // each: { token, maskedPhone, name }
          setStage('select')
        }
      } catch (err) {
        console.error('Failed to load room guests', err)
        if (!cancelled) setStage('error')
      }
    }

    loadGuests()
    return () => {
      cancelled = true
    }
  }, [roomInstanceId])

  function getRecaptcha() {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      })
    }
    return recaptchaRef.current
  }

  async function resetRecaptcha() {
    try {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear()
        recaptchaRef.current = null
      }
    } catch {
      /* no-op */
    }
  }

  // 2) Guest picks a number -> resolve the real number from its token (only
  //    now, server-side, after re-checking the stay is still ACTIVE), then send
  //    the OTP via Firebase phone auth. The full number lives only in this
  //    local variable long enough to trigger the SMS.
  async function handleSelect(guest) {
    setError('')
    setSending(true)
    setSelectedGuest(guest)
    try {
      const resolvePhone = httpsCallable(functions, 'resolveCheckInPhone')
      const res = await resolvePhone({ token: guest.token })
      const phoneNumber = res.data?.phoneNumber
      if (!phoneNumber) throw new Error('No phone number returned')

      const verifier = getRecaptcha()
      confirmationRef.current = await signInWithPhoneNumber(auth, phoneNumber, verifier)
      setStage('otp')
    } catch (err) {
      console.error('Failed to send OTP', err)
      setError(friendlyAuthError(err))
      await resetRecaptcha()
    } finally {
      setSending(false)
    }
  }

  // 3) Guest enters the code -> confirm. Success flips global auth state,
  //    and App.jsx swaps over to the access guard automatically.
  async function handleConfirm(code) {
    if (!confirmationRef.current) return
    setError('')
    setVerifying(true)
    try {
      await confirmationRef.current.confirm(code)
      // No further action — onAuthStateChanged in App takes over from here.
    } catch (err) {
      console.error('Failed to verify OTP', err)
      setError(friendlyAuthError(err))
      setVerifying(false)
    }
  }

  async function handleBack() {
    setError('')
    confirmationRef.current = null
    await resetRecaptcha()
    setStage('select')
  }

  let content
  if (stage === 'loading') {
    content = (
      <Card className="flex flex-col items-center py-12 text-center">
        <Spinner className="h-7 w-7 border-gold-400/30 border-t-gold-400" />
        <p className="mt-5 font-display text-xl text-cream">Preparing your check-in…</p>
        <p className="mt-1 text-sm text-cream/60">One moment, please.</p>
      </Card>
    )
  } else if (stage === 'empty') {
    content = (
      <InfoScreen
        icon="🛎️"
        title="No active stay found"
        message="We couldn’t find an active reservation for this room. If you’ve just checked in, please give it a moment, or contact the front desk for help."
      />
    )
  } else if (stage === 'error') {
    content = (
      <InfoScreen
        tone="error"
        icon="⚠️"
        title="We hit a snag"
        message="We couldn’t load your check-in details right now. Please try again, or reach out to the front desk."
      />
    )
  } else if (stage === 'otp') {
    content = (
      <OtpVerify
        maskedPhone={selectedGuest?.maskedPhone}
        onConfirm={handleConfirm}
        onBack={handleBack}
        verifying={verifying}
        error={error}
      />
    )
  } else {
    content = (
      <PhoneSelect guests={guests} onSelect={handleSelect} sending={sending} error={error} />
    )
  }

  return <Layout>{content}</Layout>
}
