import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Help - Netflix Clone',
  description: 'Help and troubleshooting for the Netflix Clone demo.',
}

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#141414] px-4 pb-20 pt-28 text-white lg:px-16">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-3xl font-bold md:text-4xl">Help Center</h1>
        <p className="mt-3 text-sm text-white/80 md:text-base">
          Quick answers for using this demo app.
        </p>

        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-semibold">Getting started</h2>
          <ul className="space-y-2 text-sm text-white/80 md:text-base">
            <li>
              - Browse titles on <Link className="underline hover:text-white" href="/">Home</Link> or use{' '}
              <Link className="underline hover:text-white" href="/search">Search</Link>.
            </li>
            <li>
              - Click <span className="font-semibold text-white">More Info</span> to open the details modal.
            </li>
            <li>
              - Use <span className="font-semibold text-white">My List</span> (inside the modal) to save titles.
            </li>
          </ul>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-semibold">Account & billing</h2>
          <p className="text-sm text-white/80 md:text-base">
            Subscription and billing settings live on your account page.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/account"
              className="rounded bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"
            >
              Go to Account
            </Link>
            <Link
              href="/login/signin"
              className="rounded bg-[#e50914] px-4 py-2 text-sm font-semibold hover:bg-[#f6121d]"
            >
              Sign In
            </Link>
          </div>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-semibold">Troubleshooting</h2>

          <div className="rounded-lg bg-black/30 p-5 ring-1 ring-white/10">
            <h3 className="font-semibold">Trailers won’t play</h3>
            <p className="mt-2 text-sm text-white/80 md:text-base">
              Trailer playback can be blocked by ad blockers, tracking protection, or browser autoplay rules.
              Try disabling blockers for the site or opening the trailer directly on YouTube from the modal.
            </p>
          </div>

          <div className="rounded-lg bg-black/30 p-5 ring-1 ring-white/10">
            <h3 className="font-semibold">Images not loading</h3>
            <p className="mt-2 text-sm text-white/80 md:text-base">
              If posters/backdrops don’t load, confirm your TMDB API key is set and requests are succeeding.
            </p>
          </div>

          <div className="rounded-lg bg-black/30 p-5 ring-1 ring-white/10">
            <h3 className="font-semibold">Login issues</h3>
            <p className="mt-2 text-sm text-white/80 md:text-base">
              Make sure Firebase Auth is configured and your environment variables are present.
            </p>
          </div>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-sm text-white/80 md:text-base">
            This is a demo app. If you want a contact method, add your email or a link here.
          </p>
        </section>
      </div>
    </main>
  )
}