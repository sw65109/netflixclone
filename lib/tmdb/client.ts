const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

function getTmdbApiKey() {
  const key =
    process.env.TMDB_API_KEY ||
    process.env.NEXT_PUBLIC_TMDB_API_KEY ||
    process.env.NEXT_PUBLIC_API_KEY

  if (!key) {
    throw new Error(
      'Missing TMDB API key. Set TMDB_API_KEY (server) or NEXT_PUBLIC_API_KEY (client).'
    )
  }

  return key
}

export async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${path}`)
  url.searchParams.set('api_key', getTmdbApiKey())

  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue
    url.searchParams.set(k, String(v))
  }

  const res = await fetch(url.toString())
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`TMDB ${res.status}: ${text || res.statusText}`)
  }

  return (await res.json()) as T
}

export type TmdbMultiSearchResponse = {
  page: number
  results: unknown[]
  total_pages: number
  total_results: number
}