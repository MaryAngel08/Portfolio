import { useEffect, useRef, useState } from 'react'

const CROSSFADE_S = 1.2

/**
 * Dual-video crossfade loop for a seamless cycle (no native `loop`).
 * Watches currentTime with rAF; pauses when offscreen.
 */
export default function SeamlessVideo({
  webm,
  mp4,
  poster,
  className = '',
  width = 1920,
  height = 1080,
  crossfade = CROSSFADE_S,
  /** Single looping video — cheaper on mobile (no dual rAF crossfade). */
  lite = false,
}) {
  const rootRef = useRef(null)
  const videoARef = useRef(null)
  const videoBRef = useRef(null)
  const [reduceMotion, setReduceMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Lite: one native-loop video, pause when offscreen
  useEffect(() => {
    if (reduceMotion || !lite) return undefined
    const root = rootRef.current
    const video = videoARef.current
    if (!root || !video) return undefined

    video.muted = true
    video.playsInline = true
    video.loop = true
    video.style.opacity = '1'

    const playSafe = () => {
      const p = video.play()
      if (p?.catch) p.catch(() => {})
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) playSafe()
        else video.pause()
      },
      { threshold: 0.12 },
    )
    io.observe(root)
    playSafe()
    return () => {
      io.disconnect()
      video.pause()
    }
  }, [reduceMotion, lite, webm, mp4])

  useEffect(() => {
    if (reduceMotion || lite) return undefined

    const root = rootRef.current
    const videoA = videoARef.current
    const videoB = videoBRef.current
    if (!root || !videoA || !videoB) return undefined

    const layers = [videoA, videoB]
    let front = 0
    let fading = false
    let visible = true
    let raf = 0
    let fadeTimer = 0

    const setOpacity = (el, value) => {
      el.style.opacity = String(value)
    }

    layers.forEach((v, i) => {
      v.muted = true
      v.playsInline = true
      v.preload = 'auto'
      v.style.transition = `opacity ${crossfade}s linear`
      setOpacity(v, i === 0 ? 1 : 0)
    })

    const playSafe = (v) => {
      const p = v.play()
      if (p?.catch) p.catch(() => {})
    }

    const startFront = () => {
      if (!visible || reduceMotion) return
      const active = layers[front]
      playSafe(active)
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible || fading) return

      const active = layers[front]
      const standby = layers[1 - front]
      const duration = active.duration

      if (!Number.isFinite(duration) || duration <= crossfade) return

      if (active.currentTime >= duration - crossfade) {
        fading = true
        try {
          standby.currentTime = 0
        } catch {
          /* ignore */
        }
        playSafe(standby)
        setOpacity(active, 0)
        setOpacity(standby, 1)

        fadeTimer = window.setTimeout(() => {
          active.pause()
          try {
            active.currentTime = 0
          } catch {
            /* ignore */
          }
          front = 1 - front
          fading = false
        }, crossfade * 1000)
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) {
          startFront()
        } else {
          layers.forEach((v) => v.pause())
        }
      },
      { threshold: 0.12 },
    )
    io.observe(root)

    const onReady = () => {
      if (visible) startFront()
    }
    videoA.addEventListener('loadeddata', onReady)

    raf = requestAnimationFrame(tick)
    startFront()

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(fadeTimer)
      io.disconnect()
      videoA.removeEventListener('loadeddata', onReady)
      layers.forEach((v) => v.pause())
    }
  }, [reduceMotion, webm, mp4, crossfade])

  if (reduceMotion) {
    return (
      <div ref={rootRef} className={`seamless-video ${className}`.trim()}>
        <img
          className="seamless-video__poster"
          src={poster}
          alt=""
          width={width}
          height={height}
          decoding="async"
        />
      </div>
    )
  }

  if (lite) {
    return (
      <div ref={rootRef} className={`seamless-video seamless-video--lite ${className}`.trim()}>
        <video
          ref={videoARef}
          className="seamless-video__layer"
          muted
          playsInline
          loop
          preload="metadata"
          autoPlay
          width={width}
          height={height}
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      </div>
    )
  }

  return (
    <div ref={rootRef} className={`seamless-video ${className}`.trim()}>
      <video
        ref={videoARef}
        className="seamless-video__layer"
        muted
        playsInline
        preload="auto"
        autoPlay
        width={width}
        height={height}
      >
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>
      <video
        ref={videoBRef}
        className="seamless-video__layer"
        muted
        playsInline
        preload="auto"
        width={width}
        height={height}
        tabIndex={-1}
      >
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>
    </div>
  )
}
