const NAV = [
  { href: '#discover', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#tools', label: 'Tools' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
]

/**
 * Top site header — brand + section anchors over the hero.
 */
export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-header__brand" href="#top">
        GlassWave
      </a>
      <nav className="site-header__nav" aria-label="Primary">
        {NAV.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="btn btn-ghost site-header__cta" href="#contact">
        Start a project
      </a>
    </header>
  )
}
