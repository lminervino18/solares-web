import { useCallback, useEffect, useState, type RefObject } from 'react'

export const GOAL_PLAYBACK_RATES = [0.2, 0.4, 0.5, 0.75, 1, 1.25, 1.5, 2] as const

export type GoalPlaybackRate = (typeof GOAL_PLAYBACK_RATES)[number]

export const SEEK_STEP_SECONDS = 5

export type UseGoalPlayerOptions = {
  readonly videoRef: RefObject<HTMLVideoElement | null>
  readonly containerRef: RefObject<HTMLDivElement | null>
  readonly initialRate: GoalPlaybackRate
  readonly onRateChange: (rate: GoalPlaybackRate) => void
}

export type GoalPlayerState = {
  readonly playing: boolean
  readonly currentTime: number
  readonly duration: number
  readonly muted: boolean
  readonly volume: number
  readonly rate: GoalPlaybackRate
  readonly fullscreen: boolean
  readonly failed: boolean
  readonly canFullscreen: boolean
  readonly togglePlay: () => void
  readonly seekTo: (seconds: number) => void
  readonly seekBy: (seconds: number) => void
  readonly setVolume: (volume: number) => void
  readonly toggleMuted: () => void
  readonly setRate: (rate: GoalPlaybackRate) => void
  readonly toggleFullscreen: () => void
}

/**
 * Playback state for one clip.
 *
 * The hook is mounted per goal, so switching clips remounts it and the state
 * starts clean without any reset effect. The chosen rate is lifted to the
 * caller so it survives that remount for the length of the session. Playback
 * never starts on its own, and a rate the browser refuses falls back to 1x
 * instead of leaving the player stuck.
 */
export function useGoalPlayer({
  videoRef,
  containerRef,
  initialRate,
  onRateChange,
}: UseGoalPlayerOptions): GoalPlayerState {
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [volume, setVolumeState] = useState(1)
  const [rate, setRateState] = useState<GoalPlaybackRate>(initialRate)
  const [fullscreen, setFullscreen] = useState(
    () => typeof document !== 'undefined' && document.fullscreenElement !== null,
  )
  const [failed, setFailed] = useState(false)

  const canFullscreen = typeof document !== 'undefined' && document.fullscreenEnabled === true

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement !== null)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (video === null) return

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onLoadedMetadata = () => {
      setDuration(Number.isFinite(video.duration) ? video.duration : 0)
    }
    const onError = () => setFailed(true)

    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('error', onError)

    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('error', onError)
    }
  }, [videoRef])

  useEffect(() => {
    const video = videoRef.current
    if (video === null) return
    try {
      video.playbackRate = rate
    } catch {
      video.playbackRate = 1
    }
  }, [rate, videoRef])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (video === null) return
    if (video.paused) void video.play().catch(() => setFailed(true))
    else video.pause()
  }, [videoRef])

  const seekTo = useCallback(
    (seconds: number) => {
      const video = videoRef.current
      if (video === null || !Number.isFinite(video.duration)) return
      video.currentTime = Math.min(Math.max(seconds, 0), video.duration)
    },
    [videoRef],
  )

  const seekBy = useCallback(
    (seconds: number) => {
      const video = videoRef.current
      if (video === null) return
      seekTo(video.currentTime + seconds)
    },
    [seekTo, videoRef],
  )

  const setVolume = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), 1)
      setVolumeState(clamped)
      setMuted(clamped === 0)
      const video = videoRef.current
      if (video !== null) {
        video.volume = clamped
        video.muted = clamped === 0
      }
    },
    [videoRef],
  )

  const toggleMuted = useCallback(() => {
    const video = videoRef.current
    if (video === null) return
    video.muted = !video.muted
    setMuted(video.muted)
  }, [videoRef])

  const setRate = useCallback(
    (next: GoalPlaybackRate) => {
      setRateState(next)
      onRateChange(next)
    },
    [onRateChange],
  )

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current
    if (container === null) return
    if (document.fullscreenElement === null) {
      void container.requestFullscreen().catch(() => undefined)
    } else {
      void document.exitFullscreen().catch(() => undefined)
    }
  }, [containerRef])

  return {
    playing,
    currentTime,
    duration,
    muted,
    volume,
    rate,
    fullscreen,
    failed,
    canFullscreen,
    togglePlay,
    seekTo,
    seekBy,
    setVolume,
    toggleMuted,
    setRate,
    toggleFullscreen,
  }
}
