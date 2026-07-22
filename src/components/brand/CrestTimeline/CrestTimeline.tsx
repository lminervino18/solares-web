import { useState } from 'react'
import { motion } from 'motion/react'
import { ZoomIn } from 'lucide-react'

import { crests } from '@/data/crests'
import { Picture } from '@/components/media/Picture/Picture'
import { Badge } from '@/components/primitives/Badge/Badge'
import { Lightbox } from '@/components/media/Lightbox/Lightbox'

const CREST_SHADOW =
  'drop-shadow(0 10px 14px color-mix(in oklab, var(--palette-neutral-950) 55%, transparent))'

export function CrestTimeline() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const slides = crests.map((crest) => crest.image)

  return (
    <>
      <ul className="flex flex-col items-center gap-8 lg:flex-row-reverse lg:items-center lg:justify-center lg:gap-8">
        {crests.map((crest, index) => (
          <motion.li
            key={crest.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
            className="flex flex-col items-center gap-3"
          >
            <button
              type="button"
              onClick={() => {
                setLightboxIndex(index)
              }}
              aria-label={`Ampliar ${crest.stageLabel.toLowerCase()}`}
              className="group relative flex aspect-square w-28 items-center justify-center rounded-(--radius-lg) transition-transform duration-200 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-canvas) focus-visible:outline-none sm:w-32 lg:w-40"
            >
              <span
                className="flex size-full items-center justify-center"
                style={{ filter: CREST_SHADOW }}
              >
                <Picture
                  image={crest.image}
                  imgClassName="max-h-full w-auto max-w-full object-contain"
                />
              </span>
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-(--radius-lg) bg-[color-mix(in_oklab,var(--color-canvas)_45%,transparent)] text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                <ZoomIn aria-hidden="true" className="size-6" />
              </span>
            </button>
            {crest.isCurrent ? (
              <Badge tone="brand" variant="solid" size="sm">
                Escudo actual
              </Badge>
            ) : null}
          </motion.li>
        ))}
      </ul>

      <Lightbox
        open={lightboxIndex !== null}
        slides={slides}
        index={lightboxIndex ?? 0}
        onClose={() => {
          setLightboxIndex(null)
        }}
      />
    </>
  )
}
