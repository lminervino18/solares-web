import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

export const GOALS_ROOT = 'content/incoming/goals'

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

/** Either casing works, so a collection created as `F8` and one as `f8` both resolve. */
export function resolveFormatDirectory(root: string, format: 'f8' | 'f5'): string | undefined {
  const match = formatFolders(root).find((name) => name.toLowerCase() === format)
  return match ? join(root, match) : undefined
}
