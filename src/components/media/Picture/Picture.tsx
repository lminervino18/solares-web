import { cn } from '@/lib/cn'
import type { PictureSource } from '@/types/brand'

export type PictureProps = {
  image: PictureSource
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  sizes?: string
  className?: string
  imgClassName?: string
}

export function Picture({
  image,
  loading = 'lazy',
  fetchPriority,
  sizes,
  className,
  imgClassName,
}: PictureProps) {
  return (
    <picture className={className}>
      <source srcSet={image.webp} type="image/webp" {...(sizes ? { sizes } : {})} />
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={loading}
        decoding="async"
        className={cn('h-auto max-w-full', imgClassName)}
        {...(fetchPriority ? { fetchPriority } : {})}
        {...(sizes ? { sizes } : {})}
      />
    </picture>
  )
}
