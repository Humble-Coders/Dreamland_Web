import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionHeading from './ui/SectionHeading'
import { staggerChildren, slideRight, fadeUp } from './ui/MotionVariants'
import type { Hotel } from '../../hooks/useLandingData'

type Status = 'idle' | 'sending' | 'sent'

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

const INITIAL: FormData = { name: '', email: '', phone: '', message: '' }

interface Props {
  hotel?: Hotel | null
}

export default function LandingContact({ hotel }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const [form, setForm] = useState<FormData>(INITIAL)
  const [status, setStatus] = useState<Status>('idle')

  const contactInfo = [
    hotel?.contactPhone ? { icon: '📞', value: hotel.contactPhone } : null,
    hotel?.contactEmail ? { icon: '✉️', value: hotel.contactEmail } : null,
    hotel?.address || hotel?.city
      ? { icon: '📍', value: [hotel.address, hotel.city].filter(Boolean).join(', ') }
      : null,
  ].filter(Boolean) as { icon: string; value: string }[]

  const waNumber = hotel?.contactPhone?.replace(/[\s+\-().]/g, '') ?? ''
  const waUrl = waNumber ? `https://wa.me/${waNumber}` : null

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise((r) => setTimeout(r, 1400))
    setStatus('sent')
    setForm(INITIAL)
  }

  const inputClass =
    'w-full rounded-xl border border-cream/10 bg-forest-900/50 px-4 py-3.5 text-sm text-cream placeholder-cream/25 outline-none transition-all duration-200 focus:border-gold-500/50 focus:bg-forest-900/70 focus:ring-2 focus:ring-gold-500/10'

  return (
    <section id="contact" ref={ref} className="py-16 sm:py-24 lg:py-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-2 lg:px-10">

        {/* Left */}
        <motion.div
          variants={staggerChildren(0.12)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col justify-center gap-8"
        >
          <SectionHeading
            label="Get In Touch"
            title={`We'd Love to\nHear From You`}
            subtitle="Whether you have a question about your stay, a special occasion to plan, or simply wish to learn more — our team is always within reach."
            align="left"
          />

          {contactInfo.length > 0 && (
            <motion.div variants={fadeUp} className="space-y-4 text-sm text-cream/55">
              {contactInfo.map((c) => (
                <p key={c.value} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-500/20 bg-gold-500/8 text-base">
                    {c.icon}
                  </span>
                  {c.value}
                </p>
              ))}
            </motion.div>
          )}

          {waUrl && (
            <motion.a
              variants={fadeUp}
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-fit items-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/8 px-6 py-3.5 text-sm font-medium text-emerald-300 transition-all hover:bg-emerald-500/15"
            >
              <span className="text-lg">💬</span>
              Chat on WhatsApp
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </motion.a>
          )}
        </motion.div>

        {/* Right: form */}
        <motion.div
          variants={slideRight}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {status === 'sent' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-full flex-col items-center justify-center gap-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-8 py-16 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-3xl text-emerald-300 ring-1 ring-emerald-500/25">
                ✓
              </div>
              <h3 className="font-display text-2xl text-cream">Message Received</h3>
              <p className="text-sm leading-relaxed text-cream/55">
                Thank you for reaching out. A member of our team will respond within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-2 text-xs text-gold-400 underline-offset-4 hover:underline"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-cream/8 bg-forest-900/40 p-5 backdrop-blur-sm sm:p-8"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-wide text-cream/40 uppercase">Full Name *</label>
                  <input type="text" required placeholder="Your name" value={form.name} onChange={set('name')} className={inputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-wide text-cream/40 uppercase">Email Address *</label>
                  <input type="email" required placeholder="your@email.com" value={form.email} onChange={set('email')} className={inputClass} />
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-1.5">
                <label className="text-xs tracking-wide text-cream/40 uppercase">Phone Number</label>
                <input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={set('phone')} className={inputClass} />
              </div>
              <div className="mt-4 flex flex-col gap-1.5">
                <label className="text-xs tracking-wide text-cream/40 uppercase">How can we assist you? *</label>
                <textarea required rows={5} placeholder="Tell us about your visit or enquiry…" value={form.message} onChange={set('message')} className={`${inputClass} resize-none`} />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 py-4 font-semibold text-forest-950 shadow-[0_8px_24px_rgba(212,175,55,0.3)] transition-all hover:bg-gold-400 hover:shadow-[0_12px_32px_rgba(212,175,55,0.4)] active:scale-[0.99] disabled:opacity-60"
              >
                {status === 'sending' ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-forest-950/30 border-t-forest-950" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
