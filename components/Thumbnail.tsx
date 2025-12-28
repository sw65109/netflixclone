'use client'

import Image from 'next/image'
import { Movie } from '../typings'
import { baseUrl } from '../constants/movie'
import { useUiStore } from '../stores/uiStore'

type Props = {
  movie: Movie
}

export default function Thumbnail({ movie }: Props) {
  const openModal = useUiStore((s) => s.openModal)

  return (
    <div
      className="relative h-28 min-w-45 cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-65 md:hover:scale-105"
      onClick={() => openModal(movie, { autoplayTrailer: true })}
    >
      <Image
        src={`${baseUrl}${movie.backdrop_path || movie.poster_path}`}
        className="rounded-sm object-cover md:rounded"
        fill
        alt={movie.title || movie.name || movie.original_name || 'Movie'}
      />
    </div>
  )
}