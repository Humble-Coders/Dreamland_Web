import { useState, useEffect } from 'react'
import { imgUrl, imgSrcSet } from '../../utils/imgUrl'

interface Props {
  images: string[]
  title?: string
  subtitle?: string
}

export default function MobileHeroCarousel({ images, title, subtitle }: Props) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => setCurrent((i) => (i + 1) % images.length), 5000)
    return () => clearInterval(id)
  }, [images.length])

  return (
    <div className="relative h-[65vh] min-h-[400px] w-full overflow-hidden bg-forest-950">
      {/* Crossfade images — match Android Crossfade(tween(1200ms)).
          Only the current slide and the next one (preloaded for the
          upcoming transition) are mounted, so hidden slides never
          download on initial load. */}
      {images.length > 0 ? (
        images.map((url, i) => {
          const next = (current + 1) % images.length
          if (i !== current && i !== next) return null
          return (
            <div
              key={url}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ${i === current ? 'opacity-100' : 'opacity-0'}`}
            >
              <img
                src={imgUrl(url, 1080)}
                srcSet={imgSrcSet(url)}
                sizes="100vw"
                alt=""
                className="h-full w-full object-cover"
                loading={i === current ? 'eager' : 'lazy'}
                fetchPriority={i === current ? 'high' : 'auto'}
              />
            </div>
          )
        })
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-forest-800 via-forest-900 to-forest-950" />
      )}

      {/* Top scrim — status bar legibility */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />

      {/* Bottom scrim — dissolves into bg colour like Android's multi-stop gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72"
        style={{
          background:
            'linear-gradient(to top, #052017 0%, rgba(5,32,23,0.90) 26%, rgba(0,0,0,0.76) 52%, rgba(0,0,0,0.50) 78%, transparent 100%)',
        }}
      />

      {/* Headline — lower third, matches Android layout */}
      {title && (
        <div className="absolute bottom-20 left-5 right-5">
          <h1
            className="font-display text-4xl leading-tight text-gold-400"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.85)' }}
          >
            {title.split('\n').map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>
          {subtitle && (
            <p
              className="mt-2 text-sm tracking-wide text-cream/90"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Image indicator dots */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Image ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current ? 'w-5 bg-gold-400' : 'w-1 bg-cream/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
