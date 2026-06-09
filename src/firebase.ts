import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

// Values are read from environment variables (see .env.example).
// Create a `.env.local` file with your Firebase project's web config.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

// Keep the guest logged in across reloads / re-scans of the QR code.
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error('Failed to set auth persistence', err)
})

export const db = getFirestore(app)

// Callable Cloud Functions. The check-in callables are deployed to asia-south1
// (alongside the rest of the project's functions); override with
// VITE_FUNCTIONS_REGION if needed.
export const functions = getFunctions(
  app,
  import.meta.env.VITE_FUNCTIONS_REGION || 'asia-south1',
)
