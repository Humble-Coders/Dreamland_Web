import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { app } from './firebase'

export const auth = getAuth(app)

// Keep the guest logged in across reloads / re-scans of the QR code.
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error('Failed to set auth persistence', err)
})
