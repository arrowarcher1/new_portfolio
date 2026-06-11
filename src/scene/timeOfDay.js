import * as THREE from 'three'

// Time-of-day keyframes across the journey (t = scroll offset 0..1).
// Dawn at the hero, midday over the project islands, golden hour at the
// archipelago, dusk at skills, full night for contact.

const KEYS = [
  { t: 0.0,  horizon: '#ffd9c0', zenith: '#86a8d8', sun: '#ffb36b', dir: 0.75, amb: 0.6,  fog: '#f0cdb9' },
  { t: 0.18, horizon: '#d8ecf7', zenith: '#5fa8e8', sun: '#fff3d6', dir: 1.05, amb: 0.75, fog: '#cfe6f4' },
  { t: 0.45, horizon: '#e8f4fb', zenith: '#3f8fe0', sun: '#ffffff', dir: 1.2,  amb: 0.8,  fog: '#dceef8' },
  { t: 0.62, horizon: '#fbe8cf', zenith: '#5a8fd8', sun: '#ffe9b8', dir: 1.0,  amb: 0.7,  fog: '#ecd9c4' },
  { t: 0.74, horizon: '#ffab66', zenith: '#6f6fb8', sun: '#ff8a3c', dir: 0.7,  amb: 0.55, fog: '#dd9a78' },
  { t: 0.86, horizon: '#b35a8c', zenith: '#272457', sun: '#e26a8d', dir: 0.3,  amb: 0.42, fog: '#5d3a6e' },
  { t: 1.0,  horizon: '#1d1f4a', zenith: '#07071c', sun: '#9aa7e8', dir: 0.12, amb: 0.34, fog: '#141233' },
].map((k) => ({
  ...k,
  horizon: new THREE.Color(k.horizon),
  zenith: new THREE.Color(k.zenith),
  sun: new THREE.Color(k.sun),
  fog: new THREE.Color(k.fog),
}))

// Sample the palette at a scroll offset into a reusable target object.
export function samplePalette(offset, out) {
  // NaN-proof: a poisoned offset would otherwise zero every light in the scene
  const t = Number.isFinite(offset) ? THREE.MathUtils.clamp(offset, 0, 1) : 0
  let i = 0
  while (i < KEYS.length - 2 && KEYS[i + 1].t <= t) i++
  const a = KEYS[i]
  const b = KEYS[i + 1]
  const f = THREE.MathUtils.clamp((t - a.t) / (b.t - a.t), 0, 1)

  out.horizon.lerpColors(a.horizon, b.horizon, f)
  out.zenith.lerpColors(a.zenith, b.zenith, f)
  out.sun.lerpColors(a.sun, b.sun, f)
  out.fog.lerpColors(a.fog, b.fog, f)
  out.dir = THREE.MathUtils.lerp(a.dir, b.dir, f)
  out.amb = THREE.MathUtils.lerp(a.amb, b.amb, f)
  return out
}

export function makePaletteTarget() {
  return {
    horizon: new THREE.Color(),
    zenith: new THREE.Color(),
    sun: new THREE.Color(),
    fog: new THREE.Color(),
    dir: 1,
    amb: 0.7,
  }
}

// Sun travels a full arc: rises ahead-right at dawn, overhead at midday,
// sets behind-left during dusk (gone by offset ~0.85).
export function sunDirection(offset, out) {
  const a = THREE.MathUtils.lerp(
    Math.PI * 0.08,
    Math.PI * 1.02,
    THREE.MathUtils.clamp(offset / 0.85, 0, 1),
  )
  out.set(Math.cos(a) * 0.85, Math.sin(a) * 0.75 - 0.06, -0.45)
  return out.normalize()
}

// Moon rises through dusk into night.
export function moonDirection(offset, out) {
  const f = THREE.MathUtils.clamp((offset - 0.74) / 0.26, 0, 1)
  const a = THREE.MathUtils.lerp(Math.PI * 0.05, Math.PI * 0.42, f)
  out.set(Math.cos(a) * 0.8, Math.sin(a) * 0.7 - 0.05, -0.5)
  return out.normalize()
}

// Star visibility: none until dusk, full by night.
export function starAlpha(offset) {
  return THREE.MathUtils.smoothstep(offset, 0.68, 0.92)
}

// Map a world z position along the journey to an approximate scroll offset,
// used to pre-tint clouds by the time of day they'll be seen in.
export function zToOffset(z) {
  return THREE.MathUtils.clamp((8 - z) / 140, 0, 1)
}
