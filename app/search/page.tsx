'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import Header from '../../components/Header'
import SearchBar from '../../components/SearchBar'
import Thumbnail from '../../components/Thumbnail'
import Footer from '../../components/Footer'
import type { Movie } from '../../typings'

type SearchApiResponse =
  | { results: Movie[] }
  | { error: string }
  | unknown

function isSearchError(v: unknown): v is { error: string } {
  return (
    typeof v === 'object' &&
    v !== null &&
    'error' in v &&
    typeof (v as { error?: unknown }).error === 'string'
  )
}

function isMovieLike(v: unknown): v is Movie {
  if (typeof v !== 'object' || v === null) return false
  return (
    'id' in v &&
    typeof (v as { id?: unknown }).id === 'number' &&
    'media_type' in v &&
    ((v as { media_type?: unknown }).media_type === 'movie' ||
      (v as { media_type?: unknown }).media_type === 'tv')
  )
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = useMemo(
    () => (searchParams.get('q') ?? '').toString().trim(),
    [searchParams]
  )

  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (!q) {
        setResults([])
        setError(null)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(q)}`)
        const data: SearchApiResponse = await res.json()

        if (!res.ok) {
          const message = isSearchError(data) ? data.error : 'Search failed'
          throw new Error(message)
        }

        const rawResults =
          typeof data === 'object' && data !== null && 'results' in data
            ? (data as { results?: unknown }).results
            : []

        const list = Array.isArray(rawResults) ? rawResults : []
        const filtered = list.filter(isMovieLike)

        if (!cancelled) setResults(filtered)
      } catch (e: unknown) {
        if (!cancelled) {
          setResults([])
          const message = e instanceof Error ? e.message : 'Search failed'
          setError(message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [q])

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Header />
      <SearchBar />

      <main className="mx-auto max-w-6xl px-4 pb-16">
        {q && (
          <p className="mt-6 text-sm text-gray-300">
            Results for: <span className="font-semibold text-white">{q}</span>
          </p>
        )}

        {loading && <p className="mt-6 text-gray-300">Searching…</p>}
        {error && <p className="mt-6 text-red-400">{error}</p>}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {results.map((movie) => (
            <div key={movie.id} className="group">
              <Thumbnail movie={movie} />
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}