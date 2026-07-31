import { useState } from 'react'
import { ZoomIn } from 'lucide-react'

import { cn } from '@/lib/cn'
import { Picture } from '@/components/media/Picture/Picture'
import { Lightbox } from '@/components/media/Lightbox/Lightbox'
import type { PictureSource } from '@/types/brand'

export type EditorialGalleryPhoto = PictureSource & { id: string }

export type EditorialGalleryProps = {
  photos: readonly EditorialGalleryPhoto[]
  label: string
  columns?: 1 | 2
  /** Crops every photo to a shared 4:3 box. Disable to keep the original aspect ratio. */
  crop?: boolean
  withLightbox?: boolean
  loading?: 'lazy' | 'eager'
  className?: string
}

export function EditorialGallery({
  photos,
  label,
  columns = 2,
  crop = true,
  withLightbox = true,
  loading = 'lazy',
  className,
}: EditorialGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (photos.length === 0) {
    return null
  }

  const imgClassName = crop ? 'aspect-[4/3] w-full object-cover' : 'w-full'

  return (
    <div role="group" aria-label={label} className={className}>
      <ul className={cn('grid grid-cols-1 gap-4', columns === 2 && 'sm:grid-cols-2')}>
        {photos.map((photo, index) => (
          <li
            key={photo.id}
            className={cn(
              columns === 2 &&
                photos.length % 2 === 1 &&
                index === photos.length - 1 &&
                'sm:col-span-2',
            )}
          >
            {withLightbox ? (
              <button
                type="button"
                onClick={() => {
                  setLightboxIndex(index)
                }}
                aria-label={`Ampliar imagen: ${photo.alt}`}
                className="group relative block w-full overflow-hidden rounded-(--radius-lg) border border-line focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-canvas) focus-visible:outline-none"
              >
                <Picture image={photo} loading={loading} imgClassName={imgClassName} />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[color-mix(in_oklab,var(--color-canvas)_35%,transparent)] text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <ZoomIn aria-hidden="true" className="size-7" />
                </span>
              </button>
            ) : (
              <div className="overflow-hidden rounded-(--radius-lg) border border-line">
                <Picture image={photo} loading={loading} imgClassName={imgClassName} />
              </div>
            )}
          </li>
        ))}
      </ul>

      {withLightbox ? (
        <Lightbox
          open={lightboxIndex !== null}
          slides={photos}
          index={lightboxIndex ?? 0}
          onClose={() => {
            setLightboxIndex(null)
          }}
        />
      ) : null}
    </div>
  )
}
