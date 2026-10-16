import { useEffect } from 'react'

const DEFAULTS = {
  maxTranslate: 24,
  maxRotate: 4,
  ease: 0.06,
}

/**
 * Cursor-driven translate + tilt on an element.
 * Inactive when reduced-motion is preferred, or when the device
 * lacks fine pointer / hover capability.
 *
 * @param {React.RefObject<HTMLElement|null>} ref
 * @param {{ maxTranslate?: number, maxRotate?: number, ease?: number }} [options]
 */
export function useCursorParallax(ref, options = {}) {
  const maxTranslate = options.maxTranslate ?? DEFAULTS.maxTranslate
  const maxRotate = options.maxRotate ?? DEFAULTS.maxRotate
  const ease = options.ease ?? DEFAULTS.ease

  useEffect(() => {
    const el = ref?.current
    if (!el || typeof window === 'undefined') return undefined

    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const hoverMq = window.matchMedia('(hover: hover)')
    const pointerMq = window.matchMedia('(pointer: fine)')

    if (motionMq.matches || !hoverMq.matches || !pointerMq.matches) {
      return undefined
    }

    let raf = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let targetRx = 0
    let targetRy = 0
    let currentRx = 0
    let currentRy = 0

    const apply = () => {
      el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) rotateX(${currentRx.toFixed(3)}deg) rotateY(${currentRy.toFixed(3)}deg)`
    }

    const resetTargets = () => {
      targetX = 0
      targetY = 0
      targetRx = 0
      targetRy = 0
    }

    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      targetX = nx * maxTranslate
      targetY = ny * (maxTranslate * (2 / 3))
      targetRy = nx * maxRotate
      targetRx = -ny * maxRotate
    }

    const onLeave = () => {
      resetTargets()
    }

    const tick = () => {
      currentX += (targetX - currentX) * ease
      currentY += (targetY - currentY) * ease
      currentRx += (targetRx - currentRx) * ease
      currentRy += (targetRy - currentRy) * ease
      apply()
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
      el.style.transform = ''
    }
  }, [ref, maxTranslate, maxRotate, ease])
}
