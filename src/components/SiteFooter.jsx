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
 * Site footer — dark bar under Contact (Mary · nav · copyright).
 */
export default function SiteFooter() {
  return (
    <footer className="site-footer section-dark" data-reveal>
      <div className="section-inner site-footer__inner">
        <div className="site-footer__row">
          <a className="site-footer__logo" href="#top">
            Mary
          </a>

          <nav className="site-footer__nav" aria-label="Footer">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <p className="site-footer__copy">
            © 2026 Mary. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
