import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
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
    <IslandBase position={position} color={color}>
      {/* Anchor vault on the turf */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial
          color="#0f3d2e"
          emissive={color}
          emissiveIntensity={0.5}
          flatShading
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>

      {/* Chain links */}
      <Line
        points={[new THREE.Vector3(0, 0.45, 0), ...blockPositions]}
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
        </mesh>
      ))}
    </IslandBase>
  )
}
