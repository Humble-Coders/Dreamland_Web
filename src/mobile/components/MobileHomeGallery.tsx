import { useNavigate } from 'react-router-dom'
import { imgUrl } from '../../utils/imgUrl'

interface Props {
  photos: string[]
  hotelId?: string
  hotelName?: string
  /** Photos to show in the preview grid before "View All". Default 6 */
  previewCount?: number
}

export default function MobileHomeGallery({ photos, hotelId, hotelName, previewCount = 6 }: Props) {
  const navigate = useNavigate()
  const preview = photos.slice(0, previewCount)

  const openGallery = (startIdx = 0) => {
    navigate(`/gallery/${hotelId ?? 'photos'}`, {
      state: { photos, hotelName, startIdx },
    })
  }

  if (photos.length === 0) return null

  return (
    <section className="py-8 border-t border-cream/[0.05]">
      {/* Header */}
      <div className="px-5 mb-5 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-medium tracking-[0.25em] text-gold-400/60 uppercase mb-1">Our Property</p>
          <h2 className="font-display text-2xl text-cream">Gallery</h2>
        </div>
        {photos.length > previewCount && (
          <button type="button" onClick={() => openGallery()}
            className="text-xs font-medium text-gold-400/70 flex items-center gap-1">
            See all {photos.length}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Preview grid — 3 columns */}
      <div className="grid grid-cols-3 gap-0.5 px-5">
        {preview.map((url, i) => {
          const isLast = i === previewCount - 1 && photos.length > previewCount
          const remaining = photos.length - previewCount
          return (
            <button
              key={url}
              type="button"
              onClick={() => openGallery(i)}
              className="relative aspect-square overflow-hidden bg-forest-900 focus:outline-none active:opacity-80"
            >
              <img
                src={imgUrl(url, 400)}
                alt=""
                className="h-full w-full object-cover"
                loading={i < 3 ? 'eager' : 'lazy'}
              />
              {isLast && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/65 backdrop-blur-[2px]">
                  <span className="font-display text-2xl font-bold text-cream">+{remaining}</span>
                  <span className="text-[10px] font-medium text-cream/60 tracking-wide">more</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
