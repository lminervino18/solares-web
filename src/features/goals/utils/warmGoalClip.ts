const warmed = new Set<string>()

const WARM_BYTES = 262_144

type ConnectionInfo = { saveData?: boolean }

function prefersLessData(): boolean {
  const connection = (navigator as Navigator & { connection?: ConnectionInfo }).connection
  return connection?.saveData === true
}

/**
 * Requests a clip's opening bytes on intent (pointer over or finger down), so
 * the CDN edge is already warm by the time the card is actually opened. Each URL
 * is warmed once per session and never when the visitor asked to save data.
 */
export function warmGoalClip(url: string): void {
  if (warmed.has(url) || prefersLessData()) return
  warmed.add(url)

  void fetch(url, { headers: { Range: `bytes=0-${String(WARM_BYTES - 1)}` } }).catch(() => {
    warmed.delete(url)
  })
}
