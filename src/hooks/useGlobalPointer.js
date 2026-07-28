import { useEffect } from 'react'
import { bindGlobalPointer } from '../lib/globalPointer'

/** Mount window pointer/scroll sampling for atmosphere scenes. */
export function useGlobalPointer() {
  useEffect(() => bindGlobalPointer(), [])
}
