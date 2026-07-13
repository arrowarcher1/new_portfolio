import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { JOURNEY_ITEMS } from '../data/journey'
import { useActiveSection } from './useActiveSection'

let observerCallback

beforeEach(() => {
  document.body.innerHTML = JOURNEY_ITEMS.map(({ id }) => `<section id="${id}"></section>`).join('')
  window.IntersectionObserver = vi.fn(function IntersectionObserver(callback) {
    observerCallback = callback
    this.observe = vi.fn()
    this.disconnect = vi.fn()
  })
})

afterEach(() => vi.restoreAllMocks())

describe('useActiveSection', () => {
  it('starts at the first journey item', () => {
    const { result } = renderHook(() => useActiveSection())
    expect(result.current).toBe('top')
  })

  it('uses an intersecting section as the active location', () => {
    const { result } = renderHook(() => useActiveSection())
    act(() => observerCallback([{ isIntersecting: true, target: document.getElementById('work') }]))
    expect(result.current).toBe('work')
  })

  it('falls back to requestAnimationFrame-throttled geometry reads without IntersectionObserver', () => {
    window.IntersectionObserver = undefined
    const positions = Object.fromEntries(JOURNEY_ITEMS.map(({ id }, index) => [id, index * 500]))
    const rectReaders = JOURNEY_ITEMS.map(({ id }) => {
      const reader = vi.fn(() => ({ top: positions[id] }))
      document.getElementById(id).getBoundingClientRect = reader
      return reader
    })
    let frameCallback
    const requestFrame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frameCallback = callback
      return 1
    })

    const { result } = renderHook(() => useActiveSection())
    expect(result.current).toBe('top')
    rectReaders.forEach((reader) => reader.mockClear())
    Object.assign(positions, { about: -300, experience: -100, work: 100 })

    act(() => {
      window.dispatchEvent(new Event('scroll'))
      window.dispatchEvent(new Event('scroll'))
    })
    expect(requestFrame).toHaveBeenCalledTimes(1)
    expect(rectReaders.every((reader) => reader.mock.calls.length === 0)).toBe(true)

    act(() => frameCallback())
    expect(result.current).toBe('work')
    expect(rectReaders.every((reader) => reader.mock.calls.length === 1)).toBe(true)
  })
})
