/**
 * Window-level pointer + scroll sample for R3F scenes that sit under
 * pointer-events: none (hero text / page content still receive hits).
 *
 * NDC-style coords match R3F's state.pointer: x/y in [-1, 1], y up.
 */

export const globalPointer = {
  /** NDC x, -1 left → 1 right */
  x: 0,
  /** NDC y, -1 bottom → 1 top */
  y: 0,
  clientX: 0,
  clientY: 0,
  /** 0 at top of page → 1 near document end */
  scrollProgress: 0,
  /** px scrolled from top */
  scrollY: 0,
  /** 1 in the hero band, falls toward ambient floor; dims further near page end */
  atmosphere: 1,
  /** hero height in px (approx one viewport) */
  heroHeight: 800,
}

let bound = 0
let raf = 0
let pendingX = 0
let pendingY = 0
let dirty = false

function smoothstep(t) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

function sampleScroll() {
  const doc = document.documentElement
  const scrollY = window.scrollY || doc.scrollTop || 0
  const max = Math.max(1, doc.scrollHeight - window.innerHeight)
  const heroHeight = Math.max(320, window.innerHeight * 0.92)
  const progress = Math.min(1, Math.max(0, scrollY / max))

  globalPointer.scrollY = scrollY
  globalPointer.scrollProgress = progress
  globalPointer.heroHeight = heroHeight

  // Full presence through most of the hero, then ease to a quiet ambient floor.
  const leave = smoothstep(scrollY / (heroHeight * 0.85))
  // Mid-page ambient ~0.28 (was ~0.34)
  let atmosphere = 1 - leave * 0.72

  // Extra dim in the last ~30% of the document (contact / footer) so type wins
  const endDim = smoothstep((progress - 0.68) / 0.32)
  atmosphere *= 1 - endDim * 0.55

  globalPointer.atmosphere = atmosphere
}

function flushPointer() {
  raf = 0
  if (!dirty) return
  dirty = false
  const w = window.innerWidth || 1
  const h = window.innerHeight || 1
  globalPointer.clientX = pendingX
  globalPointer.clientY = pendingY
  globalPointer.x = (pendingX / w) * 2 - 1
  globalPointer.y = -((pendingY / h) * 2 - 1)
}

function onPointerMove(e) {
  pendingX = e.clientX
  pendingY = e.clientY
  dirty = true
  if (!raf) raf = requestAnimationFrame(flushPointer)
}

function onScroll() {
  sampleScroll()
}

function onResize() {
  sampleScroll()
  dirty = true
  if (!raf) raf = requestAnimationFrame(flushPointer)
}

/** Call once from React; ref-counts so multiple mounts are safe. */
export function bindGlobalPointer() {
  if (typeof window === 'undefined') return () => {}
  bound += 1
  if (bound === 1) {
    sampleScroll()
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
  }
  return () => {
    bound = Math.max(0, bound - 1)
    if (bound === 0) {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }
  }
}
