import { useState, useEffect } from 'react'
import { getHotelDetailById } from '../../services/landingService'
import type { LandingData } from '../../services/landingService'

interface HotelDetailState extends LandingData {
  loading: boolean
  error: string | null
}

const EMPTY: HotelDetailState = {
  hotel: null,
  rooms: [],
  reviews: [],
  attractions: [],
  travelList: [],
  headerMedia: [],
  loading: true,
  error: null,
}

export function useMobileHotelDetail(hotelId: string): HotelDetailState {
  const [state, setState] = useState<HotelDetailState>(EMPTY)

  useEffect(() => {
    if (!hotelId) return
    let cancelled = false
    setState((prev) => ({ ...prev, loading: true, error: null }))

    getHotelDetailById(hotelId)
      .then((data) => {
        if (!cancelled) setState({ ...data, loading: false, error: null })
      })
      .catch(() => {
        if (!cancelled) setState((prev) => ({ ...prev, loading: false, error: 'Failed to load hotel' }))
      })

    return () => { cancelled = true }
  }, [hotelId])

  return state
}
