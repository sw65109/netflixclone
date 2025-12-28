import type { StripePayments } from '@stripe/firestore-stripe-payments'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'
import app, { auth, getDb } from '../firebase'

let _payments: StripePayments | null = null

export async function getPayments() {
  if (typeof window === 'undefined') {
    throw new Error('Stripe Payments is client-only.')
  }

  if (_payments) return _payments

  const mod = await import('@stripe/firestore-stripe-payments')

  _payments = mod.getStripePayments(app as never, {
    productsCollection: 'products',
    customersCollection: 'customers',
  })

  return _payments
}

type CheckoutSessionDoc = {
  url?: string
  sessionId?: string
  error?: { message?: string }
}

export const loadCheckout = async (priceId: string) => {
  if (typeof window === 'undefined') {
    throw new Error('Checkout is client-only.')
  }
  if (!priceId) throw new Error('Missing priceId for checkout.')

  const user = auth.currentUser
  if (!user) throw new Error('You must be signed in to start checkout.')

  const db = getDb()

  const checkoutSessionsRef = collection(db, 'customers', user.uid, 'checkout_sessions')

  const docRef = await addDoc(checkoutSessionsRef, {
    price: priceId,
    success_url: `${window.location.origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${window.location.origin}/?checkout=cancel`,
  })

  await new Promise<void>((resolve, reject) => {
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        const data = snap.data() as CheckoutSessionDoc | undefined
        const url = data?.url
        const errMsg = data?.error?.message

        if (errMsg) {
          unsub()
          reject(new Error(errMsg))
          return
        }

        if (typeof url === 'string' && url.length > 0) {
          unsub()
          window.location.assign(url)
          resolve()
        }
      },
      (err) => {
        unsub()
        reject(err)
      }
    )
  })
}

export const goToBillingPortal = async () => {
  throw new Error(
    'Billing portal is now handled via /api/stripe/portal to avoid bundling firebase/functions into the client build.'
  )
}