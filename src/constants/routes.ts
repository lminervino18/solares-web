export const routes = {
  home: '/',
  history: '/historia',
  championships: '/campeonatos',
  statistics: '/estadisticas',
  goals: '/goles',
  womenAndMixed: '/femenino-mixto',
} as const

export type RouteKey = keyof typeof routes
export type RoutePath = (typeof routes)[RouteKey]
