import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import IslandBase from './IslandBase'

// Two hologram agents negotiating at a table: each studies a floating
// holo-screen, an offer-orb shuttles between them, and the live deal
// terms render as a small bar chart on the tabletop.

function Agent({ position, color, facing = 1 }) {
  return (
    <group position={position} rotation={[0, (Math.PI / 2) * facing, 0]}>
      {/* Body */}
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
      {/* Arms reaching toward the table */}
      <mesh position={[0.18, 0.55, 0.16]} rotation={[0, 0, -0.9]}>
        <cylinderGeometry args={[0.04, 0.05, 0.38, 5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} flatShading />
      </mesh>
      <mesh position={[0.18, 0.55, -0.16]} rotation={[0, 0, -0.9]}>
        <cylinderGeometry args={[0.04, 0.05, 0.38, 5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} flatShading />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.2, 12, 10]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} />
      </mesh>
      {/* Visor */}
      <mesh position={[0.13, 1.06, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.06, 0.08, 0.26]} />
        <meshStandardMaterial color="#f5f1ff" emissive="#f5f1ff" emissiveIntensity={2} />
      </mesh>
      {/* Private holo-screen floating beside the agent */}
      <group position={[0.42, 1.18, 0.52]} rotation={[0, -0.5 , 0.08]}>
        <mesh>
          <planeGeometry args={[0.46, 0.3]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {[0.08, 0.0, -0.08].map((y, i) => (
          <mesh key={i} position={[-0.04 + (i % 2) * 0.05, y, 0.002]}>
            <planeGeometry args={[0.3 - i * 0.06, 0.022]} />
            <meshBasicMaterial color={color} transparent opacity={0.75} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default function ConvergeIsland({ position, color = '#ec4899' }) {
  const orb = useRef()
  const ring = useRef()
  const bars = useRef([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (orb.current) {
      const s = Math.sin(t * 1.5)
      orb.current.position.x = s * 0.85
      orb.current.position.y = 1.05 + (1 - s * s) * 0.3
      orb.current.scale.setScalar(1 + Math.sin(t * 6) * 0.12)
    }
    if (ring.current) {
      ring.current.rotation.z = t * 0.4
    }
    // Deal terms shifting as offers land
    bars.current.forEach((bar, i) => {
      if (!bar) return
      const h = 0.16 + 0.14 * (0.5 + 0.5 * Math.sin(t * 1.5 + i * 1.9))
      bar.scale.y = h / 0.2
      bar.position.y = 0.42 + (h * 0.2) / 0.2 / 2
    })
  })

  return (
    <IslandBase position={position} color={color}>
      {/* Negotiation table */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.55, 0.42, 0.1, 6]} />
        <meshStandardMaterial color="#2d1657" flatShading roughness={0.35} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.015, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.1, 0.16, 0.28, 6]} />
        <meshStandardMaterial color="#1d0f3a" flatShading />
      </mesh>
      {/* Bar chart of live deal terms on the tabletop */}
      {[-0.16, 0, 0.16].map((x, i) => (
        <mesh key={i} ref={(el) => (bars.current[i] = el)} position={[x, 0.5, 0.22]}>
          <boxGeometry args={[0.07, 0.2, 0.07]} />
          <meshStandardMaterial
            color={i === 1 ? '#f0abfc' : '#67e8f9'}
            emissive={i === 1 ? '#f0abfc' : '#67e8f9'}
            emissiveIntensity={1.6}
          />
        </mesh>
      ))}

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
