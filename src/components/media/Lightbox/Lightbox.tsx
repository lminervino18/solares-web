import { Suspense, lazy } from 'react'

import type { LightboxSlide } from './types'

const LightboxContent = lazy(() => import('./LightboxContent'))

export type LightboxProps = {
  open: boolean
  slides: readonly LightboxSlide[]
  index: number
  onClose: () => void
}

export function Lightbox({ open, slides, index, onClose }: LightboxProps) {
  if (!open) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <LightboxContent slides={slides} index={index} onClose={onClose} />
    </Suspense>
  )
}
