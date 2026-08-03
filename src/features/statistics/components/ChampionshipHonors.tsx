import { Award, Medal, Trophy, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/cn'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import type { AchievementStatistics } from '../types/statistics'
import { formatInteger } from '../utils/formatNumber'

export type ChampionshipHonorsProps = {
  achievements: AchievementStatistics
  scopeLabel: string
}

type Step = {
  key: string
  label: string
  value: number
  icon: LucideIcon
  iconClass: string
  stepClass: string
  valueClass: string
}

function buildNote(achievements: AchievementStatistics): string | undefined {
  const parts: string[] = []

  if (achievements.silverTitles > 0) {
    parts.push(
      achievements.silverTitles === 1
        ? '1 campeonato de Plata'
        : `${formatInteger(achievements.silverTitles)} campeonatos de Plata`,
    )
  }
  if (achievements.silverRunnerUpFinishes > 0) {
    parts.push(
      achievements.silverRunnerUpFinishes === 1
        ? '1 subcampeonato de Plata'
        : `${formatInteger(achievements.silverRunnerUpFinishes)} subcampeonatos de Plata`,
    )
  }
  if (achievements.quarterfinalFinishes > 0) {
    parts.push(
      achievements.quarterfinalFinishes === 1
        ? '1 cuartos de final'
        : `${formatInteger(achievements.quarterfinalFinishes)} cuartos de final`,
    )
  }

  if (parts.length === 0) return undefined
  if (parts.length === 1) return `${parts[0] ?? ''}.`
  return `${parts.slice(0, -1).join(', ')} y ${parts[parts.length - 1] ?? ''}.`
}

/**
 * Championship honors as a podium: the gold titles take the tallest step in the
 * centre, with gold runner-ups and semifinals at each side. The remaining
 * standings are summarised in a note below, so the podium only shows the three
 * stages that define a campaign. Labels carry the meaning, never colour alone.
 */
export function ChampionshipHonors({ achievements, scopeLabel }: ChampionshipHonorsProps) {
  const steps: readonly Step[] = [
    {
      key: 'runner-up',
      label: 'Subcampeonatos de Oro',
      value: achievements.goldRunnerUpFinishes,
      icon: Medal,
      iconClass: 'text-medal-silver',
      stepClass: 'h-24 sm:h-28',
      valueClass: 'text-[length:var(--font-size-display-sm)]',
    },
    {
      key: 'gold',
      label: 'Campeón de Oro',
      value: achievements.goldTitles,
      icon: Trophy,
      iconClass: 'text-medal-gold',
      stepClass: 'h-36 sm:h-44',
      valueClass: 'text-[length:var(--font-size-display-md)]',
    },
    {
      key: 'semifinal',
      label: 'Semifinales',
      value: achievements.semifinalFinishes,
      icon: Award,
      iconClass: 'text-medal-bronze',
      stepClass: 'h-20 sm:h-24',
      valueClass: 'text-[length:var(--font-size-display-sm)]',
    },
  ]

  const note = buildNote(achievements)

  return (
    <section aria-label={`Logros en campeonatos de ${scopeLabel}`}>
      <Heading as="h2" size="xl" className="mb-4">
        Logros en campeonatos
      </Heading>

      <dl className="grid grid-cols-3 items-end gap-2 sm:gap-4">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div key={step.key} className="flex flex-col items-center">
              <Icon className={cn('mb-2 size-6 sm:size-8', step.iconClass)} aria-hidden="true" />
              <div
                className={cn(
                  'flex w-full flex-col-reverse items-center justify-center gap-1 rounded-t-(--radius-lg) border border-b-0 border-line bg-surface px-2 pt-3 pb-3 text-center',
                  step.stepClass,
                )}
              >
                <dt className="text-[length:var(--font-size-xs)] text-balance text-secondary">
                  {step.label}
                </dt>
                <dd
                  className={cn(
                    'font-display font-bold text-primary tabular-nums',
                    step.valueClass,
                  )}
                >
                  {formatInteger(step.value)}
                </dd>
              </div>
            </div>
          )
        })}
      </dl>
      <div className="h-2 rounded-b-(--radius-lg) border border-line bg-surface-elevated" />

      {note ? (
        <Text as="p" size="sm" tone="muted" className="mt-4">
          Además: {note}
        </Text>
      ) : null}
    </section>
  )
}
