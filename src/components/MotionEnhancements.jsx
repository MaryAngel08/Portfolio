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

const REVEAL_SELECTOR = [
  '.section-title',
  '.section-eyebrow',
  '.section-lede',
  '.section-header',
  '.glass-card',
  '.project-card',
  '.pricing-card',
  '.contact-form',
  '.contact__copy',
  '.discover-title',
  '.discover-body',
  '.discover-eyebrow',
  '.discover-traits',
  '.discover-actions',
  '.discover-stage',
  '.services__row',
  '.tools-tech__copy',
  '.pricing__note',
].join(', ')

/**
 * Fine-pointer glass spotlight + light scroll reveals (content only).
 */
export default function MotionEnhancements() {
  useEffect(() => {
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)')

    const setupReveals = () => {
      if (reduceMq.matches) return () => {}

      const revealEls = Array.from(document.querySelectorAll(REVEAL_SELECTOR)).filter(
        (el) => !el.closest('.hero-glass, .hero-pin, .site-nav'),
      )
      revealEls.forEach((el) => el.classList.add('reveal'))

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            entry.target.classList.add('is-revealed')
            io.unobserve(entry.target)
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
      )
      revealEls.forEach((el) => io.observe(el))
      return () => io.disconnect()
    }

    let teardownReveal = setupReveals()

    const onReduceChange = () => {
      teardownReveal?.()
      document.querySelectorAll('.reveal').forEach((el) => {
        el.classList.remove('reveal', 'is-revealed')
        el.style.transitionDelay = ''
      })
      teardownReveal = setupReveals()
    }
    reduceMq.addEventListener('change', onReduceChange)

    if (!canEnhance()) {
      return () => {
        reduceMq.removeEventListener('change', onReduceChange)
        teardownReveal?.()
      }
    }

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

    const mo = new MutationObserver(() => collect())
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      mo.disconnect()
      reduceMq.removeEventListener('change', onReduceChange)
      teardownReveal?.()
      document.documentElement.classList.remove('has-motion-fx')
    }
  }, [])

  return null
}
