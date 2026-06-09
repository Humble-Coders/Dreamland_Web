# Hotel Dreamland — Guest Web App

A QR-driven, hospitality-grade check-in web app. Each room has a unique QR code
that opens this site with a `roomInstanceId`. The guest verifies their identity
with the phone number registered at reception (Firebase phone auth), and access
stays live-gated to an **ACTIVE** stay.

## Tech

- React 18 + Vite
- Tailwind CSS v4
- Firebase (Auth + Firestore + Cloud Functions)

## Getting started

```bash
npm install                  # web app deps
cd functions && npm install && cd ..   # Cloud Functions deps
cp .env.example .env.local   # then paste your Firebase web config
npm run dev
```

Open the app with a room id, e.g. `http://localhost:5173/?roomInstanceId=ROOM_123`
(the QR code in each room encodes this URL). `?room=` and `?r=` also work.

> The phone-number lookup runs on Cloud Functions, so the check-in screen needs
> the functions deployed (or running in the emulator) to load numbers.

## Firebase setup

1. Put your real project id in **`.firebaserc`** (replace `YOUR_FIREBASE_PROJECT_ID`).
2. **Authentication → Sign-in method →** enable **Phone**.
3. Add your dev/prod domains to **Authentication → Settings → Authorized domains**
   (`localhost` is allowed by default).
4. **Firestore** with the data model below, and deploy the rules:
   `firebase deploy --only firestore:rules`
5. **Cloud Functions** — set the token-encryption secret, then deploy:
   ```bash
   # any long random string; used to encrypt the per-option phone tokens
   firebase functions:secrets:set CHECKIN_SECRET
   firebase deploy --only functions
   ```
   (Requires the Blaze plan, like all Cloud Functions.)

## Firestore data model

```
stays/{stayId}
  roomInstanceId: string   // matches the value in the room's QR link
  uid: string              // the guest's Firebase Auth uid
  status: string           // "ACTIVE" while the guest may access the app

users/{uid}
  phoneNumber: string      // E.164, e.g. "+919876543210" (used for phone auth)
  name: string             // optional, shown on the selection screen
```

## How the flow works

1. The QR link carries `roomInstanceId`. `RoomEntry.jsx` calls the
   **`getRoomCheckInOptions`** Cloud Function, which (with the Admin SDK) finds
   the room's `ACTIVE` stays, reads each guest's `users/{uid}.phoneNumber`, and
   returns **only masked numbers** — each paired with an encrypted token.
2. The guest picks a number. On tap, **`resolveCheckInPhone`** decrypts that
   token, re-confirms the stay is still `ACTIVE`, and returns the real number —
   used immediately for Firebase phone auth (OTP) and never displayed/stored.
3. The guest must have the phone to receive the code.
4. After login the session **persists** (`browserLocalPersistence`).
5. `AccessGuard.jsx` opens a **targeted** Firestore listener — `where('uid','==', uid)`,
   reading only that guest's own stay docs — and revokes access the instant none
   of them are `ACTIVE`.

## Security model

- The browser **never reads `stays`/`users` unauthenticated**, and never receives
  full numbers in the selection list — both lookups go through Cloud Functions
  (Admin SDK), so `firestore.rules` denies all unauthenticated reads.
- Phone tokens are **AES-256-GCM encrypted** with the `CHECKIN_SECRET` and expire
  after 10 minutes, so a token can't be read client-side or replayed later.
- After login, the guest can read only their own `stays`/`users` docs (see
  `firestore.rules`), which is exactly what the access guard needs.

### Recommended hardening (App Check)

A room id is effectively public (it's printed in the room), so anyone with it can
ask the function for that room's masked numbers and trigger an OTP. To stop
scripted abuse, enable **App Check** (reCAPTCHA v3 / Enterprise) and turn on
`enforceAppCheck` in both callables. Not enabled by default because it needs
matching client-side App Check setup.
```
