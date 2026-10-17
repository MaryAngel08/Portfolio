const PROJECTS = [
  {
    title: 'Caffè Brasilia',
    kind: 'Café website',
    badge: 'Live site',
    live: true,
    body: 'A warm, editorial café site built around ritual, atmosphere and a clear path from story to visit.',
    features: [
      'Mood-driven visual storytelling',
      'Responsive menu & hours layout',
      'Soft scroll interactions',
    ],
    skills: ['HTML', 'CSS', 'JavaScript', 'UI Design'],
    desktop: '/images/projects/caffe-desktop.png',
    mobile: '/images/projects/caffe-mobile.png',
    phoneAlt: 'Caffè Brasilia mobile website preview',
    href: 'https://caffebrasilia.vercel.app/',
  },
  {
    title: 'Blake Salon',
    kind: 'Salon website',
    badge: 'Concept',
    live: false,
    body: 'A sharp, quiet barbershop presence with editorial photography and a booking-first structure.',
    features: [
      'High-contrast editorial layout',
      'Services & booking hierarchy',
      'Mobile-first precision',
    ],
    skills: ['HTML', 'CSS', 'JavaScript', 'UX'],
    desktop: '/images/projects/blake-desktop.png',
    mobile: '/images/projects/blake-mobile.png',
    phoneAlt: 'Blake Salon mobile website preview',
    href: 'https://blake-salon.vercel.app/',
  },
  {
    title: 'The Medusa',
    kind: 'Brand website',
    badge: 'Concept',
    live: false,
    body: 'A myth-forward brand site with liquid-glass energy, modular panels and strong motion cues.',
    features: [
      'Modular information cards',
      'Distinct visual identity',
      'Interaction-led storytelling',
    ],
    skills: ['HTML', 'CSS', 'JavaScript', 'Branding'],
    desktop: '/images/projects/medusa-desktop.png',
    mobile: '/images/projects/medusa-mobile.png',
    phoneAlt: 'The Medusa mobile website preview',
    href: 'https://themedusa.vercel.app/',
  },
  {
    title: 'CtrlAltDesigner',
    kind: 'Personal portfolio',
    badge: 'Concept',
    live: false,
    body: 'My personal portfolio — clarity from first layout to a live URL, with a futuristic but focused voice.',
    features: [
      'Clear service positioning',
      'Conversion-ready CTAs',
      'Responsive portfolio system',
    ],
    skills: ['HTML', 'CSS', 'JavaScript', 'Figma'],
    desktop: '/images/projects/ctrlalt-desktop.png',
    mobile: '/images/projects/ctrlalt-mobile.png',
    phoneAlt: 'CtrlAltDesigner personal portfolio mobile preview',
    href: 'https://ctrlaltdesigner.vercel.app/',
  },
]

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card__main">
        <div className="project-card__media">
          <div className="project-card__devices">
            <div className="project-card__laptop">
              <div className="project-card__laptop-screen">
                <img
                  src={project.desktop}
                  alt=""
                  width={1280}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  aria-hidden="true"
                />
              </div>
              <div className="project-card__laptop-base" />
            </div>
            <div className="project-card__phone">
              <div className="project-card__phone-notch" aria-hidden="true" />
              <img
                className="project-card__phone-img"
                src={project.mobile}
                alt={project.phoneAlt}
                width={390}
                height={844}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>

        <div className="project-card__content">
          <span
            className={`project-card__badge${project.live ? ' is-live' : ''}`}
          >
            {project.badge}
          </span>
          <h3 className="project-card__title">{project.title}</h3>
          <p className="project-card__kind">{project.kind}</p>
          <p className="project-card__body">{project.body}</p>

          <div className="project-card__features">
            <p className="project-card__label">Key features</p>
            <ul>
              {project.features.map((feature) => (
                <li key={feature}>
                  <span className="project-card__check" aria-hidden="true">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="project-card__footer">
        <div className="project-card__skills">
          <p className="project-card__label">Skills used</p>
          <ul>
            {project.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
        <a
          className={`btn btn-primary project-card__cta${
            project.live ? '' : ' project-card__cta--concept'
          }`}
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {project.live ? 'View live site' : 'View concept'}
        </a>
      </div>
    </article>
  )
}

/**
 * Recent Projects — 2-up showcase cards with laptop + phone mockups.
 */
export default function ProjectsSection() {
  return (
    <section
      id="portfolio"
      className="site-section section-light projects"
      aria-labelledby="projects-title"
    >
      <div className="projects__bg" aria-hidden="true">
        <img src="/images/projects-bg.jpg" alt="" />
        <div className="projects__glow projects__glow--a" />
        <div className="projects__glow projects__glow--b" />
        <div className="projects__glow projects__glow--c" />
      </div>
      <div className="section-inner projects__inner">
        <header className="projects__header">
          <div>
            <p className="section-eyebrow">Recent Projects</p>
            <h2 id="projects-title" className="section-title">
              Selected <span className="text-gradient">work</span>
            </h2>
          </div>
          <a className="projects__all" href="#contact">
            View all projects
          </a>
        </header>

        <div className="projects__grid">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
