import { useLandingData } from '../hooks/useLandingData'
import CursorGlow from '../components/landing/CursorGlow'
import LandingNav from '../components/landing/LandingNav'
import LandingHero from '../components/landing/LandingHero'
import LandingAbout from '../components/landing/LandingAbout'
import LandingRooms from '../components/landing/LandingRooms'
import LandingWhyChoose from '../components/landing/LandingWhyChoose'
import LandingTestimonials from '../components/landing/LandingTestimonials'
import LandingGallery from '../components/landing/LandingGallery'
import LandingAmenities from '../components/landing/LandingAmenities'
import LandingLocation from '../components/landing/LandingLocation'
import LandingContact from '../components/landing/LandingContact'
import LandingFooter from '../components/landing/LandingFooter'

export default function Landing() {
  const { hotel, rooms, reviews, attractions, travelList, headerMedia } = useLandingData()

  return (
    <div className="min-h-full bg-forest-950 text-cream">
      <CursorGlow />
      <LandingNav hotel={hotel} />
      <LandingHero heroImages={headerMedia} hotel={hotel} />
      <LandingAbout hotel={hotel} />
      <LandingRooms rooms={rooms} />
      <LandingWhyChoose />
      <LandingTestimonials reviews={reviews} />
      <LandingGallery photos={hotel?.photos} />
      {/* <LandingAmenities hotel={hotel} /> */}
      <LandingLocation hotel={hotel} attractions={attractions} />
      <LandingContact hotel={hotel} />
      <LandingFooter hotel={hotel} />
    </div>
  )
}
