import { useState } from 'react'

const INITIAL = {
  name: '',
  email: '',
  projectType: '',
  timeline: '',
  message: '',
}

const PROJECT_TYPES = [
  { value: '', label: 'Select one' },
  { value: 'new-website', label: 'New website' },
  { value: 'landing-page', label: 'Landing page' },
  { value: 'redesign', label: 'Redesign' },
  { value: 'not-sure', label: 'Not sure yet' },
]

const TIMELINES = [
  { value: '', label: 'Select one' },
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-2-months', label: '1-2 months' },
  { value: 'exploring', label: 'Just exploring' },
]

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
    if (!values.projectType) next.projectType = 'Please choose a project type.'
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
    console.log('Contact form submit:', values)
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
              site to leave. Based in Austria, working with clients worldwide.
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
              <label className="contact-form__label" htmlFor="contact-project-type">
                Project type
              </label>
              <select
                id="contact-project-type"
                className={`contact-form__input contact-form__select${
                  errors.projectType ? ' is-invalid' : ''
                }${values.projectType ? '' : ' is-placeholder'}`}
                name="projectType"
                required
                value={values.projectType}
                onChange={onChange}
                aria-invalid={errors.projectType ? 'true' : 'false'}
                aria-describedby={
                  errors.projectType ? 'contact-project-type-error' : undefined
                }
              >
                {PROJECT_TYPES.map((option) => (
                  <option
                    key={option.label}
                    value={option.value}
                    disabled={option.value === ''}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.projectType ? (
                <p id="contact-project-type-error" className="contact-form__error">
                  {errors.projectType}
                </p>
              ) : null}
            </div>

            <div className="contact-form__field">
              <label className="contact-form__label" htmlFor="contact-timeline">
                Timeline
              </label>
              <select
                id="contact-timeline"
                className={`contact-form__input contact-form__select${
                  values.timeline ? '' : ' is-placeholder'
                }`}
                name="timeline"
                value={values.timeline}
                onChange={onChange}
              >
                {TIMELINES.map((option) => (
                  <option
                    key={option.label}
                    value={option.value}
                    disabled={option.value === ''}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="contact-form__field">
              <label className="contact-form__label" htmlFor="contact-message">
                Message
              </label>
              <textarea
                id="contact-message"
                className="contact-form__input contact-form__textarea"
                name="message"
                rows={5}
                value={values.message}
                onChange={onChange}
                placeholder="Goals, references, timing…"
              />
            </div>

            <button className="btn btn-primary contact-form__submit" type="submit">
              Send message
            </button>

            <p className="contact-form__status" role="status" aria-live="polite">
              {status === 'sent'
                ? "Thanks, I'll reply soon."
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
