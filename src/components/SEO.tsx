import { useEffect } from 'react'

export const SITE_URL = 'https://bookmydreamland.com'
export const SITE_NAME = 'Dreamland Resort Karnal'
export const DEFAULT_IMAGE = `${SITE_URL}/photos/0D9A9998.jpeg`

interface Props {
  title: string
  description: string
  path: string
  image?: string
  noindex?: boolean
  type?: string
  jsonLd?: object | object[]
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLinkTag(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const JSONLD_ID = 'route-jsonld'

export default function SEO({ title, description, path, image, noindex, type = 'website', jsonLd }: Props) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`
    const ogImage = image ?? DEFAULT_IMAGE

    document.title = title
    setMetaTag('name', 'description', description)
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    setLinkTag('canonical', url)

    setMetaTag('property', 'og:type', type)
    setMetaTag('property', 'og:site_name', SITE_NAME)
    setMetaTag('property', 'og:title', title)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:image', ogImage)
    setMetaTag('property', 'og:url', url)

    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', title)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', ogImage)

    const existingJsonLd = document.getElementById(JSONLD_ID)
    if (existingJsonLd) existingJsonLd.remove()

    if (jsonLd) {
      const script = document.createElement('script')
      script.id = JSONLD_ID
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }

    return () => {
      document.getElementById(JSONLD_ID)?.remove()
    }
  }, [title, description, path, image, noindex, type, jsonLd])

  return null
}
