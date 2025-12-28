'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'
import Header from '../../../components/Header'

const ReactPlayer = dynamic(() => import('react-player').then((m) => m.default), {
  ssr: false,
}) as ComponentType<Record<string, unknown>>

type VideoResult = {
  key?: string
  site?: string
  type?: string
}

type TitleResponse = {
  id: number
  name?: string
  title?: string
  original_name?: string
  videos?: { results?: VideoResult[] }
}

type TitleApiSuccess = TitleResponse
type TitleApiError = { error: string }

function isTitleApiError(v: unknown): v is TitleApiError {
  return (
    typeof v === 'object' &&
    v !== null &&
    'error' in v &&
    typeof (v as { error?: unknown }).error === 'string'
  )
}

function isVideoResult(v: unknown): v is VideoResult {
  return typeof v === 'object' && v !== null
}

function pickYouTubeTrailerKey(results: unknown): string | null {
  if (!Array.isArray(results)) return null
  const videos = results.filter(isVideoResult)

  const trailer =
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ??
    videos.find((v) => v.site === 'YouTube')

  return typeof trailer?.key === 'string' ? trailer.key : null
}

export default function WatchPage({ params }: { params: { id: string } }) {
  const id = params.id

  const [title, setTitle] = useState<TitleResponse | null>(null)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (!id) return

      try {
        setError(null)

        const res = await fetch(
          `/api/tmdb/title?id=${encodeURIComponent(id)}&type=movie`
        )

        const data: unknown = await res.json()

        if (!res.ok) {
          const message = isTitleApiError(data) ? data.error : 'Failed to load title'
          throw new Error(message)
        }

        if (cancelled) return

        const titleData = data as TitleApiSuccess

        setTitle(titleData)
        setTrailerKey(pickYouTubeTrailerKey(titleData?.videos?.results))
      } catch (e: unknown) {
        if (cancelled) return
        const message = e instanceof Error ? e.message : 'Failed to load title'
        setError(message)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [id])

  const name = title?.title || title?.name || title?.original_name || 'Watch'

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="mx-auto max-w-5xl px-4 pb-10 pt-28">
        <div className="mb-4">
          <Link href="/" className="text-sm text-gray-300 hover:underline">
            ← Back to Home
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">{name}</h1>
        </div>

        {error && <p className="text-red-400">{error}</p>}

        <div className="relative aspect-video overflow-hidden rounded bg-white/5">
          {trailerKey ? (
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${trailerKey}`}
              width="100%"
              height="100%"
              controls
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              No trailer found.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}