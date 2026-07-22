import { Award, Medal, Trophy, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/cn'
import { Heading } from '@/components/primitives/Heading/Heading'
import type { AchievementStatistics } from '../types/statistics'
import { formatInteger } from '../utils/formatNumber'

export type ChampionshipHonorsProps = {
  achievements: AchievementStatistics
  scopeLabel: string
}

type Honor = {
  key: string
  label: string
  value: number
  icon: LucideIcon
  iconClass: string
}

/**
 * Championship honors as a grid of tiles. Each final-standing type is counted
 * once; medal colours come from design tokens and the label carries meaning so
 * nothing depends on colour alone.
 */
export function ChampionshipHonors({ achievements, scopeLabel }: ChampionshipHonorsProps) {
  const honors: readonly Honor[] = [
    {
      key: 'gold',
      label: 'Campeón de Oro',
      value: achievements.goldTitles,
      icon: Trophy,
      iconClass: 'text-medal-gold',
    },
    {
      key: 'silver',
      label: 'Campeón de Plata',
      value: achievements.silverTitles,
      icon: Trophy,
      iconClass: 'text-medal-silver',
    },
    {
      key: 'other',
      label: 'Otros títulos',
      value: achievements.otherTitles,
      icon: Trophy,
      iconClass: 'text-secondary',
    },
    {
      key: 'runner-up',
      label: 'Subcampeonatos',
      value: achievements.runnerUpFinishes,
      icon: Medal,
      iconClass: 'text-medal-silver',
    },
    {
      key: 'semifinal',
      label: 'Semifinales',
      value: achievements.semifinalFinishes,
      icon: Award,
      iconClass: 'text-medal-bronze',
    },
    {
      key: 'quarterfinal',
      label: 'Cuartos de final',
      value: achievements.quarterfinalFinishes,
      icon: Award,
      iconClass: 'text-secondary',
    },
  ]

  return (
    <section aria-label={`Logros en campeonatos de ${scopeLabel}`}>
      <Heading as="h2" size="xl" className="mb-4">
        Logros en campeonatos
      </Heading>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {honors.map((honor) => {
          const Icon = honor.icon
          return (
            <div
              key={honor.key}
              className="flex items-center gap-3 rounded-(--radius-lg) border border-line bg-surface p-4"
            >
              <Icon className={cn('size-7 shrink-0', honor.iconClass)} aria-hidden="true" />
              <div>
                <dd className="text-[length:var(--font-size-xl)] font-bold text-primary tabular-nums">
                  {formatInteger(honor.value)}
                </dd>
                <dt className="text-[length:var(--font-size-xs)] text-secondary">{honor.label}</dt>
              </div>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
