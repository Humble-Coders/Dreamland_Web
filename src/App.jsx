import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase.js'
import { getRoomInstanceId } from './utils.js'
import Layout from './components/Layout.jsx'
import Card from './components/Card.jsx'
import Spinner from './components/Spinner.jsx'
import InfoScreen from './components/InfoScreen.jsx'
import RoomEntry from './components/RoomEntry.jsx'
import AccessGuard from './components/AccessGuard.jsx'

const configMissing = !import.meta.env.VITE_FIREBASE_API_KEY

export default function App() {
  const [user, setUser] = useState(undefined) // undefined = still resolving auth
  const [roomInstanceId] = useState(getRoomInstanceId)

  useEffect(() => {
    if (configMissing) return
    return onAuthStateChanged(auth, (u) => setUser(u))
  }, [])

  let screen

  if (configMissing) {
    screen = (
      <Layout>
        <InfoScreen
          tone="error"
          icon="⚙️"
          title="Setup required"
          message="Firebase isn’t configured yet. Add your project’s web config to a .env.local file (see .env.example) and restart the dev server."
        />
      </Layout>
    )
  } else if (user === undefined) {
    // Resolving persisted session.
    screen = (
      <Layout>
        <Card className="flex flex-col items-center py-12 text-center">
          <Spinner className="h-7 w-7 border-gold-400/30 border-t-gold-400" />
          <p className="mt-5 font-display text-xl text-cream">Welcome to Hotel Dreamland</p>
        </Card>
      </Layout>
    )
  } else if (user) {
    // Signed in — guard access against the live ACTIVE-stay status.
    screen = <AccessGuard user={user} roomInstanceId={roomInstanceId} />
  } else if (!roomInstanceId) {
    // Not signed in and no room from a QR scan.
    screen = (
      <Layout>
        <InfoScreen
          icon="🔑"
          title="Scan your room code"
          message="To begin, please scan the QR code provided in your room. It will bring you right back here, ready to check in."
        />
      </Layout>
    )
  } else {
    // Not signed in, room known — run the check-in flow.
    screen = <RoomEntry roomInstanceId={roomInstanceId} />
  }

  return (
    <>
      {screen}
      {/* Invisible reCAPTCHA mount point for Firebase phone auth. */}
      <div id="recaptcha-container" />
    </>
  )
}
