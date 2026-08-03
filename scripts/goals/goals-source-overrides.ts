/**
 * Keyed by the source path relative to the goals root; wins over the parser.
 * Use it only when the file itself cannot be fixed. A wrong scorer is a wrong
 * file name: rename the file instead, which costs nothing because ids come from
 * the content, not the name.
 */
export type GoalSourceOverride = {
  readonly scorerName?: string
  readonly competitionName?: string
  readonly skip?: true
  readonly reason?: string
}

export const GOAL_SOURCE_OVERRIDES: Readonly<Record<string, GoalSourceOverride>> = {
  'F5/Apertura_2026-Lorenzo_Minervino-04.mp4': {
    skip: true,
    reason:
      'Same goal as Apertura_2026-Lorenzo_Minervino-01, re-encoded with an @solares.futbol watermark and a lower bitrate. Content hashes differ, so only a visual comparison finds it.',
  },
  'F5/Clausura_2025-Lucas_Iriarte-00.mp4': {
    skip: true,
    reason:
      'Same goal as Clausura_2025-Lucas_Iriarte-08, which is kept: this copy carries a site watermark across the top edge and a lower bitrate. Identical duration, so only a visual comparison finds it.',
  },
}
