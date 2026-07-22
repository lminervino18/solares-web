import { ImageOff } from 'lucide-react'

import { logoIcon } from '@/data/brand'
import { cn } from '@/lib/cn'
import { Picture } from '@/components/media/Picture/Picture'
import type { Championship } from '../types/championships'
import { FOOTBALL_FORMAT_LONG_LABEL } from '../utils/championshipLabels'

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
 * The image is contained (never cropped) so faces are preserved.
 */
export function ChampionshipTeamPhoto({
  championship,
  priority = false,
  className,
}: ChampionshipTeamPhotoProps) {
  const { assets } = championship

  if (assets.teamPhoto && assets.teamPhotoWebp && assets.teamPhotoWidth && assets.teamPhotoHeight) {
    return (
      <div className={cn(FRAME, className)}>
        <Picture
          image={{
            src: assets.teamPhoto,
            webp: assets.teamPhotoWebp,
            width: assets.teamPhotoWidth,
            height: assets.teamPhotoHeight,
            alt: assets.teamPhotoAlt ?? `Plantel de Solares en ${championship.name}`,
          }}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          sizes="(min-width: 1024px) 640px, 100vw"
          className="absolute inset-0 flex h-full w-full items-center justify-center"
          imgClassName="h-full w-full object-contain"
        />
      </div>
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
