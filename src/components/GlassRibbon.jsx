import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ANIMATION_SPEED, COLORS } from '../config'
import { ribbonGlassProps } from '../materials/glassMaterialProps'

/**
 * Flowing glass ribbon — compact S-curve framed on the right.
 * MeshPhysicalMaterial (not MeshTransmissionMaterial) so the form
 * stays visible against midnight navy without chalk-white wash.
 */
function createSculpturePath() {
  const anchors = [
    new THREE.Vector3(0.0, 0.72, 0.14),
    new THREE.Vector3(0.26, 1.02, 0.02),
    new THREE.Vector3(0.55, 1.16, -0.14),
    new THREE.Vector3(0.82, 0.98, -0.2),
    new THREE.Vector3(1.0, 0.7, -0.02),
    new THREE.Vector3(1.14, 0.5, 0.14),
    new THREE.Vector3(1.38, 0.58, 0.2),
    new THREE.Vector3(1.62, 0.88, 0.06),
    new THREE.Vector3(1.82, 1.08, -0.06),
  ]

  const curve = new THREE.CatmullRomCurve3(anchors)
  curve.curveType = 'catmullrom'
  curve.tension = 0.46
  return curve
}

function ribbonScale(t) {
  // Near-zero tips so ends read rounded/finished, not frustum-cut
  const edge = Math.pow(Math.sin(Math.PI * t), 1.05)
  return 0.18 + edge * 0.72 + Math.sin(t * Math.PI * 2) * 0.03 * edge
}

function createRibbonGeometry(curve, tubularSegments = 140, radialSegments = 28) {
  const frames = curve.computeFrenetFrames(tubularSegments, false)
  const positions = []
  const uvs = []
  const indices = []

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments
    const point = curve.getPointAt(t)
    const normal = frames.normals[i]
    const binormal = frames.binormals[i]
    const scale = ribbonScale(t)

    const twist = t * Math.PI * 0.6 + Math.sin(t * Math.PI) * 0.25
    const cosT = Math.cos(twist)
    const sinT = Math.sin(twist)
    const nX = normal.x * cosT + binormal.x * sinT
    const nY = normal.y * cosT + binormal.y * sinT
    const nZ = normal.z * cosT + binormal.z * sinT
    const bX = -normal.x * sinT + binormal.x * cosT
    const bY = -normal.y * sinT + binormal.y * cosT
    const bZ = -normal.z * sinT + binormal.z * cosT

    const width = 0.3 * scale
    const height = 0.1 * scale

    for (let j = 0; j <= radialSegments; j++) {
      const v = (j / radialSegments) * Math.PI * 2
      const px = Math.cos(v) * width
      const py = Math.sin(v) * height
      positions.push(
        point.x + px * nX + py * bX,
        point.y + px * nY + py * bY,
        point.z + px * nZ + py * bZ,
      )
      uvs.push(t, j / radialSegments)
    }
  }

  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j
      const b = (i + 1) * (radialSegments + 1) + j
      const c = (i + 1) * (radialSegments + 1) + (j + 1)
      const d = i * (radialSegments + 1) + (j + 1)
      indices.push(a, b, d, b, c, d)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}

/** Right-weighted; scale leaves margin at all animation extremes. */
const DESKTOP = { pos: [1.75, 0.32, 0], rot: [0.05, -0.16, 0.02], scale: 0.9 }
/** Stay inside the shared camera lookAt — don't drift off-frame on narrow viewports */
const MOBILE = { pos: [1.4, 0.0, 0], rot: [0.08, -0.12, 0.02], scale: 0.58 }

export default function GlassRibbon({
  reduceMotion = false,
  animate = true,
  isMobile = false,
}) {
  const groupRef = useRef()
  const layout = isMobile ? MOBILE : DESKTOP

  const { geometry, material } = useMemo(() => {
    const geo = createRibbonGeometry(createSculpturePath(), 140, 28)
    const mat = new THREE.MeshPhysicalMaterial({
      ...ribbonGlassProps,
      color: new THREE.Color(ribbonGlassProps.color),
      attenuationColor: new THREE.Color(ribbonGlassProps.attenuationColor),
      specularColor: new THREE.Color(COLORS.iceCyan),
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
    })
    return { geometry: geo, material: mat }
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const [bx, by, bz] = layout.pos
    const [rx, ry, rz] = layout.rot

    if (!animate || reduceMotion) {
      groupRef.current.rotation.set(rx, ry, rz)
      groupRef.current.position.set(bx, by, bz)
      groupRef.current.scale.setScalar(layout.scale)
      return
    }

    const t = state.clock.elapsedTime * ANIMATION_SPEED
    groupRef.current.rotation.y = ry + Math.sin(t * 0.055) * 0.03
    groupRef.current.rotation.x = rx + Math.cos(t * 0.042) * 0.01
    groupRef.current.rotation.z = rz + Math.sin(t * 0.035) * 0.008
    groupRef.current.position.set(bx, by + Math.sin(t * 0.07) * 0.012, bz)
    groupRef.current.scale.setScalar(layout.scale)
  })

  return (
    <group
      ref={groupRef}
      position={layout.pos}
      rotation={layout.rot}
      scale={layout.scale}
    >
      <mesh geometry={geometry} material={material} castShadow />
    </group>
  )
}
