'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Product } from '@stripe/firestore-stripe-payments'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useRouter, useSearchParams } from 'next/navigation'
import Table from '../../../components/Table'
import { getDb } from '../../../firebase'
import {
  collection,
  getDocs,
  query,
  where,
  type DocumentData,
} from 'firebase/firestore'

type StripePriceDoc = {
  id: string
  active?: boolean
  currency?: string
  unit_amount?: number
  interval?: string
  interval_count?: number
}

type StripeProductDoc = {
  name?: string
  description?: string
  active?: boolean
  role?: string
  metadata?: Record<string, unknown>
}

function toProductShape(
  id: string,
  data: StripeProductDoc,
  prices: StripePriceDoc[]
): Product {
  return {
    id,
    name: data.name ?? 'Plan',
    description: data.description ?? null,
    active: data.active ?? true,
    role: data.role ?? null,
    metadata: data.metadata ?? {},
    prices,
  } as unknown as Product
}

export default function PlansSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
const email = searchParams?.get('email')
const next = searchParams?.get('next')

  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        setProductsLoading(true)
        setProductsError(null)

        const db = getDb()

        const productsRef = collection(db, 'products')
        const productsQuery = query(productsRef, where('active', '==', true))
        const productsSnap = await getDocs(productsQuery)

        const prods: Product[] = []

        for (const docSnap of productsSnap.docs) {
          const data = docSnap.data() as DocumentData as StripeProductDoc
          const productId = docSnap.id

          const pricesRef = collection(db, 'products', productId, 'prices')
          const pricesQuery = query(pricesRef, where('active', '==', true))

          const pricesSnap = await getDocs(pricesQuery)
          const prices: StripePriceDoc[] = pricesSnap.docs.map((p) => {
            const pData = p.data() as DocumentData
            return {
              id: p.id,
              active: pData.active,
              currency: pData.currency,
              unit_amount: pData.unit_amount,
              interval: pData.interval,
              interval_count: pData.interval_count,
            }
          })

          prices.sort((a, b) => (a.unit_amount ?? 0) - (b.unit_amount ?? 0))

          prods.push(toProductShape(productId, data, prices))
        }

        const planRank = (name: string | null | undefined) => {
          const n = String(name ?? '').trim().toLowerCase()
          if (n.includes('basic')) return 0
          if (n.includes('standard')) return 1
          if (n.includes('premium')) return 2
          return 99
        }

        prods.sort((a, b) => {
          const byRank = planRank(a.name) - planRank(b.name)
          if (byRank !== 0) return byRank
          return String(a.name ?? '').localeCompare(String(b.name ?? ''))
        })

        if (!cancelled) setProducts(prods)
      } catch (e: unknown) {
        console.error('[PlansSection] Failed to load products/prices from Firestore:', e)
        if (!cancelled) {
          setProducts([])
          setProductsError(
            e instanceof Error
              ? e.message
              : 'Failed to load plans from Firestore. Check console for details.'
          )
        }
      } finally {
        if (!cancelled) setProductsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const defaultPlan = useMemo<Product | null>(() => {
    if (!products || products.length === 0) return null
    return products[products.length - 1] ?? null
  }, [products])

  const [selectedPlan, setSelectedPlan] = useState<Product | null>(() => defaultPlan)

  const effectiveSelectedPlan = selectedPlan ?? defaultPlan
  const selectedPriceId = (effectiveSelectedPlan?.prices?.[0] as unknown as { id?: string } | undefined)?.id

  const ctaPriceText = useMemo(() => {
    const priceAny = effectiveSelectedPlan?.prices?.[0] as unknown as { unit_amount?: number | null }
    const unit = typeof priceAny?.unit_amount === 'number' ? priceAny.unit_amount : null

    if (!unit) return 'Join'
    const dollars = (unit / 100).toFixed(2)
    return `Join for $${dollars}`
  }, [effectiveSelectedPlan])

  const plansReady = !!products && products.length > 0

  return (
    <section className="mx-auto w-full max-w-5xl px-5 pt-10 pb-12 md:px-10">
      <h2 className="mb-3 text-3xl font-medium">Choose the plan that’s right for you</h2>

      <ul>
        <li className="flex items-center gap-x-2 text-lg">
          <CheckIcon className="h-7 w-7 text-[#E50914]" /> Watch all you want.
        </li>
        <li className="flex items-center gap-x-2 text-lg">
          <CheckIcon className="h-7 w-7 text-[#E50914]" /> Recommendations just for you.
        </li>
        <li className="flex items-center gap-x-2 text-lg">
          <CheckIcon className="h-7 w-7 text-[#E50914]" /> Change or cancel your plan anytime.
        </li>
      </ul>

      <div className="mt-4 flex flex-col space-y-4">
        {productsLoading ? (
          <div className="rounded bg-white/5 p-4 text-sm text-gray-300">Loading plans…</div>
        ) : productsError ? (
          <div className="rounded border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            <div className="font-semibold">We couldn&apost load plans.</div>
            <div className="mt-2 wrap-break-word opacity-90">{productsError}</div>
            <div className="mt-3 text-xs text-red-100/80">
              Common causes: Firestore security rules deny read access to the <code>products</code> collection,
              the Stripe extension hasn&apost synced products/prices yet, or there are no <code>active</code> prices.
            </div>
          </div>
        ) : !plansReady ? (
          <div className="rounded bg-white/5 p-4 text-sm text-gray-300">
            No plans found. Make sure Firestore has <code>products</code> with at least one active price.
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
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedPlan(product)
                  }}
                >
                  {product.name}
                </div>
              ))}
            </div>

            <Table products={products} selectedPlan={effectiveSelectedPlan} />

            <button
              className="mx-auto w-11/12 rounded bg-[#E50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-105"
              onClick={() => {
                if (!selectedPriceId) return
                const qs = new URLSearchParams()
                qs.set('priceId', selectedPriceId)
                if (email) qs.set('email', email)
                if (next) qs.set('next', next)
                router.push(`/login/signup?${qs.toString()}`)
              }}
            >
              {ctaPriceText}
            </button>

            <p className="mx-auto w-11/12 text-xs text-white/60 md:w-105">
              You&aposll create your account, then you&aposll be prompted to enter payment details.
            </p>
          </>
        )}
      </div>
    </section>
  )
}
