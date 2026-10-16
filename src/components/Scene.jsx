import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  Lightformer,
  ContactShadows,
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import GlassRibbon from './GlassRibbon'
import Floor from './Floor'
import { ANIMATION_SPEED, BLOOM, CAMERA, COLORS } from '../config'

function CameraRig({ reduceMotion, animate }) {
  const look = useRef(new THREE.Vector3(...CAMERA.lookAt))

  useFrame((state) => {
    const cam = state.camera
    if (!animate || reduceMotion) {
      cam.position.set(...CAMERA.position)
      cam.lookAt(look.current)
      return
    }

    const t = state.clock.elapsedTime * ANIMATION_SPEED * 0.12
    const { drift } = CAMERA
    const [bx, by, bz] = CAMERA.position

    cam.position.x = bx + Math.sin(t) * drift.x
    cam.position.y = by + Math.cos(t * 0.85) * drift.y
    cam.position.z = bz + Math.sin(t * 0.7) * drift.z
    cam.lookAt(look.current)
  })

  return null
}

function AccentLights({ reduceMotion, animate }) {
  const cyanRef = useRef()
  const blueRef = useRef()

  useFrame((state) => {
    if (reduceMotion || !animate) return
    const t = state.clock.elapsedTime * ANIMATION_SPEED
    if (cyanRef.current) {
      cyanRef.current.intensity = 0.9 + Math.sin(t * 0.32) * 0.06
    }
    if (blueRef.current) {
      blueRef.current.intensity = 1.2 + Math.cos(t * 0.28) * 0.07
    }
  })

  return (
    <>
      <ambientLight intensity={0.22} color="#101c2a" />
      <hemisphereLight
        intensity={0.3}
        color="#5A8AAA"
        groundColor={COLORS.midnightNavy}
      />
      {/* Front-right key — long speculars on ridges */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={0.55}
        color="#DDF6FF"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight
        ref={cyanRef}
        position={[-3.2, 3.2, 1.5]}
        intensity={0.9}
        color={COLORS.iceCyan}
        distance={14}
        decay={2}
      />
      <pointLight
        ref={blueRef}
        position={[4.8, 1.8, 2]}
        intensity={1.2}
        color={COLORS.deepElectricBlue}
        distance={15}
        decay={2}
      />
      <spotLight
        position={[1.5, 6.5, 4]}
        angle={0.5}
        penumbra={0.85}
        intensity={0.4}
        color={COLORS.coolBlueWhite}
      />
    </>
  )
}

/**
 * Vertical softbox strips — recreate the long warped light streaks
 * running along the ridges in the reference still.
 */
function StudioEnvironment() {
  return (
    <Environment resolution={320} environmentIntensity={1.45}>
      <Lightformer
        intensity={1.1}
        color="#B8D0E4"
        position={[0, 5.5, 0]}
        scale={[14, 14, 1]}
        form="rect"
      />
      {/* Tall cool-white softboxes = streak reflections */}
      <Lightformer
        intensity={3.2}
        color={COLORS.coolBlueWhite}
        position={[-4.8, 2.5, 2]}
        scale={[0.35, 12, 1]}
        form="rect"
      />
      <Lightformer
        intensity={2.8}
        color={COLORS.iceCyan}
        position={[5.2, 2.8, 1.5]}
        scale={[0.4, 11, 1]}
        form="rect"
      />
      <Lightformer
        intensity={2.2}
        color="#F4F6FA"
        position={[0.5, 3, 6.5]}
        scale={[0.45, 9, 1]}
        form="rect"
      />
      <Lightformer
        intensity={2.4}
        color={COLORS.deepElectricBlue}
        position={[5.5, 1.2, -1.5]}
        scale={[5, 4, 1]}
        form="rect"
      />
      <Lightformer
        intensity={0.35}
        color="#060c14"
        position={[0, -2.5, 0]}
        scale={[16, 16, 1]}
        form="rect"
      />
    </Environment>
  )
}

function SceneContent({ isMobile, reduceMotion, animate }) {
  return (
    <>
      <CameraRig reduceMotion={reduceMotion} animate={animate} />
      <AccentLights reduceMotion={reduceMotion} animate={animate} />

      <Suspense fallback={null}>
        <StudioEnvironment />
      </Suspense>

      <GlassRibbon reduceMotion={reduceMotion} animate={animate} />
      <Floor />

      <ContactShadows
        position={[1.4, 0.01, 0]}
        opacity={0.42}
        scale={14}
        blur={2.8}
        far={5}
        color="#02060c"
      />

      {!isMobile && BLOOM.enabled && (
        <Suspense fallback={null}>
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={BLOOM.intensity}
              luminanceThreshold={BLOOM.luminanceThreshold}
              luminanceSmoothing={BLOOM.luminanceSmoothing}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      )}
    </>
  )
}

export default function Scene({ isMobile, reduceMotion, isVisible }) {
  const animate = isVisible && !reduceMotion

  return (
    <Canvas
      className="canvas-wrap"
      dpr={[1, isMobile ? 1.5 : 1.8]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.12,
      }}
      camera={{
        position: CAMERA.position,
        fov: CAMERA.fov,
        near: CAMERA.near,
        far: CAMERA.far,
      }}
      shadows={!isMobile}
      frameloop={isVisible ? 'always' : 'never'}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(new THREE.Color(COLORS.midnightNavy), 1)
        scene.fog = new THREE.FogExp2(COLORS.midnightNavy, 0.045)
      }}
    >
      <SceneContent isMobile={isMobile} reduceMotion={reduceMotion} animate={animate} />
    </Canvas>
  )
}
