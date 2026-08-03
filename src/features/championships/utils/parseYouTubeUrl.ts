import type { YouTubeVideo } from '../types/championships'
import { toCellString } from './normalizeCellValue'

const VIDEO_ID = /^[a-zA-Z0-9_-]{11}$/

const PATTERNS: readonly RegExp[] = [
  /(?:youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/,
  /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  /(?:youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
]

export function parseYouTubeUrl(value: unknown): YouTubeVideo | undefined {
  const text = toCellString(value)?.trim()
  if (text === undefined || text.length === 0) return undefined

  let videoId: string | undefined
  for (const pattern of PATTERNS) {
    const match = pattern.exec(text)
    if (match?.[1]) {
      videoId = match[1]
      break
    }
  }

  if (!videoId && VIDEO_ID.test(text)) {
    videoId = text
  }

  if (!videoId) return undefined

  return {
    videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
  }
}
