import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import IslandBase from './IslandBase'

// Two crystalline AI entities negotiating at a table: faceted cores with
// orbiting rings, each studying a floating holo-screen, an offer-orb
// shuttling between them, live deal terms as a bar chart on the tabletop.

function CrystalAgent({ position, color, timeOffset = 0 }) {
  const core = useRef()
  const shell = useRef()
  const ring = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime + timeOffset
    if (core.current) {
      core.current.rotation.y = t * 0.6
      core.current.position.y = 1.0 + Math.sin(t * 1.4) * 0.06
    }
    if (shell.current) {
      shell.current.rotation.y = -t * 0.25
      shell.current.rotation.x = Math.sin(t * 0.5) * 0.2
      shell.current.position.y = 1.0 + Math.sin(t * 1.4) * 0.06
    }
    if (ring.current) {
      ring.current.rotation.z = t * 0.5
      ring.current.position.y = 1.0 + Math.sin(t * 1.4) * 0.06
    }
  })

  return (
    <group position={position}>
      {/* Faceted core */}
      <mesh ref={core} position={[0, 1.0, 0]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.8}
          flatShading
        />
      </mesh>
      {/* Translucent shell */}
      <mesh ref={shell} position={[0, 1.0, 0]}>
        <icosahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.22}
          flatShading
          depthWrite={false}
        />
      </mesh>
      {/* Orbit ring */}
      <mesh ref={ring} position={[0, 1.0, 0]} rotation={[Math.PI / 2.6, 0.3, 0]}>
        <torusGeometry args={[0.46, 0.014, 8, 40]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
      </mesh>
      {/* Grounding glow on the turf */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.34, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight position={[0, 1.2, 0.3]} color={color} intensity={4} distance={3} />
    </group>
  )
}

function HoloScreen({ position, rotation, color }) {
  return (
    <group position={position} rotation={rotation}>
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
      orb.current.position.y = 1.0 + (1 - s * s) * 0.2
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
    <IslandBase position={position} color={color} seed={2}>
      {/* Negotiation pavilion over the table */}
      {[
        [-0.85, -0.85],
        [-0.85, 0.85],
        [0.85, -0.85],
        [0.85, 0.85],
      ].map(([x, z], i) => (
        <mesh key={`post${i}`} position={[x, 0.62, z]}>
          <cylinderGeometry args={[0.045, 0.06, 1.24, 5]} />
          <meshStandardMaterial color="#3b2a66" flatShading roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 1.42, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.32, 0.5, 4]} />
        <meshStandardMaterial color="#4c3a78" flatShading roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.07, 8, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>

      {/* Negotiation table */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.55, 0.42, 0.1, 6]} />
        <meshStandardMaterial color="#2d1657" flatShading roughness={0.35} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.358, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.015, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} depthWrite={false} />
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

      <CrystalAgent position={[-1.35, 0, 0]} color="#ec4899" />
      <CrystalAgent position={[1.35, 0, 0]} color="#22d3ee" timeOffset={2.1} />
      <HoloScreen position={[-1.05, 1.15, 0.55]} rotation={[0, 0.5, 0.06]} color="#ec4899" />
      <HoloScreen position={[1.05, 1.15, -0.55]} rotation={[0, Math.PI - 0.5, -0.06]} color="#22d3ee" />

      {/* The offer orb */}
      <mesh ref={orb} position={[0, 1.05, 0]}>
        <icosahedronGeometry args={[0.14, 1]} />
        <meshStandardMaterial color="#fff7fb" emissive="#f0abfc" emissiveIntensity={3} />
      </mesh>

      {/* ZOPA ring hovering above the pavilion */}
      <mesh ref={ring} position={[0, 2.25, 0]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.55, 0.025, 8, 40]} />
        <meshStandardMaterial color="#f0abfc" emissive="#d946ef" emissiveIntensity={1.6} />
      </mesh>
    </IslandBase>
  )
}
