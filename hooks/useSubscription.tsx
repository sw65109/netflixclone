'use client'

import type { User } from 'firebase/auth'
import { collection, onSnapshot, query, where, type DocumentData } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { getDb } from '../firebase'

export type Subscription = {
  id: string
  status?: string
  cancel_at_period_end?: boolean
  current_period_end?: number
  current_period_start?: number
  created?: number
  ended_at?: number | null
  cancel_at?: number | null
  canceled_at?: number | null
  trial_end?: number | null
  trial_start?: number | null
  product?: unknown
  price?: unknown
  metadata?: Record<string, unknown>
} & Record<string, unknown>

export default function useSubscription(user: User | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!user) {
      queueMicrotask(() => {
        setSubscription(null)
        setLoaded(true)
      })
      return
    }

    queueMicrotask(() => {
      setLoaded(false)
    })

    const db = getDb()
    const subsRef = collection(db, 'customers', user.uid, 'subscriptions')

    const q = query(subsRef, where('status', 'in', ['active', 'trialing']))

    const unsub = onSnapshot(
      q,
      (snap) => {
        const first = snap.docs[0]
        if (!first) {
          setSubscription(null)
          setLoaded(true)
          return
        }

        const data = first.data() as DocumentData
        setSubscription({ id: first.id, ...(data as Record<string, unknown>) } as Subscription)
        setLoaded(true)
      },
      () => {
        setSubscription(null)
        setLoaded(true)
      }
    )

    return () => {
      unsub()
    }
  }, [user])

  return { subscription: user ? subscription : null, loaded }
}