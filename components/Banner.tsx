'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import type { Movie } from '../typings'
import { baseUrl } from '../constants/movie'
import { useUiStore } from '../stores/uiStore'
import { PlayIcon } from '@heroicons/react/24/solid'

type BannerProps = {
  titles: Movie[]
  fallbackTitle?: string
}

function pickRandom<T>(items: readonly T[]): T | null {
  if (!items || items.length === 0) return null
  const idx = Math.floor(Math.random() * items.length)
  return items[idx] ?? null
}

export default function Banner({ titles, fallbackTitle = 'Featured' }: BannerProps) {
  const openModal = useUiStore((s) => s.openModal)

  const movie = useMemo(() => {
    const withImages = titles.filter((t) => !!(t?.backdrop_path || t?.poster_path))
    return pickRandom(withImages.length > 0 ? withImages : titles) as Movie | null
  }, [titles])

  if (!movie) return null

  const titleText = movie.title || movie.name || movie.original_name || fallbackTitle
  const imagePath = movie.backdrop_path || movie.poster_path

  return (
    <section className="relative w-full">
        <div className="absolute inset-0 -z-10 h-[70vh]">
          {imagePath ? (
            <Image
              src={`${baseUrl}${imagePath}`}
              alt={titleText}
              fill
              className="object-cover object-top"
              priority
            />
          ) : null}

          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="mx-auto flex min-h-[65svh] lg:min-h-[65vh] max-w-screen-2xl flex-col justify-end space-y-2 px-4 pb-10 md:space-y-4 lg:px-16 lg:pb-12">
          <h1 className="text-2xl font-bold text-shadow-lg md:text-2xl lg:text-5xl">
            {titleText}
          </h1>

          {movie.overview ? (
            <p className="max-w-xs text-xs text-shadow-lg md:max-w-lg md:text-lg lg:max-w-2xl">
              {movie.overview}
            </p>
          ) : null}

          <div className="flex space-x-3">
            <button
              className="bannerButton bannerButton--play bg-white text-black"
              onClick={() => openModal(movie, { autoplayTrailer: true })}
            >
              <PlayIcon className="h-5 w-5" />
              Play
            </button>

            <button
              className="bannerButton bg-[gray]/70 text-white"
              onClick={() => openModal(movie)}
            >
              More Info
            </button>
          </div>
        </div>
    </section>
  )
}