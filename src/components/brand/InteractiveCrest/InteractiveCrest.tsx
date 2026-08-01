import { type PointerEvent as ReactPointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

import { cn } from '@/lib/cn'
import { Picture } from '@/components/media/Picture/Picture'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import type { PictureSource } from '@/types/brand'

const SPRING = { stiffness: 40, damping: 16 }

const ROTATION: Record<CrestIntensity, { y: number; x: number }> = {
  full: { y: 130, x: 20 },
  subtle: { y: 26, x: 14 },
}

const NATURAL_SIZE: Record<CrestSize, string> = {
  sm: 'w-full max-w-[9rem]',
  md: 'w-full max-w-[13rem]',
  lg: 'w-full max-w-[18rem]',
}

const ZOOM: Record<CrestZoom, string> = {
  none: '',
  sm: 'scale-110',
  md: 'scale-[1.2]',
}

/** A square frame needs an explicit width so it does not depend on the loaded image. */
const SQUARE_SIZE: Record<CrestSize, string> = {
  sm: 'w-[9rem] max-w-full',
  md: 'w-[13rem] max-w-full',
  lg: 'w-[18rem] max-w-full',
}

const CREST_SHADOW =
  'drop-shadow(0 16px 20px color-mix(in oklab, var(--palette-neutral-950) 65%, transparent)) drop-shadow(0 8px 26px color-mix(in oklab, var(--color-brand) 34%, transparent))'

export type CrestSize = 'sm' | 'md' | 'lg'
export type CrestIntensity = 'subtle' | 'full'
export type CrestShape = 'natural' | 'square'
export type CrestZoom = 'none' | 'sm' | 'md'

export type InteractiveCrestProps = {
  crest: PictureSource
  /** Shown on the reverse side. Defaults to the front crest when the team has no back design. */
  back?: PictureSource
  size?: CrestSize
  intensity?: CrestIntensity
  /** `square` fits the crest inside a square box, so crests of different proportions match. */
  shape?: CrestShape
  /** Optical correction for artwork whose decorations shrink the body of the crest. */
  zoom?: CrestZoom
  priority?: boolean
  className?: string
}

export function InteractiveCrest({
  crest,
  back,
  size = 'lg',
  intensity = 'full',
  shape = 'natural',
  zoom = 'none',
  priority = true,
  className,
}: InteractiveCrestProps) {
  const prefersReducedMotion = useReducedMotionPreference()
  const limits = ROTATION[intensity]
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-limits.y, limits.y]), SPRING)
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [limits.x, -limits.x]), SPRING)

  const backImage = back ?? crest
  const loading = priority ? 'eager' : 'lazy'
  const frontPriority = priority ? { fetchPriority: 'high' as const } : {}
  const isSquare = shape === 'square'
  const frameClassName = isSquare ? SQUARE_SIZE[size] : NATURAL_SIZE[size]
  const faceClassName = isSquare ? 'flex size-full items-center justify-center' : undefined
  // The picture needs a definite height for `max-h-full` to resolve on the image.
  const pictureFrame = isSquare ? { className: 'flex size-full items-center justify-center' } : {}
  const imgClassName = cn(
    isSquare ? 'max-h-full w-auto max-w-full object-contain' : 'w-full',
    ZOOM[zoom],
  )

  if (prefersReducedMotion) {
    return (
      <div className={cn('mx-auto', frameClassName, className)}>
        <div
          className={cn(isSquare && 'flex aspect-square items-center justify-center')}
          style={{ filter: CREST_SHADOW }}
        >
          <Picture
            image={crest}
            loading={loading}
            {...frontPriority}
            {...pictureFrame}
            imgClassName={imgClassName}
          />
        </div>
      </div>
    )
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  function resetRotation() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <div className={cn('mx-auto [perspective:1100px]', frameClassName, className)}>
      <div onPointerMove={handlePointerMove} onPointerLeave={resetRotation} className="touch-none">
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d', filter: CREST_SHADOW }}
          className={cn('relative', isSquare && 'aspect-square')}
        >
          <div className={cn('[backface-visibility:hidden]', faceClassName)}>
            <Picture
              image={crest}
              loading={loading}
              {...frontPriority}
              {...pictureFrame}
              imgClassName={imgClassName}
            />
          </div>
          <div
            className={cn(
              'absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]',
              faceClassName,
            )}
          >
            <Picture
              image={{ ...backImage, alt: '' }}
              loading={loading}
              {...pictureFrame}
              imgClassName={imgClassName}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
