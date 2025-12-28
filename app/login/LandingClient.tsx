'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import Footer from '../../components/Footer'
import type { Movie } from '../../typings'
import { baseUrl } from '../../constants/movie'
import { useRouter } from 'next/navigation'

type LandingClientProps = {
  trendingNow: Movie[]
}

type FaqItem = {
  q: string
  a: string
}

const FAQS: readonly FaqItem[] = [
  {
    q: 'What is Netflix?',
    a: 'Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.',
  },
  {
    q: 'How much does Netflix cost?',
    a: 'Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee.',
  },
  {
    q: 'Where can I watch?',
    a: 'Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web or on devices that offer the Netflix app.',
  },
  {
    q: 'How do I cancel?',
    a: "Cancel anytime. There are no commitments—just stop your membership when you're ready.",
  },
  {
    q: 'What can I watch on Netflix?',
    a: 'Explore a huge library of feature films, documentaries, TV shows, and more.',
  },
  {
    q: 'Is Netflix good for kids?',
    a: 'The Netflix Kids experience is included to give parents control while kids enjoy family-friendly content.',
  },
] as const

function pickRandom<T>(items: readonly T[]): T | null {
  if (!items || items.length === 0) return null
  const idx = Math.floor(Math.random() * items.length)
  return items[idx] ?? null
}

function titleText(m: Movie) {
  return m.title || m.name || m.original_name || 'Featured'
}

export default function LandingClient({ trendingNow }: LandingClientProps) {
  const [open, setOpen] = useState<number | null>(null)
  const [email, setEmail] = useState('')
  const router = useRouter()

  const goToPlans = () => {
    const e = email.trim()
    const qs = e ? `?email=${encodeURIComponent(e)}` : ''
    router.push(`/login/plans${qs}`)
  }

  const hero = useMemo(() => {
    const withImages = trendingNow.filter((t) => !!(t.backdrop_path || t.poster_path))
    return (pickRandom(withImages.length ? withImages : trendingNow) ?? null) as Movie | null
  }, [trendingNow])

  const heroImagePath = hero?.backdrop_path || hero?.poster_path || null

  const topRow = useMemo(() => {
    const withPoster = trendingNow.filter((t) => !!t.poster_path)
    return withPoster.slice(0, 10)
  }, [trendingNow])

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative min-h-[75vh] w-full">
        {heroImagePath ? (
          <Image
            src={`${baseUrl}${heroImagePath}`}
            alt={hero ? titleText(hero) : 'Netflix'}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-black" />
        )}

        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/40 to-black/90" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-6 md:px-10">
          <Link href="/" aria-label="Netflix Home" className="select-none">
            <div className="text-3xl font-black tracking-wide text-[#e50914]">
              NETFLIX
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded border border-white/20 bg-black/40 px-3 py-2 text-sm text-white hover:bg-black/60"
            >
              <span className="text-xs">A</span>
              <span>English</span>
              <span className="text-white/70">▼</span>
            </button>

            <Link
              href="/login/signin"
              className="rounded bg-[#e50914] px-4 py-2 text-sm font-semibold hover:bg-[#f6121d]"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pt-24 text-center md:px-10">
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Unlimited movies,
            <br />
            TV shows, and
            <br />
            more
          </h1>

          <p className="mt-4 text-lg text-white/90">Starts at $9.99. Cancel anytime.</p>

          <p className="mt-6 text-sm text-white/90">
            Ready to watch? Enter your email to create or restart your membership.
          </p>

          <div className="mt-4 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded border border-white/25 bg-black/40 px-4 py-4 text-white placeholder:text-white/60 outline-none focus:border-white/60"
            />
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded bg-[#e50914] px-6 py-4 text-lg font-semibold hover:bg-[#f6121d]"
              onClick={goToPlans}
            >
              Get Started <span aria-hidden>›</span>
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 w-full max-w-6xl px-6 md:px-10">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#2b1f4a]/60 px-6 py-4 ring-1 ring-white/10">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🍿</div>
            <div>
              <div className="text-lg font-semibold">The Netflix you love for just $9.99.</div>
              <div className="text-sm text-gray-200">
                Get our most affordable, ad-supported plan.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="rounded bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"
            onClick={() => router.push('/login/learn-more')}
          >
            Learn More
          </button>
        </div>
      </section>

      <section className="mx-auto mt-10 w-full max-w-6xl px-6 md:px-10">
        <h2 className="mb-6 text-2xl font-semibold">Trending Now</h2>

        <div className="relative">
          <div className="flex gap-5 overflow-x-auto pb-3">
            {topRow.map((m, i) => (
              <div key={`${m.id}-${i}`} className="relative shrink-0">
                <div className="absolute -left-2 bottom-2 z-10 text-7xl font-black text-white/70 drop-shadow-[0_3px_0_rgba(0,0,0,0.7)]">
                  {i + 1}
                </div>

                <div className="relative h-55 w-40 overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
                  <Image
                    src={`${baseUrl}${m.poster_path}`}
                    alt={titleText(m)}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-black to-transparent" />
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-6xl px-6 md:px-10">
        <h2 className="mb-6 text-2xl font-semibold">More Reasons to Join</h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-[#1b1b1b]/80 p-6 text-left shadow-sm ring-1 ring-white/5">
            <div className="mb-4 text-xl font-semibold">Enjoy on your TV</div>
            <p className="text-sm text-gray-300">
              Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.
            </p>
          </div>

          <div className="rounded-2xl bg-[#1b1b1b]/80 p-6 text-left shadow-sm ring-1 ring-white/5">
            <div className="mb-4 text-xl font-semibold">Download your shows to watch offline</div>
            <p className="text-sm text-gray-300">
              Save your favorites easily and always have something to watch.
            </p>
          </div>

          <div className="rounded-2xl bg-[#1b1b1b]/80 p-6 text-left shadow-sm ring-1 ring-white/5">
            <div className="mb-4 text-xl font-semibold">Watch everywhere</div>
            <p className="text-sm text-gray-300">
              Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.
            </p>
          </div>

          <div className="rounded-2xl bg-[#1b1b1b]/80 p-6 text-left shadow-sm ring-1 ring-white/5">
            <div className="mb-4 text-xl font-semibold">Create profiles for kids</div>
            <p className="text-sm text-gray-300">
              Send kids on adventures with their favorite characters in a space made just for them—free with your membership.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-6xl px-6 md:px-10">
        <h2 className="mb-6 text-2xl font-semibold">Frequently Asked Questions</h2>

        <div className="space-y-2">
          {FAQS.map((item, idx) => {
            const isOpen = open === idx
            return (
              <div key={item.q} className="overflow-hidden rounded bg-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setOpen((prev) => (prev === idx ? null : idx))}
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-xl"
                >
                  <span>{item.q}</span>
                  <span className="text-2xl">{isOpen ? '×' : '+'}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-black/40 px-6 py-5 text-gray-200">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-white/90">
            Ready to watch? Enter your email to create or restart your membership.
          </p>

          <div className="mx-auto mt-4 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded border border-white/25 bg-black/40 px-4 py-4 text-white placeholder:text-white/60 outline-none focus:border-white/60"
            />
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded bg-[#e50914] px-6 py-4 text-lg font-semibold hover:bg-[#f6121d]"
              onClick={goToPlans}
            >
              Get Started <span aria-hidden>›</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}