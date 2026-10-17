import { useEffect, useRef, useState } from 'react'
import SeamlessVideo from './SeamlessVideo'

const ABOUT_GLASS_WEBM = '/videos/about-glass.webm'
const ABOUT_GLASS_MP4 = '/videos/about-glass.mp4'
const ABOUT_GLASS_POSTER = '/images/about-glass.jpg'

/**
 * About card: glass image by default; portrait revealed under the cursor
 * via clip-path circle (native pointer listeners for reliability).
 */
export default function DiscoverSection() {
  const stageRef = useRef(null)
  const photoRef = useRef(null)
  const [hintVisible, setHintVisible] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    const photo = photoRef.current
    if (!stage || !photo) return undefined

    let raf = 0
    let pending = null
    let active = false

    const applyClip = (xPct, yPct, radius) => {
      const clip = `circle(${radius} at ${xPct}% ${yPct}%)`
      photo.style.clipPath = clip
      photo.style.webkitClipPath = clip
    }

    if (reduceMotion) {
      applyClip(50, 40, '32%')
      setHintVisible(false)
      return undefined
    }

    applyClip(50, 42, '0%')

    const flush = () => {
      raf = 0
      if (!pending) return
      const { x, y, radius } = pending
      pending = null
      applyClip(x, y, radius)
    }

    const toLocal = (clientX, clientY) => {
      const rect = stage.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return null
      return {
        x: Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)),
        y: Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100)),
      }
    }

    const revealAt = (clientX, clientY) => {
      const local = toLocal(clientX, clientY)
      if (!local) return
      active = true
      setHintVisible(false)
      stage.classList.add('is-hot')
      pending = { x: local.x, y: local.y, radius: '28%' }
      if (!raf) raf = requestAnimationFrame(flush)
    }

    const hide = () => {
      active = false
      stage.classList.remove('is-hot')
      pending = { x: 50, y: 42, radius: '0%' }
      if (!raf) raf = requestAnimationFrame(flush)
      setHintVisible(true)
    }

    const onPointerMove = (e) => revealAt(e.clientX, e.clientY)
    const onPointerEnter = (e) => revealAt(e.clientX, e.clientY)
    const onPointerLeave = () => hide()
    const onPointerDown = (e) => {
      stage.setPointerCapture?.(e.pointerId)
      revealAt(e.clientX, e.clientY)
    }
    const onPointerUp = (e) => {
      if (e.pointerType === 'touch') {
        window.setTimeout(() => {
          if (!active) return
          hide()
        }, 1400)
      }
    }

    stage.addEventListener('pointermove', onPointerMove, { passive: true })
    stage.addEventListener('pointerenter', onPointerEnter, { passive: true })
    stage.addEventListener('pointerleave', onPointerLeave, { passive: true })
    stage.addEventListener('pointerdown', onPointerDown, { passive: true })
    stage.addEventListener('pointerup', onPointerUp, { passive: true })

    return () => {
      if (raf) cancelAnimationFrame(raf)
      stage.removeEventListener('pointermove', onPointerMove)
      stage.removeEventListener('pointerenter', onPointerEnter)
      stage.removeEventListener('pointerleave', onPointerLeave)
      stage.removeEventListener('pointerdown', onPointerDown)
      stage.removeEventListener('pointerup', onPointerUp)
    }
  }, [reduceMotion])

  return (
    <section id="discover" className="discover section-light" aria-label="About">
      <div className="discover-bg" aria-hidden="true">
        <img src="/images/about-bg.jpg" alt="" />
      </div>
      <div className="discover-grid">
        <div className="discover-copy">
          <p className="discover-eyebrow">Behind the webs</p>
          <h2 className="discover-title">
            The designer behind
            <br />
            <span className="text-gradient">Mary.</span>
          </h2>
          <p className="discover-body">
            I&apos;m Mary, a web designer based in Austria. I started building
            websites because I loved how design and code come together. I&apos;m
            early in my career, which means every project gets my full attention,
            fast replies and fresh ideas. I design in Figma, build with clean
            HTML, CSS and JavaScript, and care most about sites that feel clear
            and easy to use.
          </p>

          <ul className="discover-traits">
            <li>
              <strong>
                Thoughtful
                <br />
                Design
              </strong>
              <span>
                Clarity and
                <br />
                purpose first
              </span>
            </li>
            <li>
              <strong>Responsive by Nature</strong>
              <span>Beautiful across every screen</span>
            </li>
            <li>
              <strong>Always Learning</strong>
              <span>Design and front-end growing</span>
            </li>
          </ul>

          <div className="discover-actions">
            <a className="btn btn-primary" href="#contact">
              Let&apos;s work together
            </a>
          </div>
        </div>

        <div className="discover-visual">
          <div ref={stageRef} className="discover-stage">
            <div className="discover-cover" aria-hidden="true">
              {!reduceMotion && (
                <SeamlessVideo
                  className="discover-cover__video"
                  webm={ABOUT_GLASS_WEBM}
                  mp4={ABOUT_GLASS_MP4}
                  poster={ABOUT_GLASS_POSTER}
                  width={720}
                  height={1280}
                  crossfade={1.2}
                />
              )}
            </div>
            <div ref={photoRef} className="discover-photo" aria-hidden="true" />

            {!reduceMotion && hintVisible && (
              <p className="discover-hint">Move your cursor to discover</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
