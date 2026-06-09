# Firestore Schema

All collections used by the guest web app and its Cloud Functions.  
Fields marked **bold** are required for the app to function correctly.

---

## `stays/{stayId}`

Represents a single room booking. Created and managed by the hotel management system.

| Field | Type | Description |
|---|---|---|
| **`roomInstanceId`** | `string` | Matches the value encoded in the room's QR code URL |
| **`status`** | `string` | `"ACTIVE"` while the guest may use the app. Any other value revokes access |
| **`hotelId`** | `string` | Links to the hotel — used to query the correct menu and services |
| `hotelName` | `string` | Displayed in the app header (falls back to `"Hotel Dreamland"`) |
| `roomNumber` | `string` | Displayed in the app header (e.g. `"101"`) |
| `userId` | `string` | Firebase Auth UID of the primary guest — used to scope the orders live query |
| `guestName` | `string` | Name of the primary guest (fallback if not found in `guests[]`) |
| `guestPhone` | `string` | Phone of the primary guest — bare 10-digit local or E.164 |
| `guests` | `GuestEntry[]` | All registered guests for the room (see sub-type below) |
| `groupStayId` | `string` | If this room belongs to a group booking, all rooms share this ID. Used to allow a guest registered in a sibling room to authenticate |
| `checkOutActual` | `timestamp` | Set on checkout. If present, the stay is treated as inactive regardless of `status` |

### `GuestEntry` (element of `guests[]`)

| Field | Type | Description |
|---|---|---|
| `name` | `string` | Guest's display name |
| `phone` | `string` | Guest's phone — bare 10-digit local or E.164 |

---

## `orders/{orderId}`

Written by the guest app when an order is placed. Read back in real time on the Orders tab.

| Field | Type | Description |
|---|---|---|
| **`userId`** | `string` | Firebase Auth UID — used to scope the live orders query to this guest |
| **`stayId`** | `string` | ID of the `stays` doc this order belongs to |
| **`hotelId`** | `string` | Hotel identifier |
| **`type`** | `string` | `"ROOM_SERVICE"` for food orders · `"SERVICE"` for hotel service requests |
| **`status`** | `string` | `"NEW"` → `"ASSIGNED"` → `"COMPLETED"` — updated by hotel staff |
| **`items`** | `OrderItem[]` | Line items (see sub-type below) |
| **`subtotalAmount`** | `number` | Sum of all item subtotals (pre-tax), in INR |
| **`totalTaxAmount`** | `number` | Sum of all item tax amounts, in INR |
| **`totalAmount`** | `number` | Grand total (subtotal + tax), in INR |
| `guestName` | `string` | Name of the guest who placed the order |
| `roomNumber` | `string` | Room number at time of order |
| `roomInstanceId` | `string` | Room instance at time of order |
| `groupStayId` | `string` | Group booking ID at time of order |
| `assignedTo` | `string` | Staff member assigned to fulfil the order (set by hotel staff) |
| `createdAt` | `timestamp` | Server timestamp set on write |

### `OrderItem` (element of `items[]`)

| Field | Type | Description |
|---|---|---|
| `itemId` | `string` | ID of the source `foodItems` or `services` doc |
| `name` | `string` | Item name at time of order (snapshot — not a live reference) |
| `quantity` | `number` | Units ordered |
| `basePrice` | `number` | Pre-tax price per unit, in INR |
| `taxPercentage` | `number` | Tax rate applied (e.g. `5` for 5%) |
| `taxedPrice` | `number` | Tax-inclusive price per unit (`basePrice × (1 + tax/100)`) |
| `taxAmount` | `number` | Total tax for this line (`total − subtotal`) |
| `subtotal` | `number` | Pre-tax line total (`basePrice × quantity`) |
| `total` | `number` | Tax-inclusive line total (`taxedPrice × quantity`) |

---

## `foodItems/{itemId}`

The hotel's food menu. Queried once on app load, filtered by `hotelId`.

| Field | Type | Description |
|---|---|---|
| **`hotelId`** | `string` | Used to filter items to the correct hotel |
| **`name`** | `string` | Item name shown on the menu card |
| **`price`** | `number` | Pre-tax price per unit, in INR |
| `taxPercentage` | `number` | Tax rate (e.g. `5`). Defaults to `0` if absent |
| `category` | `string` | Comma-separated category tags used for filter chips (e.g. `"Breakfast, Veg"`) |
| `description` | `string` | Optional description shown on the item card |
| `imageUrl` | `string` | Optional image URL for the item card |
| `isAvailable` | `boolean` | Items with `isAvailable === false` are hidden from the menu |

---

## `services/{serviceId}`

Hotel add-on services (housekeeping, amenities, etc.). Queried once on app load, filtered by `hotelId`.

| Field | Type | Description |
|---|---|---|
| **`hotelId`** | `string` | Used to filter services to the correct hotel |
| **`name`** | `string` | Service name shown on the card |
| **`price`** | `number` | Pre-tax price per unit, in INR |
| `taxPercentage` | `number` | Tax rate. Defaults to `0` if absent |
| `description` | `string` | Optional description |
| `imageUrl` | `string` | Optional image URL |
| `isActive` | `boolean` | Services with `isActive === false` are hidden from the list |

---

## Access patterns summary

| Collection | Read by | Write by | Query |
|---|---|---|---|
| `stays` | `AccessGuard` (client), Cloud Functions (admin) | Hotel management system | `where('roomInstanceId', '==', ...)` · `where('groupStayId', '==', ...)` |
| `orders` | `StayApp` (live listener) | `StayApp` (on place order) | `where('userId', '==', ...)` |
| `foodItems` | `StayApp` (one-time) | Hotel management system | `where('hotelId', '==', ...)` |
| `services` | `StayApp` (one-time) | Hotel management system | `where('hotelId', '==', ...)` |
