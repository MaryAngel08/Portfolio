import { COLORS } from '../config'

/**
 * Optical glass tuned to the luminous ribbon reference:
 * deep electric blue body, ice-cyan edge streaks, polished clearcoat.
 */
export const ribbonGlassProps = {
  color: '#5B86F0',
  metalness: 0,
  roughness: 0.03,
  transmission: 0.93,
  thickness: 1.25,
  ior: 1.48,
  clearcoat: 1,
  clearcoatRoughness: 0.02,
  transparent: true,
  opacity: 1,
  envMapIntensity: 1.55,
  attenuationColor: COLORS.electricBlue,
  attenuationDistance: 0.62,
  emissive: '#0A1E4A',
  emissiveIntensity: 0.06,
  reflectivity: 0.58,
  specularIntensity: 1,
  specularColor: '#FFFFFF',
  sheen: 0.15,
  sheenRoughness: 0.3,
  sheenColor: COLORS.iceCyan,
  iridescence: 0.12,
  iridescenceIOR: 1.3,
  iridescenceThicknessRange: [120, 380],
}
