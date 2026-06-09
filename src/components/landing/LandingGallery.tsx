import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import SectionHeading from './ui/SectionHeading'
import { staggerChildren, scaleIn, fadeIn } from './ui/MotionVariants'
import Img from './ui/Img'
import { imgUrl } from '../../utils/imgUrl'
import { LOCAL_PHOTOS } from '../../data/localImages'

interface GalleryItem {
  src: string
  label: string
  span?: string
}

const SPAN_MAP: Record<number, string> = {
  0: 'md:col-span-2 md:row-span-2',
  3: 'md:col-span-2',
  7: 'md:col-span-2',
}

function photosToGallery(photos: string[]): GalleryItem[] {
  return photos.map((url, i) => ({
    src: url,
    label: `Photo ${i + 1}`,
    span: SPAN_MAP[i],
  }))
}

interface Props {
  photos?: string[]
}

export default function LandingGallery({ photos }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const gallery: GalleryItem[] = photosToGallery(
    (photos && photos.length > 0) ? photos : LOCAL_PHOTOS
  )

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
    document.body.style.overflow = ''
  }, [])

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    document.body.style.overflow = 'hidden'
  }, [])

  const showPrev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + gallery.length) % gallery.length : null))
  }, [gallery.length])

  const showNext = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % gallery.length : null))
  }, [gallery.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') showNext()
      if (e.key === 'ArrowLeft') showPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex, closeLightbox, showNext, showPrev])

  useEffect(() => () => { document.body.style.overflow = '' }, [])

  if (gallery.length === 0) return null

  return (
    <>
      <section id="gallery" ref={ref} className="py-16 sm:py-24 lg:py-36 bg-forest-900/15">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            variants={staggerChildren(0.12)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="mb-16"
          >
            <SectionHeading
              label="Inside The Stay"
              title="A Glimpse of Dreamland"
              subtitle="Every corner of Hotel Dreamland is a composition — crafted to delight the eye and soothe the soul."
            />
          </motion.div>

          <motion.div
            variants={staggerChildren(0.07, 0.1)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-3"
          >
            {gallery.map((item, index) => (
              <motion.button
                key={item.src}
                type="button"
                variants={scaleIn}
                onClick={() => openLightbox(index)}
                className={`group relative cursor-pointer overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-gold-400 bg-forest-900 ${item.span ?? ''}`}
                aria-label={`View ${item.label}`}
              >
                <Img
                  src={imgUrl(item.src, 600)}
                  alt={item.label}
                  className="h-full min-h-32 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:min-h-44"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-forest-950/80 via-forest-950/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-[9px] tracking-[0.35em] text-gold-400 uppercase">View ✦</span>
                  <span className="font-display text-lg text-cream">{item.label}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/96 p-4"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
          >
            <div className="absolute top-5 left-6 text-xs text-cream/35">
              {lightboxIndex + 1} / {gallery.length}
            </div>
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/50 transition-all hover:border-cream/30 hover:text-cream"
              aria-label="Close"
            >
              ✕
            </button>
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex max-h-[85vh] max-w-[85vw] flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={gallery[lightboxIndex].src}
                alt={gallery[lightboxIndex].label}
                className="max-h-[80vh] max-w-[85vw] rounded-xl object-contain shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
              />
              <div className="mt-4 flex items-center gap-3 text-cream/50">
                <div className="h-px w-6 bg-gold-500/30" />
                <span className="text-xs tracking-widest uppercase">{gallery[lightboxIndex].label}</span>
                <div className="h-px w-6 bg-gold-500/30" />
              </div>
            </motion.div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); showPrev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-cream/15 bg-forest-950/60 text-cream/60 backdrop-blur-sm transition-all hover:border-cream/30 hover:text-cream lg:left-8"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); showNext() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-cream/15 bg-forest-950/60 text-cream/60 backdrop-blur-sm transition-all hover:border-cream/30 hover:text-cream lg:right-8"
              aria-label="Next"
            >
              →
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                  aria-label={`Image ${i + 1}`}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === lightboxIndex ? 'w-5 bg-gold-400' : 'w-1 bg-cream/25 hover:bg-cream/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
