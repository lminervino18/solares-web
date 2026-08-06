import { useCallback, useEffect, useState, type RefObject } from 'react'

export const GOAL_PLAYBACK_RATES = [0.2, 0.4, 0.5, 0.75, 1, 1.25, 1.5, 2] as const

export type GoalPlaybackRate = (typeof GOAL_PLAYBACK_RATES)[number]

export const SEEK_STEP_SECONDS = 5

// Safari on iPhone implements no element fullscreen: only the video element can
// go native, through this non-standard method.
type NativeFullscreenVideo = HTMLVideoElement & {
  readonly webkitEnterFullscreen?: () => void
}

function nativeVideoFullscreen(video: HTMLVideoElement): (() => void) | null {
  const enter = (video as NativeFullscreenVideo).webkitEnterFullscreen
  return typeof enter === 'function' ? enter.bind(video) : null
}

function supportsElementFullscreen(): boolean {
  return typeof document !== 'undefined' && document.fullscreenEnabled === true
}

export type UseGoalPlayerOptions = {
  readonly videoRef: RefObject<HTMLVideoElement | null>
  readonly containerRef: RefObject<HTMLDivElement | null>
  readonly initialRate: GoalPlaybackRate
  readonly onRateChange: (rate: GoalPlaybackRate) => void
  readonly fallbackDuration?: number
  readonly autoPlay?: boolean
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
  readonly ready: boolean
  readonly canFullscreen: boolean
  readonly togglePlay: () => void
  readonly seekTo: (seconds: number) => void
  readonly seekBy: (seconds: number) => void
  readonly setVolume: (volume: number) => void
  readonly toggleMuted: () => void
  readonly setRate: (rate: GoalPlaybackRate) => void
  readonly toggleFullscreen: () => void
}

export function useGoalPlayer({
  videoRef,
  containerRef,
  initialRate,
  onRateChange,
  fallbackDuration,
  autoPlay = false,
}: UseGoalPlayerOptions): GoalPlayerState {
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(fallbackDuration ?? 0)
  const [muted, setMuted] = useState(false)
  const [volume, setVolumeState] = useState(1)
  const [rate, setRateState] = useState<GoalPlaybackRate>(initialRate)
  const [fullscreen, setFullscreen] = useState(
    () => typeof document !== 'undefined' && document.fullscreenElement !== null,
  )
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)

  const [canFullscreen, setCanFullscreen] = useState(supportsElementFullscreen)

  useEffect(() => {
    if (canFullscreen) return
    const video = videoRef.current
    if (video !== null && nativeVideoFullscreen(video) !== null) setCanFullscreen(true)
  }, [canFullscreen, videoRef])

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
    const readDuration = () => {
      if (fallbackDuration !== undefined) return
      if (Number.isFinite(video.duration) && video.duration > 0) setDuration(video.duration)
    }
    const onReady = () => setReady(true)
    const onError = () => setFailed(true)
    const startPlayback = () => {
      if (!autoPlay) return
      // A browser may refuse to start without a gesture (a shared link opened
      // directly). That is not a playback failure: the clip stays paused.
      void video.play().catch(() => undefined)
    }

    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('loadedmetadata', readDuration)
    video.addEventListener('durationchange', readDuration)
    video.addEventListener('canplay', onReady)
    video.addEventListener('canplay', startPlayback)
    video.addEventListener('error', onError)

    // The element can already have its metadata when this effect runs, in which
    // case the events above have fired and would never be seen.
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) readDuration()
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      onReady()
      startPlayback()
    }

    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('loadedmetadata', readDuration)
      video.removeEventListener('durationchange', readDuration)
      video.removeEventListener('canplay', onReady)
      video.removeEventListener('canplay', startPlayback)
      video.removeEventListener('error', onError)
    }
  }, [videoRef, autoPlay, fallbackDuration])

  // `timeupdate` only fires a few times a second, which reads as a stuttering
  // progress bar on a clip lasting a few seconds. While playing, the position
  // is sampled per frame instead.
  useEffect(() => {
    if (!playing) return
    let frame = 0
    const sample = () => {
      const video = videoRef.current
      if (video !== null) setCurrentTime(video.currentTime)
      frame = requestAnimationFrame(sample)
    }
    frame = requestAnimationFrame(sample)
    return () => cancelAnimationFrame(frame)
  }, [playing, videoRef])

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
      if (video === null) return
      // Bounded by the same duration the progress bar shows, so the thumb can
      // always reach both ends of the track it is drawn on.
      const limit =
        duration > 0
          ? duration
          : Number.isFinite(video.duration) && video.duration > 0
            ? video.duration
            : 0
      const target = limit > 0 ? Math.min(Math.max(seconds, 0), limit) : Math.max(seconds, 0)
      video.currentTime = target
      setCurrentTime(target)
    },
    [videoRef, duration],
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
    if (container !== null && supportsElementFullscreen()) {
      if (document.fullscreenElement === null) {
        void container.requestFullscreen().catch(() => undefined)
      } else {
        void document.exitFullscreen().catch(() => undefined)
      }
      return
    }

    const video = videoRef.current
    const enterNative = video === null ? null : nativeVideoFullscreen(video)
    if (enterNative === null) return
    try {
      enterNative()
    } catch {
      // The element rejects the call until its metadata is loaded.
    }
  }, [containerRef, videoRef])

  return {
    playing,
    currentTime,
    duration,
    muted,
    volume,
    rate,
    fullscreen,
    failed,
    ready,
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
