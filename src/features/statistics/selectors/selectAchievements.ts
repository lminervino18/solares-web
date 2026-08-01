import type { Championship } from '@/features/championships/types/championships'
import type { AchievementStatistics } from '../types/statistics'

/**
 * Counts final-standing achievements across a format's championships.
 *
 * Each championship contributes to exactly one bucket, representing the final
 * stage it reached. Titles and runner-up finishes keep their gold and silver
 * brackets apart, because they are different competitions.
 */
export function selectAchievements(championships: readonly Championship[]): AchievementStatistics {
  let goldTitles = 0
  let silverTitles = 0
  let goldRunnerUpFinishes = 0
  let silverRunnerUpFinishes = 0
  let semifinalFinishes = 0
  let quarterfinalFinishes = 0

  for (const championship of championships) {
    switch (championship.honorType) {
      case 'gold-champion':
        goldTitles += 1
        break
      case 'silver-champion':
        silverTitles += 1
        break
      case 'gold-runner-up':
        goldRunnerUpFinishes += 1
        break
      case 'silver-runner-up':
        silverRunnerUpFinishes += 1
        break
      case 'semifinalist':
        semifinalFinishes += 1
        break
      case 'quarterfinalist':
        quarterfinalFinishes += 1
        break
      default:
        break
    }
  }

  return {
    titles: goldTitles + silverTitles,
    goldTitles,
    silverTitles,
    runnerUpFinishes: goldRunnerUpFinishes + silverRunnerUpFinishes,
    goldRunnerUpFinishes,
    silverRunnerUpFinishes,
    semifinalFinishes,
    quarterfinalFinishes,
  }
}
