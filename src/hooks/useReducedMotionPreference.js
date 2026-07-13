import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches,
  )

  useEffect(() => {
    const media = window.matchMedia?.(QUERY)
    if (!media) return undefined
    const update = (event) => setReducedMotion(event.matches)
    setReducedMotion(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reducedMotion
}
