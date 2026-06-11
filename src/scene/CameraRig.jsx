import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { cameraCurve, lookTargets } from './anchors'
import { scrollBus, safeOffset } from '../lib/scrollBus'

const smoothstep = (t) => t * t * (3 - 2 * t)

export default function CameraRig({ reducedMotion }) {
  const scroll = useScroll()
  const camera = useThree((s) => s.camera)
  const pos = useRef(new THREE.Vector3())
  const look = useRef(new THREE.Vector3())
  const lookCurrent = useRef(null)
  const parallax = useRef(new THREE.Vector2())

  useFrame((state, delta) => {
    scrollBus.el = scroll.el
    scrollBus.offset = scroll.offset

    const offset = safeOffset(scroll.offset)
    cameraCurve.getPointAt(offset, pos.current)

    // Blend look targets across the current segment
    const f = offset * (lookTargets.length - 1)
    const i = Math.min(Math.floor(f), lookTargets.length - 2)
    look.current.lerpVectors(lookTargets[i], lookTargets[i + 1], smoothstep(f - i))

    if (!lookCurrent.current) {
      lookCurrent.current = look.current.clone()
    }
    lookCurrent.current.lerp(look.current, 1 - Math.exp(-7 * delta))

    // Mouse parallax, damped so raw pointer steps never reach the camera
    const px = reducedMotion ? 0 : state.pointer.x
    const py = reducedMotion ? 0 : state.pointer.y
    parallax.current.x = THREE.MathUtils.damp(parallax.current.x, px, 2.5, delta)
    parallax.current.y = THREE.MathUtils.damp(parallax.current.y, py, 2.5, delta)
    camera.position.set(
      pos.current.x + parallax.current.x * 0.45,
      pos.current.y + parallax.current.y * 0.25,
      pos.current.z,
    )
    camera.lookAt(lookCurrent.current)
  })

  return null
}
