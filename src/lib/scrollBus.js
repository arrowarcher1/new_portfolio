// Tiny bridge between the drei ScrollControls world (inside the Canvas)
// and fixed HTML chrome (nav, progress) living outside it.

export const scrollBus = {
  el: null,
  offset: 0,
}

export function jumpToStop(index, totalPages) {
  const el = scrollBus.el
  if (!el) return
  const top = (index / (totalPages - 1)) * (el.scrollHeight - el.clientHeight)
  el.scrollTo({ top, behavior: 'smooth' })
}
