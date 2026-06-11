import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Low-poly birds circling between the islands. Each bird is a body and
// two flapping wing triangles — silhouettes that sell the scale of the sky.

function Bird({ tone }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.045, 0.26, 4]} />
        <meshStandardMaterial color={tone} flatShading roughness={0.8} />
      </mesh>
      <mesh name="wingL" position={[0, 0, -0.02]}>
        <boxGeometry args={[0.3, 0.012, 0.1]} />
        <meshStandardMaterial color={tone} flatShading roughness={0.8} />
      </mesh>
      <mesh name="wingR" position={[0, 0, -0.02]}>
        <boxGeometry args={[0.3, 0.012, 0.1]} />
        <meshStandardMaterial color={tone} flatShading roughness={0.8} />
      </mesh>
    </group>
  )
}

export default function Flock({
  center = [0, 3, -20],
  radius = 7,
  count = 5,
  speed = 0.16,
  tone = '#3b2f63',
}) {
  const birds = useRef([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    birds.current.forEach((bird, i) => {
      if (!bird) return
      const a = t * speed + i * 0.85
      bird.position.set(
        center[0] + Math.cos(a) * radius,
        center[1] + Math.sin(t * 1.1 + i * 1.7) * 0.5 + i * 0.18,
        center[2] + Math.sin(a) * radius * 0.62,
      )
      // Face along the direction of travel
      bird.rotation.y = -a
      const flap = Math.sin(t * 8 + i * 1.3) * 0.55
      const wingL = bird.children[0]?.children[1]
      const wingR = bird.children[0]?.children[2]
      if (wingL) {
        wingL.rotation.x = flap
        wingL.position.x = -0.16
      }
      if (wingR) {
        wingR.rotation.x = -flap
        wingR.position.x = 0.16
      }
    })
  })

  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <group key={i} ref={(el) => (birds.current[i] = el)}>
          <Bird tone={tone} />
        </group>
      ))}
    </group>
  )
}
