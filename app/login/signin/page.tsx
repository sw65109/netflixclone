'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useAuth from '../../../hooks/useAuth'
import useSubscription from '../../../hooks/useSubscription'

function isValidEmail(v: string) {
  return /\S+@\S+\.\S+/.test(v)
}

export default function SignInPage() {
  const { signIn, error, loading, user } = useAuth()
  const { subscription, loaded: subscriptionLoaded } = useSubscription(user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams?.get('next')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const disabled = useMemo(() => {
    if (loading) return true
    if (!email || !password) return true
    if (!isValidEmail(email)) return true
    return false
  }, [email, loading, password])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalError(null)

    if (!isValidEmail(email)) return setLocalError('Please enter a valid email.')

    try {
      await signIn(email.trim(), password)
    } catch {
    }
  }

  if (user && subscriptionLoaded) {
    if (subscription) {
      router.replace('/profiles')
    } else {
      const safeNext = next && next.startsWith('/') ? next : '/'
      if (safeNext === '/') router.replace('/login/plans?next=%2F')
      else router.replace(`/login/plans?next=${encodeURIComponent(safeNext)}`)
    }
    return null
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex w-full max-w-md flex-col px-6 py-10">
        <Link href="/login" className="mb-8 text-sm text-white/80 hover:text-white">
          ← Back
        </Link>

        <h1 className="text-3xl font-bold">Sign In</h1>
        <p className="mt-2 text-sm text-white/70">Welcome back.</p>

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
              autoComplete="current-password"
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
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="mt-4 text-center text-sm text-white/70">
            New to Netflix?{' '}
            <Link
              href={next ? `/login/signup?next=${encodeURIComponent(next)}` : '/login/signup'}
              className="text-white hover:underline"
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
