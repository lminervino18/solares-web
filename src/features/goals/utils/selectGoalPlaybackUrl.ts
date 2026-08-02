import type { GoalVideo } from '../types/goals'

/**
 * Picks the clip rendition to play.
 *
 * Phones get the width-capped one: the full rendition is delivered at the source
 * width, which on a small screen is pixels the display cannot show. Manifests
 * built before that rendition existed fall back to the full one, so an outdated
 * manifest still plays.
 */
export function selectGoalPlaybackUrl(goal: GoalVideo, compact: boolean): string {
  if (!compact) return goal.cloudinary.playbackUrl
  return goal.cloudinary.compactPlaybackUrl ?? goal.cloudinary.playbackUrl
}
