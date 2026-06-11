import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Billboard, RoundedBox } from '@react-three/drei'
import IslandBase from './IslandBase'

// Two crystalline AI agents in a visible negotiation loop: the active
// agent pulses and raises a speech bubble with its offer (bar levels),
// then a glowing offer packet flies across the table to the other side,
// who answers with a counter-offer. Deal terms shift on the tabletop.

const AGENT_X = 1.35
const LEG_SECONDS = 3.0
const ROUNDS = 5
const DEAL_SECONDS = 3.4
const PERIOD = LEG_SECONDS * ROUNDS + DEAL_SECONDS
const PINK = '#ec4899'
const CYAN = '#22d3ee'
const GOLD = '#fbbf24'

const ss = (x) => {
  const c = THREE.MathUtils.clamp(x, 0, 1)
  return c * c * (3 - 2 * c)
}

function CrystalAgent({ position, color, timeOffset = 0, pulse }) {
  const core = useRef()
  const shell = useRef()
  const ring = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime + timeOffset
    const bob = 1.0 + Math.sin(t * 1.4) * 0.06
    const p = pulse?.current ?? 0
    if (core.current) {
      core.current.rotation.y = t * (0.6 + p * 2.4)
      core.current.position.y = bob
      core.current.scale.setScalar(1 + p * 0.2)
      core.current.material.emissiveIntensity = 1.8 + p * 1.6
    }
    if (shell.current) {
      shell.current.rotation.y = -t * 0.25
      shell.current.rotation.x = Math.sin(t * 0.5) * 0.2
      shell.current.position.y = bob
    }
    if (ring.current) {
      ring.current.rotation.z = t * 0.5
      ring.current.position.y = bob
    }
  })

  return (
    <group position={position}>
      <mesh ref={core} position={[0, 1.0, 0]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} flatShading />
      </mesh>
      <mesh ref={shell} position={[0, 1.0, 0]}>
        <icosahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.22}
          flatShading
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ring} position={[0, 1.0, 0]} rotation={[Math.PI / 2.6, 0.3, 0]}>
        <torusGeometry args={[0.46, 0.014, 8, 40]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.34, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight position={[0, 1.2, 0.3]} color={color} intensity={4} distance={3} />
    </group>
  )
}

// Offer bubble: dark panel with the agent's current offer as bar levels,
// popped above the speaking agent. Parent drives scale + bar heights.
function SpeechBubble({ x, color, groupRef, barRefs }) {
  return (
    <Billboard position={[x, 2.12, 0]}>
      <group ref={groupRef} scale={0}>
        <RoundedBox args={[0.8, 0.55, 0.05]} radius={0.06} smoothness={3}>
          <meshStandardMaterial color="#16092e" roughness={0.4} />
        </RoundedBox>
        {/* Colored rim */}
        <RoundedBox args={[0.85, 0.6, 0.03]} radius={0.07} smoothness={3} position={[0, 0, -0.02]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
        </RoundedBox>
        {/* Offer bars */}
        {[-0.21, 0, 0.21].map((bx, i) => (
          <mesh key={i} ref={(el) => (barRefs.current[i] = el)} position={[bx, -0.05, 0.045]}>
            <boxGeometry args={[0.13, 0.28, 0.025]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.7} />
          </mesh>
        ))}
        {/* Tail pointing down at the agent */}
        <mesh position={[0, -0.38, 0]}>
          <coneGeometry args={[0.08, 0.17, 3]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
        </mesh>
      </group>
    </Billboard>
  )
}

export default function ConvergeIsland({ position, color = '#ec4899' }) {
  const packet = useRef()
  const zopaRing = useRef()
  const dealBeam = useRef()
  const tableBars = useRef([])
  const bubbleA = useRef()
  const bubbleB = useRef()
  const barsA = useRef([])
  const barsB = useRef([])
  const pulseA = useRef(0)
  const pulseB = useRef(0)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const ct = t % PERIOD
    const dealing = ct >= LEG_SECONDS * ROUNDS

    if (!dealing) {
      // ── Negotiation rounds: offers converge leg by leg ──
      const leg = Math.floor(ct / LEG_SECONDS)
      const lt = (ct % LEG_SECONDS) / LEG_SECONDS
      const aSpeaking = leg % 2 === 0
      const progress = leg / (ROUNDS - 1)

      // Bubble pops in fast, holds while "stating the offer", then drops
      const pop = ss(lt / 0.12) * (1 - ss((lt - 0.55) / 0.12))
      const speakerBubble = aSpeaking ? bubbleA.current : bubbleB.current
      const listenerBubble = aSpeaking ? bubbleB.current : bubbleA.current
      if (speakerBubble) speakerBubble.scale.setScalar(pop)
      if (listenerBubble) listenerBubble.scale.setScalar(0)

      // Pink opens high and concedes down; cyan opens low and comes up
      const level = aSpeaking
        ? THREE.MathUtils.lerp(1.05, 0.62, progress)
        : THREE.MathUtils.lerp(0.28, 0.56, progress)
      const speakerBars = aSpeaking ? barsA.current : barsB.current
      speakerBars.forEach((bar, i) => {
        if (!bar) return
        bar.scale.y = THREE.MathUtils.clamp(level * (0.85 + 0.25 * Math.sin(leg * 1.7 + i * 2.1)), 0.2, 1.1)
      })

      // Speaker pulses while its bubble is up
      pulseA.current = aSpeaking ? pop : 0
      pulseB.current = aSpeaking ? 0 : pop

      // The offer packet flies from speaker to listener
      if (packet.current) {
        const pt = ss((lt - 0.6) / 0.32)
        const from = aSpeaking ? -AGENT_X : AGENT_X
        packet.current.visible = lt > 0.6 && lt < 0.95
        packet.current.position.x = THREE.MathUtils.lerp(from, -from, pt)
        packet.current.position.y = 1.05 + Math.sin(pt * Math.PI) * 0.5
        packet.current.scale.setScalar(1 + Math.sin(t * 9) * 0.12)
        packet.current.material.emissive.set(aSpeaking ? PINK : CYAN)
      }

      if (dealBeam.current) dealBeam.current.visible = false
      if (zopaRing.current) {
        zopaRing.current.rotation.z = t * 0.4
        zopaRing.current.scale.setScalar(1)
        zopaRing.current.material.emissive.set('#d946ef')
        zopaRing.current.material.emissiveIntensity = 1.6
      }
    } else {
      // ── Deal! Both agents agree: bubbles up together, gold handshake ──
      const dt = (ct - LEG_SECONDS * ROUNDS) / DEAL_SECONDS
      const pop = ss(dt / 0.12) * (1 - ss((dt - 0.78) / 0.14))
      if (bubbleA.current) bubbleA.current.scale.setScalar(pop)
      if (bubbleB.current) bubbleB.current.scale.setScalar(pop)
      ;[barsA.current, barsB.current].forEach((bars) =>
        bars.forEach((bar, i) => {
          if (bar) bar.scale.y = 0.58 + 0.04 * Math.sin(i * 2.1)
        }),
      )
      pulseA.current = pop
      pulseB.current = pop
      if (packet.current) packet.current.visible = false

      if (dealBeam.current) {
        dealBeam.current.visible = dt > 0.1 && dt < 0.92
        const grow = ss((dt - 0.1) / 0.15)
        dealBeam.current.scale.set(1, grow, 1)
        dealBeam.current.material.opacity = 0.85 * (1 - ss((dt - 0.78) / 0.14))
        dealBeam.current.material.emissiveIntensity = 2.2 + Math.sin(t * 10) * 0.5
      }
      if (zopaRing.current) {
        zopaRing.current.rotation.z = t * 1.2
        zopaRing.current.scale.setScalar(1 + 0.2 * Math.sin(dt * Math.PI))
        zopaRing.current.material.emissive.set(GOLD)
        zopaRing.current.material.emissiveIntensity = 2.4
      }
    }

    // Deal terms shifting as offers land
    const leg = Math.floor(ct / LEG_SECONDS)
    tableBars.current.forEach((bar, i) => {
      if (!bar) return
      const h = dealing
        ? 0.24
        : 0.16 + 0.14 * (0.5 + 0.5 * Math.sin(leg * 1.3 + i * 1.9))
      bar.scale.y = h / 0.2
      bar.position.y = 0.42 + h / 2
    })
  })

  return (
    <IslandBase position={position} color={color} seed={2}>
      {/* Negotiation pavilion over the table */}
      {[
        [-0.85, -0.85],
        [-0.85, 0.85],
        [0.85, -0.85],
        [0.85, 0.85],
      ].map(([x, z], i) => (
        <mesh key={`post${i}`} position={[x, 0.62, z]}>
          <cylinderGeometry args={[0.045, 0.06, 1.24, 5]} />
          <meshStandardMaterial color="#3b2a66" flatShading roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 1.42, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.32, 0.5, 4]} />
        <meshStandardMaterial color="#4c3a78" flatShading roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.07, 8, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>

      {/* Negotiation table */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.55, 0.42, 0.1, 6]} />
        <meshStandardMaterial color="#2d1657" flatShading roughness={0.35} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.358, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.015, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.1, 0.16, 0.28, 6]} />
        <meshStandardMaterial color="#1d0f3a" flatShading />
      </mesh>
      {/* Bar chart of live deal terms on the tabletop */}
      {[-0.16, 0, 0.16].map((x, i) => (
        <mesh key={i} ref={(el) => (tableBars.current[i] = el)} position={[x, 0.5, 0.22]}>
          <boxGeometry args={[0.07, 0.2, 0.07]} />
          <meshStandardMaterial
            color={i === 1 ? '#f0abfc' : '#67e8f9'}
            emissive={i === 1 ? '#f0abfc' : '#67e8f9'}
            emissiveIntensity={1.6}
          />
        </mesh>
      ))}

      <CrystalAgent position={[-AGENT_X, 0, 0]} color={PINK} pulse={pulseA} />
      <CrystalAgent position={[AGENT_X, 0, 0]} color={CYAN} timeOffset={2.1} pulse={pulseB} />

      <SpeechBubble x={-AGENT_X} color={PINK} groupRef={bubbleA} barRefs={barsA} />
      <SpeechBubble x={AGENT_X} color={CYAN} groupRef={bubbleB} barRefs={barsB} />

      {/* The offer packet in flight */}
      <mesh ref={packet} position={[0, 1.05, 0]} visible={false}>
        <icosahedronGeometry args={[0.11, 1]} />
        <meshStandardMaterial color="#fff7fb" emissive="#f0abfc" emissiveIntensity={3} />
      </mesh>

      {/* Gold handshake beam between the agents at deal time */}
      <mesh
        ref={dealBeam}
        position={[0, 1.0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        visible={false}
      >
        <cylinderGeometry args={[0.03, 0.03, AGENT_X * 2, 8]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={2.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* ZOPA ring hovering above the pavilion */}
      <mesh ref={zopaRing} position={[0, 2.45, 0]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.55, 0.025, 8, 40]} />
        <meshStandardMaterial color="#f0abfc" emissive="#d946ef" emissiveIntensity={1.6} />
      </mesh>
    </IslandBase>
  )
}
