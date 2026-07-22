import { lazy } from 'react'
import { type RouteObject } from 'react-router-dom'

import { routes } from '@/constants/routes'
import { RootLayout } from '@/layouts/RootLayout'
import { RouteErrorBoundary } from './RouteErrorBoundary'

const HomePage = lazy(() =>
  import('@/pages/HomePage/HomePage').then((module) => ({ default: module.HomePage })),
)
const HistoryPage = lazy(() =>
  import('@/pages/HistoryPage/HistoryPage').then((module) => ({ default: module.HistoryPage })),
)
const ChampionshipsPage = lazy(() =>
  import('@/pages/ChampionshipsPage/ChampionshipsPage').then((module) => ({
    default: module.ChampionshipsPage,
  })),
)
const StatisticsPage = lazy(() =>
  import('@/pages/StatisticsPage/StatisticsPage').then((module) => ({
    default: module.StatisticsPage,
  })),
)
const GoalsPage = lazy(() =>
  import('@/pages/GoalsPage/GoalsPage').then((module) => ({ default: module.GoalsPage })),
)
const WomenAndMixedPage = lazy(() =>
  import('@/pages/WomenAndMixedPage/WomenAndMixedPage').then((module) => ({
    default: module.WomenAndMixedPage,
  })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)

export const appRoutes: RouteObject[] = [
  {
    path: routes.home,
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: routes.history, element: <HistoryPage /> },
      { path: routes.championships, element: <ChampionshipsPage /> },
      { path: routes.statistics, element: <StatisticsPage /> },
      { path: routes.goals, element: <GoalsPage /> },
      { path: routes.womenAndMixed, element: <WomenAndMixedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
