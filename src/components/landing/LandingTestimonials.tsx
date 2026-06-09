import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import SectionHeading from './ui/SectionHeading'
import { staggerChildren, fadeUp, ease } from './ui/MotionVariants'
import type { HotelReview } from '../../hooks/useLandingData'

interface Testimonial {
  id: string
  quote: string
  name: string
  rating: number
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'f1',
    quote: 'An absolutely extraordinary stay. The attention to detail was remarkable — from the handwritten welcome note to the perfectly curated room fragrance. Hotel Dreamland has set a new benchmark for us.',
    name: 'Rahul S.',
    rating: 5,
  },
  {
    id: 'f2',
    quote: 'We celebrated our anniversary here and it exceeded every expectation. The staff anticipated our every need and the Super Deluxe suite was truly magnificent. We will absolutely return.',
    name: 'Priya & Amandeep K.',
    rating: 5,
  },
  {
    id: 'f3',
    quote: 'The rooms are immaculately maintained, the food is exceptional, and the location on GT Road is incredibly convenient. By far the finest hotel experience in Karnal. Highly recommended.',
    name: 'Vikram M.',
    rating: 5,
  },
  {
    id: 'f4',
    quote: 'From the moment we arrived, we were treated like royalty. The concierge team organised everything flawlessly. A hotel that genuinely understands what luxury service means.',
    name: 'Sunita R.',
    rating: 5,
  },
]

function toTestimonials(reviews: HotelReview[]): Testimonial[] {
  return reviews.map((r) => ({
    id: r.id,
    quote: r.comment ?? '',
    name: 'Verified Guest',
    rating: r.rating,
  }))
}

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60, transition: { duration: 0.4 } }),
}

interface Props {
  reviews?: HotelReview[]
}

export default function LandingTestimonials({ reviews }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [[active, direction], setActive] = useState([0, 0])

  const testimonials = reviews && reviews.length > 0 ? toTestimonials(reviews) : FALLBACK_TESTIMONIALS

  const next = useCallback(() => {
    setActive(([i]) => [(i + 1) % testimonials.length, 1])
  }, [testimonials.length])

  const prev = useCallback(() => {
    setActive(([i]) => [(i - 1 + testimonials.length) % testimonials.length, -1])
  }, [testimonials.length])

  useEffect(() => {
    if (!isInView || testimonials.length === 0) return
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [isInView, next, testimonials.length])

  const t = testimonials[active] ?? testimonials[0]

  return (
    <section id="testimonials" ref={ref} className="relative py-28 lg:py-36 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,175,55,0.05),transparent)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-10">
        <motion.div
          variants={staggerChildren(0.12)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading label="Guest Reviews" title="What Our Guests Say" />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative"
        >
          <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 font-display text-9xl leading-none text-gold-500/8 select-none">
            "
          </div>

          <div className="relative min-h-56 overflow-hidden rounded-2xl border border-cream/8 bg-forest-900/40 px-8 py-10 backdrop-blur-sm md:px-14 md:py-14">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="text-center"
              >
                <div className="mb-6 flex justify-center gap-1 text-gold-400 text-sm">
                  {'★'.repeat(t.rating)}
                </div>
                <blockquote className="font-display text-xl italic leading-relaxed text-cream/85 sm:text-2xl">
                  "{t.quote}"
                </blockquote>
                <div className="mt-8 flex flex-col items-center gap-1">
                  <div className="h-px w-8 bg-gold-500/40" />
                  <p className="mt-2 font-medium text-cream">{t.name}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/50 transition-all hover:border-gold-500/40 hover:text-gold-300"
              aria-label="Previous"
            >
              ←
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive([i, i > active ? 1 : -1])}
                  aria-label={`Go to ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? 'w-6 bg-gold-400' : 'w-1.5 bg-cream/20 hover:bg-cream/40'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/50 transition-all hover:border-gold-500/40 hover:text-gold-300"
              aria-label="Next"
            >
              →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
