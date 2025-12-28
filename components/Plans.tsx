"use client"

import { CheckIcon } from '@heroicons/react/24/outline'
import { Product } from '@stripe/firestore-stripe-payments'
import Head from 'next/head'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '../hooks/useAuth'
import useSubscription from '../hooks/useSubscription'
import { loadCheckout } from '../lib/stripe'
import Loader from './Loader'
import Table from './Table'
import Image from 'next/image'

interface Props {
  products: Product[]
}

type PriceLike = {
  id?: string
  currency?: string
  unit_amount?: number | null
} & Record<string, unknown>

function getOptionalString(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined
}

function getOptionalBoolean(v: unknown): boolean | undefined {
  return typeof v === 'boolean' ? v : undefined
}

function getRecurringInterval(price: unknown): string | undefined {
  if (typeof price !== 'object' || price === null) return undefined
  const p = price as Record<string, unknown>

  const recurring = p.recurring
  if (typeof recurring !== 'object' || recurring === null) return undefined

  const interval = (recurring as Record<string, unknown>).interval
  return getOptionalString(interval)
}

export default function Plans({ products }: Props) {
  const { logout, user } = useAuth()
  const { subscription, loaded: subscriptionLoaded } = useSubscription(user)
  const router = useRouter()

  const defaultPlan = useMemo<Product | null>(() => {
    if (!products || products.length === 0) return null
    return products[products.length - 1]
  }, [products])

  const [selectedPlan, setSelectedPlan] = useState<Product | null>(() => defaultPlan)

  const [isBillingLoading, setBillingLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectiveSelectedPlan = selectedPlan ?? defaultPlan
  const selectedPriceId = effectiveSelectedPlan?.prices?.[0]?.id ?? null

  const subscribeToPlan = async () => {
    setError(null)

    if (subscriptionLoaded && subscription) {
      router.replace('/profiles')
      return
    }

    console.log('[Subscribe click]', {
      uid: user?.uid ?? null,
      email: user?.email ?? null,
      selectedPlan: effectiveSelectedPlan
        ? {
            id: effectiveSelectedPlan.id,
            name: effectiveSelectedPlan.name,
            active: effectiveSelectedPlan.active,
            prices: (effectiveSelectedPlan.prices ?? []).map((raw) => {
              const p = raw as unknown as PriceLike

              return {
                id: p.id,
                currency: p.currency,
                unit_amount: p.unit_amount ?? null,
                interval: getRecurringInterval(p),
                type: getOptionalString(p.type),
                active: getOptionalBoolean(p.active),
              }
            }),
          }
        : null,
      selectedPriceId,
    })

    if (!effectiveSelectedPlan) {
      setError('Please select a plan.')
      return
    }

    if (!selectedPriceId) {
      setError(
        'This plan has no price loaded. Make sure products were fetched with includePrices: true and that your Stripe extension synced prices.'
      )
      return
    }

    if (!user) {
      router.push('/login?next=/')
      return
    }

    try {
      setBillingLoading(true)
      await loadCheckout(selectedPriceId)
    } catch (e: unknown) {
      console.error('Subscribe failed:', e)
      setError(e instanceof Error ? e.message : 'Subscribe failed. Check console for details.')
      setBillingLoading(false)
    }
  }

  const productsReady = products && products.length > 0
  const canSubscribe = !!effectiveSelectedPlan && !!selectedPriceId && !isBillingLoading

  return (
    <div>
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="border-b border-white/10 bg-[#141414]">
        <Link href="/">
          <Image
            src="https://rb.gy/ulxxee"
            alt="Netflix"
            width={150}
            height={90}
            className="cursor-pointer object-contain"
          />
        </Link>

        {user ? (
          <button className="text-lg font-medium hover:underline" onClick={logout}>
            Sign Out
          </button>
        ) : (
          <Link href="/login" className="text-lg font-medium hover:underline">
            Sign In
          </Link>
        )}
      </header>

      <main className="mx-auto max-w-5xl px-5 pt-28 pb-12 transition-all md:px-10">
        <h1 className="mb-3 text-3xl font-medium">
          Choose the plan that&apos;s right for you
        </h1>

        <ul>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Watch all you want. Ad-free.
          </li>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Recommendations just for you.
          </li>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Change or cancel your plan anytime.
          </li>
        </ul>

        <div className="mt-4 flex flex-col space-y-4">
          {!productsReady ? (
            <div className="rounded bg-white/5 p-4 text-sm text-gray-300">
              Loading plans…
            </div>
          ) : (
            <>
              <div className="flex w-full items-center justify-center self-end md:w-3/5">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`planBox ${
                      effectiveSelectedPlan?.id === product.id ? 'opacity-100' : 'opacity-60'
                    }`}
                    onClick={() => setSelectedPlan(product)}
                  >
                    {product.name}
                  </div>
                ))}
              </div>

              <Table products={products} selectedPlan={effectiveSelectedPlan} />

              {error && (
                <p className="mx-auto w-11/12 text-sm text-red-400 md:w-105">{error}</p>
              )}

              <button
                disabled={!canSubscribe}
                className={`mx-auto w-11/12 rounded bg-[#E50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-105 ${
                  (!canSubscribe || isBillingLoading) && 'opacity-60'
                }`}
                onClick={subscribeToPlan}
              >
                {isBillingLoading ? (
                  <Loader color="dark:fill-gray-300" />
                ) : user ? (
                  'Subscribe'
                ) : (
                  'Sign in to Subscribe'
                )}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}