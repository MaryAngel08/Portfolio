import { useEffect, useState } from 'react'
import SeamlessVideo from './SeamlessVideo'

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
  const [navScrolled, setNavScrolled] = useState(false)
  const [activeHref, setActiveHref] = useState('#top')

  useEffect(() => {
    document.title = 'SpiderMary — Web Designer'
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

  return (
    <>
      <header
        className={`site-nav${navScrolled ? ' is-scrolled' : ''}`}
      >
        <div className="site-nav__inner">
          <a className="site-nav__logo" href="#top" aria-label="Mary home">
            <span className="site-nav__mark" aria-hidden="true">
              M
            </span>
            <span className="site-nav__name">Mary</span>
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
        </div>
      </header>

      <section
        id="top"
        className="theme-glass section-dark hero-glass"
        aria-label="SpiderMary hero"
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
                crossfade={1.2}
              />
              <SeamlessVideo
                className="hero-glass__image hero-glass__image--reflect"
                webm={HERO_VIDEO_WEBM}
                mp4={HERO_VIDEO_MP4}
                poster={HERO_POSTER}
                width={2560}
                height={1440}
                crossfade={1.2}
              />
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
                your brand.
                <br />
                <span className="hero-glass__title-gradient text-gradient">
                  stand out
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
