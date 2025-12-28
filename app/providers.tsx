'use client'

import { ReactNode, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { AuthProvider } from '../hooks/useAuth'
import useAuth from '../hooks/useAuth'
import useSubscription from '../hooks/useSubscription'
import useProfile from '../hooks/useProfile'

function SubscriptionGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const { subscription, loaded: subscriptionLoaded } = useSubscription(user)

  useEffect(() => {
    if (loading) return
    const clean = pathname || '/'
    const isLoginRoute = clean === '/login' || clean.startsWith('/login/')

    if (!user) {
      if (!isLoginRoute) window.location.assign('/login')
      return
    }

    if (!subscriptionLoaded) return

    const qs = searchParams?.toString()
    const asPath = `${clean}${qs ? `?${qs}` : ''}`

    const checkoutResult = searchParams?.get('checkout')
    const isCheckoutReturn =
      clean === '/' && (checkoutResult === 'success' || checkoutResult === 'cancel')

    if (subscription && isLoginRoute) {
      window.history.replaceState(null, '', '/profiles')
      window.location.assign('/profiles')
      return
    }

    if (isLoginRoute || isCheckoutReturn) return

    if (clean === '/login/plans') return

    if (!subscription) {
      window.history.replaceState(
        null,
        '',
        `/login/plans?next=${encodeURIComponent(asPath)}`
      )
      window.location.assign(`/login/plans?next=${encodeURIComponent(asPath)}`)
    }
  }, [loading, pathname, searchParams, subscription, subscriptionLoaded, user])

  const clean = pathname || '/'
  const isLoginRoute = clean === '/login' || clean.startsWith('/login/')

  if (!isLoginRoute && loading) return null

  if (!isLoginRoute && !user) return null

  if (!isLoginRoute && user && !subscriptionLoaded) return null

  if (!isLoginRoute && user && subscriptionLoaded && !subscription) return null

  return <>{children}</>
}

function KidsRouteGuard({ children }: { children: ReactNode }) {
  const { activeProfile } = useProfile()

  useEffect(() => {
    if (!activeProfile?.isKids) return

    const allowedPrefixes = ['/kids', '/profiles', '/help']

    const enforce = (path: string) => {
      const clean = path.split('?')[0] || path
      const allowed = allowedPrefixes.some(
        (p) => clean === p || clean.startsWith(`${p}/`)
      )
      if (!allowed) window.location.href = '/kids'
    }

    enforce(window.location.pathname)
  }, [activeProfile?.isKids])

  return <>{children}</>
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SubscriptionGuard>
        <KidsRouteGuard>{children}</KidsRouteGuard>
      </SubscriptionGuard>
    </AuthProvider>
  )
}