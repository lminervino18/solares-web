import { useState } from 'react'
import { ZoomIn } from 'lucide-react'

import { cn } from '@/lib/cn'
import { Picture } from '@/components/media/Picture/Picture'
import { Lightbox } from '@/components/media/Lightbox/Lightbox'
import type { HistoryPhoto } from '@/types/history'

export type HistoryFigureProps = {
  photo: HistoryPhoto
  className?: string
}

export function HistoryFigure({ photo, className }: HistoryFigureProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <figure className={cn('m-0', className)}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true)
        }}
        aria-label={`Ampliar imagen: ${photo.alt}`}
        className="group relative block w-full overflow-hidden rounded-(--radius-lg) border border-line focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-canvas) focus-visible:outline-none"
      >
        <Picture image={photo} imgClassName="w-full" />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[color-mix(in_oklab,var(--color-canvas)_35%,transparent)] text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <ZoomIn aria-hidden="true" className="size-7" />
        </span>
      </button>

      <Lightbox
        open={isOpen}
        slides={[photo]}
        index={0}
        onClose={() => {
          setIsOpen(false)
        }}
      />
    </figure>
  )
}
