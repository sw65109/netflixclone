import type { Movie } from '../../typings'
import requests from '../../utils/request'
import KidsClient from './KidsClient'

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: 'no-store' })
  return res.json()
}

export default async function KidsPage() {
  const [kidsMoviesRes, kidsTVRes] = await Promise.all([
    fetchJson(requests.fetchKidsMovies),
    fetchJson(requests.fetchKidsTV),
  ])

  return (
    <KidsClient
      kidsMovies={(kidsMoviesRes?.results ?? []) as Movie[]}
      kidsTV={(kidsTVRes?.results ?? []) as Movie[]}
    />
  )
}