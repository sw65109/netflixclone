'use client'

import { RefObject, useEffect } from 'react'

type AnyEvent = MouseEvent | TouchEvent

type Options = {
  enabled?: boolean
}

export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  onOutsideClick: (event: AnyEvent) => void,
  options: Options = {}
) {
  const { enabled = true } = options

  useEffect(() => {
    if (!enabled) return

    const handler = (event: AnyEvent) => {
      const el = ref.current
      if (!el) return

      const target = event.target as Node | null
      if (!target) return

      if (el.contains(target)) return
      onOutsideClick(event)
    }

    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)

    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [ref, onOutsideClick, enabled])
}