const TOOLS = [
  {
    name: 'Figma',
    category: 'Design & prototyping',
    body: 'For planning layouts, exploring ideas, and creating interface designs.',
    logo: '/images/tools/figma.png',
  },
  {
    name: 'HTML',
    category: 'Page structure',
    body: 'For structuring pages with clear, semantic markup.',
    logo: '/images/tools/html.png',
  },
  {
    name: 'CSS',
    category: 'Styling & layout',
    body: 'For styling layouts that look considered across devices.',
    logo: '/images/tools/css.png',
  },
  {
    name: 'JavaScript',
    category: 'Interaction',
    body: 'For adding interactive behaviour that feels smooth and clear.',
    logo: '/images/tools/javascript.png',
  },
  {
    name: 'WordPress',
    category: 'Website creation',
    body: 'For building and customizing websites as my WordPress skills develop.',
    logo: '/images/tools/wordpress.png',
  },
]

/**
 * Tools — brand logo cards (Figma, HTML, CSS, JavaScript, WordPress).
 */
export default function ToolsSection() {
  return (
    <section
      id="tools"
      className="site-section section-light tools-tech"
      aria-labelledby="tools-title"
      data-reveal
    >
      <div className="tools-tech__bg" aria-hidden="true">
        <img src="/images/tools-bg.jpg" alt="" />
      </div>
      <div className="section-inner tools-tech__inner">
        <header className="tools-tech__copy">
          <p className="section-eyebrow">Tools &amp; Technologies</p>
          <h2 id="tools-title" className="section-title">
            The stack I <span className="text-gradient">ship with</span>
          </h2>
          <p className="section-lede section-lede--light">
            Design-to-code tools chosen for speed in exploration and precision
            in production — not for trend lists.
          </p>
        </header>

        <ul className="tools-tech__cards">
          {TOOLS.map(({ name, category, body, logo }) => (
            <li key={name} className="glass-card glass-card--light tools-tech__card">
              <span className="tools-tech__logo" aria-hidden="true">
                <img src={logo} alt="" width={56} height={56} />
              </span>
              <h3 className="tools-tech__name">{name}</h3>
              <p className="tools-tech__category">{category}</p>
              <p className="tools-tech__body">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
