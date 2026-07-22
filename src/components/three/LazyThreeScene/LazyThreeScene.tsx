import { Suspense, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'

import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import { ThreeFallback } from '@/components/three/ThreeFallback/ThreeFallback'

export type LazyThreeSceneProps = {
  load: () => Promise<{ default: ComponentType }>
  label: string
  fallback?: ReactNode
}

/**
 * Loads a Three.js scene only when it enters the viewport and motion is allowed.
 * Keeps the 3D dependencies out of pages that do not render a scene. When reduced
 * motion is preferred, the static fallback is shown instead of the interactive scene.
 */
export function LazyThreeScene({ load, label, fallback }: LazyThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [Scene, setScene] = useState<ComponentType | null>(null)
  const prefersReducedMotion = useReducedMotionPreference()

  useEffect(() => {
    const element = containerRef.current
    if (!element || prefersReducedMotion) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    if (!isVisible || Scene) {
      return
    }
    let active = true
    void load().then((module) => {
      if (active) {
        setScene(() => module.default)
      }
    })
    return () => {
      active = false
    }
  }, [isVisible, Scene, load])

  const staticFallback = fallback ?? <ThreeFallback label={label} />

  return (
    <div ref={containerRef}>
      {prefersReducedMotion || !Scene ? (
        staticFallback
      ) : (
        <Suspense fallback={staticFallback}>
          <Scene />
        </Suspense>
      )}
    </div>
  )
}
