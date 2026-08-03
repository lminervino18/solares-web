import { existsSync, readdirSync } from 'node:fs'
import { extname, join } from 'node:path'

export const GOALS_INTAKE_ROOT = 'content/incoming/goals'

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

/** Emptiness matters, not existence: the intake folders are committed empty. */
export function resolveGoalsRoot(): string {
  return holdsClips(GOALS_INTAKE_ROOT) ? GOALS_INTAKE_ROOT : GOALS_LEGACY_ROOT
}

export function resolveFormatDirectory(root: string, format: 'f8' | 'f5'): string | undefined {
  const match = formatFolders(root).find((name) => name.toLowerCase() === format)
  return match ? join(root, match) : undefined
}
