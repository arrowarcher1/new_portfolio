import { useMemo } from 'react'
import * as THREE from 'three'
import { Float } from '@react-three/drei'

// Floating low-poly island: faceted rock keel + hexagonal turf slab,
// orbiting pebbles, and a colored glow pooling beneath.
// Children are the themed scene standing on top (y=0 is the turf surface).

export default function IslandBase({
  position = [0, 0, 0],
  color = '#d946ef',
  scale = 1,
  float = true,
  children,
}) {
  const pebbles = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        angle: (i / 4) * Math.PI * 2 + i * 1.3,
        radius: 3.1 + (i % 2) * 0.7,
        y: -0.6 + (i % 3) * 0.5,
        size: 0.16 + (i % 3) * 0.09,
      })),
    [],
  )

  return (
    <group position={position} scale={scale}>
      <Float
        speed={float ? 1.1 : 0}
        rotationIntensity={float ? 0.06 : 0}
        floatIntensity={float ? 0.5 : 0}
      >
        {/* Rock keel */}
        <mesh position={[0, -1.55, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[2.25, 2.7, 6, 1]} />
          <meshStandardMaterial color="#3d2c63" flatShading roughness={0.9} />
        </mesh>
        {/* Turf slab */}
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[2.3, 2.42, 0.42, 6]} />
          <meshStandardMaterial color="#1f8f6f" flatShading roughness={0.7} />
        </mesh>
        {/* Turf rim glow */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[2.44, 2.44, 0.05, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>

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

      {/* Glow pool beneath */}
      <mesh position={[0, -3.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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
