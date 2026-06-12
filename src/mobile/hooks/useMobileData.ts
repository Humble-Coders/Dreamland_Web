import { useState, useEffect } from 'react'
import { getLandingData, getHotels } from '../../services/landingService'
import type { Hotel, HotelRoom, HotelReview } from '../../services/landingService'

interface MobileHomeState {
  hotels: Hotel[]
  rooms: HotelRoom[]
  reviews: HotelReview[]
  galleryPhotos: string[]
  loading: boolean
  error: string | null
}

const INITIAL: MobileHomeState = {
  hotels: [],
  rooms: [],
  reviews: [],
  galleryPhotos: [],
  loading: true,
  error: null,
}

export function useMobileData(): MobileHomeState {
  const [state, setState] = useState<MobileHomeState>(INITIAL)

  useEffect(() => {
    let cancelled = false
    Promise.all([getLandingData(), getHotels()])
      .then(([data, hotels]) => {
        if (!cancelled) {
          setState({
            hotels,
            rooms: data.rooms,
            reviews: data.reviews,
            galleryPhotos: data.hotel?.photos ?? [],
            loading: false,
            error: null,
          })
        }
      })
      .catch(() => {
        if (!cancelled)
          setState((p) => ({ ...p, loading: false, error: 'Failed to load' }))
      })
    return () => { cancelled = true }
  }, [])

  return state
}
