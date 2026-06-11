import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

// Shared modeling helpers: deterministic vertex jitter for hand-sculpted
// silhouettes, shadow wiring, and reusable low-poly props.

// Renders a CC0 GLB prop (optionally a single named node from a pack),
// normalized so it stands `height` units tall with its base at y=0.
export function GLBProp({
  url,
  node = null,
  height = 1.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  const { scene } = useGLTF(url)
  const object = useMemo(() => {
    const src = node ? scene.getObjectByName(node) : scene
    if (!src) return null
    const c = src.clone(true)
    c.position.set(0, 0, 0)
    c.rotation.set(0, 0, 0)
    const size = new THREE.Vector3()
    new THREE.Box3().setFromObject(c).getSize(size)
    if (size.y > 0) c.scale.multiplyScalar(height / size.y)
    const box = new THREE.Box3().setFromObject(c)
    c.position.y = -box.min.y
    c.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    return c
  }, [scene, node, height])
  if (!object) return null
  return (
    <group position={position} rotation={rotation}>
      <primitive object={object} />
    </group>
  )
}

useGLTF.preload('/models/pine.glb')
useGLTF.preload('/models/trees.glb')

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

// Minimal chess-pawn figure — reads as "person" while staying in the
// scene's own visual language. Smooth shaded, matte, soft emissive.
const PAWN_PROFILE = (() => {
  const pts = []
  const profile = [
    [0.2, 0],
    [0.2, 0.04],
    [0.16, 0.12],
    [0.1, 0.26],
    [0.075, 0.38],
    [0.07, 0.46],
  ]
  profile.forEach(([x, y]) => pts.push(new THREE.Vector2(x, y)))
  return pts
})()

export function Pawn({ position, rotation = [0, 0, 0], color = '#22d3ee', scale = 1, cap = false }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh>
        <latheGeometry args={[PAWN_PROFILE, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.22} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <sphereGeometry args={[0.13, 20, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.4} />
      </mesh>
      {cap && (
        <group position={[0, 0.66, 0]} rotation={[0, Math.PI / 6, 0.06]}>
          <mesh>
            <boxGeometry args={[0.34, 0.035, 0.34]} />
            <meshStandardMaterial color="#2d1657" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.035, 0]}>
            <sphereGeometry args={[0.025, 8, 6]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} />
          </mesh>
        </group>
      )}
    </group>
  )
}
