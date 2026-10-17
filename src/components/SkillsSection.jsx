const SERVICES = [
  {
    title: 'Website Design',
    body: 'Editorial layouts and glass-era visuals that make your brand feel premium from the first scroll.',
    icon: 'layout',
  },
  {
    title: 'Responsive Development',
    body: 'Pixel-true builds across phones, tablets, and desktops: fast, accessible, and easy to maintain.',
    icon: 'devices',
  },
  {
    title: 'Landing Pages',
    body: 'Focused campaign pages with clear hierarchy and CTAs engineered to convert attention into leads.',
    icon: 'spark',
  },
  {
    title: 'Brand Systems',
    body: 'Cohesive colour, type, and motion rules so every page feels like one deliberate product.',
    icon: 'grid',
  },
]

function ServiceIcon({ name }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.25,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  switch (name) {
    case 'layout':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      )
    case 'devices':
      return (
        <svg {...common}>
          <rect x="2" y="4" width="14" height="12" rx="1.5" />
          <path d="M6 20h6M9 16v4" />
          <rect x="16" y="10" width="6" height="10" rx="1.2" />
        </svg>
      )
    case 'spark':
      return (
        <svg {...common}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
          <path d="M5.6 5.6 8.4 8.4M15.6 15.6l2.8 2.8M18.4 5.6 15.6 8.4M8.4 15.6 5.6 18.4" />
          <circle cx="12" cy="12" r="2.25" />
        </svg>
      )
    case 'grid':
    default:
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
  }
}

/**
 * Services — numbered rows (reference layout), existing brand tokens.
 */
export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="site-section section-dark services"
      aria-labelledby="services-title"
      data-reveal
    >
      <div className="premium-dark__bg" aria-hidden="true">
        <span className="premium-dark__orb premium-dark__orb--a" />
        <span className="premium-dark__orb premium-dark__orb--b" />
        <span className="premium-dark__mesh" />
      </div>
      <div className="section-inner services__inner">
        <header className="services__header">
          <div className="services__label-row">
            <p className="section-eyebrow services__label">Services</p>
            <span className="services__label-line" aria-hidden="true" />
          </div>

          <h2 id="services-title" className="visually-hidden">
            What I can do for you
          </h2>

          <div className="services__marquee" aria-hidden="true">
            <div className="services__marquee-track">
              <span>Expertise</span>
              <span>Expertise</span>
              <span>Expertise</span>
              <span>Expertise</span>
              <span>Expertise</span>
              <span>Expertise</span>
            </div>
          </div>
        </header>

        <ul className="services__list">
          {SERVICES.map((service, index) => (
            <li key={service.title} className="services__row">
              <span className="services__index">
                {String(index + 1).padStart(2, '0')}.
              </span>
              <h3 className="services__name">{service.title}</h3>
              <p className="services__body">{service.body}</p>
              <span className="services__icon" aria-hidden="true">
                <ServiceIcon name={service.icon} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
