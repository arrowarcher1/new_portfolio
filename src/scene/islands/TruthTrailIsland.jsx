import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Line, Edges } from '@react-three/drei'
import IslandBase from './IslandBase'

// A chain of evidence blocks spiraling skyward, a verification pulse
// climbing link by link.

const BLOCKS = 6

export default function TruthTrailIsland({ position, color = '#34d399' }) {
  const blockRefs = useRef([])

  const blockPositions = useMemo(
    () =>
      Array.from({ length: BLOCKS }, (_, i) => {
        const angle = i * 1.1
        const r = 0.9 + i * 0.08
        return new THREE.Vector3(Math.cos(angle) * r, 0.55 + i * 0.62, Math.sin(angle) * r)
      }),
    [],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Pulse travels up the chain, lighting each block in turn
    const active = (t * 1.2) % BLOCKS
    blockRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const d = Math.abs(active - i)
      const heat = Math.max(0, 1 - Math.min(d, BLOCKS - d))
      mesh.material.emissiveIntensity = 0.35 + heat * 2.2
      mesh.rotation.y = t * 0.3 + i
    })
  })

  return (
    <IslandBase position={position} color={color} seed={6}>
      {/* Archive vault building */}
      <mesh position={[0, 0.36, 0]}>
        <boxGeometry args={[0.95, 0.72, 0.72]} />
        <meshStandardMaterial
          color="#0f3d2e"
          emissive={color}
          emissiveIntensity={0.4}
          flatShading
          roughness={0.4}
          metalness={0.5}
        />
        <Edges color={color} threshold={15} scale={1.04} />
      </mesh>
      {/* Pitched roof */}
      <mesh position={[0, 0.9, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.78, 0.4, 4]} />
        <meshStandardMaterial color="#143326" flatShading roughness={0.7} />
      </mesh>
      {/* Door and columns */}
      <mesh position={[0, 0.26, 0.37]}>
        <boxGeometry args={[0.26, 0.45, 0.04]} />
        <meshStandardMaterial color="#091f16" flatShading />
      </mesh>
      {[-0.36, 0.36].map((x, i) => (
        <mesh key={i} position={[x, 0.36, 0.39]}>
          <cylinderGeometry args={[0.045, 0.055, 0.72, 5]} />
          <meshStandardMaterial color="#1c5a42" flatShading roughness={0.6} />
        </mesh>
      ))}
      {/* Front step */}
      <mesh position={[0, 0.04, 0.48]}>
        <boxGeometry args={[0.42, 0.08, 0.2]} />
        <meshStandardMaterial color="#1c5a42" flatShading />
      </mesh>
      {/* Padlock sealing the door: body + shackle */}
      <group position={[0, 0.52, 0.4]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.2, 0.16, 0.08]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} flatShading metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[0.07, 0.018, 6, 16, Math.PI]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      {/* Evidence slips scattered on the turf */}
      {[
        { p: [0.85, 0.03, 0.55], r: 0.5 },
        { p: [-0.7, 0.03, 0.8], r: -0.9 },
        { p: [0.5, 0.03, -0.85], r: 1.8 },
      ].map((slip, i) => (
        <mesh key={`slip${i}`} position={slip.p} rotation={[-Math.PI / 2, 0, slip.r]}>
          <planeGeometry args={[0.3, 0.4]} />
          <meshStandardMaterial color="#e9e1fc" emissive="#e9e1fc" emissiveIntensity={0.25} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Chain links */}
      <Line
        points={[new THREE.Vector3(0, 1.05, 0), ...blockPositions]}
        color={color}
        lineWidth={1.5}
        transparent
        opacity={0.55}
      />

      {/* Evidence blocks */}
      {blockPositions.map((p, i) => (
        <mesh key={i} ref={(el) => (blockRefs.current[i] = el)} position={p}>
          <boxGeometry args={[0.34, 0.34, 0.34]} />
          <meshStandardMaterial
            color="#10241c"
            emissive={color}
            emissiveIntensity={0.35}
            flatShading
            roughness={0.3}
            metalness={0.6}
          />
          <Edges color={color} threshold={15} scale={1.04} />
        </mesh>
      ))}
    </IslandBase>
  )
}
