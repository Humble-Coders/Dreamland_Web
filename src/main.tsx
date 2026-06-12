import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import App from './App'
import Landing from './pages/Landing'
import Hotels from './pages/Hotels'
import Bookings from './pages/Bookings'
import Profile from './pages/Profile'
import HotelDetail from './pages/HotelDetail'
import RoomDetail from './pages/RoomDetail'
import GalleryScreen from './pages/GalleryScreen'
import MobileHome from './mobile/pages/MobileHome'
import MobileHotelDetail from './mobile/pages/MobileHotelDetail'
import MobileRoomDetail from './mobile/pages/MobileRoomDetail'
import MobileGalleryScreen from './mobile/pages/MobileGalleryScreen'
import MobileHotels from './mobile/pages/MobileHotels'
import MobileBookings from './mobile/pages/MobileBookings'
import MobileProfile from './mobile/pages/MobileProfile'
import './index.css'

const isMobile = () => window.innerWidth < 1024

function R(Desktop: React.ComponentType, Mobile: React.ComponentType) {
  return function ResponsiveWrapper() {
    const [mobile] = useState(isMobile)
    return mobile ? <Mobile /> : <Desktop />
  }
}

// Reset scroll position to top whenever the route changes
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const ResponsiveHome        = R(Landing,        MobileHome)
const ResponsiveHotels      = R(Hotels,         MobileHotels)
const ResponsiveBookings    = R(Bookings,       MobileBookings)
const ResponsiveProfile     = R(Profile,        MobileProfile)
const ResponsiveHotelDetail = R(HotelDetail,    MobileHotelDetail)
const ResponsiveRoomDetail  = R(RoomDetail,     MobileRoomDetail)
const ResponsiveGallery     = R(GalleryScreen,  MobileGalleryScreen)

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
        <Route path="/app"      element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
