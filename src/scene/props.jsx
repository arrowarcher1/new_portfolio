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
