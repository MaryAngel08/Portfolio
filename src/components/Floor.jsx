import { COLORS } from '../config'

/** Dark satin floor with a soft blue sheen under the right-side ribbon. */
export default function Floor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color={COLORS.deepBlueBlack}
          metalness={0.1}
          roughness={0.6}
          envMapIntensity={0.25}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.7, 0, 0]} receiveShadow>
        <circleGeometry args={[2.8, 64]} />
        <meshStandardMaterial
          color="#050d18"
          metalness={0.22}
          roughness={0.4}
          transparent
          opacity={0.9}
          emissive={COLORS.deepElectricBlue}
          emissiveIntensity={0.055}
        />
      </mesh>
    </group>
  )
}
