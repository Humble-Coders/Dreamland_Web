import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import Landing from './pages/Landing'
import MobileHome from './mobile/pages/MobileHome'
import MobileHotelDetail from './mobile/pages/MobileHotelDetail'
import MobileRoomDetail from './mobile/pages/MobileRoomDetail'
import MobileGalleryScreen from './mobile/pages/MobileGalleryScreen'
import MobileHotels from './mobile/pages/MobileHotels'
import MobileBookings from './mobile/pages/MobileBookings'
import MobileProfile from './mobile/pages/MobileProfile'
import './index.css'

function ResponsiveLandingWrapper() {
  const [isMobile] = useState(() => window.innerWidth < 1024)
  return isMobile ? <MobileHome /> : <Landing />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ResponsiveLandingWrapper />} />
        <Route path="/hotels" element={<MobileHotels />} />
        <Route path="/bookings" element={<MobileBookings />} />
        <Route path="/profile" element={<MobileProfile />} />
        <Route path="/hotel/:hotelId" element={<MobileHotelDetail />} />
        <Route path="/hotel/:hotelId/gallery" element={<MobileGalleryScreen />} />
        <Route path="/gallery/:hotelId" element={<MobileGalleryScreen />} />
        <Route path="/room/:roomId" element={<MobileRoomDetail />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
