import type { Movie } from '../../typings'
import requests from '../../utils/request'
import LandingClient from './LandingClient'

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: 'no-store' })
  return res.json()
}

export default async function LoginPage() {
  const trending = await fetchJson(requests.fetchTrending)

  return <LandingClient trendingNow={(trending?.results ?? []) as Movie[]} />
}