'use client'

import { PropsWithChildren } from 'react'
import { usePathname } from 'next/navigation'

export default function HeaderGate({ children }: PropsWithChildren) {
  const pathname = usePathname()

  if (!pathname) return null
  if (pathname.startsWith('/login')) return null

  return <>{children}</>
}
