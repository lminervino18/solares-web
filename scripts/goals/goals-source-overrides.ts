/**
 * Explicit resolutions for goal files whose name cannot be classified safely.
 *
 * Keyed by the source path relative to the goals root (for example
 * `F8/Apertura_2026-Lorenzo_Minervino-0.mp4`). Only add an entry when the
 * deterministic parser reports the file as ambiguous or unresolved — never to
 * merge two spellings that should become an alias instead.
 *
 * `skip` also removes a clip from the collection without deleting the file, for
 * a re-encode of a goal that is already published under another name.
 */
export type GoalSourceOverride = {
  readonly scorerName?: string
  readonly competitionName?: string
  readonly skip?: true
  /** Why the entry exists, so a future reader does not have to guess. */
  readonly reason?: string
}

export const GOAL_SOURCE_OVERRIDES: Readonly<Record<string, GoalSourceOverride>> = {
  'F5/Apertura_2026-Lorenzo_Minervino-04.mp4': {
    skip: true,
    reason:
      'Same goal as Apertura_2026-Lorenzo_Minervino-01, re-encoded with an @solares.futbol watermark and a lower bitrate. Content hashes differ, so only a visual comparison finds it.',
  },
}
