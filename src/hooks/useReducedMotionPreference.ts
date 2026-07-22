import { useMediaQuery } from './useMediaQuery'

export function useReducedMotionPreference(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
