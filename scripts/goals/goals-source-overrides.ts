/**
 * Keyed by the source path relative to the goals root; wins over the parser.
 * Changing a scorer changes the Cloudinary public id and orphans the old asset:
 * run `npm run goals:verify`, then `npm run goals:prune`.
 */
export type GoalSourceOverride = {
  readonly scorerName?: string
  readonly competitionName?: string
  readonly skip?: true
  readonly reason?: string
}

export const GOAL_SOURCE_OVERRIDES: Readonly<Record<string, GoalSourceOverride>> = {
  // Four clips were exported under the wrong scorer's name. The parser read the
  // file names correctly; the names themselves are wrong. Corrections confirmed
  // by the club and consistent with the spreadsheet scorer tallies.
  'F8/Apertura_2025-Pablo_Kunz-00.mp4': {
    scorerName: 'Ariel Atienza',
    reason:
      'Exported under the wrong scorer. Ariel Atienza has one Apertura 2025 goal in the spreadsheet and had no video until this correction.',
  },
  'F8/Clausura_2024-Lorenzo_Minervino-07.mp4': {
    scorerName: 'Lucas Pranteda',
    reason: 'Exported under the wrong scorer. Confirmed by the club.',
  },
  'F5/Clausura_2025-Luca_Crivaro-00.mp4': {
    scorerName: 'Agustin Di Yacovo',
    reason: 'Exported under the wrong scorer. Confirmed by the club.',
  },
  'F5/Clausura_2025-Agustin_Di_Yacovo-06.mp4': {
    scorerName: 'Mauro Gonzalez',
    reason:
      'Exported under the wrong scorer. Mauro Gonzalez has two Clausura 2025 F5 goals in the spreadsheet and only one video until this correction.',
  },

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
