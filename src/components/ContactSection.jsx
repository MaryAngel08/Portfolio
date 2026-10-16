import { useState } from 'react'

const INITIAL = { name: '', email: '', message: '' }

/**
 * Contact — light section, copy left + glass form right.
 */
export default function ContactSection() {
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const validate = () => {
    const next = {}
    if (!values.name.trim()) next.name = 'Please enter your name.'
    if (!values.email.trim()) {
      next.email = 'Please enter your email.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      next.email = 'Enter a valid email address.'
    }
    if (!values.message.trim()) next.message = 'Please write a short message.'
    else if (values.message.trim().length < 10) {
      next.message = 'A bit more detail helps (10+ characters).'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!validate()) {
      setStatus('error')
      return
    }
    setStatus('sent')
    setValues(INITIAL)
  }

  return (
    <section
      id="contact"
      className="site-section section-light contact"
      aria-labelledby="contact-title"
      data-reveal
    >
      <div className="contact__bg" aria-hidden="true">
        <img src="/images/contact-bg.jpg" alt="" />
      </div>
      <div className="section-inner contact__inner">
        <div className="contact__grid">
          <header className="contact__copy">
            <p className="section-eyebrow">Contact</p>
            <h2 id="contact-title" className="section-title">
              Let’s build something{' '}
              <span className="text-gradient">luminous</span>
            </h2>
            <p className="section-lede section-lede--light">
              Tell me about your brand, timeline, and the feeling you want the
              site to leave. Based in Austria — working with clients worldwide.
            </p>

            <dl className="contact__details">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:hello@glasswave.studio">hello@glasswave.studio</a>
                </dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>Austria</dd>
              </div>
            </dl>
          </header>

          <form
            className="glass-card glass-card--light contact-form"
            onSubmit={onSubmit}
            noValidate
          >
            <p className="glass-card__label">Project inquiry</p>

            <div className="contact-form__field">
              <label className="contact-form__label" htmlFor="contact-name">
                Name
              </label>
              <input
                id="contact-name"
                className={`contact-form__input${errors.name ? ' is-invalid' : ''}`}
                name="name"
                type="text"
                autoComplete="name"
                required
                value={values.name}
                onChange={onChange}
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                placeholder="Your name"
              />
              {errors.name ? (
                <p id="contact-name-error" className="contact-form__error">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className="contact-form__field">
              <label className="contact-form__label" htmlFor="contact-email">
                Email
              </label>
              <input
                id="contact-email"
                className={`contact-form__input${errors.email ? ' is-invalid' : ''}`}
                name="email"
                type="email"
                autoComplete="email"
                required
                value={values.email}
                onChange={onChange}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                placeholder="you@studio.com"
              />
              {errors.email ? (
                <p id="contact-email-error" className="contact-form__error">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="contact-form__field">
              <label className="contact-form__label" htmlFor="contact-message">
                Message
              </label>
              <textarea
                id="contact-message"
                className={`contact-form__input contact-form__textarea${
                  errors.message ? ' is-invalid' : ''
                }`}
                name="message"
                rows={5}
                required
                value={values.message}
                onChange={onChange}
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                placeholder="Goals, references, timing…"
              />
              {errors.message ? (
                <p id="contact-message-error" className="contact-form__error">
                  {errors.message}
                </p>
              ) : null}
            </div>

            <button className="btn btn-primary contact-form__submit" type="submit">
              Send message
            </button>

            <p className="contact-form__status" role="status" aria-live="polite">
              {status === 'sent'
                ? 'Thanks — I’ll reply within two business days.'
                : status === 'error'
                  ? 'Please fix the fields above and try again.'
                  : 'No spam. Discovery call if we’re a fit.'}
            </p>
          </form>
        </div>
      </div>

    </section>
  )
}
