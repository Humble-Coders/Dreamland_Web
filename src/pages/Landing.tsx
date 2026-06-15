import { useLandingData } from '../hooks/useLandingData'
import { HEADER_PHOTOS } from '../data/localImages'
import SEO, { SITE_URL, DEFAULT_IMAGE } from '../components/SEO'
import CursorGlow from '../components/landing/CursorGlow'
import LandingNav from '../components/landing/LandingNav'
import LandingHero from '../components/landing/LandingHero'
import LandingAbout from '../components/landing/LandingAbout'
import LandingRooms from '../components/landing/LandingRooms'
import LandingWhyChoose from '../components/landing/LandingWhyChoose'
import LandingTestimonials from '../components/landing/LandingTestimonials'
import LandingGallery from '../components/landing/LandingGallery'
import LandingLocation from '../components/landing/LandingLocation'
import LandingContact from '../components/landing/LandingContact'
import LandingFooter from '../components/landing/LandingFooter'

export default function Landing() {
  const { hotel, rooms, reviews, attractions, travelList } = useLandingData()

  return (
    <div className="min-h-full bg-forest-950 text-cream">
      <SEO
        title="Dreamland Resort Karnal | Luxury Stay & Hospitality"
        description={hotel?.description || 'Dreamland Resort in Karnal, Haryana offers luxury rooms, fine dining and warm hospitality on GT Road. Book your stay at Hotel Dreamland today.'}
        path="/"
        image={hotel?.photos?.[0] ? `${SITE_URL}${hotel.photos[0]}` : DEFAULT_IMAGE}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': ['Hotel', 'LodgingBusiness', 'LocalBusiness'],
          name: hotel?.name ?? 'Dreamland Resort',
          description: hotel?.description,
          image: hotel?.photos?.length
            ? hotel.photos.slice(0, 5).map((p) => `${SITE_URL}${p}`)
            : [DEFAULT_IMAGE],
          url: SITE_URL,
          telephone: hotel?.contactPhone,
          email: hotel?.contactEmail,
          priceRange: '₹₹',
          currenciesAccepted: 'INR',
          paymentAccepted: 'Cash, Credit Card, Debit Card, UPI',
          address: {
            '@type': 'PostalAddress',
            streetAddress: hotel?.address || 'GT Road',
            addressLocality: hotel?.city || 'Karnal',
            addressRegion: 'Haryana',
            postalCode: hotel?.pincode,
            addressCountry: 'IN',
          },
          ...(hotel?.latitude && hotel?.longitude
            ? {
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: hotel.latitude,
                  longitude: hotel.longitude,
                },
                hasMap: `https://maps.google.com/?q=${hotel.latitude},${hotel.longitude}`,
              }
            : {}),
          ...(hotel?.checkInTime ? { checkinTime: hotel.checkInTime } : {}),
          ...(hotel?.checkOutTime ? { checkoutTime: hotel.checkOutTime } : {}),
          ...(hotel?.highlights?.length
            ? {
                amenityFeature: hotel.highlights.map((h) => ({
                  '@type': 'LocationFeatureSpecification',
                  name: h.title,
                  value: true,
                })),
              }
            : {}),
          ...(hotel?.socialLinks
            ? { sameAs: hotel.socialLinks.split(/[\s,]+/).filter(Boolean) }
            : {}),
          ...(hotel?.starRating ? { starRating: { '@type': 'Rating', ratingValue: hotel.starRating } } : {}),
          ...(hotel?.averageRating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: hotel.averageRating, reviewCount: hotel.totalReviews ?? 1 } } : {}),
        }}
      />
      <CursorGlow />
      <LandingNav hotel={hotel} />
      <main>
        {/* Hero images are static local assets — rendered immediately, no Firestore wait */}
        <LandingHero heroImages={HEADER_PHOTOS} hotel={hotel} rooms={rooms} />
        <LandingAbout hotel={hotel} />
        <LandingRooms rooms={rooms} hotel={hotel} />
        <LandingWhyChoose />
        <LandingTestimonials reviews={reviews} />
        <LandingGallery photos={hotel?.photos} />
        <LandingLocation hotel={hotel} attractions={attractions} />
        <LandingContact hotel={hotel} />
      </main>
      <LandingFooter hotel={hotel} />
    </div>
  )
}
