'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useAuth from '../../../hooks/useAuth'
import useSubscription from '../../../hooks/useSubscription'

function isValidEmail(v: string) {
  return /\S+@\S+\.\S+/.test(v)
}

export default function SignUpPage() {
  const { signUp, error, loading, user } = useAuth()
  const { subscription, loaded: subscriptionLoaded } = useSubscription(user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const priceId = searchParams?.get('priceId')
  const next = searchParams?.get('next')
  const emailFromQuery = searchParams?.get('email')

  const [email, setEmail] = useState(() => emailFromQuery ?? '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const disabled = useMemo(() => {
    if (loading) return true
    if (!email || !password || !confirm) return true
    if (!isValidEmail(email)) return true
    if (password.length < 6) return true
    if (password !== confirm) return true
    return false
  }, [confirm, email, loading, password])

  useEffect(() => {
    if (priceId) return
    const qs = new URLSearchParams()
    const e = email.trim()
    if (e) qs.set('email', e)
    if (next) qs.set('next', next)
    router.replace(`/login/plans${qs.toString() ? `?${qs.toString()}` : ''}`)
  }, [priceId, router, email, next])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalError(null)

    if (subscriptionLoaded && subscription) {
      router.replace('/profiles')
      return
    }

    if (!isValidEmail(email)) return setLocalError('Please enter a valid email.')
    if (password.length < 6) return setLocalError('Password must be at least 6 characters.')
    if (password !== confirm) return setLocalError("Passwords don't match.")

    try {
      await signUp(email.trim(), password)

      if (priceId) {
        const qs = new URLSearchParams()
        qs.set('priceId', priceId)
        if (next) qs.set('next', next)
        router.replace(`/login/checkout?${qs.toString()}`)
        return
      }

      if (next) {
        router.replace(next)
        return
      }
    } catch {
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex w-full max-w-md flex-col px-6 py-10">
        <Link href="/login" className="mb-8 text-sm text-white/80 hover:text-white">
          ← Back
        </Link>

        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="mt-2 text-sm text-white/70">
          Enter your email and create a password to start your membership.
        </p>

        {priceId && (
          <p className="mt-4 rounded bg-white/5 px-4 py-3 text-sm text-white/80 ring-1 ring-white/10">
            You selected a plan—after creating your account, we’ll take you to payment.
          </p>
        )}

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-lg bg-white/5 p-6 ring-1 ring-white/10"
        >
          <label className="block">
            <span className="text-sm text-white/80">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="mt-2 w-full rounded border border-white/20 bg-black/40 px-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-white/60"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm text-white/80">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              className="mt-2 w-full rounded border border-white/20 bg-black/40 px-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-white/60"
            />
            <p className="mt-2 text-xs text-white/60">Use at least 6 characters.</p>
          </label>

          <label className="mt-4 block">
            <span className="text-sm text-white/80">Confirm password</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              className="mt-2 w-full rounded border border-white/20 bg-black/40 px-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-white/60"
            />
          </label>

          {(localError || error) && (
            <div className="mt-4 rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {localError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={disabled}
            className="mt-6 inline-flex w-full items-center justify-center rounded bg-[#e50914] px-4 py-3 text-sm font-semibold hover:bg-[#f6121d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="mt-4 text-center text-sm text-white/70">
            Already have an account?{' '}
            <Link href="/login/signin" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
