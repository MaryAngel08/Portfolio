import { useEffect, useRef, useState } from 'react'

const STEPS = [
  {
    n: '01',
    title: 'Discover',
    body: 'A short conversation about your goals and audience.',
  },
  {
    n: '02',
    title: 'Design',
    body: 'A modern layout based on your brand, shown before any code.',
  },
  {
    n: '03',
    title: 'Build',
    body: 'Clean, fast, responsive development.',
  },
  {
    n: '04',
    title: 'Test',
    body: 'Checked on every device and browser.',
  },
  {
    n: '05',
    title: 'Launch',
    body: 'Final setup, go-live and handover.',
  },
]

/**
 * Process — numbered glass steps with a scroll-linked progress line.
 */
export default function ProcessSection() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [stepsReady, setStepsReady] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return undefined

    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (reduceMq.matches) {
      setInView(true)
      setStepsReady(true)
      setProgress(1)
      return undefined
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)

    let raf = 0
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      const vh = window.innerHeight || 1
      const rect = track.getBoundingClientRect()
      const start = vh * 0.72
      const end = vh * 0.28
      const span = rect.height + (start - end)
      const raw = span <= 0 ? 0 : (start - rect.top) / span
      setProgress(Math.min(1, Math.max(0, raw)))
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        measure()
      })
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    const onReduce = () => {
      if (reduceMq.matches) {
        setInView(true)
        setStepsReady(true)
        setProgress(1)
      }
    }
    reduceMq.addEventListener('change', onReduce)

    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      reduceMq.removeEventListener('change', onReduce)
    }
  }, [])

  /* Drop stagger delays after the last step finishes rising (0.48s + 0.6s). */
  useEffect(() => {
    if (!inView || stepsReady) return undefined
    const timer = window.setTimeout(() => setStepsReady(true), 1100)
    return () => window.clearTimeout(timer)
  }, [inView, stepsReady])

  const activeCount =
    progress <= 0
      ? -1
      : Math.round(progress * (STEPS.length - 1))

  return (
    <section
      ref={sectionRef}
      id="process"
      className={`site-section section-dark process${inView ? ' is-inview' : ''}${stepsReady ? ' is-steps-ready' : ''}`}
      style={{ '--process-progress': String(progress) }}
      aria-labelledby="process-title"
    >
      <div className="premium-dark__bg" aria-hidden="true">
        <span className="premium-dark__orb premium-dark__orb--a" />
        <span className="premium-dark__orb premium-dark__orb--b" />
        <span className="premium-dark__mesh" />
      </div>
      <div className="section-inner process__inner">
        <span className="process__outline" aria-hidden="true">
          PROCESS
        </span>

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

        <div ref={trackRef} className="process__track">
          <div className="process__line" aria-hidden="true">
            <span className="process__line-fill" />
            <span className="process__line-dot" />
          </div>

          <ol className="process__steps">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className={`process__step${index <= activeCount ? ' is-active' : ''}`}
                style={{ '--process-stagger': index }}
              >
                <div className="process__circle">
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
