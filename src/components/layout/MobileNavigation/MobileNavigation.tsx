import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Dialog, VisuallyHidden } from 'radix-ui'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'

import { cn } from '@/lib/cn'
import { navigationItems } from '@/config/navigation.config'
import { siteConfig } from '@/config/site.config'
import { IconButton } from '@/components/primitives/IconButton/IconButton'

export type MobileNavigationProps = {
  className?: string
}

export function MobileNavigation({ className }: MobileNavigationProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <IconButton
          aria-label="Abrir menú de navegación"
          icon={<Menu aria-hidden="true" className="size-5" />}
          variant="ghost"
          tone="neutral"
          className={className}
        />
      </Dialog.Trigger>

      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-[var(--z-overlay)] bg-[color-mix(in_oklab,var(--color-canvas)_72%,transparent)] backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 380, damping: 38 }}
                className="fixed inset-y-0 right-0 z-[var(--z-dialog)] flex w-[min(22rem,86vw)] flex-col border-l border-line bg-surface pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-lg)]"
              >
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <Dialog.Title className="font-display text-lg font-bold text-primary">
                    {siteConfig.teamName}
                  </Dialog.Title>
                  <VisuallyHidden.Root>
                    <Dialog.Description>Menú de navegación principal</Dialog.Description>
                  </VisuallyHidden.Root>
                  <Dialog.Close asChild>
                    <IconButton
                      aria-label="Cerrar menú de navegación"
                      icon={<X aria-hidden="true" className="size-5" />}
                      variant="ghost"
                      tone="neutral"
                    />
                  </Dialog.Close>
                </div>

                <nav aria-label="Navegación principal" className="flex flex-col gap-1 p-4">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        onClick={() => {
                          setOpen(false)
                        }}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-(--radius-md) px-4 py-3 text-base font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:outline-none',
                            isActive
                              ? 'bg-[color-mix(in_oklab,var(--color-brand)_18%,transparent)] text-primary'
                              : 'text-secondary hover:bg-surface-elevated hover:text-primary',
                          )
                        }
                      >
                        <Icon aria-hidden="true" className="size-5 text-brand" />
                        {item.label}
                      </NavLink>
                    )
                  })}
                </nav>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  )
}
