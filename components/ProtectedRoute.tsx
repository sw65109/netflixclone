"use client"

import { PropsWithChildren } from 'react'
import { useProtectedRoute } from '../hooks/useProtectedRoute'

type Props = PropsWithChildren<{
  redirectTo?: string
}>

export default function ProtectedRoute({ children, redirectTo }: Props) {
  const { user, loading } = useProtectedRoute(redirectTo)

  if (loading) return null
  if (!user) return null

  return <>{children}</>
}