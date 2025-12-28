'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useAuth from '../../../hooks/useAuth'
import useSubscription from '../../../hooks/useSubscription'
import { loadCheckout } from '../../../lib/stripe'

export default function CheckoutHandoffPage() {
  const { user } = useAuth()
  const { subscription, loaded: subscriptionLoaded } = useSubscription(user)
  const router = useRouter()
  const searchParams = useSearchParams()

  const priceId = searchParams?.get('priceId')
  const next = searchParams?.get('next')

  const [error, setError] = useState<string | null>(null)

  const missingPriceId = !priceId

  const ready = useMemo(() => !!priceId && !!user, [priceId, user])

  useEffect(() => {
    if (subscriptionLoaded && subscription) {
      router.replace('/profiles')
      return
    }

    if (!user) {
      const qs = new URLSearchParams()
      if (priceId) qs.set('priceId', priceId)
      if (next) qs.set('next', next)
      router.replace(`/login/signin?next=${encodeURIComponent(`/login/checkout?${qs.toString()}`)}`)
      return
    }

    if (!priceId) return

    ;(async () => {
      try {
        await loadCheckout(priceId)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Checkout failed. Please try again.')
      }
    })()
  }, [next, priceId, router, subscription, subscriptionLoaded, user])

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex w-full max-w-md flex-col px-6 py-10">
        <Link href="/login/plans" className="mb-8 text-sm text-white/80 hover:text-white">
          ← Back to plans
        </Link>

        <h1 className="text-3xl font-bold">Secure checkout</h1>
        <p className="mt-2 text-sm text-white/70">
          {ready ? 'Redirecting you to payment…' : 'Preparing your checkout…'}
        </p>

        {missingPriceId && !error && (
          <div className="mt-6 rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            Missing priceId. Please go back and select a plan.
          </div>
        )}

        {error && (
          <div className="mt-6 rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {!error && (
          <div className="mt-6 rounded bg-white/5 px-4 py-3 text-sm text-white/70 ring-1 ring-white/10">
            If nothing happens after a few seconds, your Stripe extension may not be set up yet, or the selected plan has no active price.
          </div>
        )}
      </div>
    </main>
  )
}
