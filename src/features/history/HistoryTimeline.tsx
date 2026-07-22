import { useEffect, useState } from 'react'

import { cn } from '@/lib/cn'
import { historyChapters } from '@/data/history'

export function HistoryTimeline() {
  const [activeId, setActiveId] = useState<string>(historyChapters[0]?.id ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) {
          setActiveId(visible.target.id)
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )

    for (const chapter of historyChapters) {
      const element = document.getElementById(chapter.id)
      if (element) {
        observer.observe(element)
      }
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <nav aria-label="Capítulos de la historia" className="lg:sticky lg:top-24">
      <p className="mb-3 hidden text-sm font-semibold text-muted uppercase lg:block">Capítulos</p>
      <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
        {historyChapters.map((chapter, index) => {
          const isActive = chapter.id === activeId
          return (
            <li key={chapter.id} className="shrink-0">
              <a
                href={`#${chapter.id}`}
                aria-label={`Capítulo ${String(index + 1)}: ${chapter.title}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-(--radius-md) px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:outline-none',
                  isActive
                    ? 'bg-[color-mix(in_oklab,var(--color-brand)_16%,transparent)] text-primary'
                    : 'text-secondary hover:bg-surface-elevated hover:text-primary',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    isActive ? 'bg-brand text-on-brand' : 'bg-surface-elevated text-secondary',
                  )}
                >
                  {index + 1}
                </span>
                <span className="hidden lg:inline">{chapter.title}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
