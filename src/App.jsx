import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, AdaptiveDpr, Preload } from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  Vignette,
  HueSaturation,
  BrightnessContrast,
} from '@react-three/postprocessing'
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
        shadows={quality === 'low' ? false : 'soft'}
        dpr={quality === 'low' ? [1, 1.5] : [1, 2]}
        camera={{ fov: 50, near: 0.5, far: 250, position: [0, 0.8, 6] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
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
                intensity={0.7}
                luminanceThreshold={1}
                luminanceSmoothing={0.4}
                mipmapBlur
              />
              <HueSaturation saturation={0.18} />
              <BrightnessContrast contrast={0.07} />
              <Vignette eskil={false} offset={0.2} darkness={0.45} />
            </EffectComposer>
          )}

          <AdaptiveDpr />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
