import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import IslandBase from './IslandBase'

// The builder's desk: a cozy floating workspace for the About stop —
// desk, glowing laptop, warm lamp, coffee, and a stack of books.

export default function AboutIsland({ position }) {
  const screen = useRef()
  const glyphs = useRef([])
  const steam = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Screen flickers faintly, like code scrolling
    if (screen.current) {
      screen.current.material.emissiveIntensity = 1.1 + Math.sin(t * 7) * 0.12 + Math.sin(t * 13) * 0.06
    }
    // Code glyphs orbit lazily above the laptop
    glyphs.current.forEach((g, i) => {
      if (!g) return
      const a = t * 0.5 + (i * Math.PI * 2) / 3
      g.position.set(Math.cos(a) * 0.5, 1.05 + Math.sin(t * 1.2 + i) * 0.08, Math.sin(a) * 0.5)
      g.rotation.y = t * 0.8 + i
    })
    // Coffee steam puff drifts up and fades
    if (steam.current) {
      const s = (t * 0.3 + 0.4) % 1
      steam.current.position.y = 0.62 + s * 0.3
      steam.current.material.opacity = 0.4 * (1 - s)
      steam.current.scale.setScalar(0.5 + s * 0.8)
    }
  })

  return (
    <IslandBase position={position} color="#8b5cf6" scale={0.85} seed={9}>
      {/* Desk */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.0, 0.06, 0.55]} />
        <meshStandardMaterial color="#6b4f3a" flatShading roughness={0.7} />
      </mesh>
      {[
        [-0.44, -0.22],
        [-0.44, 0.22],
        [0.44, -0.22],
        [0.44, 0.22],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.19, z]}>
          <boxGeometry args={[0.05, 0.38, 0.05]} />
          <meshStandardMaterial color="#553e2c" flatShading />
        </mesh>
      ))}

      {/* Laptop */}
      <group position={[-0.1, 0.44, 0.02]} rotation={[0, 0.25, 0]}>
        <mesh position={[0, 0.012, 0.09]}>
          <boxGeometry args={[0.36, 0.025, 0.22]} />
          <meshStandardMaterial color="#2d2440" flatShading roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh ref={screen} position={[0, 0.12, -0.045]} rotation={[-0.32, 0, 0]}>
          <boxGeometry args={[0.36, 0.24, 0.018]} />
          <meshStandardMaterial
            color="#0a2a33"
            emissive="#22d3ee"
            emissiveIntensity={1.1}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Orbiting code glyphs */}
      {[0, 1, 2].map((i) => (
        <mesh key={`g${i}`} ref={(el) => (glyphs.current[i] = el)} position={[0.5, 1.05, 0]}>
          <octahedronGeometry args={[0.05, 0]} />
          <meshStandardMaterial
            color={['#d946ef', '#22d3ee', '#fbbf24'][i]}
            emissive={['#d946ef', '#22d3ee', '#fbbf24'][i]}
            emissiveIntensity={1.8}
            flatShading
          />
        </mesh>
      ))}

      {/* Coffee mug + steam */}
      <group position={[0.33, 0.46, 0.12]}>
        <mesh position={[0, 0.045, 0]}>
          <cylinderGeometry args={[0.05, 0.045, 0.09, 10]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.5} />
        </mesh>
        <mesh position={[0.06, 0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.03, 0.01, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.5} />
        </mesh>
      </group>
      <mesh ref={steam} position={[0.33, 0.62, 0.12]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <meshStandardMaterial color="#f5f1ff" transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* Desk lamp with warm light */}
      <group position={[0.42, 0.44, -0.18]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.03, 8]} />
          <meshStandardMaterial color="#2d2440" flatShading />
        </mesh>
        <mesh position={[-0.04, 0.12, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 6]} />
          <meshStandardMaterial color="#2d2440" flatShading />
        </mesh>
        <mesh position={[-0.12, 0.2, 0]} rotation={[0, 0, 1.1]}>
          <coneGeometry args={[0.05, 0.08, 8]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={1.4}
            flatShading
          />
        </mesh>
        <pointLight position={[-0.16, 0.14, 0]} color="#ffd9a0" intensity={1.6} distance={1.6} />
      </group>

      {/* Book stacks on the turf */}
      {[
        { p: [-0.85, 0, 0.55], colors: ['#d946ef', '#22d3ee'] },
        { p: [0.9, 0, 0.5], colors: ['#34d399', '#fb7185', '#8b5cf6'] },
      ].map((stack, si) => (
        <group key={`bk${si}`} position={stack.p}>
          {stack.colors.map((c, i) => (
            <mesh key={i} position={[0, 0.04 + i * 0.08, 0]} rotation={[0, i * 0.7, 0]}>
              <boxGeometry args={[0.3, 0.07, 0.22]} />
              <meshStandardMaterial color={c} flatShading roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}
    </IslandBase>
  )
}
