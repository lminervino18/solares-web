import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

import type { LightboxSlide } from './types'

export type LightboxContentProps = {
  slides: readonly LightboxSlide[]
  index: number
  onClose: () => void
}

export default function LightboxContent({ slides, index, onClose }: LightboxContentProps) {
  return (
    <Lightbox
      open
      close={onClose}
      index={index}
      slides={slides.map((slide) => ({
        src: slide.src,
        alt: slide.alt,
        width: slide.width,
        height: slide.height,
      }))}
      styles={{
        container: {
          backgroundColor: 'color-mix(in oklab, var(--color-canvas) 94%, transparent)',
        },
      }}
    />
  )
}
