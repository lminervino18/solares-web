import { Trophy } from 'lucide-react'

import { cn } from '@/lib/cn'
import type { Championship } from '../types/championships'

export type TournamentLogoSize = 'md' | 'lg'

export type TournamentLogoProps = {
  championship: Championship
  size?: TournamentLogoSize
  className?: string
}

const FRAME_SIZE: Record<TournamentLogoSize, string> = {
  md: 'size-16 p-1.5',
  lg: 'size-24 p-2 sm:size-28',
}

function initials(value: string): string {
  const words = value
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean)
  const letters = words.slice(0, 2).map((word) => word.charAt(0).toUpperCase())
  return letters.join('') || '·'
}

export function TournamentLogo({ championship, size = 'md', className }: TournamentLogoProps) {
  const { assets, league, name } = championship

  if (assets.tournamentLogo) {
    return (
      <div
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-(--radius-md) border border-line bg-surface',
          FRAME_SIZE[size],
          className,
        )}
      >
        <img
          src={assets.tournamentLogo}
          alt={assets.tournamentLogoAlt ?? (league ? `Logo de ${league}` : `Logo de ${name}`)}
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-0.5 rounded-(--radius-md) border border-line bg-surface-elevated',
        FRAME_SIZE[size],
        className,
      )}
      role="img"
      aria-label={`Logo del torneo ${league ?? name} todavía no disponible`}
    >
      <Trophy className="size-4 text-muted" aria-hidden="true" />
      <span className="text-[length:var(--font-size-sm)] font-bold text-secondary">
        {initials(league ?? name)}
      </span>
    </div>
  )
}
