import { useState } from 'react'
import { ImageOff, ZoomIn } from 'lucide-react'

import { logoIcon } from '@/data/brand'
import { cn } from '@/lib/cn'
import { Picture } from '@/components/media/Picture/Picture'
import { Lightbox } from '@/components/media/Lightbox/Lightbox'
import type { Championship } from '../types/championships'
import { FOOTBALL_FORMAT_LONG_LABEL } from '@/config/football-format'

export type ChampionshipTeamPhotoProps = {
  championship: Championship
  priority?: boolean
  className?: string
}

const FRAME =
  'relative aspect-[4/3] w-full overflow-hidden rounded-(--radius-xl) border border-line bg-surface'

/**
 * Renders the championship team photo, or an accessible placeholder that keeps
 * the same frame so no layout shift occurs when a real photo is added later.
 * The image is contained (never cropped) so faces are preserved, and it opens
 * full size in a lightbox.
 */
export function ChampionshipTeamPhoto({
  championship,
  priority = false,
  className,
}: ChampionshipTeamPhotoProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { assets } = championship

  if (assets.teamPhoto && assets.teamPhotoWebp && assets.teamPhotoWidth && assets.teamPhotoHeight) {
    const photo = {
      src: assets.teamPhoto,
      webp: assets.teamPhotoWebp,
      width: assets.teamPhotoWidth,
      height: assets.teamPhotoHeight,
      alt: assets.teamPhotoAlt ?? `Plantel de Solares en ${championship.name}`,
    }

    return (
      <>
        <button
          type="button"
          onClick={() => {
            setIsOpen(true)
          }}
          aria-label={`Ampliar imagen: ${photo.alt}`}
          className={cn(
            FRAME,
            'group block focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-canvas) focus-visible:outline-none',
            className,
          )}
        >
          <Picture
            image={photo}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            sizes="(min-width: 1024px) 640px, 100vw"
            className="absolute inset-0 flex h-full w-full items-center justify-center"
            imgClassName="h-full w-full object-contain"
          />
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
      </>
    )
  }

  return (
    <div
      className={cn(
        FRAME,
        'flex flex-col items-center justify-center gap-3 px-6 text-center',
        className,
      )}
      role="img"
      aria-label={`Foto del plantel de ${championship.name} todavía no disponible`}
    >
      <img src={logoIcon.src} alt="" aria-hidden="true" className="size-14 opacity-40" />
      <ImageOff className="size-6 text-muted" aria-hidden="true" />
      <p className="text-[length:var(--font-size-sm)] font-medium text-secondary">
        Foto del plantel todavía no disponible
      </p>
      <p className="text-[length:var(--font-size-xs)] text-muted">
        {championship.name} · {FOOTBALL_FORMAT_LONG_LABEL[championship.format]}
      </p>
    </div>
  )
}
