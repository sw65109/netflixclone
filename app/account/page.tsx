'use client'

import type { Product } from '@stripe/firestore-stripe-payments'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Membership from '../../components/Membership'
import Footer from '../../components/Footer'
import useAuth from '../../hooks/useAuth'
import useSubscription from '../../hooks/useSubscription'
import Image from 'next/image'
import { getDb } from '../../firebase'
import { collection, getDocs, query, where, type DocumentData } from 'firebase/firestore'

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

export default function AccountPage() {
  const { logout, user } = useAuth()
  const { subscription } = useSubscription(user)

  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        setProductsLoading(true)
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

        if (!cancelled) setProducts(prods)
      } catch {
        if (!cancelled) setProducts([])
      } finally {
        if (!cancelled) setProductsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const currentPlanName =
    products.find((product) => product.id === subscription?.product)?.name ?? '—'

  return (
    <div>
      <header className="bg-[#141414]">
        <Link href="/" aria-label="Go to home">
          <Image
            src="https://rb.gy/ulxxee"
            width={120}
            height={120}
            alt="Netflix"
            className="cursor-pointer object-contain"
          />
        </Link>

        <Link href="/account" aria-label="Account">
          <Image
            src="https://rb.gy/g1pwyx"
            alt="Avatar"
            className="h-7 w-7 cursor-pointer rounded"
            width={28}
            height={28}
          />
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-5 pt-24 pb-12 transition-all md:px-10">
        <div className="flex flex-col gap-x-4 md:flex-row md:items-center">
          <h1 className="text-3xl md:text-4xl">Account</h1>
          <div className="-ml-0.5 flex items-center gap-x-1.5">
            <Image 
              src="https://rb.gy/4vfk4r" 
              alt="" 
              className="h-7 w-7"
              width={28}
              height={28}
            />
            <p className="text-xs font-semibold text-[#555]">
              Member since {subscription?.created}
            </p>
          </div>
        </div>

        <Membership />

        <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0 md:pb-0">
          <h4 className="text-lg text-[gray]">Plan Details</h4>
          <div className="hidden md:block" />
          <div className="col-span-2 font-medium">
            {productsLoading ? 'Loading…' : currentPlanName}
          </div>
          <p className="cursor-pointer text-blue-500 hover:underline md:text-right">
            Change plan
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0">
          <h4 className="text-lg text-[gray]">Settings</h4>
          <p
            className="col-span-3 cursor-pointer text-blue-500 hover:underline"
            onClick={logout}
          >
            Sign out of Netflix
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}