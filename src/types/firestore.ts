import type { Timestamp } from 'firebase/firestore'

export interface GuestEntry {
  name: string
  phone: string
  address: string
  age: number
  dob: string
  gender: string
  govIdNumber: string
  govIdPictures: string[]
  grcNumber: string
  idProofVerified: boolean
  idType: string
  purpose: string
}

export interface Stay {
  id: string
  hotelId: string
  hotelName?: string
  roomInstanceId: string
  roomNumber: string
  roomCategoryId: string
  roomCategoryName: string
  userId: string
  userName: string
  status: 'ACTIVE' | 'COMPLETED'
  guestName: string
  guestPhone: string
  guests: GuestEntry[]
  groupStayId: string
  bookingId: string
  breakfast: boolean
  earlyCheckIn: boolean
  earlyCheckInCharge: number
  lateCheckOut: boolean
  lateCheckOutCharge: number
  extraBed: boolean
  extraCharges: unknown[]
  adults: number
  children: number
  agreedPricePerNight: number
  advancePaidAmount: number
  advancePaymentMethod: string
  totalBilled: number
  checkInActual: Timestamp
  checkOutActual: Timestamp | null
  expectedCheckOut: Timestamp
  trueCheckIn: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
  checkInManager: string
  checkOutManager: string
  ledgerAdvancePostedAtCheckIn: boolean
}

export interface OrderItem {
  itemId: string
  name: string
  quantity: number
  basePrice: number
  price?: number
  taxPercentage: number
  taxedPrice: number
  taxAmount: number
  subtotal: number
  total: number
}

export type OrderStatus = 'NEW' | 'ASSIGNED' | 'COMPLETED'
export type OrderType = 'ROOM_SERVICE' | 'SERVICE' | 'ORDER'

export interface Order {
  id: string
  hotelId: string
  userId: string
  stayId: string
  groupStayId: string
  roomInstanceId: string
  roomNumber: string
  guestName: string
  type: OrderType
  items: OrderItem[]
  subtotalAmount: number
  totalTaxAmount: number
  totalAmount: number
  status: OrderStatus
  assignedTo: string
  createdAt: Timestamp | null
}

export interface FoodItem {
  id: string
  hotelId: string
  name: string
  price: number
  taxPercentage: number
  category: string
  isAvailable: boolean
  description?: string
  imageUrl?: string
}

export interface Service {
  id: string
  hotelId: string
  name: string
  price: number
  taxPercentage?: number
  isActive: boolean
  description?: string
  imageUrl?: string
}

export type CartSource = 'food' | 'service'

export interface CartLine {
  source: CartSource
  item: FoodItem | Service
  qty: number
}

export interface OrderTotals {
  subtotalAmount: number
  totalTaxAmount: number
  totalAmount: number
}

export interface CheckInOption {
  token: string
  maskedPhone: string
  name: string
}
