import { useCallback, useRef, useState } from 'react'

export const MIN_GOAL_ZOOM = 1
export const MAX_GOAL_ZOOM = 4
export const GOAL_ZOOM_STEP = 0.5

export type GoalZoom = {
  readonly scale: number
  readonly offsetX: number
  readonly offsetY: number
  readonly isZoomed: boolean
  readonly isPanning: boolean
  readonly zoomIn: () => void
  readonly zoomOut: () => void
  readonly reset: () => void
  readonly onPointerDown: (event: React.PointerEvent<HTMLElement>) => void
  readonly onPointerMove: (event: React.PointerEvent<HTMLElement>) => void
  readonly onPointerUp: (event: React.PointerEvent<HTMLElement>) => void
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function useGoalZoom(): GoalZoom {
  const [scale, setScale] = useState(MIN_GOAL_ZOOM)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const origin = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | undefined>(
    undefined,
  )

  const clampOffset = useCallback((next: { x: number; y: number }, nextScale: number) => {
    const limit = ((nextScale - 1) / 2) * 100
    return { x: clamp(next.x, -limit, limit), y: clamp(next.y, -limit, limit) }
  }, [])

  const zoomIn = useCallback(() => {
    setScale((current) => {
      const next = clamp(current + GOAL_ZOOM_STEP, MIN_GOAL_ZOOM, MAX_GOAL_ZOOM)
      setOffset((currentOffset) => clampOffset(currentOffset, next))
      return next
    })
  }, [clampOffset])

  const zoomOut = useCallback(() => {
    setScale((current) => {
      const next = clamp(current - GOAL_ZOOM_STEP, MIN_GOAL_ZOOM, MAX_GOAL_ZOOM)
      setOffset((currentOffset) =>
        next === MIN_GOAL_ZOOM ? { x: 0, y: 0 } : clampOffset(currentOffset, next),
      )
      return next
    })
  }, [clampOffset])

  const reset = useCallback(() => {
    setScale(MIN_GOAL_ZOOM)
    setOffset({ x: 0, y: 0 })
  }, [])

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (scale <= MIN_GOAL_ZOOM) return
      event.currentTarget.setPointerCapture(event.pointerId)
      origin.current = { x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y }
      setIsPanning(true)
    },
    [scale, offset],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const start = origin.current
      if (start === undefined || scale <= MIN_GOAL_ZOOM) return
      const bounds = event.currentTarget.getBoundingClientRect()
      if (bounds.width === 0 || bounds.height === 0) return

      const deltaX = ((event.clientX - start.x) / bounds.width) * 100
      const deltaY = ((event.clientY - start.y) / bounds.height) * 100
      setOffset(clampOffset({ x: start.offsetX + deltaX, y: start.offsetY + deltaY }, scale))
    },
    [scale, clampOffset],
  )

  const onPointerUp = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    origin.current = undefined
    setIsPanning(false)
  }, [])

  return {
    scale,
    offsetX: offset.x,
    offsetY: offset.y,
    isZoomed: scale > MIN_GOAL_ZOOM,
    isPanning,
    zoomIn,
    zoomOut,
    reset,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }
}
