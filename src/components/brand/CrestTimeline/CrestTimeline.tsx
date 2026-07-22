import { useState } from 'react'
import { motion } from 'motion/react'
import { ZoomIn } from 'lucide-react'

import { cn } from '@/lib/cn'
import { crests } from '@/data/crests'
import { Picture } from '@/components/media/Picture/Picture'
import { Badge } from '@/components/primitives/Badge/Badge'
import { Lightbox } from '@/components/media/Lightbox/Lightbox'

export function CrestTimeline() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const slides = crests.map((crest) => crest.image)

  return (
    <>
      <ul className="flex flex-col items-stretch gap-6 lg:flex-row-reverse lg:items-end lg:justify-center lg:gap-6">
        {crests.map((crest, index) => (
          <motion.li
            key={crest.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
            className={cn('flex flex-col items-center gap-3', crest.isCurrent && 'lg:-mb-2')}
          >
            <button
              type="button"
              onClick={() => {
                setLightboxIndex(index)
              }}
              aria-label={`Ampliar ${crest.stageLabel.toLowerCase()}`}
              className={cn(
                'group relative block overflow-hidden rounded-(--radius-lg) border bg-plaque p-3 shadow-[var(--shadow-md)] transition-transform duration-200 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-canvas) focus-visible:outline-none',
                crest.isCurrent
                  ? 'w-40 border-brand ring-2 ring-brand sm:w-48 lg:w-52'
                  : 'w-28 border-line sm:w-32 lg:w-36',
              )}
            >
              <Picture image={crest.image} imgClassName="w-full" />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[color-mix(in_oklab,var(--color-canvas)_55%,transparent)] text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
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
