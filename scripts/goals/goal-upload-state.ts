import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

/**
 * Local, resumable upload state for the goal clips.
 *
 * Keyed by the file content hash so a renamed file is still recognised and a
 * changed file is re-uploaded. Resumption is guaranteed at file level: a clip
 * interrupted mid-transfer restarts from the beginning on the next run. The
 * state never stores credentials, signatures or absolute paths.
 */

export const UPLOAD_STATE_PATH = '.cache/goals-upload-state.json'

const STATE_VERSION = 1

export type UploadEntryStatus = 'uploaded' | 'failed'

export type UploadEntry = {
  readonly status: UploadEntryStatus
  readonly publicId: string
  readonly attempts: number
  readonly updatedAt: string
  readonly bytes?: number
  readonly assetVersion?: number
  readonly format?: string
  readonly duration?: number
  readonly width?: number
  readonly height?: number
  readonly error?: string
}

export type UploadState = {
  version: number
  entries: Record<string, UploadEntry>
}

export function loadUploadState(path: string = UPLOAD_STATE_PATH): UploadState {
  if (!existsSync(path)) return { version: STATE_VERSION, entries: {} }
  try {
    const parsed: unknown = JSON.parse(readFileSync(path, 'utf-8'))
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'entries' in parsed &&
      typeof (parsed as UploadState).entries === 'object'
    ) {
      return { version: STATE_VERSION, entries: { ...(parsed as UploadState).entries } }
    }
  } catch {
    // A corrupted checkpoint must not block a run; it is rebuilt from scratch.
  }
  return { version: STATE_VERSION, entries: {} }
}

export function saveUploadState(state: UploadState, path: string = UPLOAD_STATE_PATH): void {
  mkdirSync(dirname(path), { recursive: true })
  const entries = Object.fromEntries(
    Object.entries(state.entries).sort(([a], [b]) => a.localeCompare(b)),
  )
  writeFileSync(path, `${JSON.stringify({ version: STATE_VERSION, entries }, null, 2)}\n`)
}

export function isAlreadyUploaded(state: UploadState, hash: string, publicId: string): boolean {
  const entry = state.entries[hash]
  return entry?.status === 'uploaded' && entry.publicId === publicId
}
