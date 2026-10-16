import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

/**
 * Yaw + palette. Positions/sizes live in RING_LAYOUT (image-space).
 * yawSign: -1 = openings toward screen-left (flip to 1 if reversed).
 */
const RING_CONFIG = {
  yawStart: 18,
  yawEnd: 42,
  yawExponent: 1.25,
  yawSign: 1,
  palette: {
    base: '#d9cff4',
    highlight: '#ffffff',
    lavender: '#c3aef3',
    pink: '#f3c9f0',
    warmRim: '#ffcf8a',
    deepShade: '#b3a2e2',
    coolFill: '#c9b8f5',
  },
}

/** focus-bg.jpg intrinsic size — used for object-fit: cover mapping */
const BG_IMAGE = { w: 1024, h: 571 }

/**
 * Torus tube radius when major radius = 1.
 * BG rings: tube diameter ≈ 18% of outer diameter → tube ≈ 0.22
 */
const RING_TUBE = 0.22
const RING_GEO_OUTER = 2 * (1 + RING_TUBE)

/**
 * One entry per painted ring in focus-bg.jpg (left → right).
 * nx, ny = center in IMAGE space 0–1 (not viewport).
 * d = outer diameter as fraction of IMAGE width.
 * Measured against 1024×571 focus-bg.jpg (cover-mapped to the Focus frame).
 */
const RING_LAYOUT = [
  { nx: 0.195, ny: 0.581, d: 0.024 }, // leftmost — red marker (guide image)
  { nx: 0.235, ny: 0.47, d: 0.036 },
  { nx: 0.285, ny: 0.465, d: 0.046 },
  { nx: 0.338, ny: 0.452, d: 0.06 },
  { nx: 0.4, ny: 0.422, d: 0.078 },
  { nx: 0.47, ny: 0.385, d: 0.102 },
  { nx: 0.548, ny: 0.335, d: 0.135 },
  { nx: 0.635, ny: 0.28, d: 0.178 },
  { nx: 0.72, ny: 0.24, d: 0.23 },
  { nx: 0.8, ny: 0.215, d: 0.295 },
  { nx: 0.875, ny: 0.205, d: 0.365 },
]

/**
 * Crystals inside the rings (reference: cyan / gold / violet / magenta gems).
 * All rings include a crystal (CRYSTAL_START = 0).
 */
const CRYSTAL_START = 0
const CRYSTAL_SIZE = 0.2 // fraction of ring scale; raise for bigger crystals
const CRYSTAL_STYLES = [
  { shape: 'octa', color: '#5ec8ff' }, // bright cyan
  { shape: 'shard', color: '#ffb84a' }, // amber / gold
  { shape: 'gem', color: '#9b7dff' }, // deep violet
  { shape: 'rhombus', color: '#ff6ec7' }, // magenta
  { shape: 'octa', color: '#7af0ff' }, // electric cyan
  { shape: 'shard', color: '#c49bff' }, // soft lavender
  { shape: 'gem', color: '#ffcf6b' }, // warm gold
  { shape: 'rhombus', color: '#5ec8ff' },
  { shape: 'octa', color: '#ffb84a' },
  { shape: 'shard', color: '#ff6ec7' },
  { shape: 'gem', color: '#7af0ff' },
]
const CRYSTAL_GEOS = {
  octa: new THREE.OctahedronGeometry(1).scale(1, 1.7, 1),
  shard: new THREE.TetrahedronGeometry(1).scale(0.75, 2.1, 0.75),
  gem: new THREE.IcosahedronGeometry(0.9, 0),
  rhombus: new THREE.OctahedronGeometry(1).scale(1.25, 1.35, 0.55),
}

/** Deterministic ±2° offset so the arc feels hand-placed. */
function rotJitter(index, channel) {
  const n = Math.sin(index * 12.9898 + channel * 78.233) * 43758.5453
  return (n - Math.floor(n)) * 4 - 2
}

function deg(d) {
  return (d * Math.PI) / 180
}

/**
 * Orthographic world units = CSS pixels.
 * xPct/yPct origin is top-left (CSS-like). z = depth for draw order only.
 */
const _pos = new THREE.Vector3()
function percentToWorld(viewW, viewH, xPct, yPct, z = 0) {
  return _pos.set(
    (xPct / 100 - 0.5) * viewW,
    -(yPct / 100 - 0.5) * viewH,
    z,
  )
}

/** Same math as CSS object-fit: cover + object-position: center. */
function coverMap(cw, ch, iw, ih) {
  const scale = Math.max(cw / iw, ch / ih)
  const tw = iw * scale
  const th = ih * scale
  return {
    scale,
    offsetX: (cw - tw) * 0.5,
    offsetY: (ch - th) * 0.5,
  }
}

/** Image-space (0–1) → canvas % (0–100), matching the cover background. */
function imageToViewPct(nx, ny, dImg, cw, ch) {
  const { scale, offsetX, offsetY } = coverMap(cw, ch, BG_IMAGE.w, BG_IMAGE.h)
  const px = offsetX + nx * BG_IMAGE.w * scale
  const py = offsetY + ny * BG_IMAGE.h * scale
  const dPx = dImg * BG_IMAGE.w * scale
  return {
    xPct: (px / cw) * 100,
    yPct: (py / ch) * 100,
    sizePct: (dPx / cw) * 100,
  }
}

function Rings({ animate }) {
  const groupRef = useRef(null)
  const pivotRefs = useRef([])
  const meshRefs = useRef([])
  const crystalRefs = useRef([])
  const { camera, size } = useThree()

  const { palette } = RING_CONFIG

  const crystalMats = useMemo(
    () =>
      CRYSTAL_STYLES.map(
        (s) =>
          new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(s.color),
            flatShading: true,
            metalness: 0.12,
            roughness: 0.02,
            transmission: 0.45,
            thickness: 0.6,
            ior: 1.7,
            clearcoat: 1,
            clearcoatRoughness: 0.02,
            iridescence: 0.85,
            envMapIntensity: 2.4,
            emissive: new THREE.Color(s.color),
            emissiveIntensity: 1.45,
            transparent: true,
            opacity: 0.92,
          }),
      ),
    [],
  )

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(palette.base),
        metalness: 1,
        roughness: 0.14,
        clearcoat: 0.3,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.3,
        reflectivity: 1,
        iridescence: 0.35,
        iridescenceIOR: 1.3,
        iridescenceThicknessRange: [200, 480],
        sheen: 0,
        emissiveIntensity: 0,
      }),
    [palette],
  )

  // Per-ring tweaks
  const materials = useMemo(() => {
    const base = new THREE.Color(palette.base)
    const shade = new THREE.Color(palette.deepShade)
    const last = RING_LAYOUT.length - 1
    return RING_LAYOUT.map((_, i) => {
      const mat = material.clone()
      const u = i / last
      mat.transparent = true
      mat.depthWrite = true
      mat.color.copy(base).lerp(shade, (1 - u) * 0.08)
      mat.envMapIntensity = 1.2 + u * 0.3
      mat.emissiveIntensity = 0
      mat.sheen = 0
      mat.roughness = 0.16 - u * 0.04
      return mat
    })
  }, [material, palette])

  const geometry = useMemo(
    () => new THREE.TorusGeometry(1, RING_TUBE, 64, 160),
    [],
  )

  const layout = useMemo(() => {
    const n = RING_LAYOUT.length
    const last = n - 1
    return RING_LAYOUT.map((cfg, i) => {
      const t = i / last
      const yawT = t ** RING_CONFIG.yawExponent
      const yawDeg =
        RING_CONFIG.yawSign *
        (RING_CONFIG.yawStart +
          (RING_CONFIG.yawEnd - RING_CONFIG.yawStart) * yawT +
          rotJitter(i, 1))

      return {
        nx: cfg.nx,
        ny: cfg.ny,
        d: cfg.d,
        yaw: deg(yawDeg),
        // Slight z separation so nearer (larger) rings draw correctly
        z: i * 0.02,
        phase: i * 0.85,
      }
    })
  }, [])

  useFrame((state) => {
    const cam = camera
    const viewW = size.width
    const viewH = size.height

    // Orthographic: 1 world unit = 1 CSS pixel → exact cover lock
    cam.left = -viewW / 2
    cam.right = viewW / 2
    cam.top = viewH / 2
    cam.bottom = -viewH / 2
    cam.zoom = 1
    cam.near = -100
    cam.far = 100
    cam.position.set(0, 0, 10)
    cam.up.set(0, 1, 0)
    cam.lookAt(0, 0, 0)
    cam.updateProjectionMatrix()
    cam.updateMatrixWorld()

    if (groupRef.current) {
      groupRef.current.rotation.set(0, 0, 0)
    }

    const t = state.clock.elapsedTime

    layout.forEach((ring, i) => {
      const pivot = pivotRefs.current[i]
      const mesh = meshRefs.current[i]
      if (!pivot || !mesh) return

      const view = imageToViewPct(ring.nx, ring.ny, ring.d, viewW, viewH)
      const pos = percentToWorld(viewW, viewH, view.xPct, view.yPct, ring.z)

      pivot.position.copy(pos)
      pivot.rotation.set(0, 0, 0)
      pivot.scale.set(1, 1, 1)

      mesh.position.set(0, 0, 0)
      mesh.rotation.order = 'XYZ'
      // Face camera in ortho (yaw around Y still reads as chrome tilt)
      mesh.rotation.set(0, ring.yaw, 0)

      // Outer diameter in CSS pixels (= world units)
      const diameterPx = (view.sizePct / 100) * viewW
      mesh.scale.setScalar(diameterPx / RING_GEO_OUTER)

      const crystal = crystalRefs.current[i]
      if (crystal) {
        const unit = diameterPx / RING_GEO_OUTER
        const s =
          unit * CRYSTAL_SIZE * (i >= RING_LAYOUT.length - 2 ? 0.55 : 1)
        crystal.scale.set(s, s, s)
        crystal.rotation.y = animate
          ? t * (0.35 + (i % 3) * 0.12) + ring.phase
          : ring.phase
        crystal.position.y = 0
      }
    })
  })

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
      materials.forEach((m) => m.dispose())
      crystalMats.forEach((m) => m.dispose())
    },
    [geometry, material, materials, crystalMats],
  )

  return (
    <group ref={groupRef}>
      {layout.map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            pivotRefs.current[i] = el
          }}
        >
          <mesh
            ref={(el) => {
              meshRefs.current[i] = el
            }}
            geometry={geometry}
            material={materials[i]}
          />
          {i >= CRYSTAL_START && (
            <mesh
              ref={(el) => {
                crystalRefs.current[i] = el
              }}
              geometry={
                CRYSTAL_GEOS[
                  CRYSTAL_STYLES[(i - CRYSTAL_START) % CRYSTAL_STYLES.length].shape
                ]
              }
              material={
                crystalMats[(i - CRYSTAL_START) % CRYSTAL_STYLES.length]
              }
            />
          )}
        </group>
      ))}
    </group>
  )
}

function StudioLights() {
  const { palette } = RING_CONFIG
  return (
    <>
      <ambientLight intensity={0.28} color={palette.lavender} />
      {/* Sunset key — strong warm gold from the right */}
      <directionalLight
        position={[7, 2.2, 2.5]}
        intensity={0.85}
        color={palette.warmRim}
      />
      {/* Cool purple fill — left / sky */}
      <directionalLight
        position={[-5, 2.5, 2]}
        intensity={0.5}
        color={palette.coolFill}
      />
      {/* Soft bottom bounce — valley mist */}
      <directionalLight
        position={[0, -4, 2]}
        intensity={0.25}
        color={palette.pink}
      />
    </>
  )
}

function StudioEnvironment() {
  const { palette } = RING_CONFIG
  return (
    <Environment resolution={320} environmentIntensity={1}>
      {/* soft lavender light above, small so the rings keep dark areas to reflect */}
      <Lightformer intensity={1.6} color={palette.base} position={[0, 5, 0]} scale={[10, 6, 1]} form="rect" />
      <Lightformer intensity={1.8} color={palette.lavender} position={[-5.5, 2.5, 1]} scale={[5, 7, 1]} form="rect" />
      <Lightformer intensity={1.2} color={palette.pink} position={[-3, 4, 3]} scale={[7, 3, 1]} form="rect" />
      {/* warm sunset side */}
      <Lightformer intensity={3.2} color={palette.warmRim} position={[6, 2.5, 0]} scale={[5, 6, 1]} form="rect" />
      <Lightformer intensity={2.4} color="#ffe8c4" position={[5.2, 1.8, 3]} scale={[3, 4, 1]} form="rect" />
      <Lightformer intensity={3} color={palette.warmRim} position={[6.5, 1.5, -2]} scale={[1.2, 9, 1]} form="rect" />
      {/* sharp white streaks: this is what reads as metal */}
      <Lightformer intensity={4} color={palette.highlight} position={[-4.2, 2.8, 3.5]} scale={[0.18, 12, 1]} form="rect" />
      <Lightformer intensity={3.8} color={palette.highlight} position={[3.8, 2.6, 3.2]} scale={[0.16, 11, 1]} form="rect" />
      <Lightformer intensity={3.4} color={palette.highlight} position={[0.6, 3.4, 5.2]} scale={[0.2, 10, 1]} form="rect" />
      {/* dark floor for contrast */}
      <Lightformer intensity={0.25} color={palette.deepShade} position={[0, -3.2, 0]} scale={[16, 16, 1]} form="rect" />
      {/* faint edge fills, only enough to stop black outlines */}
      <Lightformer intensity={0.35} color={palette.lavender} position={[0, 0, -10]} scale={[40, 40, 1]} form="rect" />
      <Lightformer intensity={0.35} color={palette.base} position={[-10, 0, 0]} rotation-y={Math.PI / 2} scale={[30, 30, 1]} form="rect" />
      <Lightformer intensity={0.35} color={palette.pink} position={[10, 0, 0]} rotation-y={-Math.PI / 2} scale={[30, 30, 1]} form="rect" />
    </Environment>
  )
}

function Scene({ animate, isMobile }) {
  return (
    <>
      <StudioLights />
      <Suspense fallback={null}>
        <StudioEnvironment />
        <Rings animate={animate} />
        <Sparkles
          count={90}
          position={[120, 80, 1]}
          scale={[900, 280, 40]}
          size={4}
          speed={0.22}
          opacity={0.7}
          color="#e8f4ff"
        />
      </Suspense>
      {!isMobile && (
        <Suspense fallback={null}>
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom
              intensity={0.22}
              luminanceThreshold={0.72}
              luminanceSmoothing={0.4}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      )}
    </>
  )
}

/**
 * Metallic chrome ring arc — transparent WebGL, no scene background.
 * Renderer: Three.js via @react-three/fiber (Canvas / WebGL).
 */
export default function MetallicRings() {
  const wrapRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [visible, setVisible] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 640px)')
    const sync = () => setIsMobile(mqMobile.matches)
    sync()
    mqMobile.addEventListener('change', sync)
    return () => mqMobile.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05, rootMargin: '80px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const animate = visible && !reduceMotion

  return (
    <div className="metallic-rings" ref={wrapRef} aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1.25 : 1.6]}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        orthographic
        camera={{ position: [0, 0, 10], zoom: 1, near: -100, far: 100 }}
        frameloop={visible ? 'always' : 'demand'}
        onCreated={({ gl, camera: cam }) => {
          gl.setClearColor(0x000000, 0)
          // Prevent R3F from overwriting our pixel-locked frustum
          cam.manual = true
        }}
      >
        <Suspense fallback={null}>
          <Scene animate={animate} isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  )
}
