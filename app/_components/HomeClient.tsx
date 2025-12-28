'use client'

import type { Movie } from '../../typings'
import Banner from '../../components/Banner'
import Modal from '../../components/Modal'
import Row from '../../components/Row'
import { useUiStore } from '../../stores/uiStore'

type HomeClientProps = {
  netflixOriginals: Movie[]
  trendingNow: Movie[]
  topRated: Movie[]
  actionMovies: Movie[]
  comedyMovies: Movie[]
  horrorMovies: Movie[]
  romanceMovies: Movie[]
  documentaries: Movie[]
}

export default function HomeClient({
  netflixOriginals,
  trendingNow,
  topRated,
  actionMovies,
  comedyMovies,
  horrorMovies,
  romanceMovies,
  documentaries,
}: HomeClientProps) {
  const showModal = useUiStore((s) => s.showModal)

  return (
    <>
      <main className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16">
      <Banner titles={netflixOriginals} fallbackTitle="Netflix Originals" />

        <section className="md:space-y-24">
          <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Action Movies" movies={actionMovies} />
          <Row title="Comedy Movies" movies={comedyMovies} />
          <Row title="Horror Movies" movies={horrorMovies} />
          <Row title="Romance Movies" movies={romanceMovies} />
          <Row title="Documentaries" movies={documentaries} />
        </section>
      </main>

      {showModal && <Modal />}
    </>
  )
}