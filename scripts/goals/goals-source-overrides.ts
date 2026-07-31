/**
 * Explicit resolutions for goal files whose name cannot be classified safely.
 *
 * Keyed by the source path relative to the goals root (for example
 * `F8/Apertura_2026-Lorenzo_Minervino-0.mp4`). Only add an entry when the
 * deterministic parser reports the file as ambiguous or unresolved — never to
 * merge two spellings that should become an alias instead.
 *
 * Empty while every local file name parses cleanly.
 */
export type GoalSourceOverride = {
  readonly scorerName?: string
  readonly competitionName?: string
  readonly skip?: true
}

export const GOAL_SOURCE_OVERRIDES: Readonly<Record<string, GoalSourceOverride>> = {}
