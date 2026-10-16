import { useEffect } from 'react'

const LERP = 0.06

function lerp(a, b, t) {
  return a + (b - a) * t
}

function canEnhance() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  return (
    window.matchMedia('(hover: hover)').matches &&
    window.matchMedia('(pointer: fine)').matches
  )
}

/**
 * Fine-pointer only: glass spotlight + scroll reveals.
 * Card lift is CSS-only (same as Services) — no floating / antigravity.
 */
export default function MotionEnhancements() {
  useEffect(() => {
    if (!canEnhance()) return undefined

    document.documentElement.classList.add('has-motion-fx')

    const midX = window.innerWidth / 2
    const midY = window.innerHeight / 2
    const pointer = { x: midX, y: midY, sx: midX, sy: midY }
    let raf = 0

    const cards = []

    const collect = () => {
      cards.length = 0
      document.querySelectorAll('.glass-card').forEach((el) => {
        cards.push({
          el,
          mx: 50,
          my: 50,
          smx: 50,
          smy: 50,
        })
      })
    }

    collect()

    const onMove = (e) => {
      pointer.sx = e.clientX
      pointer.sy = e.clientY
    }

    const tick = () => {
      pointer.x = lerp(pointer.x, pointer.sx, LERP)
      pointer.y = lerp(pointer.y, pointer.sy, LERP)

      for (const c of cards) {
        const rect = c.el.getBoundingClientRect()
        c.mx = ((pointer.x - rect.left) / Math.max(rect.width, 1)) * 100
        c.my = ((pointer.y - rect.top) / Math.max(rect.height, 1)) * 100
        c.smx = lerp(c.smx, c.mx, LERP)
        c.smy = lerp(c.smy, c.my, LERP)
        c.el.style.setProperty('--mx', `${c.smx.toFixed(2)}%`)
        c.el.style.setProperty('--my', `${c.smy.toFixed(2)}%`)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    window.addEventListener('pointermove', onMove, { passive: true })

    const revealEls = Array.from(
      document.querySelectorAll(
        '[data-reveal], .site-section, .hero-glass, .site-footer, .contact',
      ),
    )
    const unique = [...new Set(revealEls)]
    let revealIndex = 0
    unique.forEach((el) => el.classList.add('reveal'))

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target
          el.style.transitionDelay = `${revealIndex * 80}ms`
          revealIndex += 1
          el.classList.add('is-revealed')
          io.unobserve(el)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    unique.forEach((el) => io.observe(el))

    const mo = new MutationObserver(() => collect())
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      io.disconnect()
      mo.disconnect()
      document.documentElement.classList.remove('has-motion-fx')
    }
  }, [])

  return null
}
