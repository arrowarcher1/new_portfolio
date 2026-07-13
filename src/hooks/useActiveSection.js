import { useEffect, useState } from 'react'
import { JOURNEY_ITEMS } from '../data/journey'

export function useActiveSection(items = JOURNEY_ITEMS) {
  const [activeSection, setActiveSection] = useState(items[0]?.id ?? 'top')

  useEffect(() => {
    const sections = items.map(({ id }) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return undefined

    if (typeof window.IntersectionObserver === 'function') {
      const observer = new window.IntersectionObserver((entries) => {
        const current = entries.find((entry) => entry.isIntersecting)
        if (current) setActiveSection(current.target.id)
      }, { rootMargin: '-45% 0px -53% 0px', threshold: 0 })
      sections.forEach((section) => observer.observe(section))
      return () => observer.disconnect()
    }

    let frame = 0
    const update = () => {
      frame = 0
      const readingLine = window.innerHeight * 0.46
      const next = sections.reduce(
        (current, section) => section.getBoundingClientRect().top <= readingLine ? section.id : current,
        sections[0].id,
      )
      setActiveSection(next)
    }
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      window.cancelAnimationFrame(frame)
    }
  }, [items])

  return activeSection
}
