import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => cleanup())

window.requestAnimationFrame ??= (callback) => window.setTimeout(callback, 0)
window.cancelAnimationFrame ??= (handle) => window.clearTimeout(handle)
window.matchMedia ??= vi.fn(() => ({
  matches: false,
  media: '',
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}))
