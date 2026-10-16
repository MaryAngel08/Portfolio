const NAV = [
  { href: '#top', label: 'Home' },
  { href: '#discover', label: 'About' },
  { href: '#skills', label: 'Services' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#process', label: 'Process' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
]

function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 9.5v9M6.5 6.2v.2M11 18.5v-5.2c0-1.4.9-2.3 2.2-2.3 1.2 0 2 .8 2 2.3v5.2M11 11.2V18.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" />
    </svg>
  )
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6 18 18M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * Site footer — dark bar with logo, links, socials.
 */
export default function SiteFooter() {
  return (
    <footer className="site-footer section-dark" data-reveal>
      <div className="section-inner site-footer__inner">
        <a className="site-footer__logo" href="#top">
          GlassWave
        </a>

        <nav className="site-footer__nav" aria-label="Footer">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-footer__social">
          <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer">
            <IconLinkedIn />
          </a>
          <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">
            <IconInstagram />
          </a>
          <a href="https://x.com" aria-label="X" target="_blank" rel="noreferrer">
            <IconX />
          </a>
        </div>

        <p className="site-footer__copy">
          © {new Date().getFullYear()} GlassWave · Austria
        </p>
      </div>
    </footer>
  )
}
