'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useAuth from './useAuth'

export function useProtectedRoute(redirectTo: string = '/login') {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (loading) return
    if (user) return

    const qs = searchParams?.toString()
    const asPath = `${pathname}${qs ? `?${qs}` : ''}`

    router.replace(`${redirectTo}?next=${encodeURIComponent(asPath)}`)
  }, [loading, user, redirectTo, router, pathname, searchParams])

  return { user, loading }
}