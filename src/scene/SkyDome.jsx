import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { samplePalette, makePaletteTarget, sunDirection } from './timeOfDay'

// Inward-facing sphere painted with the time-of-day gradient and a sun
// glow halo. Follows the camera; colors driven by scroll offset.

const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uHorizon;
  uniform vec3 uZenith;
  uniform vec3 uSunColor;
  uniform vec3 uSunDir;
  varying vec3 vDir;

  void main() {
    vec3 dir = normalize(vDir);
    float h = smoothstep(-0.08, 0.5, dir.y);
    vec3 col = mix(uHorizon, uZenith, h);

    // Below the horizon, deepen toward the zenith tone (the "sea of air")
    col = mix(col, uZenith * 0.55 + uHorizon * 0.2, smoothstep(-0.05, -0.5, dir.y));

    // Sun halo
    float d = max(dot(dir, uSunDir), 0.0);
    col += uSunColor * (pow(d, 220.0) * 1.1 + pow(d, 10.0) * 0.18);

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function SkyDome() {
  const mesh = useRef()
  const scroll = useScroll()
  const palette = useMemo(makePaletteTarget, [])
  const sunDir = useMemo(() => new THREE.Vector3(), [])
  const uniforms = useMemo(
    () => ({
      uHorizon: { value: new THREE.Color('#ffd9c0') },
      uZenith: { value: new THREE.Color('#86a8d8') },
      uSunColor: { value: new THREE.Color('#ffb36b') },
      uSunDir: { value: new THREE.Vector3(0.8, 0.1, -0.45) },
    }),
    [],
  )

  useFrame((state) => {
    samplePalette(scroll.offset, palette)
    uniforms.uHorizon.value.copy(palette.horizon)
    uniforms.uZenith.value.copy(palette.zenith)
    uniforms.uSunColor.value.copy(palette.sun)
    uniforms.uSunDir.value.copy(sunDirection(scroll.offset, sunDir))
    if (mesh.current) {
      mesh.current.position.copy(state.camera.position)
    }
  })

  return (
    <mesh ref={mesh} frustumCulled={false}>
      <sphereGeometry args={[110, 48, 32]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}
