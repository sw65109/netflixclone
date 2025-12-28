'use client'

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { auth } from '../firebase'

function isLoginRoute(pathname: string) {
  return pathname === '/login' || pathname.startsWith('/login/')
}

interface IAuth {
  user: User | null
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
  loading: boolean
}

function messageFromUnknown(e: unknown, fallback: string) {
  return e instanceof Error ? e.message : fallback
}

const AuthContext = createContext<IAuth>({
  user: null,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
  error: null,
  loading: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null)
      setInitialLoading(false)

      if (!u && !isLoginRoute(window.location.pathname)) {
        router.push('/login')
      }
    })

    return () => unsub()
  }, [router])

  const signUp = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      setError(null)
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        setUser(cred.user)

        const params = new URLSearchParams(window.location.search)
        const next = params.get('next')
        router.push(next && next.startsWith('/') ? next : '/')
      } catch (e: unknown) {
        setError(messageFromUnknown(e, 'Sign up failed'))
        throw e
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      setError(null)
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password)
        setUser(cred.user)

        const params = new URLSearchParams(window.location.search)
        const next = params.get('next')
        router.push(next && next.startsWith('/') ? next : '/')
      } catch (e: unknown) {
        setError(messageFromUnknown(e, 'Sign in failed'))
        throw e
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await signOut(auth)
      setUser(null)
      router.push('/login')
    } catch (e: unknown) {
      setError(messageFromUnknown(e, 'Logout failed'))
      throw e
    } finally {
      setLoading(false)
    }
  }, [router])

  const value = useMemo(
    () => ({ user, signUp, signIn, logout, error, loading }),
    [user, signUp, signIn, logout, error, loading]
  )

  return (
    <AuthContext.Provider value={value}>
      {!initialLoading && children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}