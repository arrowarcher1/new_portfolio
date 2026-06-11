import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { samplePalette, makePaletteTarget, zToOffset } from './timeOfDay'

// Low-poly clouds scattered along the journey — clusters of flat-shaded
// icosahedra, pre-tinted by the time of day at their position on the path.
// A layer drifts below the islands so the journey feels like flying above
// a cloud deck; others float at eye level off to the sides.

const CLOUD_SLOTS = [
  // [x, y, z, scale]
  [-14, -6, 2, 2.6],
  [12, -7, -8, 3.2],
  [16, 4, -14, 1.6],
  [-11, 6, -24, 1.9],
  [-16, -6, -34, 3.4],
  [13, -8, -44, 2.8],
  [-13, 5, -52, 1.7],
  [18, -5, -60, 3.0],
  [-15, -7, -72, 3.1],
  [11, 6, -78, 1.5],
  [-12, -6, -88, 2.7],
  [17, 4, -96, 1.8],
  [-14, -8, -106, 3.0],
  [12, -6, -116, 2.4],
  [-10, 5, -122, 1.6],
  [15, -7, -130, 2.8],
]

function puffsFor(seed) {
  // Deterministic puff layout per cloud
  const rand = (n) => {
    const x = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453
    return x - Math.floor(x)
  }
  const count = 5 + Math.floor(rand(0) * 3)
  return Array.from({ length: count }, (_, i) => ({
    pos: [
      (rand(i * 3 + 1) - 0.5) * 3.2,
      (rand(i * 3 + 2) - 0.5) * 0.9,
      (rand(i * 3 + 3) - 0.5) * 1.6,
    ],
    scale: [
      0.9 + rand(i * 5 + 4) * 1.3,
      0.55 + rand(i * 5 + 5) * 0.5,
      0.8 + rand(i * 5 + 6) * 0.9,
    ],
    rot: rand(i * 7) * Math.PI,
  }))
}

export default function CloudField() {
  const group = useRef()

  const clouds = useMemo(() => {
    const palette = makePaletteTarget()
    const white = new THREE.Color('#ffffff')
    return CLOUD_SLOTS.map(([x, y, z, scale], i) => {
      samplePalette(zToOffset(z), palette)
      // Daylight clouds run white; dawn/dusk clouds pick up the horizon tint
      const tint = palette.horizon.clone().lerp(white, 0.55)
      return { pos: [x, y, z], scale, tint: `#${tint.getHexString()}`, puffs: puffsFor(i + 1), phase: i * 1.7 }
    })
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!group.current) return
    group.current.children.forEach((cloud, i) => {
      cloud.position.x = clouds[i].pos[0] + Math.sin(t * 0.07 + clouds[i].phase) * 1.4
    })
  })

  return (
    <group ref={group}>
      {clouds.map((cloud, i) => (
        <group key={i} position={cloud.pos} scale={cloud.scale}>
          {cloud.puffs.map((p, j) => (
            <mesh key={j} position={p.pos} scale={p.scale} rotation={[0, p.rot, 0]}>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={cloud.tint} flatShading roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
