import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { animate, motion, useMotionValue } from 'motion/react'

import { cn } from '@/lib/cn'
import { Picture } from '@/components/media/Picture/Picture'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import type { PictureSource } from '@/types/brand'

const MAX_ROTATE_Y = 55
const MAX_ROTATE_X = 35
const DRAG_SENSITIVITY = 0.5

const CREST_SHADOW =
  'drop-shadow(0 16px 20px color-mix(in oklab, var(--palette-neutral-950) 65%, transparent)) drop-shadow(0 8px 26px color-mix(in oklab, var(--color-brand) 34%, transparent))'

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export type InteractiveCrestProps = {
  crest: PictureSource
  className?: string
}

export function InteractiveCrest({ crest, className }: InteractiveCrestProps) {
  const prefersReducedMotion = useReducedMotionPreference()
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })

  if (prefersReducedMotion) {
    return (
      <div className={cn('mx-auto w-full max-w-[18rem]', className)}>
        <div style={{ filter: CREST_SHADOW }}>
          <Picture image={crest} loading="eager" fetchPriority="high" imgClassName="w-full" />
        </div>
      </div>
    )
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    isDragging.current = true
    lastPointer.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDragging.current) {
      return
    }
    const deltaX = event.clientX - lastPointer.current.x
    const deltaY = event.clientY - lastPointer.current.y
    lastPointer.current = { x: event.clientX, y: event.clientY }
    rotateY.set(clamp(rotateY.get() + deltaX * DRAG_SENSITIVITY, -MAX_ROTATE_Y, MAX_ROTATE_Y))
    rotateX.set(clamp(rotateX.get() - deltaY * DRAG_SENSITIVITY, -MAX_ROTATE_X, MAX_ROTATE_X))
  }

  function releasePointer() {
    if (!isDragging.current) {
      return
    }
    isDragging.current = false
    const spring = { type: 'spring', stiffness: 140, damping: 15 } as const
    animate(rotateX, 0, spring)
    animate(rotateY, 0, spring)
  }

  return (
    <div className={cn('mx-auto w-full max-w-[18rem] [perspective:1100px]', className)}>
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={releasePointer}
        onPointerLeave={releasePointer}
        className="cursor-grab touch-none active:cursor-grabbing"
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d', filter: CREST_SHADOW }}
        >
          <Picture image={crest} loading="eager" fetchPriority="high" imgClassName="w-full" />
        </motion.div>
      </div>
    </div>
  )
}
