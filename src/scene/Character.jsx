import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js'

// CC0 character models (Quaternius & Polygonal Mind, via poly.pizza).
// Each instance gets its own skeleton clone so several can animate at once.
// Models without baked animations can use `hover` for a procedural idle.

export const MODELS = {
  robot: '/models/robot2.glb',
  adventurer: '/models/adventurer.glb',
  punk: '/models/punk.glb',
  character: '/models/character.glb',
}

export default function Character({
  model = 'robot',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  anim = 'Idle',
  tint = null,
  timeOffset = 0,
  hover = false,
}) {
  const url = MODELS[model]
  const { scene, animations } = useGLTF(url)
  const group = useRef()

  const cloned = useMemo(() => {
    const c = skeletonClone(scene)
    c.traverse((o) => {
      if (o.isMesh || o.isSkinnedMesh) {
        o.castShadow = true
        o.receiveShadow = true
        if (tint && o.material) {
          o.material = o.material.clone()
          o.material.color.lerp(new THREE.Color(tint), 0.4)
        }
      }
    })
    return c
  }, [scene, tint])

  const { actions, names } = useAnimations(animations, group)

  useEffect(() => {
    const name =
      names.find((n) => n.toLowerCase() === anim.toLowerCase()) ??
      names.find((n) => n.toLowerCase().includes(anim.toLowerCase())) ??
      names[0]
    const action = actions[name]
    if (!action) return undefined
    action.reset().fadeIn(0.2).play()
    // Stagger so identical characters don't move in lockstep
    action.time = timeOffset
    return () => action.fadeOut(0.2)
  }, [actions, names, anim, timeOffset])

  useFrame((state) => {
    if (!hover || !group.current) return
    const t = state.clock.elapsedTime + timeOffset * 4
    group.current.position.y = position[1] + 0.06 + Math.sin(t * 1.6) * 0.05
    group.current.rotation.z = rotation[2] + Math.sin(t * 1.1) * 0.04
    group.current.rotation.y = rotation[1] + Math.sin(t * 0.7) * 0.06
  })

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <primitive object={cloned} />
    </group>
  )
}

Object.values(MODELS).forEach((url) => useGLTF.preload(url))
