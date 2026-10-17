import { useEffect, useId, useState } from 'react'
import SeamlessVideo from './SeamlessVideo'
import { useMediaFlags } from '../hooks/useMediaFlags'

const NAV = [
  { href: '#top', label: 'Home' },
  { href: '#discover', label: 'About' },
  { href: '#skills', label: 'Services' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#process', label: 'Process' },
  { href: '#pricing', label: 'Pricing' },
]

const CONTACT_HREF = '#contact'

/**
 * Sticky glass nav + navy-glass hero with edge-bleeding video.
 */
const HERO_VIDEO_WEBM = '/videos/hero-glass-wave.webm'
const HERO_VIDEO_MP4 = '/videos/hero-glass-wave.mp4'
const HERO_POSTER = '/images/hero-glass-wave-poster.jpg'

export default function HeroGlass() {
  const { isMobile } = useMediaFlags()
  const [navScrolled, setNavScrolled] = useState(false)
  const [activeHref, setActiveHref] = useState('#top')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    document.title = 'Mary | Web Designer'
  }, [])

  /* Drop will-change after hero text entrance finishes (once on load). */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return undefined

    const nodes = document.querySelectorAll(
      '.hero-glass__title-line-inner, .hero-glass__eyebrow, .hero-glass__intro, .hero-glass__actions',
    )
    nodes.forEach((el) => {
      el.style.willChange = 'transform, opacity'
    })

    const clear = () => {
      nodes.forEach((el) => {
        el.style.willChange = 'auto'
      })
    }

    /* Last rise starts ~1.54s, runs 0.8s → clear shortly after */
    const timer = window.setTimeout(clear, 2600)
    return () => window.clearTimeout(timer)
  }, [])

  /* Sticky-pin depth fade (transform/opacity) + pause torus when covered */
  useEffect(() => {
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const narrowMq = window.matchMedia('(max-width: 900px)')
    const scrollTimelineOk =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline', 'scroll()')

    const hero = document.querySelector('.hero-glass')
    const depth = document.querySelector('.hero-glass__depth')
    if (!hero || !depth) return undefined

    let raf = 0

    const applyProgress = (progress) => {
      const p = Math.min(1, Math.max(0, progress))
      if (!scrollTimelineOk || reduceMq.matches || narrowMq.matches) {
        if (reduceMq.matches || narrowMq.matches) {
          depth.style.transform = ''
          depth.style.opacity = ''
          depth.style.willChange = 'auto'
          hero.classList.remove('is-covered')
          return
        }
        const scale = 1 - p * 0.06
        const opacity = 1 - p * 0.5
        depth.style.transform = `scale(${scale})`
        depth.style.opacity = String(opacity)
        depth.style.willChange = p > 0 && p < 1 ? 'transform, opacity' : 'auto'
      }

      if (p >= 0.85) hero.classList.add('is-covered')
      else hero.classList.remove('is-covered')
    }

    const measure = () => {
      if (reduceMq.matches || narrowMq.matches) {
        applyProgress(0)
        return
      }
      const vh = window.innerHeight || 1
      applyProgress(window.scrollY / vh)
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        setNavScrolled(window.scrollY > 40)
        measure()
      })
    }

    measure()
    setNavScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    reduceMq.addEventListener('change', measure)
    narrowMq.addEventListener('change', measure)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      reduceMq.removeEventListener('change', measure)
      narrowMq.removeEventListener('change', measure)
      depth.style.transform = ''
      depth.style.opacity = ''
      depth.style.willChange = 'auto'
      hero.classList.remove('is-covered')
    }
  }, [])

  useEffect(() => {
    const ids = [...NAV.map((item) => item.href.slice(1)), CONTACT_HREF.slice(1)]
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!elements.length) return undefined

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (!visible[0]?.target?.id) return
        setActiveHref(`#${visible[0].target.id}`)
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.1, 0.25, 0.5] },
    )

    elements.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  // Close overlay when leaving mobile/tablet breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1100px)')
    const onChange = () => {
      if (!mq.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header
        className={`site-nav${navScrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-menu-open' : ''}`}
      >
        <div className="site-nav__inner">
          <a className="site-nav__logo" href="#top" aria-label="Mary">
            Mary
            <span className="site-nav__logo-dot" aria-hidden="true">
              .
            </span>
          </a>
          <nav className="site-nav__links" aria-label="Primary">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={activeHref === item.href ? 'is-active' : undefined}
                aria-current={activeHref === item.href ? 'true' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            className={`site-nav__cta${activeHref === CONTACT_HREF ? ' is-active' : ''}`}
            href={CONTACT_HREF}
            aria-current={activeHref === CONTACT_HREF ? 'true' : undefined}
          >
            Contact
          </a>
          <button
            type="button"
            className="site-nav__menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="site-nav__menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        <div
          id={menuId}
          className={`site-nav__overlay${menuOpen ? ' is-open' : ''}`}
          aria-hidden={!menuOpen}
        >
          <nav className="site-nav__overlay-nav" aria-label="Mobile">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={activeHref === item.href ? 'is-active' : undefined}
                aria-current={activeHref === item.href ? 'true' : undefined}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            className={`site-nav__overlay-cta${activeHref === CONTACT_HREF ? ' is-active' : ''}`}
            href={CONTACT_HREF}
            aria-current={activeHref === CONTACT_HREF ? 'true' : undefined}
            onClick={closeMenu}
          >
            Contact
          </a>
        </div>
      </header>

      <div className="hero-pin">
        <section
          id="top"
          className="theme-glass section-dark hero-glass"
          aria-label="Mary"
        >
          <div className="hero-glass__depth">
            <div className="hero-glass__bg" aria-hidden="true">
              <span className="hero-glass__orb hero-glass__orb--a" />
              <span className="hero-glass__orb hero-glass__orb--b" />
              <span className="hero-glass__orb hero-glass__orb--c" />
              <span className="hero-glass__mesh" />
            </div>
            <div className="hero-glass__media" aria-hidden="true">
              <div className="hero-glass__media-tilt">
                <div className="hero-glass__stage">
                  <SeamlessVideo
                    className="hero-glass__image"
                    webm={HERO_VIDEO_WEBM}
                    mp4={HERO_VIDEO_MP4}
                    poster={HERO_POSTER}
                    width={2560}
                    height={1440}
                    crossfade={isMobile ? 0.45 : 1.2}
                    lite={isMobile}
                  />
                  {!isMobile && (
                    <SeamlessVideo
                      className="hero-glass__image hero-glass__image--reflect"
                      webm={HERO_VIDEO_WEBM}
                      mp4={HERO_VIDEO_MP4}
                      poster={HERO_POSTER}
                      width={2560}
                      height={1440}
                      crossfade={1.2}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="hero-glass__shell">
              <div className="hero-glass__grid">
                <div className="hero-glass__copy">
                  <p className="hero-glass__eyebrow">Web designer</p>
                  <h1
                    className="hero-glass__title"
                    aria-label="Good design isn't just seen. It's experienced."
                  >
                    <span className="hero-glass__title-line">
                      <span className="hero-glass__title-line-inner" aria-hidden="true">
                        Good design
                      </span>
                    </span>
                    <span className="hero-glass__title-line">
                      <span className="hero-glass__title-line-inner" aria-hidden="true">
                        isn&apos;t just seen.
                      </span>
                    </span>
                    <span className="hero-glass__title-line">
                      <span
                        className="hero-glass__title-line-inner hero-glass__title-gradient"
                        aria-hidden="true"
                      >
                        It&apos;s experienced.
                      </span>
                    </span>
                  </h1>
                  <p className="hero-glass__intro">
                    I create thoughtful digital experiences that bring brands to life
                    through purposeful design, seamless interactions, and a
                    distinctive visual identity.
                  </p>
                  <div className="hero-glass__actions">
                    <a className="hero-glass__btn hero-glass__btn--primary" href="#skills">
                      Discover my work
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
