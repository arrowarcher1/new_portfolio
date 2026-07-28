import { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGlobalPointer } from '../hooks/useGlobalPointer'

const SignalField = lazy(() => import('./heroes/signal-field'))

/**
 * Page atmosphere — fixed full-viewport signal field behind content.
 * Pointer is sampled from the window so hovering hero text still warps the mesh.
 */
export default function HeroField({ reducedMotion = false }) {
  useGlobalPointer()

  return (
    <div className="atmosphere" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <SignalField reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  )
}
