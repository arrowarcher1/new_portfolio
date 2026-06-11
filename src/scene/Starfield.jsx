import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { starAlpha } from './timeOfDay'
import { safeOffset } from '../lib/scrollBus'

// Twinkling points scattered around the journey path. Invisible by day,
// fading in through dusk to full brightness for the night finale.

const vertexShader = /* glsl */ `
  attribute float aPhase;
  attribute float aSize;
  uniform float uTime;
  varying float vTwinkle;
  void main() {
    vTwinkle = 0.45 + 0.55 * sin(uTime * 1.4 + aPhase);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (180.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.05, d) * vTwinkle * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`

export default function Starfield({ count = 900 }) {
  const scroll = useScroll()
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color('#e9ecff') },
    }),
    [],
  )

  const { positions, phases, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const sizes = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Scatter in a wide box around the path, kept away from center stage
      const r = 10 + Math.random() * 45
      const theta = Math.random() * Math.PI * 2
      positions[i * 3 + 0] = Math.cos(theta) * r
      positions[i * 3 + 1] = (Math.random() - 0.35) * 30
      positions[i * 3 + 2] = 25 - Math.random() * 175
      phases[i] = Math.random() * Math.PI * 2
      sizes[i] = 0.6 + Math.random() * 1.8
    }
    return { positions, phases, sizes }
  }, [count])

  const points = useRef()
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uOpacity.value = starAlpha(safeOffset(scroll.offset))
  })

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  )
}
