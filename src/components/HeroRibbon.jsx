import { useEffect, useRef, useState } from 'react'

const MAX_TILT = 5.5
const MAX_SHIFT = 10
const LERP = 0.075
const IDLE = { x: 0, y: 0, glow: 0 }

/**
 * Cursor-reactive glass ribbon (flat PNG).
 * Soft tilt + masked cyan/white sheen — no fake 3D geometry.
 */
export default function HeroRibbon() {
  const stageRef = useRef(null)
  const target = useRef({ ...IDLE })
  const current = useRef({ ...IDLE })
  const rafRef = useRef(0)
  const [interactive, setInteractive] = useState(false)

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerMq = window.matchMedia('(hover: hover) and (pointer: fine)')

    const sync = () => {
      setInteractive(!motionMq.matches && pointerMq.matches)
    }
    sync()

    motionMq.addEventListener('change', sync)
    pointerMq.addEventListener('change', sync)
    return () => {
      motionMq.removeEventListener('change', sync)
      pointerMq.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !interactive) {
      stage?.style.setProperty('--ribbon-rx', '0deg')
      stage?.style.setProperty('--ribbon-ry', '0deg')
      stage?.style.setProperty('--ribbon-dx', '0px')
      stage?.style.setProperty('--ribbon-dy', '0px')
      stage?.style.setProperty('--ribbon-mx', '50%')
      stage?.style.setProperty('--ribbon-my', '46%')
      stage?.style.setProperty('--ribbon-glow', '0')
      return undefined
    }

    const hero = stage.closest('.hero')
    if (!hero) return undefined

    const tick = () => {
      const c = current.current
      const t = target.current
      c.x += (t.x - c.x) * LERP
      c.y += (t.y - c.y) * LERP
      c.glow += (t.glow - c.glow) * LERP

      stage.style.setProperty('--ribbon-rx', `${(-c.y * MAX_TILT).toFixed(3)}deg`)
      stage.style.setProperty('--ribbon-ry', `${(c.x * MAX_TILT).toFixed(3)}deg`)
      stage.style.setProperty('--ribbon-dx', `${(c.x * MAX_SHIFT).toFixed(2)}px`)
      stage.style.setProperty('--ribbon-dy', `${(c.y * MAX_SHIFT * 0.65).toFixed(2)}px`)
      stage.style.setProperty('--ribbon-mx', `${((c.x + 1) * 50).toFixed(2)}%`)
      stage.style.setProperty('--ribbon-my', `${((c.y + 1) * 50).toFixed(2)}%`)
      stage.style.setProperty('--ribbon-glow', c.glow.toFixed(3))

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    const onMove = (e) => {
      const rect = stage.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
      target.current = {
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny)),
        glow: 1,
      }
    }

    const onLeave = () => {
      target.current = { ...IDLE }
    }

    hero.addEventListener('pointermove', onMove, { passive: true })
    hero.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)

    return () => {
      cancelAnimationFrame(rafRef.current)
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
      target.current = { ...IDLE }
      current.current = { ...IDLE }
    }
  }, [interactive])

  return (
    <div
      ref={stageRef}
      className={`hero-ribbon-stage${interactive ? ' is-reactive' : ''}`}
      aria-hidden="true"
    >
      <img
        className="hero-ribbon"
        src="/images/hero-glass-ribbon.png"
        alt=""
        width={1600}
        height={900}
        decoding="async"
        fetchPriority="high"
        draggable={false}
      />
      <div className="hero-ribbon-sheen" />
    </div>
  )
}
