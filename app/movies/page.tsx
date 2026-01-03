import type { Movie } from '../../typings'
import Banner from '../../components/Banner'
import Row from '../../components/Row'
import Footer from '../../components/Footer'
import { tmdbFetch } from '../../lib/tmdb/client'

type TmdbListResponse = { results?: unknown }

function toMovies(raw: unknown): Movie[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((v) => typeof v === 'object' && v !== null)
    .map((v) => v as Record<string, unknown>)
    .map((o): Movie | null => {
      const id = typeof o.id === 'number' ? o.id : null
      if (id == null) return null

      const vote_average = typeof o.vote_average === 'number' ? o.vote_average : 0
      const vote_count = typeof o.vote_count === 'number' ? o.vote_count : 0

      return {
        id,
        vote_average,
        vote_count,
        media_type: 'movie',
        title: typeof o.title === 'string' ? o.title : undefined,
        name: typeof o.name === 'string' ? o.name : undefined,
        original_name: typeof o.original_name === 'string' ? o.original_name : undefined,
        overview: typeof o.overview === 'string' ? o.overview : undefined,
        poster_path:
          typeof o.poster_path === 'string' || o.poster_path === null
            ? (o.poster_path as string | null)
            : undefined,
        backdrop_path:
          typeof o.backdrop_path === 'string' || o.backdrop_path === null
            ? (o.backdrop_path as string | null)
            : undefined,
        release_date: typeof o.release_date === 'string' ? o.release_date : undefined,
        original_language:
          typeof o.original_language === 'string' ? o.original_language : undefined,
      }
    })
    .filter((m): m is Movie => m !== null)
}

async function fetchList(path: string, extra: Record<string, string | number | boolean> = {}) {
  const data = await tmdbFetch<TmdbListResponse>(path, {
    language: 'en-US',
    page: 1,
    ...extra,
  })
  return toMovies(data?.results)
}

export const metadata = {
  title: 'Movies - Netflix Clone',
}

export default async function MoviesPage() {
  const [popular, topRated, nowPlaying, actionMovies] = await Promise.all([
    fetchList('/movie/popular'),
    fetchList('/movie/top_rated'),
    fetchList('/movie/now_playing'),
    fetchList('/discover/movie', { with_genres: 28 }),
  ])

  const heroTitles = [...popular, ...topRated]

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <main className="relative pb-24">
        <Banner titles={heroTitles} fallbackTitle="Movies" />

        <section className="pl-4 lg:pl-16 md:space-y-24">
          <Row title="Popular Movies" movies={popular} />
          <Row title="Top Rated Movies" movies={topRated} />
          <Row title="Now Playing" movies={nowPlaying} />
          <Row title="Action Movies" movies={actionMovies} />
        </section>
      </main>

      <Footer />
    </div>
  )
}