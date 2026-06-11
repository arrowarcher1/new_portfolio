import { useMemo } from 'react'
import * as THREE from 'three'

// Shared modeling helpers: deterministic vertex jitter for hand-sculpted
// silhouettes, shadow wiring, and reusable low-poly props.

// Deterministic per-vertex displacement — turns perfect primitives into
// organic-looking rock/foliage. Indexed geometry keeps shared vertices
// together so faces never crack apart.
export function jitterGeometry(geo, amount = 0.12, seed = 1) {
  const pos = geo.attributes.position
  const rand = (i, n) => {
    const x = Math.sin(i * 127.1 + seed * 311.7 + n * 74.7) * 43758.5453
    return x - Math.floor(x) - 0.5
  }
  for (let i = 0; i < pos.count; i++) {
    pos.setXYZ(
      i,
      pos.getX(i) + rand(i, 1) * amount,
      pos.getY(i) + rand(i, 2) * amount * 0.7,
      pos.getZ(i) + rand(i, 3) * amount,
    )
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

export function useJittered(create, amount, seed) {
  return useMemo(() => jitterGeometry(create(), amount, seed), [create, amount, seed])
}

// Marks every opaque mesh beneath it as a shadow caster + receiver.
export function Shadows({ children }) {
  return (
    <group
      ref={(g) => {
        if (!g) return
        g.traverse((o) => {
          if (o.isMesh && !o.material?.transparent) {
            o.castShadow = true
            o.receiveShadow = true
          }
        })
      }}
    >
      {children}
    </group>
  )
}

export function PineTree({ position, scale = 1, seed = 1 }) {
  const foliage = useMemo(() => {
    return [0, 1, 2].map((i) =>
      jitterGeometry(new THREE.ConeGeometry(0.34 - i * 0.09, 0.42, 6), 0.05, seed + i),
    )
  }, [seed])
  const greens = ['#1f8f6f', '#27a37a', '#2fb98a']
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.28, 5]} />
        <meshStandardMaterial color="#6b4f3a" flatShading roughness={0.9} />
      </mesh>
      {foliage.map((g, i) => (
        <mesh key={i} geometry={g} position={[0, 0.4 + i * 0.3, 0]}>
          <meshStandardMaterial color={greens[i]} flatShading roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

export function RoundTree({ position, scale = 1, seed = 5 }) {
  const canopy = useMemo(
    () => jitterGeometry(new THREE.IcosahedronGeometry(0.4, 0), 0.09, seed),
    [seed],
  )
  const tuft = useMemo(
    () => jitterGeometry(new THREE.IcosahedronGeometry(0.22, 0), 0.06, seed + 9),
    [seed],
  )
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.4, 5]} />
        <meshStandardMaterial color="#6b4f3a" flatShading roughness={0.9} />
      </mesh>
      <mesh geometry={canopy} position={[0, 0.62, 0]}>
        <meshStandardMaterial color="#36b97f" flatShading roughness={0.8} />
      </mesh>
      <mesh geometry={tuft} position={[0.24, 0.46, 0.12]}>
        <meshStandardMaterial color="#2fae76" flatShading roughness={0.8} />
      </mesh>
    </group>
  )
}

export function Lantern({ position, color = '#fbbf24', scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.025, 0.035, 0.6, 5]} />
        <meshStandardMaterial color="#2d2440" flatShading roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.64, 0]}>
        <boxGeometry args={[0.12, 0.14, 0.12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.8}
          flatShading
        />
      </mesh>
      <mesh position={[0, 0.74, 0]}>
        <coneGeometry args={[0.1, 0.09, 4]} />
        <meshStandardMaterial color="#2d2440" flatShading />
      </mesh>
    </group>
  )
}
