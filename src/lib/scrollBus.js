// Tiny bridge between the drei ScrollControls world (inside the Canvas)
// and fixed HTML chrome (nav, progress) living outside it.

export const scrollBus = {
  el: null,
  offset: 0,
  lastGoodOffset: 0,
}

// drei's scroll offset can briefly turn NaN during container resize/zoom
// (0/0 when scrollHeight === clientHeight mid-relayout). Everything that
// drives lights, fog, or the camera must go through this guard — a single
// NaN frame poisons all light intensities and renders the scene black.
export function safeOffset(raw) {
  if (Number.isFinite(raw)) {
    scrollBus.lastGoodOffset = Math.min(1, Math.max(0, raw))
  }
  return scrollBus.lastGoodOffset
}

export function jumpToStop(index, totalPages) {
  const el = scrollBus.el
  if (!el) return
  const top = (index / (totalPages - 1)) * (el.scrollHeight - el.clientHeight)
  el.scrollTo({ top, behavior: 'smooth' })
}
