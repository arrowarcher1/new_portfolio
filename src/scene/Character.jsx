import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useGLTF, useAnimations } from '@react-three/drei'
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js'

// Animated CC0 character models (Quaternius, via poly.pizza).
// Each instance gets its own skeleton clone so several can animate at once.

export const MODELS = {
  robot: '/models/robot.glb',
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

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <primitive object={cloned} />
    </group>
  )
}

Object.values(MODELS).forEach((url) => useGLTF.preload(url))
