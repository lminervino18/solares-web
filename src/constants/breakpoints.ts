export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type BreakpointKey = keyof typeof breakpoints

export function minWidthQuery(key: BreakpointKey): string {
  return `(min-width: ${breakpoints[key]}px)`
}
