import { Award, Medal, Trophy, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/cn'
import type { ChampionshipHonorType, TrophyTier } from '../types/championships'
import { HONOR_LABEL } from '../utils/championshipLabels'

export type ChampionshipHonorProps = {
  honorType: ChampionshipHonorType
  trophyTier: TrophyTier
  resultLabel?: string | undefined
  className?: string | undefined
}

type HonorStyle = {
  icon: LucideIcon
  iconClass: string
}

function resolveStyle(honorType: ChampionshipHonorType, trophyTier: TrophyTier): HonorStyle {
  if (trophyTier === 'gold') return { icon: Trophy, iconClass: 'text-medal-gold' }
  if (trophyTier === 'silver') return { icon: Trophy, iconClass: 'text-medal-silver' }
  if (honorType === 'gold-runner-up') return { icon: Medal, iconClass: 'text-medal-silver' }
  if (honorType === 'silver-runner-up') return { icon: Medal, iconClass: 'text-medal-silver' }
  if (honorType === 'semifinalist' || honorType === 'quarterfinalist') {
    return { icon: Award, iconClass: 'text-secondary' }
  }
  return { icon: Award, iconClass: 'text-muted' }
}

export function ChampionshipHonor({
  honorType,
  trophyTier,
  resultLabel,
  className,
}: ChampionshipHonorProps) {
  const { icon: Icon, iconClass } = resolveStyle(honorType, trophyTier)
  const label = resultLabel ?? HONOR_LABEL[honorType]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-(--radius-pill) border border-line bg-surface-elevated px-3 py-1.5',
        className,
      )}
    >
      <Icon className={cn('size-4 shrink-0', iconClass)} aria-hidden="true" />
      <span className="text-[length:var(--font-size-sm)] font-semibold text-primary">{label}</span>
    </span>
  )
}
