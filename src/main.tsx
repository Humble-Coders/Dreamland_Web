import React, { useEffect, useState, lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './index.css'

const isMobile = () => window.innerWidth < 1024

type LazyImport = () => Promise<{ default: React.ComponentType }>

// Full-screen fallback shown while a route chunk is loading.
function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-700 border-t-gold-400" />
    </div>
  )
}

// Builds a route element that lazily loads ONLY the Desktop or Mobile module
// for the current viewport — the other half is never downloaded.
function R(loadDesktop: LazyImport, loadMobile: LazyImport) {
  return function ResponsiveWrapper() {
    const [mobile] = useState(isMobile)
    const [Comp] = useState(() => lazy(mobile ? loadMobile : loadDesktop))
    return (
      <Suspense fallback={<PageFallback />}>
        <Comp />
      </Suspense>
    )
  }
}

const LazyApp = lazy(() => import('./App'))

// Reset scroll position to top whenever the route changes
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const ResponsiveHome = R(
  () => import('./pages/Landing'),
  () => import('./mobile/pages/MobileHome'),
)
const ResponsiveHotels = R(
  () => import('./pages/Hotels'),
  () => import('./mobile/pages/MobileHotels'),
)
const ResponsiveBookings = R(
  () => import('./pages/Bookings'),
  () => import('./mobile/pages/MobileBookings'),
)
const ResponsiveProfile = R(
  () => import('./pages/Profile'),
  () => import('./mobile/pages/MobileProfile'),
)
const ResponsiveHotelDetail = R(
  () => import('./pages/HotelDetail'),
  () => import('./mobile/pages/MobileHotelDetail'),
)
const ResponsiveRoomDetail = R(
  () => import('./pages/RoomDetail'),
  () => import('./mobile/pages/MobileRoomDetail'),
)
const ResponsiveGallery = R(
  () => import('./pages/GalleryScreen'),
  () => import('./mobile/pages/MobileGalleryScreen'),
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/"         element={<ResponsiveHome />} />
        <Route path="/hotels"   element={<ResponsiveHotels />} />
        <Route path="/bookings" element={<ResponsiveBookings />} />
        <Route path="/profile"  element={<ResponsiveProfile />} />
        <Route path="/hotel/:hotelId"          element={<ResponsiveHotelDetail />} />
        <Route path="/hotel/:hotelId/gallery"  element={<ResponsiveGallery />} />
        <Route path="/gallery/:hotelId"        element={<ResponsiveGallery />} />
        <Route path="/room/:roomId"            element={<ResponsiveRoomDetail />} />
        <Route path="/app" element={<Suspense fallback={<PageFallback />}><LazyApp /></Suspense>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
