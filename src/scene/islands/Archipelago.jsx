import { Float } from '@react-three/drei'
import IslandBase from './IslandBase'
import { ARCHIPELAGO_PROJECTS } from '../../data/content'

// Cluster of three mini islands, each crowned with a glowing emblem
// in its project color.

const OFFSETS = [
  [-2.2, 0.6, -0.5],
  [0.6, -0.4, 1.2],
  [2.6, 1.1, -1.4],
]

const EMBLEMS = [
  (color) => (
    // LCRS: a pulse-cross
    <group>
      <mesh>
        <boxGeometry args={[0.55, 0.16, 0.16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.16, 0.55, 0.16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} />
      </mesh>
    </group>
  ),
  (color) => (
    // ASL: two speech facets meeting
    <group>
      <mesh position={[-0.16, 0, 0]} rotation={[0, 0.5, 0]}>
        <tetrahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} flatShading />
      </mesh>
      <mesh position={[0.18, 0.1, 0]} rotation={[0.4, -0.4, 0]}>
        <tetrahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} flatShading />
      </mesh>
    </group>
  ),
  (color) => (
    // Portfolio: a tiny open laptop
    <group rotation={[0, -0.5, 0]}>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.34]} />
        <meshStandardMaterial color="#1d0f3a" flatShading />
      </mesh>
      <mesh position={[0, 0.07, -0.16]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.5, 0.34, 0.03]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} flatShading />
      </mesh>
    </group>
  ),
]

export default function Archipelago({ position }) {
  return (
    <group position={position}>
      {ARCHIPELAGO_PROJECTS.map((project, i) => (
        <IslandBase
          key={project.id}
          position={OFFSETS[i]}
          color={project.color}
          scale={0.55}
          seed={17 + i * 5}
        >
          <Float speed={2} rotationIntensity={0.8} floatIntensity={0.8}>
            <group position={[0, 0.9, 0]}>{EMBLEMS[i](project.color)}</group>
          </Float>
        </IslandBase>
      ))}
    </group>
  )
}
