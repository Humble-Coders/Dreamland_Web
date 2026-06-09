import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { imgUrl } from '../../utils/imgUrl'

interface Props {
  photos: string[]
  /** Max thumbnails shown in the grid before "View all" button. Default 6. */
  previewCount?: number
}

export default function MobileGallery({ photos, previewCount = 6 }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const visible = photos.slice(0, previewCount)
  const remaining = photos.length - visible.length

  const open = useCallback((i: number) => {
    setLightboxIndex(i)
    document.body.style.overflow = 'hidden'
  }, [])

  const close = useCallback(() => {
    setLightboxIndex(null)
    document.body.style.overflow = ''
  }, [])

  const prev = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null)),
    [photos.length])

  const next = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : null)),
    [photos.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex, close, next, prev])

  useEffect(() => () => { document.body.style.overflow = '' }, [])

  if (photos.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-3 gap-1.5">
        {visible.map((url, i) => {
          const isLast = i === visible.length - 1 && remaining > 0
          return (
            <button
              key={url}
              type="button"
              onClick={() => open(i)}
              className="relative aspect-square overflow-hidden rounded-xl bg-forest-900 outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            >
              <img
                src={imgUrl(url, 400)}
                alt={`Photo ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 active:scale-95"
                loading="lazy"
              />
              {isLast && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-forest-950/80 backdrop-blur-sm">
                  <span className="text-lg font-semibold text-cream">+{remaining}</span>
                  <span className="text-[10px] text-cream/60">more</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/97"
            onClick={close}
          >
            {/* Counter */}
            <div className="absolute left-4 top-4 text-xs text-cream/40">
              {lightboxIndex + 1} / {photos.length}
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/60 hover:text-cream"
              aria-label="Close gallery"
            >
              ✕
            </button>

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              src={photos[lightboxIndex]}
              alt={`Photo ${lightboxIndex + 1}`}
              className="max-h-[85vh] max-w-[92vw] rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Prev / Next */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); prev() }}
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/15 bg-forest-950/60 text-cream/60 backdrop-blur-sm active:text-cream"
                  aria-label="Previous"
                >←</button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); next() }}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/15 bg-forest-950/60 text-cream/60 backdrop-blur-sm active:text-cream"
                  aria-label="Next"
                >→</button>
              </>
            )}

            {/* Dot strip */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1">
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                  aria-label={`Photo ${i + 1}`}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === lightboxIndex ? 'w-5 bg-gold-400' : 'w-1 bg-cream/25'
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
