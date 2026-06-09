# Recent Changes — Dev Reference

A summary of structural changes made to this project. Read this if you're joining the codebase or pulling recent updates.

---

## 1. TypeScript Migration (JSX → TSX)

The entire frontend has been migrated from plain JavaScript/JSX to TypeScript.

**What changed:**
- All `src/**/*.jsx` files renamed to `.tsx`
- All `src/**/*.js` files renamed to `.ts`
- `tsconfig.json` added at the project root (strict mode, Vite client types)
- New `src/types/firestore.ts` — single source of truth for all Firestore data shapes

**New dependencies:**
```bash
npm install --save-dev typescript @types/react @types/react-dom @types/react-router-dom
```

**To type-check without running the dev server:**
```bash
npx tsc --noEmit
```

### Firestore Types (`src/types/firestore.ts`)

All interfaces are derived from the live Firestore schema. Key types:

| Type | Used in | Notes |
|------|---------|-------|
| `Stay` | `AccessGuard`, `StayApp` | Full stays document shape including `guests[]` array |
| `GuestEntry` | `Stay.guests[]` | Per-guest map inside a stay doc |
| `Order` | `StayApp` | Written on place-order; read back via live listener |
| `OrderItem` | `Order.items[]` | Line item with full tax/price breakdown |
| `FoodItem` | `StayApp`, `ItemCard` | From `foodItems` collection |
| `Service` | `StayApp`, `ItemCard` | From `services` collection |
| `CartLine` | `StayApp`, `CartSheet` | Client-side cart entry (not persisted) |
| `CartSource` | Cart functions | `'food' \| 'service'` |
| `OrderTotals` | `CartSheet`, `StayApp` | Subtotal / tax / total aggregate |
| `CheckInOption` | `RoomEntry`, `PhoneSelect` | Masked phone + token from Cloud Function |

> **Note on `Stay` fields:** The schema document shows `guestDetails.name / .phone` but the actual Firestore documents use top-level `guestName` / `guestPhone`. The TypeScript types reflect the actual DB structure.

---

## 2. Routing — Landing Page + `/app` Split

**New dependency:**
```bash
npm install react-router-dom
```

### Route structure

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `src/pages/Landing.tsx` | Public landing page — no auth required |
| `/app` | `src/App.tsx` | Full guest app — check-in flow + stay dashboard |

### Landing page (`src/pages/Landing.tsx`)

Visible to anyone at the root URL. Contains:
- Hotel logo + nav with front desk phone link
- Hero section with tagline and QR CTA
- Features grid (Room Service, Hotel Services, Order Tracking, Security)
- Contact section with call and email links

**To update the front desk phone number or email**, edit the `href` values in `Landing.tsx` directly — they are hardcoded placeholder values right now:
```tsx
href="tel:+911234567890"          // replace with real number
href="mailto:reception@hoteldreamland.com"  // replace with real email
```

### QR code URLs

Update all printed QR codes to point to `/app`:
```
https://yourdomain.com/app?roomInstanceId=ROOM_123
```

Old QR codes pointing to `/?roomInstanceId=...` are still handled — `utils.ts` auto-redirects them to `/app` on load.

---

## 3. File Structure After Migration

```
src/
├── types/
│   └── firestore.ts        ← all Firestore interfaces (NEW)
├── pages/
│   └── Landing.tsx         ← public landing page (NEW)
├── components/
│   ├── AccessGuard.tsx
│   ├── Card.tsx
│   ├── CartSheet.tsx
│   ├── InfoScreen.tsx
│   ├── ItemCard.tsx
│   ├── Layout.tsx
│   ├── Logo.tsx
│   ├── OtpVerify.tsx
│   ├── PhoneSelect.tsx
│   ├── RoomEntry.tsx
│   ├── Spinner.tsx
│   ├── StayApp.tsx
│   └── Success.tsx
├── App.tsx                 ← guest app root (was App.jsx)
├── firebase.ts             ← (was firebase.js)
├── main.tsx                ← router setup (was main.jsx)
├── orders.ts               ← order math utilities (was orders.js)
└── utils.ts                ← phone/stay helpers (was utils.js)
```

---

## 4. Reference Docs Added

| File | Purpose |
|------|---------|
| `SCREENS.md` | Every screen/state in the app with conditions and file references |
| `FIRESTORE_SCHEMA.md` | All Firestore collections, fields, types, and access patterns |
| `CHANGES.md` | This file |

---

## 5. Dev Setup Checklist (for new devs)

```bash
# 1. Install dependencies
npm install
cd functions && npm install && cd ..

# 2. Set up Firebase config
cp .env.example .env.local
# Fill in your Firebase project credentials in .env.local

# 3. Run type check
npx tsc --noEmit

# 4. Start dev server
npm run dev
# Landing page: http://localhost:5173/
# Guest app:    http://localhost:5173/app?roomInstanceId=YOUR_ROOM_ID
```

> The check-in flow calls Cloud Functions (`getRoomCheckInOptions`, `resolveCheckInPhone`).  
> These must be deployed or running in the Firebase emulator for the phone selection screen to load.
