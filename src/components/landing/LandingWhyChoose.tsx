// "Why Guests Choose Dreamland" — four trust pillars that build confidence
// in the property. Uses a horizontally distributed card layout with gold
// icon rings and subtle animated entrance on scroll.
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionHeading from './ui/SectionHeading'
import { staggerChildren, scaleIn } from './ui/MotionVariants'

interface TrustItem {
  icon: string
  title: string
  desc: string
}

const TRUST_ITEMS: TrustItem[] = [
  {
    icon: '✦',
    title: 'Verified Property',
    desc: 'Officially quality-verified and reviewed. Every stay meets our gold standard of hospitality.',
  },
  {
    icon: '◈',
    title: 'Best Price Guarantee',
    desc: 'Book direct and always receive the best available rate — no hidden charges, ever.',
  },
  {
    icon: '↺',
    title: 'Free Cancellation',
    desc: 'Plans change. Cancel up to 24 hours before check-in, no questions asked.',
  },
  {
    icon: '◷',
    title: '24/7 Support',
    desc: 'Our dedicated concierge team is available day and night for your every need.',
  },
]

export default function LandingWhyChoose() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      ref={ref}
      className="relative border-y border-gold-500/10 py-28 lg:py-36 overflow-hidden"
    >
      {/* Warm gold tint across the section to break visual rhythm */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_50%,rgba(212,175,55,0.05),transparent)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">

        {/* Heading */}
        <motion.div
          variants={staggerChildren(0.12)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <SectionHeading
            label="Why Choose Us"
            title="Why Guests Choose Dreamland"
            subtitle="Four reasons our guests return, year after year."
          />
        </motion.div>

        {/* Trust cards — 4-col desktop, 2-col tablet, 1-col mobile */}
        <motion.div
          variants={staggerChildren(0.12, 0.2)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {TRUST_ITEMS.map((item) => (
            <motion.div
              key={item.title}
              variants={scaleIn}
              className="group flex flex-col items-center gap-5 rounded-2xl border border-cream/8 bg-forest-900/30 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:border-gold-500/30 hover:bg-forest-900/50"
            >
              {/* Icon ring */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-2xl text-gold-400 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(212,175,55,0.2)]">
                {item.icon}
              </div>

              <div>
                <h3 className="font-display text-xl text-cream">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/50">{item.desc}</p>
              </div>

              {/* Gold bottom accent line — appears on hover */}
              <div className="mt-auto h-px w-0 bg-gold-500/40 transition-all duration-500 group-hover:w-12" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
