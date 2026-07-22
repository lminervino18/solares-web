import { ChartNoAxesCombined, CirclePlay, Home, Trophy, Users, type LucideIcon } from 'lucide-react'

import { routes } from '@/constants/routes'

export type NavigationItem = {
  label: string
  path: string
  icon: LucideIcon
}

export const navigationItems = [
  { label: 'Inicio', path: routes.home, icon: Home },
  { label: 'Campeonatos', path: routes.championships, icon: Trophy },
  { label: 'Estadísticas', path: routes.statistics, icon: ChartNoAxesCombined },
  { label: 'Goles', path: routes.goals, icon: CirclePlay },
  { label: 'Femenino y Mixto', path: routes.womenAndMixed, icon: Users },
] as const satisfies readonly NavigationItem[]
