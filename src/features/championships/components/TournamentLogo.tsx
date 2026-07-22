import { Trophy } from 'lucide-react'

import { cn } from '@/lib/cn'
import type { Championship } from '../types/championships'

export type TournamentLogoProps = {
  championship: Championship
  className?: string
}

function initials(value: string): string {
  const words = value
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean)
  const letters = words.slice(0, 2).map((word) => word.charAt(0).toUpperCase())
  return letters.join('') || '·'
}

/**
 * Renders the league/tournament logo (PNG, contained, no filters) or an
 * accessible placeholder with the tournament initials. A missing logo never
 * borrows another tournament's image.
 */
export function TournamentLogo({ championship, className }: TournamentLogoProps) {
  const { assets, league, name } = championship

  if (assets.tournamentLogo) {
    return (
      <div
        className={cn(
          'flex size-16 items-center justify-center overflow-hidden rounded-(--radius-md) border border-line bg-surface p-1.5',
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
        'flex size-16 flex-col items-center justify-center gap-0.5 rounded-(--radius-md) border border-line bg-surface-elevated',
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
