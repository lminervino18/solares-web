import { existsSync, readdirSync } from 'node:fs'
import { extname, join } from 'node:path'

/**
 * Shared paths for the goals pipeline.
 *
 * These live apart from the scripts that use them so importing a constant never
 * runs another script's entry point as a side effect.
 */

/** Documented intake folder for new clips. */
export const GOALS_INTAKE_ROOT = 'content/incoming/goals'

/** Original location, kept working so an existing collection needs no move. */
export const GOALS_LEGACY_ROOT = 'Goles/web'

export const INSPECTION_REPORT_PATH = 'data/goals/goals-inspection.generated.json'
export const DUPLICATES_REPORT_PATH = 'data/goals/goals-duplicates.generated.json'
export const UPLOAD_REPORT_PATH = 'data/goals/goals-upload-report.generated.json'

export const SUPPORTED_GOAL_EXTENSIONS = new Set(['.mp4', '.mov', '.m4v', '.webm', '.avi', '.mkv'])

function formatFolders(root: string): readonly string[] {
  if (!existsSync(root)) return []
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^f[85]$/i.test(entry.name))
    .map((entry) => entry.name)
}

function holdsClips(root: string): boolean {
  return formatFolders(root).some((folder) =>
    readdirSync(join(root, folder), { withFileTypes: true }).some(
      (entry) => entry.isFile() && SUPPORTED_GOAL_EXTENSIONS.has(extname(entry.name).toLowerCase()),
    ),
  )
}

/**
 * Picks the goals root: the intake folder once it actually holds clips,
 * otherwise the legacy one. Emptiness matters, not existence — the intake
 * folders are committed empty, and choosing them while empty would silently
 * hide an existing collection. Only one root is read per run, so a clip is never
 * inspected twice under two source paths. Ids are content hashes, so moving a
 * collection between the two roots never re-uploads anything.
 */
export function resolveGoalsRoot(): string {
  return holdsClips(GOALS_INTAKE_ROOT) ? GOALS_INTAKE_ROOT : GOALS_LEGACY_ROOT
}

/**
 * Resolves the format subfolder inside a root, accepting either casing so a
 * collection created as `F8` and one created as `f8` both work.
 */
export function resolveFormatDirectory(root: string, format: 'f8' | 'f5'): string | undefined {
  const match = formatFolders(root).find((name) => name.toLowerCase() === format)
  return match ? join(root, match) : undefined
}
