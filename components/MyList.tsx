"use client"

import useList from '@/hooks/useList'
import useAuth from '../hooks/useAuth'
import Row from './Row'
import type { Movie } from '../typings'

type FirestoreMovieLike = Record<string, unknown> & { id?: unknown }

function toNumberId(id: unknown): number | null {
  if (typeof id === 'number' && Number.isFinite(id)) return id
  if (typeof id === 'string') {
    const n = Number(id)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function pickString(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined
}

function pickNullableString(v: unknown): string | null | undefined {
  if (typeof v === 'string') return v
  if (v === null) return null
  return undefined
}

function pickNumber(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined
}

function coerceToMovie(item: unknown): Movie | null {
  if (typeof item !== 'object' || item === null) return null
  const o = item as FirestoreMovieLike

  const id = toNumberId(o.id)
  if (id == null) return null

  const vote_average = pickNumber(o.vote_average) ?? 0
  const vote_count = pickNumber(o.vote_count) ?? 0

  const media_type =
    o.media_type === 'movie' || o.media_type === 'tv'
      ? (o.media_type as 'movie' | 'tv')
      : undefined

  const movie: Movie = {
    id,
    vote_average,
    vote_count,
    title: pickString(o.title),
    name: pickString(o.name),
    original_name: pickString(o.original_name),
    overview: pickString(o.overview),
    poster_path: pickNullableString(o.poster_path),
    backdrop_path: pickNullableString(o.backdrop_path),
    media_type,
    release_date: pickString(o.release_date),
    first_air_date: pickString(o.first_air_date),
    original_language: pickString(o.original_language),
  }

  return movie
}

export default function MyList() {
  const { user } = useAuth()
  const list = useList(user?.uid)

  if (!user || !list || list.length === 0) return null

  const movies: Movie[] = (Array.isArray(list) ? list : [])
    .map(coerceToMovie)
    .filter((m): m is Movie => m !== null)

  if (movies.length === 0) return null

  return <Row title="My List" movies={movies} />
}