import { motion } from 'motion/react'

import { historyPhotos } from '@/data/history'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { HistoryFigure } from './HistoryFigure'
import { HistoryGallery } from './HistoryGallery'
import type { HistoryChapter as HistoryChapterModel } from '@/types/history'

export type HistoryChapterProps = {
  chapter: HistoryChapterModel
}

export function HistoryChapter({ chapter }: HistoryChapterProps) {
  const titleId = `${chapter.id}-title`

  return (
    <motion.section
      id={chapter.id}
      aria-labelledby={titleId}
      className="mx-auto max-w-[54rem] scroll-mt-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.5 }}
    >
      <Heading as="h2" id={titleId} size="display-sm">
        {chapter.title}
      </Heading>

      <div className="mt-6 space-y-6">
        {chapter.blocks.map((block, index) => {
          const key = `${chapter.id}-block-${String(index)}`

          if (block.type === 'paragraph') {
            return (
              <Text
                key={key}
                as="p"
                size="lg"
                tone="secondary"
                leading="relaxed"
                className="max-w-[44rem] text-pretty"
              >
                {block.text}
              </Text>
            )
          }

          if (block.type === 'figure') {
            const photo = historyPhotos[block.photoId]
            if (!photo) {
              return null
            }
            return <HistoryFigure key={key} photo={photo} className="my-8" />
          }

          const photos = block.photoIds
            .map((photoId) => historyPhotos[photoId])
            .filter((photo): photo is NonNullable<typeof photo> => photo !== undefined)

          if (photos.length === 0) {
            return null
          }

          return (
            <div key={key} className="my-8">
              <HistoryGallery photos={photos} label={`Galería del capítulo ${chapter.title}`} />
            </div>
          )
        })}
      </div>
    </motion.section>
  )
}
