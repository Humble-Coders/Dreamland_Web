import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore'
import type { Timestamp } from 'firebase/firestore'
import { db } from '../firebase'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface HotelHighlight {
  title: string
  category: string
  amenityType: string
}

export interface HotelMode {
  category: string
  name: string
  distance: string
  distanceInKm?: number
  detailed?: string
  cab?: boolean
  auto?: boolean
}

export interface MealPlan {
  value: string
  price: number
}

export interface RatingBreakdown {
  cleanliness?: number
  food?: number
  staff?: number
  location?: number
  value?: number
}

export interface Hotel {
  id: string
  name: string
  description?: string
  hotelType?: string
  starRating?: number
  averageRating?: number
  totalReviews?: number
  isLuxury?: boolean
  totalRooms?: number
  // Location
  address?: string
  city?: string
  country?: string
  pincode?: string
  latitude?: number
  longitude?: number
  // Contact
  contactPhone?: string
  contactEmail?: string
  website?: string
  socialLinks?: string
  // Media
  photos?: string[]
  // Operations
  checkInTime?: string
  checkOutTime?: string
  earlyCheckInAllowed?: boolean
  earlyCheckInFee?: boolean
  earlyCheckInPrice?: number
  lateCheckOutAllowed?: boolean
  lateCheckOutFee?: boolean
  lateCheckOutPrice?: number
  // Amenities
  highlights?: HotelHighlight[]
  mealPlansAvailable?: MealPlan[]
  foodInclusivity?: boolean
  parkingAvailable?: boolean
  parkingType?: string
  parkingSpots?: number
  petPolicy?: boolean
  // Transport modes (how to reach the hotel)
  modes?: HotelMode[]
  // Ratings (flat fields matching Firestore / Android model)
  ratingCleanliness?: number
  ratingFood?: number
  ratingStaff?: number
  ratingLocation?: number
  ratingValue?: number
  ratingBreakdown?: RatingBreakdown
  // Policies
  pdfRequired?: boolean
  privacyPremium?: boolean
  ageRestriction?: number
}

export interface HotelRoom {
  id: string
  hotelId?: string
  name: string
  description?: string
  capacity?: number
  maxOccupancy?: number
  price?: number
  tax?: number
  available?: boolean
  bedType?: string
  noOfBeds?: number
  view?: string
  roomSizeSqft?: number
  floor?: number
  bathroomType?: string
  smokingAllowed?: boolean
  accessibilityFeatures?: boolean
  extraGuestCharge?: number
  minStayNights?: number
  freeCancellation?: boolean
  amenities?: string[]
  media?: string[]
  complimentaryBenefits?: string[]
  purchasableBenefits?: string[]
}

export interface HotelReview {
  id: string
  userId: string
  rating: number
  cleanliness?: number
  food?: number
  staff?: number
  location?: number
  value?: number
  comment?: string
  createdAt?: Timestamp
}

export interface Attraction {
  id: string
  hotelId: string
  name: string
  category: string
  description?: string
  pictureable?: boolean
  media?: string[]
}

export interface TravelActivity {
  id: string
  hotelId: string
  title: string
  category: string
  description?: string
  duration?: string
  price?: number
  included?: string[]
  media?: string[]
}

export interface LandingData {
  hotel: Hotel | null
  rooms: HotelRoom[]
  reviews: HotelReview[]
  attractions: Attraction[]
  travelList: TravelActivity[]
  headerMedia: string[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Normalise headerMedia: string[] | {url}[] | {media}[]
function normalizeHeaderMedia(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object') {
        const o = item as Record<string, unknown>
        if (typeof o.url === 'string') return o.url
        if (typeof o.media === 'string') return o.media
      }
      return null
    })
    .filter((url): url is string => Boolean(url))
}

// ── Service ───────────────────────────────────────────────────────────────────

export async function getHeaderMedia(): Promise<string[]> {
  try {
    const snap = await getDoc(doc(db, 'appConfig', 'header'))
    if (!snap.exists()) return []
    return normalizeHeaderMedia(snap.data().headerMedia)
  } catch {
    return []
  }
}

export async function getHotels(): Promise<Hotel[]> {
  const snap = await getDocs(
    query(collection(db, 'hotels'), where('isActive', '==', true)),
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Hotel))
}

export async function getLandingData(): Promise<LandingData> {
  const [hotels, headerMedia] = await Promise.all([getHotels(), getHeaderMedia()])

  const hotel = hotels[0] ?? null
  if (!hotel) {
    return { hotel: null, rooms: [], reviews: [], attractions: [], travelList: [], headerMedia }
  }

  // Each query is isolated — a permission error on one cannot block the others.
  const silent = () => null
  const [roomsSnap, reviewsSnap, attractionsSnap, travelSnap] = await Promise.all([
    getDocs(query(collection(db, 'rooms'), where('hotelId', '==', hotel.id))).catch(silent),
    getDocs(
      query(collection(db, 'hotels', hotel.id, 'reviews'), limit(10)),
    ).catch(silent),
    getDocs(query(collection(db, 'attractions'), where('hotelId', '==', hotel.id))).catch(silent),
    getDocs(query(collection(db, 'travelList'), where('hotelId', '==', hotel.id))).catch(silent),
  ])

  const rooms = (roomsSnap?.docs ?? [])
    .map((d) => ({ id: d.id, ...d.data() } as HotelRoom))
    .filter((r) => r.available !== false)

  const reviews = (reviewsSnap?.docs ?? [])
    .map((d) => ({ id: d.id, ...d.data() } as HotelReview))
    .filter((r) => r.comment && (r.rating ?? 0) >= 4)
    .slice(0, 6)

  const attractions = (attractionsSnap?.docs ?? []).map(
    (d) => ({ id: d.id, ...d.data() } as Attraction),
  )

  const travelList = (travelSnap?.docs ?? []).map(
    (d) => ({ id: d.id, ...d.data() } as TravelActivity),
  )

  return { hotel, rooms, reviews, attractions, travelList, headerMedia }
}

export async function getRoomById(roomId: string): Promise<{ room: HotelRoom; hotel: Hotel | null } | null> {
  try {
    const snap = await getDoc(doc(db, 'rooms', roomId))
    if (!snap.exists()) return null
    const room = { id: snap.id, ...snap.data() } as HotelRoom
    const hotel = room.hotelId
      ? await getDoc(doc(db, 'hotels', room.hotelId))
          .then((h) => (h.exists() ? ({ id: h.id, ...h.data() } as Hotel) : null))
          .catch(() => null)
      : null
    return { room, hotel }
  } catch {
    return null
  }
}

export async function getHotelDetailById(hotelId: string): Promise<LandingData> {
  const [hotelSnap, headerMedia] = await Promise.all([
    getDoc(doc(db, 'hotels', hotelId)),
    getHeaderMedia(),
  ])

  if (!hotelSnap.exists()) {
    return { hotel: null, rooms: [], reviews: [], attractions: [], travelList: [], headerMedia }
  }

  const hotel = { id: hotelSnap.id, ...hotelSnap.data() } as Hotel
  const silent = () => null

  const [roomsSnap, reviewsSnap, attractionsSnap, travelSnap] = await Promise.all([
    getDocs(query(collection(db, 'rooms'), where('hotelId', '==', hotel.id))).catch(silent),
    getDocs(query(collection(db, 'hotels', hotel.id, 'reviews'), limit(10))).catch(silent),
    getDocs(query(collection(db, 'attractions'), where('hotelId', '==', hotel.id))).catch(silent),
    getDocs(query(collection(db, 'travelList'), where('hotelId', '==', hotel.id))).catch(silent),
  ])

  const rooms = (roomsSnap?.docs ?? [])
    .map((d) => ({ id: d.id, ...d.data() } as HotelRoom))
    .filter((r) => r.available !== false)

  const reviews = (reviewsSnap?.docs ?? [])
    .map((d) => ({ id: d.id, ...d.data() } as HotelReview))
    .filter((r) => r.comment && (r.rating ?? 0) >= 4)
    .slice(0, 5)

  const attractions = (attractionsSnap?.docs ?? []).map(
    (d) => ({ id: d.id, ...d.data() } as Attraction),
  )

  const travelList = (travelSnap?.docs ?? []).map(
    (d) => ({ id: d.id, ...d.data() } as TravelActivity),
  )

  return { hotel, rooms, reviews, attractions, travelList, headerMedia }
}
