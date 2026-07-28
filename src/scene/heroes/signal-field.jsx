import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { globalPointer } from '../../lib/globalPointer'

const PLANE_W = 30
const PLANE_H = 22
const HALF_W = PLANE_W / 2
const HALF_H = PLANE_H / 2
/** Cap scroll drift so the plane rim never crawls into view */
const MAX_SCROLL_DRIFT = 0.52

/** Deterministic multi-octave height — infrastructure load, not hills. */
function baseHeight(x, y) {
  return (
    Math.sin(x * 0.42) * Math.cos(y * 0.31) * 0.38 +
    Math.sin(x * 0.95 + y * 0.55) * 0.14 +
    Math.cos(x * 0.22 - y * 0.78) * 0.22 +
    Math.sin(x * 1.7 - y * 1.3) * 0.05
  )
}

/** 1 at center → ~0 at rim so the mesh edge dissolves into the void */
function edgeWeight(x, y) {
  const nx = Math.abs(x) / HALF_W
  const ny = Math.abs(y) / HALF_H
  const e = Math.max(nx, ny)
  if (e < 0.52) return 1
  if (e > 0.94) return 0.02
  return 1 - (e - 0.52) / 0.42
}

/**
 * Signal field — living low-poly heightfield / signal surface.
 * Scene-only (no Canvas). Window pointer + scroll atmosphere.
 * Edge vertex colors + drift cap hide the hard plane boundary at page end.
 */
export default function SignalField({ reducedMotion = false }) {
  const fillRef = useRef()
  const wireRef = useRef()
  const signalsRef = useRef()
  const groupRef = useRef()
  const pointerSmooth = useRef({ x: 0, y: 0 })
  const intensitySmooth = useRef(1)

  const { fillGeo, wireGeo, baseZ, edgeW, signalIndices, signalPositions } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(PLANE_W, PLANE_H, 60, 44)
    const pos = geo.attributes.position
    const base = new Float32Array(pos.count)
    const edge = new Float32Array(pos.count)
    const colors = new Float32Array(pos.count * 3)

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const jx = Math.sin(i * 12.9898) * 0.055
      const jy = Math.cos(i * 78.233) * 0.055
      const px = x + jx
      const py = y + jy
      pos.setX(i, px)
      pos.setY(i, py)
      const w = edgeWeight(px, py)
      edge[i] = w
      const z = baseHeight(px * 0.8, py * 0.8) * w
      base[i] = z
      pos.setZ(i, z)
      // Vertex colors: rim → black so wire/fill dissolve on #0a0a0a
      colors[i * 3] = w
      colors[i * 3 + 1] = w
      colors[i * 3 + 2] = w
    }
    pos.needsUpdate = true
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()

    const wire = geo.clone()

    const candidates = []
    for (let i = 0; i < pos.count; i++) {
      if (base[i] > 0.2 && edge[i] > 0.55 && (i * 17) % 31 === 0) candidates.push(i)
    }
    const picked = candidates.slice(0, 20)
    const sigPos = new Float32Array(picked.length * 3)
    for (let s = 0; s < picked.length; s++) {
      const i = picked[s]
      sigPos[s * 3] = pos.getX(i)
      sigPos[s * 3 + 1] = pos.getY(i)
      sigPos[s * 3 + 2] = pos.getZ(i) + 0.06
    }

    return {
      fillGeo: geo,
      wireGeo: wire,
      baseZ: base,
      edgeW: edge,
      signalIndices: picked,
      signalPositions: sigPos,
    }
  }, [])

  useFrame(() => {
    const t = performance.now() * 0.001
    const group = groupRef.current
    const fill = fillRef.current
    const wire = wireRef.current
    if (!fill || !wire) return

    const targetI = reducedMotion ? 0.32 : globalPointer.atmosphere
    intensitySmooth.current = THREE.MathUtils.lerp(intensitySmooth.current, targetI, 0.06)
    const intensity = intensitySmooth.current

    // Soft drift with a hard cap — never expose the plane rim
    const rawDrift = globalPointer.scrollY * 0.00085
    const scrollDrift = Math.min(MAX_SCROLL_DRIFT, rawDrift)

    if (reducedMotion) {
      if (group) {
        group.rotation.y = 0.1 + t * 0.025
        group.position.y = -0.12 - scrollDrift * 0.5
      }
      if (fill.material) fill.material.opacity = 0.4 * intensity
      if (wire.material) wire.material.opacity = 0.055 * intensity
      return
    }

    const fillPos = fill.geometry.attributes.position
    const wirePos = wire.geometry.attributes.position
    const count = fillPos.count

    // Slow follow + modest map range so pointer influence stays calm
    pointerSmooth.current.x = THREE.MathUtils.lerp(
      pointerSmooth.current.x,
      globalPointer.x * 5.5 - 0.25,
      0.045,
    )
    pointerSmooth.current.y = THREE.MathUtils.lerp(
      pointerSmooth.current.y,
      globalPointer.y * 3.6 + scrollDrift * 0.15,
      0.045,
    )

    const px = pointerSmooth.current.x
    const py = pointerSmooth.current.y
    const warpRadiusSq = 2.2 * 2.2
    const warpStrength = 0.1 + 0.2 * intensity
    const phase = t * 0.42
    const waveAmp = 0.025 + 0.035 * intensity

    for (let i = 0; i < count; i++) {
      const x = fillPos.getX(i)
      const y = fillPos.getY(i)
      const w = edgeW[i]
      let z =
        baseZ[i] * (0.7 + 0.3 * intensity) +
        (Math.sin(x * 0.7 + phase) * Math.cos(y * 0.55 - phase * 0.7) * waveAmp +
          Math.sin(x * 0.25 + y * 0.3 + phase * 0.4) * waveAmp * 0.7) *
          w

      const dx = x - px
      const dy = y - py
      const dSq = dx * dx + dy * dy
      if (dSq < warpRadiusSq && w > 0.2) {
        const falloff = 1 - dSq / warpRadiusSq
        z -= falloff * falloff * warpStrength * w
      }

      fillPos.setZ(i, z)
      wirePos.setZ(i, z)
    }

    fillPos.needsUpdate = true
    wirePos.needsUpdate = true
    fill.geometry.computeVertexNormals()

    if (signalsRef.current && signalIndices.length) {
      const sigAttr = signalsRef.current.geometry.attributes.position
      for (let s = 0; s < signalIndices.length; s++) {
        const i = signalIndices[s]
        sigAttr.setXYZ(s, fillPos.getX(i), fillPos.getY(i), fillPos.getZ(i) + 0.06)
      }
      sigAttr.needsUpdate = true
      signalsRef.current.material.opacity = (0.12 + Math.sin(t * 1.4) * 0.1) * intensity
    }

    // Ambient floor keeps wire quiet in content / contact
    if (fill.material) {
      fill.material.opacity = 0.35 + 0.5 * intensity
    }
    if (wire.material) {
      wire.material.opacity = 0.04 + 0.11 * intensity
    }

    if (group) {
      group.rotation.z = 0.06 + Math.sin(t * 0.12) * 0.02
      group.position.y = -0.1 - scrollDrift
      group.position.x = 0.2 + Math.sin(t * 0.08) * 0.03
      // Mild tilt with scroll, capped
      group.rotation.x = -0.72 + Math.min(0.1, globalPointer.scrollProgress * 0.1)
    }
  })

  return (
    <>
      <ambientLight intensity={0.36} />
      <directionalLight position={[4, 5, 6]} intensity={0.85} color="#ffffff" />
      <directionalLight position={[-4, -2, -3]} intensity={0.28} color="#8b9cff" />

      <group ref={groupRef} position={[0.2, -0.1, 0]} rotation={[-0.72, 0.1, 0.06]}>
        <mesh ref={fillRef} geometry={fillGeo}>
          <meshStandardMaterial
            color="#111111"
            metalness={0.1}
            roughness={0.92}
            flatShading
            transparent
            opacity={0.85}
            vertexColors
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        <mesh ref={wireRef} geometry={wireGeo} position={[0, 0, 0.002]}>
          <meshBasicMaterial
            color="#ececec"
            wireframe
            transparent
            opacity={0.15}
            vertexColors
            depthWrite={false}
          />
        </mesh>

        <points ref={signalsRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[signalPositions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            color="#c8f55a"
            size={0.038}
            sizeAttenuation
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </points>
      </group>
    </>
  )
}
