import { NavLink } from 'react-router-dom'
import { motion } from 'motion/react'

import { cn } from '@/lib/cn'
import { navigationItems } from '@/config/navigation.config'

export type AppNavigationProps = {
  className?: string
}

export function AppNavigation({ className }: AppNavigationProps) {
  return (
    <nav aria-label="Navegación principal" className={cn('flex items-center gap-1', className)}>
      {navigationItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className="group rounded-(--radius-md) px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:outline-none"
        >
          {({ isActive }) => (
            <span
              className={cn(
                'relative inline-block',
                isActive ? 'text-primary' : 'text-secondary group-hover:text-primary',
              )}
            >
              {item.label}
              {isActive ? (
                <motion.span
                  layoutId="app-nav-active"
                  className="absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-brand"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              ) : null}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
