import MetallicRings from './MetallicRings'

/**
 * Bridge under the hero — metallic rings over valley background.
 */
export default function FocusSection() {
  return (
    <section
      id="focus"
      className="site-section section-light focus"
      aria-label="Focus"
    >
      <div className="focus__bg" aria-hidden="true">
        <img src="/images/focus-bg.jpg" alt="" />
      </div>
      <MetallicRings />
    </section>
  )
}
