import type { PictureSource } from './brand'

export type HistoryPhoto = PictureSource & { id: string }

export type HistoryBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'figure'; photoId: string }
  | { type: 'gallery'; photoIds: readonly string[] }

export type HistoryChapter = {
  id: string
  title: string
  blocks: readonly HistoryBlock[]
}
