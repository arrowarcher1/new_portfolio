import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const SAMPLE_COUNT = 640
const ACTIVE_COUNT = 42
const MAX_ANCHORS = 32
const LIME = new THREE.Color('#c7ff22')
const WARM_WHITE = new THREE.Color('#e9e9df')

const smoothstep = (value) => value * value * (3 - 2 * value)

function getLayoutPosition(element) {
  let x = element.offsetWidth / 2
  let y = element.offsetHeight / 2
  let node = element

  while (node) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent
  }

  return { x, y }
}

function Trace({ reducedMotion }) {
  const baseGeometry = useRef()
  const activeGeometry = useRef()
  const nodeGeometry = useRef()
  const head = useRef()
  const anchors = useRef([])
  const targetAnchors = useRef([])
  const layout = useRef({ height: 1, width: 1, viewportHeight: 1 })
  const targetLayout = useRef({ height: 1, width: 1, viewportHeight: 1 })
  const lastMeasure = useRef(0)

  const basePositions = useMemo(() => new Float32Array(SAMPLE_COUNT * 3), [])
  const activePositions = useMemo(() => new Float32Array(ACTIVE_COUNT * 3), [])
  const nodePositions = useMemo(() => new Float32Array(MAX_ANCHORS * 3), [])

  const measure = () => {
    const height = Math.max(document.documentElement.scrollHeight, window.innerHeight)
    const width = window.innerWidth
    const viewportHeight = window.innerHeight
    const measured = [...document.querySelectorAll('[data-trace-anchor]')]
      .map((element) => {
        const position = getLayoutPosition(element)
        return {
          x: position.x,
          y: position.y,
          z: Number(element.dataset.traceDepth ?? 0),
        }
      })
      .sort((a, b) => a.y - b.y)

    const nextAnchors = [
      { x: width * 0.72, y: 0, z: 0 },
      ...measured,
      { x: width * 0.5, y: height, z: 0 },
    ]
    targetAnchors.current = nextAnchors
    targetLayout.current = { height, width, viewportHeight }

    if (anchors.current.length !== nextAnchors.length) {
      anchors.current = nextAnchors.map((anchor) => ({ ...anchor }))
      layout.current = { height, width, viewportHeight }
    }
  }

  const samplePath = (documentY) => {
    const values = anchors.current
    if (values.length < 2) return { x: layout.current.width * 0.68, z: 0 }

    let index = 0
    while (index < values.length - 2 && documentY > values[index + 1].y) index += 1
    const start = values[index]
    const end = values[index + 1]
    const span = Math.max(1, end.y - start.y)
    const progress = smoothstep(THREE.MathUtils.clamp((documentY - start.y) / span, 0, 1))
    return {
      x: THREE.MathUtils.lerp(start.x, end.x, progress),
      z: THREE.MathUtils.lerp(start.z, end.z, progress),
    }
  }

  const toWorld = (documentY, sampled) => ({
    x: (sampled.x - layout.current.width / 2) / 100,
    y: (layout.current.viewportHeight / 2 - (documentY - window.scrollY)) / 100,
    z: sampled.z,
  })

  useFrame((state, delta) => {
    if (!baseGeometry.current || !activeGeometry.current || !nodeGeometry.current || !head.current) return
    if (state.clock.elapsedTime - lastMeasure.current > 0.5 || anchors.current.length === 0) {
      measure()
      lastMeasure.current = state.clock.elapsedTime
    }

    const damping = reducedMotion ? 100 : 8
    const nextAnchors = targetAnchors.current
    if (anchors.current.length === nextAnchors.length) {
      anchors.current.forEach((anchor, index) => {
        const target = nextAnchors[index]
        anchor.x = THREE.MathUtils.damp(anchor.x, target.x, damping, delta)
        anchor.y = THREE.MathUtils.damp(anchor.y, target.y, damping, delta)
        anchor.z = THREE.MathUtils.damp(anchor.z, target.z, damping, delta)
      })
    }
    layout.current.height = THREE.MathUtils.damp(layout.current.height, targetLayout.current.height, damping, delta)
    layout.current.width = targetLayout.current.width
    layout.current.viewportHeight = targetLayout.current.viewportHeight

    const { height, viewportHeight } = layout.current

    for (let index = 0; index < SAMPLE_COUNT; index += 1) {
      const documentY = (index / (SAMPLE_COUNT - 1)) * height
      const point = toWorld(documentY, samplePath(documentY))
      basePositions[index * 3] = point.x
      basePositions[index * 3 + 1] = point.y
      basePositions[index * 3 + 2] = point.z
    }
    baseGeometry.current.attributes.position.needsUpdate = true

    const readingY = reducedMotion ? window.scrollY + viewportHeight * 0.5 : window.scrollY + viewportHeight * 0.46
    const activeSpan = viewportHeight * 0.22
    for (let index = 0; index < ACTIVE_COUNT; index += 1) {
      const offset = index / (ACTIVE_COUNT - 1) - 0.5
      const documentY = THREE.MathUtils.clamp(readingY + offset * activeSpan, 0, height)
      const point = toWorld(documentY, samplePath(documentY))
      activePositions[index * 3] = point.x
      activePositions[index * 3 + 1] = point.y
      activePositions[index * 3 + 2] = point.z + 0.01
    }
    activeGeometry.current.attributes.position.needsUpdate = true

    const headPoint = toWorld(readingY, samplePath(readingY))
    head.current.position.set(headPoint.x, headPoint.y, headPoint.z + 0.03)

    const visibleAnchors = anchors.current.slice(1, -1).slice(0, MAX_ANCHORS)
    visibleAnchors.forEach((anchor, index) => {
      const point = toWorld(anchor.y, anchor)
      nodePositions[index * 3] = point.x
      nodePositions[index * 3 + 1] = point.y
      nodePositions[index * 3 + 2] = point.z + 0.015
    })
    nodeGeometry.current.setDrawRange(0, visibleAnchors.length)
    nodeGeometry.current.attributes.position.needsUpdate = true
  })

  return (
    <group>
      <line frustumCulled={false}>
        <bufferGeometry ref={baseGeometry}>
          <bufferAttribute attach="attributes-position" args={[basePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={WARM_WHITE} transparent opacity={0.36} depthWrite={false} />
      </line>

      <line frustumCulled={false}>
        <bufferGeometry ref={activeGeometry}>
          <bufferAttribute attach="attributes-position" args={[activePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={LIME} transparent opacity={1} depthWrite={false} />
      </line>

      <points frustumCulled={false}>
        <bufferGeometry ref={nodeGeometry}>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={WARM_WHITE} size={2.4} sizeAttenuation={false} transparent opacity={0.72} depthWrite={false} />
      </points>

      <group ref={head}>
        <mesh>
          <ringGeometry args={[0.055, 0.07, 32]} />
          <meshBasicMaterial color={LIME} transparent opacity={0.95} depthWrite={false} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.018, 24]} />
          <meshBasicMaterial color={LIME} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}

export default function ScrollTraceCanvas() {
  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  return (
    <div className="scroll-trace-canvas" aria-hidden="true">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom: 100, near: 0.1, far: 30 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Trace reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}
