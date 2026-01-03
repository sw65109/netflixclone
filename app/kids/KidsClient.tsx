'use client'

import Row from '../../components/Row'
import Banner from '../../components/Banner'
import type { Movie } from '../../typings'

type KidsClientProps = {
  kidsMovies: Movie[]
  kidsTV: Movie[]
}

export default function KidsClient({ kidsMovies, kidsTV }: KidsClientProps) {
  const heroTitles = [...kidsMovies, ...kidsTV]

  return (
    <main className="relative pl-4 pb-24 lg:pl-16">
      <Banner titles={heroTitles} fallbackTitle="Kids" />

      <section className="md:space-y-24">
        <Row title="Kids Movies" movies={kidsMovies} />
        <Row title="Kids TV" movies={kidsTV} />
      </section>
    </main>
  )
}