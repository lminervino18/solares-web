import { useState } from 'react'
import { motion } from 'motion/react'
import { ZoomIn } from 'lucide-react'

import { kits } from '@/data/kits'
import { Picture } from '@/components/media/Picture/Picture'
import { Text } from '@/components/primitives/Text/Text'
import { Lightbox } from '@/components/media/Lightbox/Lightbox'

export function KitGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const slides = kits.map((kit) => kit.image)

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {kits.map((kit, index) => (
          <motion.li
            key={kit.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.35, delay: (index % 4) * 0.04 }}
            className="flex flex-col gap-3"
          >
            <button
              type="button"
              onClick={() => {
                setLightboxIndex(index)
              }}
              aria-label={`Ampliar ${kit.label.toLowerCase()}`}
              className="group relative block overflow-hidden rounded-(--radius-lg) border border-line bg-plaque shadow-[var(--shadow-sm)] transition-transform duration-200 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-canvas) focus-visible:outline-none"
            >
              <Picture image={kit.image} imgClassName="w-full" />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[color-mix(in_oklab,var(--color-canvas)_45%,transparent)] text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                <ZoomIn aria-hidden="true" className="size-6" />
              </span>
            </button>
            <Text size="sm" tone="secondary" weight="medium" className="text-center">
              {kit.label}
            </Text>
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
