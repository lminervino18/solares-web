import { useState, type CSSProperties, type ImgHTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

const objectFitClass: Record<ObjectFit, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
}

export type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'style' | 'alt'> & {
  alt: string
  aspectRatio?: string
  objectFit?: ObjectFit
  fallback?: ReactNode
  className?: string
}

export function ResponsiveImage({
  alt,
  aspectRatio,
  objectFit = 'cover',
  fallback,
  className,
  loading = 'lazy',
  ...props
}: ResponsiveImageProps) {
  const [hasError, setHasError] = useState(false)
  const style: CSSProperties | undefined = aspectRatio ? { aspectRatio } : undefined

  if (hasError && fallback) {
    return (
      <div className={cn('grid place-items-center bg-surface-elevated', className)} style={style}>
        {fallback}
      </div>
    )
  }

  return (
    <img
      alt={alt}
      loading={loading}
      decoding="async"
      style={style}
      className={cn('h-auto w-full', objectFitClass[objectFit], className)}
      onError={() => {
        setHasError(true)
      }}
      {...props}
    />
  )
}
