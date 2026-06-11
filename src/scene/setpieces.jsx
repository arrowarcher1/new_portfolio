import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Float, Line } from '@react-three/drei'
import { EXPERIENCES } from '../data/content'

// Non-island set pieces along the journey: hero shards, the about blob,
// the experience constellation, the skills orrery, and the contact portal.

export function HeroShards({ position }) {
  const group = useRef()
  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.05
  })
  const shards = [
    { p: [2.6, 0.8, -1], s: 0.45, c: '#d946ef' },
    { p: [-2.8, -0.4, 0.5], s: 0.6, c: '#8b5cf6' },
    { p: [1.8, -1.2, 1.2], s: 0.3, c: '#22d3ee' },
    { p: [-1.6, 1.5, -1.5], s: 0.35, c: '#f0abfc' },
    { p: [3.4, -0.9, 0.2], s: 0.25, c: '#34d399' },
    { p: [-3.6, 0.6, -0.8], s: 0.4, c: '#22d3ee' },
  ]
  return (
    <group ref={group} position={position}>
      {shards.map((sh, i) => (
        <Float key={i} speed={1.4 + i * 0.2} rotationIntensity={1.2} floatIntensity={1.4}>
          <mesh position={sh.p} scale={sh.s}>
            <tetrahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={sh.c}
              emissive={sh.c}
              emissiveIntensity={0.8}
              flatShading
              transparent
              opacity={0.9}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export function ExperienceConstellation({ position }) {
  const nodes = [
    [0, 1.6, 0],
    [-1.8, 0, 0.6],
    [1.6, -1.2, -0.4],
  ]
  const refs = useRef([])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    refs.current.forEach((m, i) => {
      if (!m) return
      m.rotation.y = t * 0.4 + i
      m.material.emissiveIntensity = 1 + 0.6 * Math.sin(t * 1.5 + i * 2)
    })
  })
  return (
    <group position={position}>
      <Line
        points={nodes}
        color="#a795d4"
        lineWidth={1}
        transparent
        opacity={0.4}
      />
      {nodes.map((p, i) => (
        <group key={i} position={p}>
          <mesh ref={(el) => (refs.current[i] = el)}>
            <octahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial
              color={EXPERIENCES[i].color}
              emissive={EXPERIENCES[i].color}
              emissiveIntensity={1.2}
              flatShading
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.65, 0.015, 8, 40]} />
            <meshStandardMaterial
              color={EXPERIENCES[i].color}
              emissive={EXPERIENCES[i].color}
              emissiveIntensity={0.8}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 0.5, 2.5]} color="#8b5cf6" intensity={18} distance={12} />
    </group>
  )
}

const ORBITERS = [
  { geo: <boxGeometry args={[0.26, 0.26, 0.26]} />, c: '#d946ef' },
  { geo: <tetrahedronGeometry args={[0.22, 0]} />, c: '#22d3ee' },
  { geo: <octahedronGeometry args={[0.2, 0]} />, c: '#34d399' },
  { geo: <dodecahedronGeometry args={[0.18, 0]} />, c: '#fbbf24' },
  { geo: <icosahedronGeometry args={[0.2, 0]} />, c: '#8b5cf6' },
  { geo: <tetrahedronGeometry args={[0.24, 0]} />, c: '#fb7185' },
]

export function SkillsOrrery({ position }) {
  const ringA = useRef()
  const ringB = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ringA.current) ringA.current.rotation.y = t * 0.35
    if (ringB.current) ringB.current.rotation.y = -t * 0.25
  })
  return (
    <group position={position}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={0.7}
            wireframe
          />
        </mesh>
      </Float>
      <group ref={ringA} rotation={[0.4, 0, 0.15]}>
        {ORBITERS.slice(0, 3).map((o, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 3) * Math.PI * 2) * 1.9,
              0,
              Math.sin((i / 3) * Math.PI * 2) * 1.9,
            ]}
          >
            {o.geo}
            <meshStandardMaterial color={o.c} emissive={o.c} emissiveIntensity={1.3} flatShading />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.9, 0.012, 8, 64]} />
          <meshStandardMaterial color="#a795d4" transparent opacity={0.35} />
        </mesh>
      </group>
      <group ref={ringB} rotation={[-0.5, 0, -0.2]}>
        {ORBITERS.slice(3).map((o, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 3) * Math.PI * 2 + 1) * 2.7,
              0,
              Math.sin((i / 3) * Math.PI * 2 + 1) * 2.7,
            ]}
          >
            {o.geo}
            <meshStandardMaterial color={o.c} emissive={o.c} emissiveIntensity={1.3} flatShading />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.7, 0.012, 8, 64]} />
          <meshStandardMaterial color="#a795d4" transparent opacity={0.25} />
        </mesh>
      </group>
      <pointLight position={[0, 1, 2]} color="#8b5cf6" intensity={22} distance={12} />
    </group>
  )
}

export function ContactPortal({ position }) {
  const ring = useRef()
  const inner = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ring.current) {
      ring.current.rotation.z = t * 0.2
      ring.current.rotation.x = Math.sin(t * 0.3) * 0.15
    }
    if (inner.current) {
      inner.current.rotation.z = -t * 0.45
      inner.current.material.emissiveIntensity = 2.2 + Math.sin(t * 2) * 0.7
    }
  })
  return (
    <group position={position}>
      <mesh ref={ring}>
        <torusGeometry args={[1.7, 0.05, 12, 80]} />
        <meshStandardMaterial color="#d946ef" emissive="#d946ef" emissiveIntensity={2.6} />
      </mesh>
      <mesh ref={inner}>
        <torusGeometry args={[1.15, 0.022, 10, 70]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.2} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.1, 48]} />
        <meshBasicMaterial
          color="#1d0f3a"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <pointLight position={[0, 0, 2.5]} color="#d946ef" intensity={30} distance={14} />
    </group>
  )
}
