/**
 * Full-bleed valley scene under Focus — glowing path background.
 */
export default function ValleySection() {
  return (
    <section
      id="valley"
      className="site-section valley"
      aria-label="Valley"
    >
      <div className="valley__bg" aria-hidden="true">
        <img
          src="/images/valley-path-bg.jpg"
          alt=""
          width={2048}
          height={1024}
          decoding="async"
        />
      </div>
    </section>
  )
}
