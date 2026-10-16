/**
 * Design tokens + scene knobs.
 * Keep palette aligned with CSS variables in styles.css
 * (--bg, --blue, --cyan, --text, --muted, …).
 */

export const COLORS = {
  heroBg: '#000000',
  midnightNavy: '#000000',
  surfaceDark: '#000000',
  electricBlue: '#3B5FE0',
  highlightBlue: '#3B5FE0',
  deepElectricBlue: '#3B5FE0',
  iceCyan: '#69D7FF',
  porcelain: '#ffffff',
  mutedOnDark: 'rgba(220, 230, 255, 0.68)',
  mutedOnLight: '#5B6B85',
  muted: 'rgba(220, 230, 255, 0.68)',
  textOnDark: 'rgba(255, 255, 255, 0.92)',
  textOnLight: '#0A1A33',
  coolBlueWhite: '#DDF6FF',
  deepBlueBlack: '#000000',
  softWhite: '#ffffff',
}

/** Multiply all animation speeds (1 = normal, 0.5 = half speed). */
export const ANIMATION_SPEED = 1

/**
 * Framing — sculpture fully visible on the RIGHT with margin.
 * LEFT stays open for headline / CTAs.
 */
export const CAMERA = {
  position: [0.45, 0.95, 8.0],
  fov: 33,
  near: 0.1,
  far: 80,
  lookAt: [2.15, 0.9, 0],
  drift: {
    x: 0.02,
    y: 0.012,
    z: 0.012,
  },
}

export const BLOOM = {
  enabled: true,
  intensity: 0.18,
  luminanceThreshold: 0.88,
  luminanceSmoothing: 0.45,
}
