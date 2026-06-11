import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import IslandBase from './IslandBase'
import { Pawn } from '../props'

// Students on one side, professors on the other, match-beams arcing between.
// Figures are minimal pawn pieces in team colors — students cyan,
// professors amber with graduation caps.

const STUDENTS = [
  { pos: [-1.5, 0, -0.7] },
  { pos: [-1.7, 0, 0.3] },
  { pos: [-1.1, 0, 0.9] },
]
const PROFESSORS = [
  { pos: [1.5, 0, -0.4] },
  { pos: [1.4, 0, 0.7] },
]
const MATCHES = [
  [0, 0],
  [1, 1],
  [2, 0],
]

export default function ProfPairIsland({ position, color = '#22d3ee' }) {
  const beams = useRef([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    beams.current.forEach((line, i) => {
      if (!line?.material) return
      line.material.opacity = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(t * 2 + i * 2.1))
    })
  })

  return (
    <IslandBase position={position} color={color} seed={11}>
      {/* Campus clock tower behind the meeting ground */}
      <group position={[0, 0, -1.15]}>
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.55, 1.6, 0.55]} />
          <meshStandardMaterial color="#6d549a" flatShading roughness={0.8} />
        </mesh>
        {/* Belt course */}
        <mesh position={[0, 1.18, 0]}>
          <boxGeometry args={[0.62, 0.07, 0.62]} />
          <meshStandardMaterial color="#5b4480" flatShading />
        </mesh>
        {/* Clock face + hands */}
        <mesh position={[0, 1.38, 0.285]}>
          <circleGeometry args={[0.16, 16]} />
          <meshStandardMaterial color="#f5f1ff" emissive="#f5f1ff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 1.41, 0.29]} rotation={[0, 0, 0.6]}>
          <boxGeometry args={[0.02, 0.11, 0.01]} />
          <meshStandardMaterial color="#2d1657" />
        </mesh>
        <mesh position={[0, 1.38, 0.29]} rotation={[0, 0, -1.8]}>
          <boxGeometry args={[0.018, 0.14, 0.01]} />
          <meshStandardMaterial color="#2d1657" />
        </mesh>
        {/* Arched doorway */}
        <mesh position={[0, 0.28, 0.275]}>
          <boxGeometry args={[0.2, 0.36, 0.03]} />
          <meshStandardMaterial color="#3b2a66" flatShading />
        </mesh>
        {/* Spire */}
        <mesh position={[0, 1.82, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.46, 0.44, 4]} />
          <meshStandardMaterial color="#4c3a78" flatShading roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.1, 0]}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.2} />
        </mesh>
      </group>

      {/* Book stacks beside the professors */}
      {[
        { p: [1.1, 0, 1.15], colors: ['#22d3ee', '#fbbf24', '#d946ef'] },
        { p: [1.95, 0, 0.15], colors: ['#34d399', '#8b5cf6'] },
      ].map((stack, si) => (
        <group key={`bk${si}`} position={stack.p}>
          {stack.colors.map((c, i) => (
            <mesh
              key={i}
              position={[0, 0.045 + i * 0.09, 0]}
              rotation={[0, i * 0.6 - 0.3, 0]}
            >
              <boxGeometry args={[0.34, 0.08, 0.24]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.35} flatShading />
            </mesh>
          ))}
        </group>
      ))}

      {STUDENTS.map((s, i) => (
        <Pawn
          key={`s${i}`}
          position={s.pos}
          rotation={[0, Math.PI / 2 - i * 0.3, 0]}
          color="#22d3ee"
          scale={0.95}
        />
      ))}
      {PROFESSORS.map((p, i) => (
        <Pawn
          key={`p${i}`}
          position={p.pos}
          rotation={[0, -Math.PI / 2 + i * 0.4, 0]}
          color="#fbbf24"
          scale={1.15}
          cap
        />
      ))}

      {/* Match beams */}
      {MATCHES.map(([s, p], i) => {
        const a = STUDENTS[s].pos
        const b = PROFESSORS[p].pos
        return (
          <Line
            key={i}
            ref={(el) => (beams.current[i] = el)}
            points={[
              [a[0], 0.85, a[2]],
              [(a[0] + b[0]) / 2, 1.6, (a[2] + b[2]) / 2],
              [b[0], 1.0, b[2]],
            ]}
            color="#f0abfc"
            lineWidth={1.2}
            transparent
            opacity={0.5}
          />
        )
      })}

      {/* Match star above the meeting point */}
      <mesh position={[0, 2.0, 0]}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color="#f0abfc" emissive="#d946ef" emissiveIntensity={2.2} />
      </mesh>
    </IslandBase>
  )
}
