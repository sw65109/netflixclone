import HomeClient from './_components/HomeClient'
import { Movie } from '../typings'
import requests from '../utils/request'

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: 'no-store' })
  return res.json()
}

export default async function HomePage() {
  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetchJson(requests.fetchNetflixOriginals),
    fetchJson(requests.fetchTrending),
    fetchJson(requests.fetchTopRated),
    fetchJson(requests.fetchActionMovies),
    fetchJson(requests.fetchComedyMovies),
    fetchJson(requests.fetchHorrorMovies),
    fetchJson(requests.fetchRomanceMovies),
    fetchJson(requests.fetchDocumentaries),
  ])

  return (
    <HomeClient
      netflixOriginals={(netflixOriginals?.results ?? []) as Movie[]}
      trendingNow={(trendingNow?.results ?? []) as Movie[]}
      topRated={(topRated?.results ?? []) as Movie[]}
      actionMovies={(actionMovies?.results ?? []) as Movie[]}
      comedyMovies={(comedyMovies?.results ?? []) as Movie[]}
      horrorMovies={(horrorMovies?.results ?? []) as Movie[]}
      romanceMovies={(romanceMovies?.results ?? []) as Movie[]}
      documentaries={(documentaries?.results ?? []) as Movie[]}
    />
  )
}
