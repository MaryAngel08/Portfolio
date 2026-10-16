/**
 * Hero glass ribbon — full-bleed HD alpha WebM loop.
 */
export default function HeroVideo() {
  return (
    <div className="hero-ribbon-stage" aria-hidden="true">
      <video
        className="hero-ribbon hero-ribbon-video"
        src="/videos/hero-glass-ribbon.webm"
        width={2752}
        height={1536}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
      />
    </div>
  )
}
