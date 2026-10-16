import { useEffect, useRef } from 'react'

const COUNT = 110
const LINK_DIST = 150
const CURSOR_DIST = 210
/** Slow drift speed (px per frame at ~60fps). */
const SPEED_MIN = 0.04
const SPEED_MAX = 0.1

/**
 * Constellation network: particles float slowly around the section;
 * links form when near each other; cursor draws lines to nearby nodes.
 */
export default function PricingNetwork() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return undefined

    const section = canvas.parentElement
    let raf = 0
    let width = 0
    let height = 0
    let dpr = 1
    const pointer = { x: -9999, y: -9999, active: false }
    /** @type {{ x: number, y: number, vx: number, vy: number, phase: number }[]} */
    let particles = []

    const randomSpeed = () =>
      SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)

    const spawn = () => {
      const speed = randomSpeed()
      const angle = Math.random() * Math.PI * 2
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        phase: Math.random() * Math.PI * 2,
      }
    }

    const resize = () => {
      if (!section) return
      const rect = section.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      particles = Array.from({ length: COUNT }, spawn)
    }

    const onMove = (e) => {
      const rect = section.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active = true
    }

    const onLeave = () => {
      pointer.active = false
      pointer.x = -9999
      pointer.y = -9999
    }

    const drawLink = (x1, y1, x2, y2, alpha, color) => {
      if (alpha <= 0.02) return
      ctx.beginPath()
      ctx.strokeStyle = color.replace('ALPHA', String(alpha))
      ctx.lineWidth = 0.75
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    const step = (time) => {
      ctx.clearRect(0, 0, width, height)
      const t = time * 0.001

      for (const p of particles) {
        // Gentle wander so paths feel organic, not straight lines
        p.vx += Math.sin(t * 0.18 + p.phase) * 0.0015
        p.vy += Math.cos(t * 0.14 + p.phase * 1.3) * 0.0015

        // Keep a slow constant float — never damp to a stop
        let speed = Math.hypot(p.vx, p.vy) || SPEED_MIN
        if (speed < SPEED_MIN) {
          p.vx = (p.vx / speed) * SPEED_MIN
          p.vy = (p.vy / speed) * SPEED_MIN
          speed = SPEED_MIN
        } else if (speed > SPEED_MAX * 1.35) {
          p.vx = (p.vx / speed) * SPEED_MAX
          p.vy = (p.vy / speed) * SPEED_MAX
        }

        p.x += p.vx
        p.y += p.vy

        if (p.x <= 0 || p.x >= width) {
          p.vx *= -1
          p.x = Math.max(0, Math.min(width, p.x))
        }
        if (p.y <= 0 || p.y >= height) {
          p.vy *= -1
          p.y = Math.max(0, Math.min(height, p.y))
        }

        if (pointer.active) {
          const dx = pointer.x - p.x
          const dy = pointer.y - p.y
          const dist = Math.hypot(dx, dy) || 1
          if (dist < CURSOR_DIST) {
            const pull = (1 - dist / CURSOR_DIST) * 0.018
            p.vx += (dx / dist) * pull
            p.vy += (dy / dist) * pull
          }
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist >= LINK_DIST) continue
          const alpha = (1 - dist / LINK_DIST) * 0.55
          drawLink(a.x, a.y, b.x, b.y, alpha, 'rgba(105, 215, 255, ALPHA)')
        }
      }

      if (pointer.active) {
        for (const p of particles) {
          const dist = Math.hypot(p.x - pointer.x, p.y - pointer.y)
          if (dist >= CURSOR_DIST) continue
          const alpha = (1 - dist / CURSOR_DIST) * 0.72
          drawLink(p.x, p.y, pointer.x, pointer.y, alpha, 'rgba(37, 99, 255, ALPHA)')
        }

        ctx.beginPath()
        ctx.fillStyle = 'rgba(105, 215, 255, 0.95)'
        ctx.arc(pointer.x, pointer.y, 2.6, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const p of particles) {
        ctx.beginPath()
        ctx.fillStyle = 'rgba(105, 215, 255, 0.88)'
        ctx.arc(p.x, p.y, 2.1, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(step)
    }

    resize()
    raf = requestAnimationFrame(step)
    section?.addEventListener('pointermove', onMove, { passive: true })
    section?.addEventListener('pointerleave', onLeave, { passive: true })
    window.addEventListener('resize', resize)

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    if (section && ro) ro.observe(section)

    return () => {
      cancelAnimationFrame(raf)
      section?.removeEventListener('pointermove', onMove)
      section?.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', resize)
      ro?.disconnect()
    }
  }, [])

  return <canvas className="pricing-network" ref={canvasRef} aria-hidden="true" />
}
