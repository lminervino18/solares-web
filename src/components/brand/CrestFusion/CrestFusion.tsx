import { type ReactNode } from 'react'
import { motion } from 'motion/react'

import { cn } from '@/lib/cn'
import {
  InteractiveCrest,
  type CrestZoom,
} from '@/components/brand/InteractiveCrest/InteractiveCrest'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import type { PictureSource } from '@/types/brand'

const SIGN_SHADOW =
  'drop-shadow(0 8px 16px color-mix(in oklab, var(--color-brand) 45%, transparent))'

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

const groupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const crestProps = {
  size: 'md',
  shape: 'square',
  intensity: 'subtle',
  priority: false,
} as const

type FusionItemProps = {
  animated: boolean
  children: ReactNode
}

function FusionItem({ animated, children }: FusionItemProps) {
  if (!animated) {
    return <div>{children}</div>
  }
  return <motion.div variants={itemVariants}>{children}</motion.div>
}

function FusionSign({ animated, symbol }: { animated: boolean; symbol: string }) {
  return (
    <FusionItem animated={animated}>
      <span
        aria-hidden="true"
        className={cn(
          'font-display leading-none font-bold text-brand',
          'text-[length:var(--font-size-xl)] sm:text-[length:var(--font-size-display-sm)]',
          'md:text-[length:var(--font-size-display-md)]',
        )}
        style={{ filter: SIGN_SHADOW }}
      >
        {symbol}
      </span>
    </FusionItem>
  )
}

export type FusionCrest = {
  crest: PictureSource
  zoom?: CrestZoom
}

export type CrestFusionProps = {
  left: FusionCrest
  right: FusionCrest
  result: FusionCrest
  label: string
  className?: string
}

export function CrestFusion({ left, right, result, label, className }: CrestFusionProps) {
  const prefersReducedMotion = useReducedMotionPreference()
  const animated = !prefersReducedMotion

  // The equation reads as one line at every width: stacking it vertically turned
  // "Cambalache + Solares = Cambalares" into three unrelated crests.
  const groupClassName = cn(
    'flex flex-row items-center justify-center gap-2 sm:gap-5 md:gap-8',
    className,
  )

  const content = (
    <>
      <FusionItem animated={animated}>
        <InteractiveCrest {...crestProps} {...left} />
      </FusionItem>
      <FusionSign animated={animated} symbol="+" />
      <FusionItem animated={animated}>
        <InteractiveCrest {...crestProps} {...right} />
      </FusionItem>
      <FusionSign animated={animated} symbol="=" />
      <FusionItem animated={animated}>
        <InteractiveCrest {...crestProps} {...result} />
      </FusionItem>
    </>
  )

  if (!animated) {
    return (
      <div role="group" aria-label={label} className={groupClassName}>
        {content}
      </div>
    )
  }

  return (
    <motion.div
      role="group"
      aria-label={label}
      variants={groupVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      className={groupClassName}
    >
      {content}
    </motion.div>
  )
}
