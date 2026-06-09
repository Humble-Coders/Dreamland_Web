import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import Landing from './pages/Landing'
import Hotels from './pages/Hotels'
import Bookings from './pages/Bookings'
import Profile from './pages/Profile'
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

const ResponsiveHome     = R(Landing,   MobileHome)
const ResponsiveHotels   = R(Hotels,    MobileHotels)
const ResponsiveBookings = R(Bookings,  MobileBookings)
const ResponsiveProfile  = R(Profile,   MobileProfile)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<ResponsiveHome />} />
        <Route path="/hotels"   element={<ResponsiveHotels />} />
        <Route path="/bookings" element={<ResponsiveBookings />} />
        <Route path="/profile"  element={<ResponsiveProfile />} />
        <Route path="/hotel/:hotelId"          element={<MobileHotelDetail />} />
        <Route path="/hotel/:hotelId/gallery"  element={<MobileGalleryScreen />} />
        <Route path="/gallery/:hotelId"        element={<MobileGalleryScreen />} />
        <Route path="/room/:roomId"            element={<MobileRoomDetail />} />
        <Route path="/app"      element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
