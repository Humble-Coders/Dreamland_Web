import { useState } from 'react'

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
}

// Drop-in replacement for <img> that fades in once loaded.
// Parent container must be positioned (relative/absolute) with a bg color so
// the dark placeholder shows while the image is fetching.
export default function Img({ src, alt, className = '', ...rest }: Props) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={src}
      alt={alt}
      className={`${className} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      onLoad={() => setLoaded(true)}
      {...rest}
    />
  )
}
