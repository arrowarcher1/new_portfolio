import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import IslandBase from './IslandBase'

// Students on one side, professors on the other, match-beams arcing between.

const STUDENTS = [
  [-1.5, 0, -0.7],
  [-1.7, 0, 0.3],
  [-1.1, 0, 0.9],
]
const PROFESSORS = [
  [1.5, 0, -0.4],
  [1.4, 0, 0.7],
]
const MATCHES = [
  [0, 0],
  [1, 1],
  [2, 0],
]

function Figure({ position, color, height = 0.7, cap = false }) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <coneGeometry args={[0.22, height, 5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} flatShading />
      </mesh>
      <mesh position={[0, height + 0.13, 0]}>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} />
      </mesh>
      {cap && (
        <mesh position={[0, height + 0.27, 0]} rotation={[0, Math.PI / 5, 0]}>
          <boxGeometry args={[0.36, 0.05, 0.36]} />
          <meshStandardMaterial color="#1d0f3a" flatShading />
        </mesh>
      )}
    </group>
  )
}

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
    <IslandBase position={position} color={color}>
      {/* Campus archway between the two groups */}
      <group position={[0, 0, -1.1]}>
        <mesh position={[-0.55, 0.45, 0]}>
          <boxGeometry args={[0.18, 0.9, 0.18]} />
          <meshStandardMaterial color="#5b4480" flatShading roughness={0.8} />
        </mesh>
        <mesh position={[0.55, 0.45, 0]}>
          <boxGeometry args={[0.18, 0.9, 0.18]} />
          <meshStandardMaterial color="#5b4480" flatShading roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.97, 0]}>
          <boxGeometry args={[1.45, 0.16, 0.24]} />
          <meshStandardMaterial color="#6d549a" flatShading roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.13, 0]}>
          <coneGeometry args={[0.18, 0.24, 4]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} flatShading />
        </mesh>
        {/* Arch lamp glow */}
        <mesh position={[0, 0.84, 0.13]}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshStandardMaterial color="#f0abfc" emissive="#f0abfc" emissiveIntensity={2.4} />
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

      {STUDENTS.map((p, i) => (
        <Figure key={`s${i}`} position={p} color="#22d3ee" height={0.6} />
      ))}
      {PROFESSORS.map((p, i) => (
        <Figure key={`p${i}`} position={p} color="#fbbf24" height={0.8} cap />
      ))}

      {/* Match beams */}
      {MATCHES.map(([s, p], i) => {
        const a = STUDENTS[s]
        const b = PROFESSORS[p]
        return (
          <Line
            key={i}
            ref={(el) => (beams.current[i] = el)}
            points={[
              [a[0], 0.75, a[2]],
              [(a[0] + b[0]) / 2, 1.6, (a[2] + b[2]) / 2],
              [b[0], 0.95, b[2]],
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
