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
  { href: '#contact', label: 'Contact' },
]

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

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = NAV.map((item) => item.href.slice(1))
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
          <a className="site-nav__logo" href="#top" aria-label="Mary home">
            Mary
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
          <a className="site-nav__cta" href="#contact">
            Let’s talk
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
            className="site-nav__overlay-cta"
            href="#contact"
            onClick={closeMenu}
          >
            Let’s talk
          </a>
        </div>
      </header>

      <section
        id="top"
        className="theme-glass section-dark hero-glass"
        aria-label="Mary"
      >
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
              <h1 className="hero-glass__title">
                Modern websites
                <br />
                that make
                <br />
                your brand
                <br />
                <span className="hero-glass__title-gradient text-gradient">
                  stand out.
                </span>
              </h1>
              <p className="hero-glass__intro">
                I&apos;m a website designer who turns ideas into clean, modern and
                user-friendly websites that work as well as they look.
              </p>
              <div className="hero-glass__actions">
                <a className="hero-glass__btn hero-glass__btn--primary" href="#skills">
                  View my work
                </a>
                <a className="hero-glass__text-link" href="#contact">
                  Get in touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
