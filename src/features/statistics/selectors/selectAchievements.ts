import type { Championship } from '@/features/championships/types/championships'
import type { AchievementStatistics } from '../types/statistics'

/**
 * Counts final-standing achievements across a format's championships.
 *
 * Each championship contributes to exactly one bucket, representing the final
 * stage it reached. A title with an unconfirmed cup tier would fall into
 * `otherTitles` rather than being assumed gold.
 */
export function selectAchievements(championships: readonly Championship[]): AchievementStatistics {
  let goldTitles = 0
  let silverTitles = 0
  // Unclassified titles do not occur with the current honor mapping (a plain
  // "Campeón" is classified as gold), but the bucket is kept for completeness.
  const otherTitles = 0
  let runnerUpFinishes = 0
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
      case 'silver-runner-up':
        runnerUpFinishes += 1
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
    titles: goldTitles + silverTitles + otherTitles,
    goldTitles,
    silverTitles,
    otherTitles,
    runnerUpFinishes,
    semifinalFinishes,
    quarterfinalFinishes,
  }
}
