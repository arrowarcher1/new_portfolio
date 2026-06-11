import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, AdaptiveDpr, Preload } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import SceneWorld from './scene/SceneWorld'
import Overlay from './ui/Overlay'
import StaticFallback from './ui/StaticFallback'
import { IntroVeil, Wordmark, TopRight, JourneyRail } from './ui/Chrome'
import { PAGES } from './data/content'

function detectWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export default function App() {
  const webgl = useMemo(detectWebGL, [])
  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )
  const quality = useMemo(
    () => (window.innerWidth < 768 || navigator.hardwareConcurrency <= 4 ? 'low' : 'high'),
    [],
  )

  if (!webgl) return <StaticFallback />

  return (
    <div className="h-full grain">
      <IntroVeil />
      <Wordmark />
      <TopRight />
      <JourneyRail />

      <Canvas
        dpr={quality === 'low' ? [1, 1.5] : [1, 2]}
        camera={{ fov: 50, near: 0.1, far: 250, position: [0, 0.8, 6] }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ScrollControls pages={PAGES} damping={0.22}>
            <SceneWorld reducedMotion={reducedMotion} quality={quality} />
            <Scroll html style={{ width: '100%' }}>
              <Overlay />
            </Scroll>
          </ScrollControls>

          {quality === 'high' && (
            <EffectComposer disableNormalPass>
              <Bloom
                intensity={0.85}
                luminanceThreshold={0.28}
                luminanceSmoothing={0.7}
                mipmapBlur
              />
              <Vignette eskil={false} offset={0.25} darkness={0.75} />
            </EffectComposer>
          )}

          <AdaptiveDpr pixelated />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
