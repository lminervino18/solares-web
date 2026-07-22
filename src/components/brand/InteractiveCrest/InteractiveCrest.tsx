import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

import { cn } from '@/lib/cn'
import { Picture } from '@/components/media/Picture/Picture'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import type { PictureSource } from '@/types/brand'

const MAX_TILT = 14
const SPRING = { stiffness: 220, damping: 20 }

export type InteractiveCrestProps = {
  crest: PictureSource
  className?: string
}

function CrestMedallion({ crest, className }: { crest: PictureSource; className?: string }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-(--radius-xl) border border-line bg-plaque p-4 shadow-[var(--shadow-lg)]',
        className,
      )}
    >
      <Picture image={crest} loading="eager" fetchPriority="high" imgClassName="w-full" />
    </div>
  )
}

export function InteractiveCrest({ crest, className }: InteractiveCrestProps) {
  const prefersReducedMotion = useReducedMotionPreference()
  const [isFlipped, setIsFlipped] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), SPRING)
  const rotateYTilt = useSpring(useTransform(pointerX, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), SPRING)

  if (prefersReducedMotion) {
    return (
      <div className={cn('mx-auto w-full max-w-[18rem]', className)}>
        <CrestMedallion crest={crest} />
      </div>
    )
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const element = buttonRef.current
    if (!element) {
      return
    }
    const rect = element.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  function resetTilt() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <div className={cn('mx-auto w-full max-w-[18rem] [perspective:1100px]', className)}>
      <motion.button
        ref={buttonRef}
        type="button"
        aria-pressed={isFlipped}
        aria-label="Girar el escudo de Solares"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        onBlur={resetTilt}
        onClick={() => {
          setIsFlipped((value) => !value)
        }}
        style={{ rotateX, rotateY: rotateYTilt, transformStyle: 'preserve-3d' }}
        whileTap={{ scale: 0.97 }}
        className="block w-full rounded-(--radius-xl) focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-4 focus-visible:ring-offset-(--color-canvas) focus-visible:outline-none"
      >
        <motion.div
          className="relative [transform-style:preserve-3d]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20 }}
        >
          <div className="[backface-visibility:hidden]">
            <CrestMedallion crest={crest} />
          </div>
          <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <CrestMedallion crest={crest} />
          </div>
        </motion.div>
      </motion.button>
    </div>
  )
}
