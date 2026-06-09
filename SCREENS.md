# Dreamland Web — Screens & App States

This app has **no URL router**. All navigation is state-driven inside a single
`/` page. The "route" is determined by auth state, the presence of a
`roomInstanceId` query param, and live Firestore data.

---

## Routes

| Route | Component | Purpose |
|---|---|---|
| `/` | `Landing.jsx` | Public landing page — hotel branding, features, QR CTA, contact |
| `/app` | `App.jsx` | Full guest app — check-in flow and stay dashboard |

**QR codes** should encode `/app?roomInstanceId=ROOM_123`.  
If an old QR code points to `/?roomInstanceId=ROOM_123`, the app auto-redirects to `/app`.

The `roomInstanceId` value is persisted to `localStorage` so a returning guest who reopens `/app`
without query params is still associated with their room.

Supported query param aliases on `/app`:

| Param | Example |
|---|---|
| `?roomInstanceId=` | `/app?roomInstanceId=ROOM_123` |
| `?room=` | `/app?room=ROOM_123` |
| `?r=` | `/app?r=ROOM_123` |

---

## Screen tree

```
/                            →  Landing page
/app
├── [config missing]         →  Setup Required screen
├── [auth resolving]         →  Loading screen
├── [signed out, no room]    →  Scan Your Room Code screen
├── [signed out, room known] →  Check-in Flow  (RoomEntry)
│   ├── loading              →  "Preparing your check-in…"
│   ├── select               →  Phone Select screen
│   ├── otp                  →  OTP Verify screen
│   ├── empty                →  No Active Stay screen
│   └── error                →  Check-in Error screen
└── [signed in]              →  Access Guard  (AccessGuard)
    ├── checking             →  "Confirming your stay…"
    ├── revoked              →  Access Unavailable screen
    ├── error                →  Guard Error screen
    └── granted              →  Stay App  (StayApp)
        ├── food tab         →  Menu browser
        ├── services tab     →  Hotel services
        └── orders tab       →  Order history
```

---

## Screens

### 0. Landing Page
**Route:** `/`  
**File:** `src/pages/Landing.jsx`  
**Condition:** Always visible at the root URL — no auth required.  
**What it shows:**
- **Nav bar** — hotel logo, name, and a "Front desk" link (phone call).
- **Hero section** — hotel name, tagline badge, and a large heading with a gold accent.
- **QR CTA** — icon + copy instructing guests to scan their room QR code. Includes an "Already scanned? Open the app →" button that navigates to `/app`.
- **Features grid** — four cards: Room Service, Hotel Services, Live Order Tracking, Secure & Private.
- **Contact section** — "Call front desk" (tel link) and "Email us" (mailto link).

---

### 1. Setup Required
**File:** `src/App.jsx`  
**Condition:** `VITE_FIREBASE_API_KEY` env var is missing.  
**What it shows:**
- Error card with a message instructing the developer to create `.env.local`.
- Never visible to real guests; development-only guard.

---

### 2. Loading (auth resolving)
**File:** `src/App.jsx`  
**Condition:** Firebase auth state is still being resolved on page load (`user === undefined`).  
**What it shows:**
- Spinner + "Welcome to Hotel Dreamland" text.
- Disappears automatically once Firebase confirms the session.

---

### 3. Scan Your Room Code
**File:** `src/App.jsx`  
**Condition:** Guest is not signed in **and** no `roomInstanceId` is present (no QR scan, no localStorage value).  
**What it shows:**
- Info card with a key icon.
- Message asking the guest to scan the QR code in their room.
- No actions — guest must scan to proceed.

---

### 4. Check-in Flow (`RoomEntry`)
**File:** `src/components/RoomEntry.jsx`  
**Condition:** Guest is not signed in, but a `roomInstanceId` is known.  
Internally cycles through five sub-states:

#### 4a. Loading
- Spinner + "Preparing your check-in…"
- Calls `getRoomCheckInOptions` Cloud Function to fetch masked phone numbers for the room.

#### 4b. Phone Select (`PhoneSelect`)
**File:** `src/components/PhoneSelect.jsx`  
- Lists the registered guests for the room with masked phone numbers (e.g. `+91 ••••••7890`).
- Guest taps their name/number to trigger OTP.
- Calls `resolveCheckInPhone` Cloud Function, then `signInWithPhoneNumber` (Firebase phone auth).

#### 4c. OTP Verify (`OtpVerify`)
**File:** `src/components/OtpVerify.jsx`  
- Input for the 6-digit SMS code.
- Shows the masked phone the code was sent to.
- Back button to return to phone selection.
- On success: auth state changes globally → app transitions to Access Guard automatically.

#### 4d. No Active Stay
- Info card with a bell icon.
- Shown when `getRoomCheckInOptions` returns zero options (no ACTIVE stay on this room).
- Instructs the guest to contact the front desk.

#### 4e. Check-in Error
- Error card with a warning icon.
- Shown if the Cloud Function call fails (network issue, function error).

---

### 5. Access Guard (`AccessGuard`)
**File:** `src/components/AccessGuard.jsx`  
**Condition:** Guest is signed in. Opens a real-time Firestore listener to verify the stay is still ACTIVE.  
Internally cycles through four sub-states:

#### 5a. Checking
- Spinner + "Confirming your stay…"
- Waiting for the Firestore listener to return stay data.

#### 5b. Access Unavailable (revoked)
- Error card with a lock icon.
- Shown when the guest's stay is no longer ACTIVE (checked out, cancelled, etc.).
- Includes a **Sign out** button.

#### 5c. Guard Error
- Error card with a warning icon.
- Shown if the Firestore listener itself errors (permissions issue, network).

#### 5d. Access Granted → Stay App
- Passes `stay`, `user`, and resolved `guestName` down to `StayApp`.

---

### 6. Stay App (`StayApp`)
**File:** `src/components/StayApp.jsx`  
**Condition:** Signed in + active stay confirmed.  
**Header (always visible):**
- Hotel logo, room number, hotel name, **Sign out** button.
- Three tab pills: **Food**, **Services**, **Orders**.

#### 6a. Food Tab (default)
- Horizontal scrollable **category filter chips** (All, Breakfast, Drinks, etc. — built dynamically from `foodItems` collection).
- Grid of `ItemCard` components for each available food item.
- Each card has `+` / `−` quantity controls.
- Loads from Firestore `foodItems` collection filtered by `hotelId`.

#### 6b. Services Tab
- Heading "Hotel services".
- List of `ItemCard` components for each active hotel service.
- Same quantity controls as food.
- Loads from Firestore `services` collection filtered by `hotelId`.

#### 6c. Orders Tab
- Live list of the guest's own orders (real-time Firestore listener on `orders` where `userId` matches).
- Each order card shows: type (Room service / Service), timestamp, itemised lines with quantities and per-item price, subtotal / tax / **total**.
- Status badge: **Received** (NEW) · **In progress** (ASSIGNED) · **Delivered** (COMPLETED).
- Empty state with a "Browse the menu" shortcut back to the Food tab.

#### Cart Sheet (`CartSheet`)
**File:** `src/components/CartSheet.jsx`  
- Slide-up sheet triggered by the sticky **"View cart"** bar at the bottom (visible when cart has items).
- Shows all cart lines with quantity controls, subtotal, tax, total.
- **Place Order** button — writes one `orders` doc per type (ROOM_SERVICE and/or SERVICE) to Firestore, then clears the cart and switches to the Orders tab.

---

## Firestore collections read by this app

| Collection | Read by | Purpose |
|---|---|---|
| `stays` | `AccessGuard` | Verify ACTIVE stay + group booking |
| `foodItems` | `StayApp` | Hotel menu |
| `services` | `StayApp` | Hotel add-on services |
| `orders` | `StayApp` | Guest's own order history (live) |

`orders` is also **written** by `StayApp` when the guest places an order.  
Phone number lookups go through **Cloud Functions** (never read directly from Firestore in the browser).
