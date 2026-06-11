import { useMemo } from 'react'
import * as THREE from 'three'
import { Float } from '@react-three/drei'

// Floating low-poly island: layered turf/soil/rock strata, a jagged
// two-tier keel with embedded boulders, rim crystals and grass tufts,
// orbiting pebbles, and a colored glow pooling beneath.
// Children are the themed scene standing on top (y=0 is the turf surface).

export default function IslandBase({
  position = [0, 0, 0],
  color = '#d946ef',
  scale = 1,
  float = true,
  children,
}) {
  const { pebbles, crystals, tufts, boulders } = useMemo(() => {
    const pebbles = Array.from({ length: 4 }, (_, i) => ({
      angle: (i / 4) * Math.PI * 2 + i * 1.3,
      radius: 3.1 + (i % 2) * 0.7,
      y: -0.6 + (i % 3) * 0.5,
      size: 0.16 + (i % 3) * 0.09,
    }))
    const crystals = Array.from({ length: 5 }, (_, i) => {
      const a = (i / 5) * Math.PI * 2 + 0.7
      return {
        pos: [Math.cos(a) * 1.95, 0.16, Math.sin(a) * 1.95],
        h: 0.28 + ((i * 7) % 3) * 0.14,
        tilt: ((i * 13) % 10) / 18 - 0.25,
      }
    })
    const tufts = Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2 + 0.2
      const r = 1.2 + ((i * 11) % 5) * 0.22
      return { pos: [Math.cos(a) * r, 0.12, Math.sin(a) * r], s: 0.09 + ((i * 3) % 3) * 0.04 }
    })
    const boulders = Array.from({ length: 4 }, (_, i) => {
      const a = (i / 4) * Math.PI * 2 + 1.1
      return {
        pos: [Math.cos(a) * 1.6, -1.1 - (i % 2) * 0.6, Math.sin(a) * 1.6],
        s: 0.35 + (i % 3) * 0.15,
        rot: [i * 0.8, i * 1.7, i * 0.5],
      }
    })
    return { pebbles, crystals, tufts, boulders }
  }, [])

  return (
    <group position={position} scale={scale}>
      <Float
        speed={float ? 1.1 : 0}
        rotationIntensity={float ? 0.06 : 0}
        floatIntensity={float ? 0.5 : 0}
      >
        {/* Upper keel */}
        <mesh position={[0, -1.3, 0]} rotation={[Math.PI, 0.3, 0]}>
          <coneGeometry args={[2.1, 2.2, 7, 2]} />
          <meshStandardMaterial color="#3d2c63" flatShading roughness={0.9} />
        </mesh>
        {/* Lower keel tip, offset for a jagged silhouette */}
        <mesh position={[0.35, -2.6, -0.2]} rotation={[Math.PI, 1.2, 0.12]}>
          <coneGeometry args={[1.05, 1.7, 5, 1]} />
          <meshStandardMaterial color="#332253" flatShading roughness={0.95} />
        </mesh>
        {/* Boulders embedded in the keel */}
        {boulders.map((b, i) => (
          <mesh key={`b${i}`} position={b.pos} rotation={b.rot}>
            <dodecahedronGeometry args={[b.s, 0]} />
            <meshStandardMaterial color="#46336e" flatShading roughness={0.9} />
          </mesh>
        ))}

        {/* Soil stratum */}
        <mesh position={[0, -0.38, 0]}>
          <cylinderGeometry args={[2.36, 2.18, 0.32, 6]} />
          <meshStandardMaterial color="#5b4480" flatShading roughness={0.85} />
        </mesh>
        {/* Turf slab */}
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[2.3, 2.42, 0.34, 6]} />
          <meshStandardMaterial color="#1f8f6f" flatShading roughness={0.7} />
        </mesh>
        {/* Turf rim glow — pulled clear of the soil layer and depth-decoupled
            so it can't z-fight the strata faces */}
        <mesh position={[0, -0.245, 0]}>
          <cylinderGeometry args={[2.47, 2.47, 0.04, 6, 1, true]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Rim crystals in the island's accent color */}
        {crystals.map((c, i) => (
          <mesh key={`c${i}`} position={c.pos} rotation={[c.tilt, 0, -c.tilt]}>
            <coneGeometry args={[0.09, c.h, 4]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.1}
              flatShading
              transparent
              opacity={0.92}
            />
          </mesh>
        ))}
        {/* Grass tufts */}
        {tufts.map((t, i) => (
          <group key={`t${i}`} position={t.pos}>
            <mesh position={[-t.s * 0.5, 0, 0]} rotation={[0, 0, 0.25]}>
              <coneGeometry args={[t.s * 0.45, t.s * 2.4, 3]} />
              <meshStandardMaterial color="#2fb98a" flatShading />
            </mesh>
            <mesh position={[t.s * 0.5, 0, t.s * 0.3]} rotation={[0.1, 0, -0.2]}>
              <coneGeometry args={[t.s * 0.4, t.s * 1.8, 3]} />
              <meshStandardMaterial color="#27a37a" flatShading />
            </mesh>
          </group>
        ))}

        {/* Themed scene on top */}
        <group position={[0, 0.15, 0]}>{children}</group>

        {/* Orbiting pebbles */}
        {pebbles.map((p, i) => (
          <Float key={i} speed={1.6 + i * 0.3} floatIntensity={1.1} rotationIntensity={0.6}>
            <mesh
              position={[Math.cos(p.angle) * p.radius, p.y, Math.sin(p.angle) * p.radius]}
            >
              <dodecahedronGeometry args={[p.size, 0]} />
              <meshStandardMaterial color="#4c3a78" flatShading roughness={0.9} />
            </mesh>
          </Float>
        ))}
      </Float>

      {/* Glow pool beneath — kept below the bobbing keel tip so the two
          never intersect mid-float */}
      <mesh position={[0, -3.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.6, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight position={[0, 2.5, 1.5]} color={color} intensity={26} distance={11} />
    </group>
  )
}
