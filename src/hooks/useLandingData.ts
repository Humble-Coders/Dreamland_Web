import { useEffect, useState } from 'react'
import { getLandingData, type LandingData } from '../services/landingService'

const EMPTY: LandingData = {
  hotel: null,
  rooms: [],
  reviews: [],
  attractions: [],
  travelList: [],
  headerMedia: [],
}

export function useLandingData() {
  const [data, setData] = useState<LandingData>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getLandingData()
      .then((d) => { if (!cancelled) setData(d) })
      .catch((err) => {
        console.error('useLandingData:', err)
        if (!cancelled) setError('Failed to load hotel data')
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { ...data, loading, error }
}

export type {
  Hotel,
  HotelRoom,
  HotelReview,
  HotelHighlight,
  HotelMode,
  MealPlan,
  RatingBreakdown,
  Attraction,
  TravelActivity,
  LandingData,
} from '../services/landingService'
