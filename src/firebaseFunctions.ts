import { getFunctions } from 'firebase/functions'
import { app } from './firebase'

// Callable Cloud Functions. The check-in callables are deployed to asia-south1
// (alongside the rest of the project's functions); override with
// VITE_FUNCTIONS_REGION if needed.
export const functions = getFunctions(
  app,
  import.meta.env.VITE_FUNCTIONS_REGION || 'asia-south1',
)
