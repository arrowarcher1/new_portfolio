import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { cameraCurve, lookTargets } from './anchors'
import { scrollBus } from '../lib/scrollBus'

const smoothstep = (t) => t * t * (3 - 2 * t)

export default function CameraRig({ reducedMotion }) {
  const scroll = useScroll()
  const camera = useThree((s) => s.camera)
  const pos = useRef(new THREE.Vector3())
  const look = useRef(new THREE.Vector3())
  const lookCurrent = useRef(null)

  useFrame((state) => {
    scrollBus.el = scroll.el
    scrollBus.offset = scroll.offset

    const offset = THREE.MathUtils.clamp(scroll.offset, 0, 1)
    cameraCurve.getPointAt(offset, pos.current)

    // Blend look targets across the current segment
    const f = offset * (lookTargets.length - 1)
    const i = Math.min(Math.floor(f), lookTargets.length - 2)
    look.current.lerpVectors(lookTargets[i], lookTargets[i + 1], smoothstep(f - i))

    if (!lookCurrent.current) {
      lookCurrent.current = look.current.clone()
    }
    lookCurrent.current.lerp(look.current, 0.12)

    // Gentle mouse parallax
    const px = reducedMotion ? 0 : state.pointer.x
    const py = reducedMotion ? 0 : state.pointer.y
    camera.position.set(
      pos.current.x + px * 0.45,
      pos.current.y + py * 0.25,
      pos.current.z,
    )
    camera.lookAt(lookCurrent.current)
  })

  return null
}
