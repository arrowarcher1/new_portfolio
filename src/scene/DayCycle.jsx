import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import {
  samplePalette,
  makePaletteTarget,
  sunDirection,
  moonDirection,
} from './timeOfDay'

// The sun and moon discs, the lights they cast, and the fog color —
// all driven by scroll offset. Celestial bodies follow the camera so
// they stay on the horizon for the whole journey.

export default function DayCycle() {
  const scroll = useScroll()
  const scene = useThree((s) => s.scene)

  const palette = useMemo(makePaletteTarget, [])
  const sunDir = useMemo(() => new THREE.Vector3(), [])
  const moonDir = useMemo(() => new THREE.Vector3(), [])

  const celestials = useRef()
  const sunMesh = useRef()
  const moonMesh = useRef()
  const dirLight = useRef()
  const ambLight = useRef()
  const hemiLight = useRef()
  const lightTarget = useRef()

  useFrame((state) => {
    const offset = scroll.offset
    samplePalette(offset, palette)
    sunDirection(offset, sunDir)
    moonDirection(offset, moonDir)

    // Sky bodies ride with the camera
    if (celestials.current) celestials.current.position.copy(state.camera.position)
    if (sunMesh.current) {
      sunMesh.current.position.copy(sunDir).multiplyScalar(95)
      // Push past 1.0 so the HDR bloom pass gives the sun a halo
      sunMesh.current.material.color.copy(palette.sun).multiplyScalar(1.7)
      sunMesh.current.visible = sunDir.y > -0.12
    }
    if (moonMesh.current) {
      moonMesh.current.position.copy(moonDir).multiplyScalar(92)
      moonMesh.current.visible = offset > 0.7
    }

    // Key light: sun by day, moon by night
    const night = offset > 0.85
    const keyDir = night ? moonDir : sunDir
    if (dirLight.current && lightTarget.current) {
      if (dirLight.current.target !== lightTarget.current) {
        dirLight.current.target = lightTarget.current
      }
      dirLight.current.position
        .copy(state.camera.position)
        .addScaledVector(keyDir, 60)
      lightTarget.current.position.copy(state.camera.position)
      lightTarget.current.updateMatrixWorld()
      dirLight.current.intensity = night ? 0.35 : palette.dir
      if (night) {
        dirLight.current.color.set('#aab8e8')
      } else {
        dirLight.current.color.copy(palette.sun)
      }
    }
    if (ambLight.current) {
      ambLight.current.intensity = palette.amb
      ambLight.current.color.copy(palette.horizon).lerp(new THREE.Color('#ffffff'), 0.4)
    }
    if (hemiLight.current) {
      hemiLight.current.color.copy(palette.zenith)
      hemiLight.current.groundColor.copy(palette.horizon).multiplyScalar(0.6)
    }

    // Fog tracks the horizon color
    if (scene.fog) scene.fog.color.copy(palette.fog)
  })

  return (
    <>
      <group ref={celestials}>
        <mesh ref={sunMesh} frustumCulled={false}>
          <sphereGeometry args={[5.5, 24, 18]} />
          <meshBasicMaterial color="#ffb36b" fog={false} toneMapped={false} />
        </mesh>
        <mesh ref={moonMesh} frustumCulled={false} visible={false}>
          <sphereGeometry args={[3.4, 20, 16]} />
          <meshStandardMaterial
            color="#e8edff"
            emissive="#cdd8ff"
            emissiveIntensity={1.3}
            fog={false}
          />
        </mesh>
      </group>

      <directionalLight
        ref={dirLight}
        intensity={1}
        color="#fff3d6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.04}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-camera-near={5}
        shadow-camera-far={150}
      />
      <object3D ref={lightTarget} />
      <ambientLight ref={ambLight} intensity={0.7} />
      <hemisphereLight ref={hemiLight} intensity={0.45} />
    </>
  )
}
