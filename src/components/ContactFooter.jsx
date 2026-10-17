import { useState } from 'react'

const NAV = [
  { href: '#discover', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#tools', label: 'Tools' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
]

export default function ContactFooter() {
  const [status, setStatus] = useState('idle')

  const onSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    setStatus('sent')
    form.reset()
  }

  return (
    <footer id="contact" className="contact-footer section-dark" aria-labelledby="contact-title">
      <div className="section-inner contact-footer__inner">
        <div className="contact-footer__grid">
          <header className="section-header contact-footer__intro">
            <p className="section-eyebrow">Contact</p>
            <h2 id="contact-title" className="section-title">
              Let’s build the next{' '}
              <span className="text-gradient">frame</span>
            </h2>
            <p className="section-lede section-lede--dark">
              Tell me about your brand, timeline, and the feeling you want the work to leave.
            </p>
            <a className="contact-footer__email" href="mailto:hello@glasswave.studio">
              hello@glasswave.studio
            </a>
          </header>

          <form className="glass-card glass-card--dark contact-form" onSubmit={onSubmit} noValidate>
            <p className="glass-card__label">Project inquiry</p>

            <label className="contact-form__field">
              <span className="contact-form__label">Name</span>
              <input
                className="contact-form__input"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Your name"
              />
            </label>

            <label className="contact-form__field">
              <span className="contact-form__label">Email</span>
              <input
                className="contact-form__input"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@agency.com"
              />
            </label>

            <label className="contact-form__field">
              <span className="contact-form__label">Message</span>
              <textarea
                className="contact-form__input contact-form__textarea"
                name="message"
                rows={4}
                required
                placeholder="Goals, references, timing…"
              />
            </label>

            <button className="btn btn-primary contact-form__submit" type="submit">
              Send message
            </button>

            <p className="contact-form__status" role="status" aria-live="polite">
              {status === 'sent'
                ? "Thanks, I'll reply within two business days."
                : 'No spam. Discovery call if we’re a fit.'}
            </p>
          </form>
        </div>

        <hr className="divider" />

        <div className="site-footer-bar">
          <p className="site-footer-bar__brand">Mary</p>
          <nav className="site-footer-bar__nav" aria-label="Footer">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <p className="site-footer-bar__copy">
            © {new Date().getFullYear()} Mary. Crafted light for modern brands.
          </p>
        </div>
      </div>
    </footer>
  )
}
