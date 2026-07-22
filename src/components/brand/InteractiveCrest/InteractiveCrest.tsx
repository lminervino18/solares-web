import { type PointerEvent as ReactPointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

import { cn } from '@/lib/cn'
import { Picture } from '@/components/media/Picture/Picture'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import type { PictureSource } from '@/types/brand'

const MAX_ROTATE_Y = 130
const MAX_ROTATE_X = 20
const SPRING = { stiffness: 40, damping: 16 }

const CREST_SHADOW =
  'drop-shadow(0 16px 20px color-mix(in oklab, var(--palette-neutral-950) 65%, transparent)) drop-shadow(0 8px 26px color-mix(in oklab, var(--color-brand) 34%, transparent))'

export type InteractiveCrestProps = {
  crest: PictureSource
  className?: string
}

export function InteractiveCrest({ crest, className }: InteractiveCrestProps) {
  const prefersReducedMotion = useReducedMotionPreference()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-MAX_ROTATE_Y, MAX_ROTATE_Y]),
    SPRING,
  )
  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [MAX_ROTATE_X, -MAX_ROTATE_X]),
    SPRING,
  )

  if (prefersReducedMotion) {
    return (
      <div className={cn('mx-auto w-full max-w-[18rem]', className)}>
        <div style={{ filter: CREST_SHADOW }}>
          <Picture image={crest} loading="eager" fetchPriority="high" imgClassName="w-full" />
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
    <div className={cn('mx-auto w-full max-w-[18rem] [perspective:1100px]', className)}>
      <div onPointerMove={handlePointerMove} onPointerLeave={resetRotation} className="touch-none">
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d', filter: CREST_SHADOW }}
          className="relative"
        >
          <div className="[backface-visibility:hidden]">
            <Picture image={crest} loading="eager" fetchPriority="high" imgClassName="w-full" />
          </div>
          <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <Picture image={crest} loading="eager" imgClassName="w-full" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
