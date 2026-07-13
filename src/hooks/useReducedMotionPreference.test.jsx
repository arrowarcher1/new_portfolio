import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useReducedMotionPreference } from './useReducedMotionPreference'

function installMatchMedia(initial) {
  let matches = initial
  const listeners = new Set()
  const media = {
    get matches() { return matches },
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: (_, listener) => listeners.add(listener),
    removeEventListener: (_, listener) => listeners.delete(listener),
    setMatches(next) {
      matches = next
      listeners.forEach((listener) => listener({ matches }))
    },
  }
  window.matchMedia = vi.fn(() => media)
  return media
}

describe('useReducedMotionPreference', () => {
  it('reads and reacts to the operating-system preference', () => {
    const media = installMatchMedia(false)
    const { result } = renderHook(() => useReducedMotionPreference())
    expect(result.current).toBe(false)

    act(() => media.setMatches(true))
    expect(result.current).toBe(true)
  })
})
