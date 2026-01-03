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

      const media_type =
        o.media_type === 'tv' || o.media_type === 'movie'
          ? (o.media_type as 'tv' | 'movie')
          : undefined

      return {
        id,
        vote_average,
        vote_count,
        media_type,
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
        first_air_date: typeof o.first_air_date === 'string' ? o.first_air_date : undefined,
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
  title: 'New & Popular - Netflix Clone',
}

export default async function NewAndPopularPage() {
  const [trending, movieUpcoming, tvPopular, moviePopular] = await Promise.all([
    fetchList('/trending/all/week'),
    fetchList('/movie/upcoming'),
    fetchList('/tv/popular'),
    fetchList('/movie/popular'),
  ])

  const heroTitles = trending.length ? trending : [...moviePopular, ...tvPopular]

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <main className="relative pb-24">
        <Banner titles={heroTitles} fallbackTitle="New & Popular" />

        <section className="pl-4 lg:pl-16 md:space-y-24">
          <Row title="Trending This Week" movies={trending} />
          <Row title="Upcoming Movies" movies={movieUpcoming} />
          <Row title="Popular TV" movies={tvPopular} />
          <Row title="Popular Movies" movies={moviePopular} />
        </section>
      </main>

      <Footer />
    </div>
  )
}