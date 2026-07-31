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

const SIZE: Record<CrestSize, string> = {
  sm: 'max-w-[9rem]',
  md: 'max-w-[13rem]',
  lg: 'max-w-[18rem]',
}

const CREST_SHADOW =
  'drop-shadow(0 16px 20px color-mix(in oklab, var(--palette-neutral-950) 65%, transparent)) drop-shadow(0 8px 26px color-mix(in oklab, var(--color-brand) 34%, transparent))'

export type CrestSize = 'sm' | 'md' | 'lg'
export type CrestIntensity = 'subtle' | 'full'

export type InteractiveCrestProps = {
  crest: PictureSource
  /** Shown on the reverse side. Defaults to the front crest when the team has no back design. */
  back?: PictureSource
  size?: CrestSize
  intensity?: CrestIntensity
  priority?: boolean
  className?: string
}

export function InteractiveCrest({
  crest,
  back,
  size = 'lg',
  intensity = 'full',
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

  if (prefersReducedMotion) {
    return (
      <div className={cn('mx-auto w-full', SIZE[size], className)}>
        <div style={{ filter: CREST_SHADOW }}>
          <Picture image={crest} loading={loading} {...frontPriority} imgClassName="w-full" />
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
    <div className={cn('mx-auto w-full [perspective:1100px]', SIZE[size], className)}>
      <div onPointerMove={handlePointerMove} onPointerLeave={resetRotation} className="touch-none">
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d', filter: CREST_SHADOW }}
          className="relative"
        >
          <div className="[backface-visibility:hidden]">
            <Picture image={crest} loading={loading} {...frontPriority} imgClassName="w-full" />
          </div>
          <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <Picture image={{ ...backImage, alt: '' }} loading={loading} imgClassName="w-full" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
