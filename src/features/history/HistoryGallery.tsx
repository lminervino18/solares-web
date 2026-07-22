import { useState } from 'react'
import { ZoomIn } from 'lucide-react'

import { Picture } from '@/components/media/Picture/Picture'
import { Lightbox } from '@/components/media/Lightbox/Lightbox'
import type { HistoryPhoto } from '@/types/history'

export type HistoryGalleryProps = {
  photos: readonly HistoryPhoto[]
  label: string
}

export function HistoryGallery({ photos, label }: HistoryGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <div role="group" aria-label={label}>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {photos.map((photo, index) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => {
                setLightboxIndex(index)
              }}
              aria-label={`Ampliar imagen: ${photo.alt}`}
              className="group relative block w-full overflow-hidden rounded-(--radius-lg) border border-line focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-canvas) focus-visible:outline-none"
            >
              <Picture image={photo} imgClassName="aspect-[4/3] w-full object-cover" />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[color-mix(in_oklab,var(--color-canvas)_35%,transparent)] text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                <ZoomIn aria-hidden="true" className="size-7" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        open={lightboxIndex !== null}
        slides={photos}
        index={lightboxIndex ?? 0}
        onClose={() => {
          setLightboxIndex(null)
        }}
      />
    </div>
  )
}
