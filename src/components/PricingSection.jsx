import PricingNetwork from './PricingNetwork'

const PLANS = [
  {
    name: 'Basic',
    kind: 'Starter website',
    price: '€450',
    period: 'from',
    description:
      'The first connection. A focused website built to establish your digital presence.',
    features: [
      '1 to 5 pages',
      'Custom visual direction',
      'Responsive design',
      'Basic SEO setup',
      'Contact / inquiry integration',
      '1 round of revisions',
    ],
    cta: 'Start Basic',
    highlighted: false,
  },
  {
    name: 'Standard',
    kind: 'Business website',
    price: '€800',
    period: 'from',
    description:
      'More than a website. A complete digital experience designed around your story.',
    features: [
      '5 to 10 pages',
      'Custom UI/UX design',
      'Advanced animations',
      'CMS integration',
      'SEO optimization',
      'Conversion-focused structure',
      '3 rounds of revisions',
    ],
    cta: 'Choose Standard',
    highlighted: true,
  },
  {
    name: 'Premium',
    kind: 'Custom experience',
    price: '€3,000',
    period: 'from',
    description:
      'A fully immersive digital world built for brands that want to be remembered.',
    features: [
      'Unique interactive design',
      'Custom animations & interactions',
      'Custom layouts & content structure',
      'E-commerce / booking / more',
      'Full SEO & performance setup',
      'Unlimited revisions',
      'Bespoke creative direction',
    ],
    cta: "Let's build it",
    highlighted: false,
  },
]

function CheckIcon() {
  return (
    <svg
      className="pricing-card__check"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.2 8.2 6.4 11.4 12.8 4.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="site-section section-dark pricing"
      aria-labelledby="pricing-title"
    >
      <div className="premium-dark__bg" aria-hidden="true">
        <span className="premium-dark__orb premium-dark__orb--a" />
        <span className="premium-dark__orb premium-dark__orb--b" />
        <span className="premium-dark__mesh" />
      </div>
      <PricingNetwork />
      <div className="section-inner pricing__inner">
        <header className="section-header">
          <p className="section-eyebrow">Pricing</p>
          <h2 id="pricing-title" className="section-title">
            Clear packages. <span className="text-gradient">Premium craft.</span>
          </h2>
          <p className="section-lede section-lede--dark">
            Transparent starting points in euros. Every engagement is tailored
            after a short discovery call.
          </p>
        </header>

        <div className="pricing-grid">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`glass-card glass-card--dark pricing-card${
                plan.highlighted ? ' is-popular' : ''
              }`}
            >
              {plan.highlighted ? (
                <span className="pricing-card__badge">Most popular</span>
              ) : null}

              <h3 className="glass-card__title pricing-card__name">{plan.name}</h3>
              <p className="glass-card__label pricing-card__kind">{plan.kind}</p>
              <div className="pricing-card__price">
                {plan.period ? (
                  <span className="pricing-card__period">{plan.period}</span>
                ) : null}
                <span className="pricing-card__amount">{plan.price}</span>
              </div>
              <p className="glass-card__body">{plan.description}</p>

              <ul className="pricing-card__features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-ghost'} pricing-card__cta`}
                href="#contact"
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
