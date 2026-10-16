import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import GlassKnot from './GlassKnot'
import { COLORS } from '../config'

function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.16} color="#050d1a" />
      <hemisphereLight
        intensity={0.18}
        color="#3A6A9A"
        groundColor={COLORS.heroBg}
      />
      <directionalLight position={[4, 7, 5]} intensity={1.15} color="#FFFFFF" />
      <directionalLight position={[-4, 3, 2]} intensity={0.45} color={COLORS.iceCyan} />
      <pointLight
        position={[-2.8, 2.4, 3.2]}
        intensity={1.15}
        color={COLORS.iceCyan}
        distance={16}
        decay={2}
      />
      <pointLight
        position={[3.6, 1.4, 2.8]}
        intensity={1.35}
        color={COLORS.electricBlue}
        distance={16}
        decay={2}
      />
    </>
  )
}

function StudioEnvironment() {
  return (
    <Environment resolution={256} environmentIntensity={1.05}>
      <Lightformer
        intensity={0.2}
        color="#040912"
        position={[0, 4, -5]}
        scale={[16, 16, 1]}
        form="rect"
      />
      {/* Narrow softbox streaks — elongated speculars along the ribbon */}
      <Lightformer
        intensity={3.4}
        color={COLORS.iceCyan}
        position={[-4.5, 2.4, 2.2]}
        scale={[0.14, 14, 1]}
        form="rect"
      />
      <Lightformer
        intensity={3.2}
        color={COLORS.electricBlue}
        position={[4.8, 2.6, 1.4]}
        scale={[0.16, 13, 1]}
        form="rect"
      />
      <Lightformer
        intensity={4.0}
        color="#FFFFFF"
        position={[0.4, 3.6, 5.2]}
        scale={[0.22, 10, 1]}
        form="rect"
      />
      <Lightformer
        intensity={2.2}
        color="#DDF6FF"
        position={[1.5, -0.4, 4]}
        scale={[8, 0.18, 1]}
        form="rect"
      />
    </Environment>
  )
}

function Scene({ isMobile, pointerRef, interactive }) {
  return (
    <>
      <color attach="background" args={[COLORS.heroBg]} />
      <StudioLights />
      <Suspense fallback={null}>
        <StudioEnvironment />
        <GlassKnot
          isMobile={isMobile}
          pointerRef={pointerRef}
          interactive={interactive}
        />
      </Suspense>
    </>
  )
}

export default function HeroGlassSculpture() {
  const [isMobile, setIsMobile] = useState(false)
  const [webglOk, setWebglOk] = useState(true)
  const [interactive, setInteractive] = useState(false)
  const wrapRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0, inside: false })

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 640px)')
    const sync = () => setIsMobile(mqMobile.matches)
    sync()
    mqMobile.addEventListener('change', sync)
    return () => mqMobile.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerMq = window.matchMedia('(hover: hover) and (pointer: fine)')

    const sync = () => {
      setInteractive(!motionMq.matches && pointerMq.matches)
    }
    sync()

    motionMq.addEventListener('change', sync)
    pointerMq.addEventListener('change', sync)
    return () => {
      motionMq.removeEventListener('change', sync)
      pointerMq.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !interactive) {
      pointerRef.current = { x: 0, y: 0, inside: false }
      return undefined
    }

    const hero = wrap.closest('.hero')
    if (!hero) return undefined

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
      pointerRef.current = {
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny)),
        inside: true,
      }
    }

    const onLeave = () => {
      pointerRef.current = { x: 0, y: 0, inside: false }
    }

    hero.addEventListener('pointermove', onMove, { passive: true })
    hero.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)

    return () => {
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
      pointerRef.current = { x: 0, y: 0, inside: false }
    }
  }, [interactive])

  if (!webglOk) {
    return (
      <div className="hero-ribbon-stage" aria-hidden="true">
        <img
          className="hero-ribbon"
          src="/images/hero-glass-ribbon.png"
          alt=""
          width={1600}
          height={900}
          decoding="async"
        />
      </div>
    )
  }

  return (
    <div className="hero-canvas" ref={wrapRef} aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1.15 : 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        camera={{ position: [0.2, 0.35, 5.4], fov: 36, near: 0.1, far: 40 }}
        frameloop="always"
        onCreated={({ gl }) => {
          try {
            gl.setClearColor(new THREE.Color(COLORS.heroBg), 1)
          } catch {
            setWebglOk(false)
          }
        }}
      >
        <Suspense fallback={null}>
          <Scene
            isMobile={isMobile}
            pointerRef={pointerRef}
            interactive={interactive}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
