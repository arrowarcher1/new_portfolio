import { describe, expect, it } from 'vitest'
import { JOURNEY_ITEMS } from './journey'

describe('JOURNEY_ITEMS', () => {
  it('defines one continuous number for every public section', () => {
    expect(JOURNEY_ITEMS).toEqual([
      { number: '01', label: 'Home', id: 'top' },
      { number: '02', label: 'About', id: 'about' },
      { number: '03', label: 'Experience', id: 'experience' },
      { number: '04', label: 'Work', id: 'work' },
      { number: '05', label: 'Capabilities', id: 'capabilities' },
      { number: '06', label: 'Contact', id: 'contact' },
    ])
  })
})
