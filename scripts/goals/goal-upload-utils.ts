/**
 * Shared helpers for the Cloudinary goal upload.
 *
 * Nothing here reads, formats or logs credentials: the Cloudinary SDK picks up
 * `CLOUDINARY_URL` from the environment on its own and the value never travels
 * through this module.
 */

const TAG_UNSAFE = /[^a-zA-Z0-9_:-]+/g
const CONTEXT_UNSAFE = /[=|]/g

export function sanitizeTag(value: string): string {
  return value.replace(TAG_UNSAFE, '-').replace(/^-+|-+$/g, '')
}

export function sanitizeContextValue(value: string): string {
  return value.replace(CONTEXT_UNSAFE, ' ').trim()
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`
}

/**
 * Authentication and permission failures are permanent: retrying them only
 * burns quota and risks locking the account, so they abort the file instead.
 */
export function isPermanentError(error: unknown): boolean {
  const status = readErrorStatus(error)
  return status === 401 || status === 403 || status === 420
}

export function readErrorStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) return undefined
  if ('http_code' in error) {
    const code = (error as { http_code: unknown }).http_code
    if (typeof code === 'number') return code
  }
  if ('error' in error) return readErrorStatus((error as { error: unknown }).error)
  return undefined
}

/**
 * Cloudinary errors can carry the signed request that produced them, so only a
 * short message is ever surfaced or written to the checkpoint.
 */
export function readErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message.slice(0, 200)
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message).slice(0, 200)
  }
  if (typeof error === 'object' && error !== null && 'error' in error) {
    return readErrorMessage((error as { error: unknown }).error)
  }
  return 'Unknown upload error'
}

export async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
