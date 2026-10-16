import { useEffect, useRef, useState } from 'react'

const STEPS = [
  {
    n: '01',
    title: 'Discover',
    body: 'We start with a conversation to understand your goals, target audience, and what you want your website to achieve.',
  },
  {
    n: '02',
    title: 'Design',
    body: 'I create a modern design based on your brand and goals. You’ll see the layout, style and structure before we move to development.',
  },
  {
    n: '03',
    title: 'Build',
    body: 'I develop your website using clean code and modern best practices. The site is fast, responsive and optimised for all devices.',
  },
  {
    n: '04',
    title: 'Test',
    body: 'I carefully test your website on all devices and browsers. I check every detail, from performance to user experience.',
  },
  {
    n: '05',
    title: 'Launch',
    body: 'Once you’re happy with everything, I handle the final setup, launch your website and provide everything you need to get started.',
  },
]

/**
 * Process — numbered glass steps with a draw-in connector line.
 */
export default function ProcessSection() {
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return undefined

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="process"
      className={`site-section section-dark process${inView ? ' is-inview' : ''}`}
      aria-labelledby="process-title"
    >
      <div className="premium-dark__bg" aria-hidden="true">
        <span className="premium-dark__orb premium-dark__orb--a" />
        <span className="premium-dark__orb premium-dark__orb--b" />
        <span className="premium-dark__mesh" />
      </div>
      <div className="section-inner process__inner">
        <header className="section-header process__header">
          <p className="section-eyebrow">My Process</p>
          <h2 id="process-title" className="section-title">
            From idea to <span className="text-gradient">website.</span>
          </h2>
          <p className="section-lede section-lede--dark">
            I follow a clear and simple process to turn your ideas into a
            modern, functional and visually stunning website. Here’s how we work
            together:
          </p>
        </header>

        <div className="process__track">
          <div className="process__line" aria-hidden="true">
            <span className="process__line-fill" />
            <span className="process__line-dot" />
          </div>

          <ol className="process__steps">
            {STEPS.map((step) => (
              <li key={step.title} className="process__step">
                <div className="process__circle glass-card glass-card--dark">
                  <span className="process__num">{step.n}</span>
                </div>
                <h3 className="process__step-title">{step.title}</h3>
                <p className="process__step-body">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
