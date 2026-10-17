import { useEffect, useRef, useState } from 'react'

const TOOLS = [
  {
    name: 'Figma',
    category: 'Design',
    body: 'Layouts and interfaces, refined before code.',
    logo: '/images/tools/figma.png',
    brand: '#a259ff',
    brandRgb: '162, 89, 255',
  },
  {
    name: 'HTML',
    category: 'Structure',
    body: 'Clean, semantic, accessible markup.',
    logo: '/images/tools/html.png',
    brand: '#e34f26',
    brandRgb: '227, 79, 38',
  },
  {
    name: 'CSS',
    category: 'Styling',
    body: 'Responsive layouts that hold up on every screen.',
    logo: '/images/tools/css.png',
    brand: '#2965f1',
    brandRgb: '41, 101, 241',
  },
  {
    name: 'JavaScript',
    category: 'Interaction',
    body: 'Purposeful motion and behaviour.',
    logo: '/images/tools/javascript.png',
    brand: '#f7df1e',
    brandRgb: '247, 223, 30',
  },
  {
    name: 'WordPress',
    category: 'CMS',
    body: 'Sites you can easily edit yourself.',
    logo: '/images/tools/wordpress.png',
    brand: '#21759b',
    brandRgb: '33, 117, 155',
  },
]

/**
 * Tools — brand logo cards (Figma, HTML, CSS, JavaScript, WordPress).
 */
export default function ToolsSection() {
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [cardsReady, setCardsReady] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return undefined

    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMq.matches) {
      setInView(true)
      setCardsReady(true)
      return undefined
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setInView(true)
        io.disconnect()
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || cardsReady) return undefined
    const timer = window.setTimeout(() => setCardsReady(true), 1000)
    return () => window.clearTimeout(timer)
  }, [inView, cardsReady])

  return (
    <section
      ref={sectionRef}
      id="tools"
      className={`site-section section-light tools-tech${inView ? ' is-inview' : ''}${cardsReady ? ' is-cards-ready' : ''}`}
      aria-labelledby="tools-title"
      data-reveal
    >
      <div className="tools-tech__bg" aria-hidden="true">
        <img src="/images/tools-bg.jpg" alt="" />
      </div>
      <div className="section-inner tools-tech__inner">
        <header className="tools-tech__copy">
          <p className="section-eyebrow">Tools &amp; Technologies</p>
          <h2 id="tools-title" className="section-title">
            My <span className="text-gradient">tools</span>
          </h2>
          <p className="section-lede section-lede--light">
            Design-to-code tools chosen for speed in exploration and precision
            in production, not for trend lists.
          </p>
        </header>

        <ul className="tools-tech__cards">
          {TOOLS.map(({ name, category, body, logo, brand, brandRgb }, index) => (
            <li
              key={name}
              className="tools-tech__card"
              style={{
                '--brand': brand,
                '--brand-rgb': brandRgb,
                '--tools-stagger': index,
              }}
            >
              <span className="tools-tech__logo" aria-hidden="true">
                <img src={logo} alt="" width={36} height={36} />
              </span>
              <h3 className="tools-tech__name">{name}</h3>
              <p className="tools-tech__category">{category}</p>
              <p className="tools-tech__body">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
