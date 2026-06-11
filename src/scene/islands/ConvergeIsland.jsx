import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import IslandBase from './IslandBase'

// Two hologram agents at a table, an offer-orb shuttling between them.

function Agent({ position, color, facing = 1 }) {
  return (
    <group position={position} rotation={[0, (Math.PI / 2) * facing, 0]}>
      <mesh position={[0, 0.42, 0]}>
        <coneGeometry args={[0.28, 0.85, 5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.9}
          flatShading
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.2, 12, 10]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} />
      </mesh>
    </group>
  )
}

export default function ConvergeIsland({ position, color = '#ec4899' }) {
  const orb = useRef()
  const ring = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (orb.current) {
      // Offer shuttles between the two agents, arcing slightly upward mid-flight
      const s = Math.sin(t * 1.5)
      orb.current.position.x = s * 0.85
      orb.current.position.y = 1.05 + Math.abs(Math.cos(t * 1.5)) * 0.0 + (1 - s * s) * 0.3
      const pulse = 1 + Math.sin(t * 6) * 0.12
      orb.current.scale.setScalar(pulse)
    }
    if (ring.current) {
      ring.current.rotation.z = t * 0.4
    }
  })

  return (
    <IslandBase position={position} color={color}>
      {/* Negotiation table */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.5, 0.36, 0.12, 6]} />
        <meshStandardMaterial color="#2d1657" flatShading roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 0.28, 6]} />
        <meshStandardMaterial color="#1d0f3a" flatShading />
      </mesh>

      <Agent position={[-1.3, 0, 0]} color="#ec4899" facing={1} />
      <Agent position={[1.3, 0, 0]} color="#22d3ee" facing={-1} />

      {/* The offer orb */}
      <mesh ref={orb} position={[0, 1.05, 0]}>
        <icosahedronGeometry args={[0.14, 1]} />
        <meshStandardMaterial color="#fff7fb" emissive="#f0abfc" emissiveIntensity={3} />
      </mesh>

      {/* ZOPA ring hovering above the deal */}
      <mesh ref={ring} position={[0, 2.1, 0]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.55, 0.025, 8, 40]} />
        <meshStandardMaterial color="#f0abfc" emissive="#d946ef" emissiveIntensity={1.6} />
      </mesh>
    </IslandBase>
  )
}
