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

export function imgUrl(src: string | undefined | null, width?: number): string {
  if (!src) return ''
  if (!CLOUD_NAME) return src
  const transforms = ['f_auto', 'q_auto', ...(width ? [`w_${width},c_limit`] : [])].join(',')
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/${transforms}/${encodeURIComponent(src)}`
}
