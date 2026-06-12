// Cloudinary fetch transform — wraps Firebase Storage URLs to serve auto-format
// (WebP/AVIF) at the requested width, cached at Cloudinary's CDN.
//
// Setup:
//  1. Create a free Cloudinary account (cloudinary.com)
//  2. In your Cloudinary dashboard, go to Settings → Upload → Enable "Fetch" delivery type
//  3. Add VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name to .env.local
//
// When the env var is absent the function is a no-op (original URL returned).

const CLOUD_NAME = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined) ?? ''

// Widths that scripts/generate-image-variants.mjs pre-renders for every
// /photos/*.avif|jpeg source as "<name>-<width>.avif".
const LOCAL_WIDTHS = [400, 600, 1080, 1600] as const

// Picks the smallest pre-generated local variant that is >= the requested
// width, falling back to the largest available variant.
function localVariant(src: string, width?: number): string {
  if (!width) return src
  const target = LOCAL_WIDTHS.find((w) => w >= width) ?? LOCAL_WIDTHS[LOCAL_WIDTHS.length - 1]
  return src.replace(/\.\w+$/, `-${target}.avif`)
}

export function imgUrl(src: string | undefined | null, width?: number): string {
  if (!src) return ''
  // Local public-folder paths — serve a pre-generated responsive AVIF variant
  if (src.startsWith('/photos/')) return localVariant(src, width)
  if (src.startsWith('/')) return src
  if (!CLOUD_NAME) return src
  const transforms = ['f_auto', 'q_auto', ...(width ? [`w_${width},c_limit`] : [])].join(',')
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/${transforms}/${encodeURIComponent(src)}`
}

// Builds a srcset string from pre-generated local variants. Returns '' for
// non-local (Cloudinary/remote) sources, where srcset isn't applicable.
export function imgSrcSet(src: string | undefined | null, widths: readonly number[] = LOCAL_WIDTHS): string {
  if (!src || !src.startsWith('/photos/')) return ''
  return widths.map((w) => `${localVariant(src, w)} ${w}w`).join(', ')
}
