import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ANIMATION_SPEED, COLORS } from '../config'

/** Horizontal serpentine pose — framed on the hero right. */
const BASE_ROT = [0.12, -0.42, -0.06]
const BASE_POS_DESKTOP = [0.85, 0.05, 0]
const BASE_POS_MOBILE = [0.15, -0.05, 0]

/** Restrained cursor influence (radians). */
const MAX_RX = 0.12
const MAX_RY = 0.2
const MAX_RZ = 0.055
const MAX_DEPTH = 0.1
const MAX_LIFT = 0.035

/** Idle float — subtle, combines with cursor without fighting it. */
const IDLE_RX = 0.02
const IDLE_RY = 0.035
const IDLE_Z = 0.015

const DAMP = 3.2

/**
 * Build a thick glass ribbon path matching the reference wave:
 * enter low-left → primary crest → trough → secondary rise → exit right.
 */
function createRibbonGeometry() {
  const curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-3.4, -1.05, 0.55),
      new THREE.Vector3(-2.55, -0.35, 0.75),
      new THREE.Vector3(-1.55, 1.05, 0.25),
      new THREE.Vector3(-0.55, 0.35, -0.45),
      new THREE.Vector3(0.35, -0.7, 0.1),
      new THREE.Vector3(1.25, 0.15, 0.55),
      new THREE.Vector3(2.15, 0.95, -0.05),
      new THREE.Vector3(3.15, 0.2, -0.4),
    ],
    false,
    'catmullrom',
    0.45,
  )

  const geo = new THREE.TubeGeometry(curve, 280, 0.38, 48, false)
  geo.computeVertexNormals()
  return geo
}

/**
 * Serpentine glass ribbon — TubeGeometry + MeshPhysicalMaterial, cursor tilt.
 */
export default function GlassKnot({
  isMobile = false,
  pointerRef,
  interactive = true,
}) {
  const groupRef = useRef(null)
  const smoothed = useRef({ x: 0, y: 0, active: 0 })

  const { geometry, material } = useMemo(() => {
    const geo = createRibbonGeometry()

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0D2B6B'),
      metalness: 0.35,
      roughness: 0.04,
      transmission: 0.72,
      thickness: 1.45,
      ior: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      transparent: true,
      opacity: 1,
      envMapIntensity: 1.65,
      attenuationColor: new THREE.Color(COLORS.electricBlue),
      attenuationDistance: 0.55,
      emissive: new THREE.Color('#061530'),
      emissiveIntensity: 0.08,
      specularIntensity: 1,
      specularColor: new THREE.Color('#FFFFFF'),
      sheen: 0.2,
      sheenRoughness: 0.28,
      sheenColor: new THREE.Color(COLORS.iceCyan),
      iridescence: 0.1,
      iridescenceIOR: 1.28,
      iridescenceThicknessRange: [100, 360],
    })

    return { geometry: geo, material: mat }
  }, [])

  const basePos = isMobile ? BASE_POS_MOBILE : BASE_POS_DESKTOP
  const scale = isMobile ? 0.52 : 0.78

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return

    const dt = Math.min(delta, 0.05)
    const speed = ANIMATION_SPEED
    const t = state.clock.elapsedTime * speed

    const ptr = pointerRef?.current
    const targetX = interactive && ptr ? ptr.x : 0
    const targetY = interactive && ptr ? ptr.y : 0
    const targetActive = interactive && ptr?.inside ? 1 : 0

    const s = smoothed.current
    s.x = THREE.MathUtils.damp(s.x, targetX, DAMP, dt)
    s.y = THREE.MathUtils.damp(s.y, targetY, DAMP, dt)
    s.active = THREE.MathUtils.damp(s.active, targetActive, DAMP * 0.85, dt)

    const idleAmp = 1 - s.active * 0.35
    const idleRx = Math.sin(t * 0.55) * IDLE_RX * idleAmp
    const idleRy = Math.cos(t * 0.38) * IDLE_RY * idleAmp
    const idleZ = Math.sin(t * 0.42) * IDLE_Z * idleAmp

    const cursorRx = -s.y * MAX_RX
    const cursorRy = s.x * MAX_RY
    const cursorRz = s.x * MAX_RZ * 0.55 - s.y * MAX_RZ * 0.35

    group.rotation.x = BASE_ROT[0] + cursorRx + idleRx
    group.rotation.y = BASE_ROT[1] + cursorRy + idleRy
    group.rotation.z = BASE_ROT[2] + cursorRz

    group.position.x = basePos[0]
    group.position.y = basePos[1] + s.y * -MAX_LIFT + idleZ * 0.35
    group.position.z =
      basePos[2] +
      s.active * (s.x * 0.02) +
      Math.abs(s.y) * -MAX_DEPTH * 0.35 +
      idleZ

    // Turning slides studio light streaks across the ribbon
    material.envMapIntensity = 1.55 + s.active * 0.22 + Math.abs(s.x) * 0.08
  })

  return (
    <group ref={groupRef} position={basePos} rotation={BASE_ROT} scale={scale}>
      <mesh geometry={geometry} material={material} />
    </group>
  )
}
