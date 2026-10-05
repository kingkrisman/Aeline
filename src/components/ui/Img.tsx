import { useState } from 'react'
import { photo } from '../../lib/data'

/**
 * Image with a blur-up placeholder and a graceful fallback.
 * The wrapper keeps a tinted gradient underneath, so a slow or failed
 * load still reads as an intentional surface rather than a hole.
 */
export function Img({
  id,
  alt,
  className = '',
  width = 1200,
  priority = false,
  parallaxClass = '',
}: {
  id: string
  alt: string
  className?: string
  width?: number
  priority?: boolean
  parallaxClass?: string
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <span
      aria-hidden={failed ? 'true' : undefined}
      className="absolute inset-0 block overflow-hidden bg-[linear-gradient(140deg,#3d5a3a,#22321f_60%,#141c16)]"
    >
      {!failed && (
        <img
          src={photo(id, width)}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={[
            'h-full w-full object-cover select-none',
            // Blur-up: the only transition here, and it costs nothing to skip
            'transition-[opacity,filter] duration-700 ease-out',
            loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-lg',
            parallaxClass,
            className,
          ].join(' ')}
        />
      )}
    </span>
  )
}
