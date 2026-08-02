/**
 * Explicit resolutions for individual goal files, keyed by the source path
 * relative to the goals root (for example `F8/Apertura_2026-Lorenzo-0.mp4`).
 *
 * An override wins over the parser, so it covers three cases:
 *
 * 1. The parser reports the file as ambiguous or unresolved.
 * 2. The file name is wrong — the clip was exported under another player's name.
 *    Record who confirmed the correction; never guess a scorer.
 * 3. `skip` removes a clip from the collection without deleting the file, for a
 *    re-encode of a goal already published under another name.
 *
 * Never use an override to merge two spellings of the same name: that is an
 * alias (`src/features/goals/data/goal-scorer-aliases.ts`).
 *
 * Changing a scorer changes the Cloudinary public id, so the clip is uploaded
 * again under the new id and the old asset is left orphaned. Run
 * `npm run goals:verify` to see it and `npm run goals:prune` to review deleting
 * it. The goal id is content-derived and does not change, so shared links keep
 * working.
 */
export type GoalSourceOverride = {
  readonly scorerName?: string
  readonly competitionName?: string
  readonly skip?: true
  /** Why the entry exists, so a future reader does not have to guess. */
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
