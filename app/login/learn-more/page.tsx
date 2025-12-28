import Link from 'next/link'

export const metadata = {
  title: 'Learn More - Netflix Clone',
}

export default function LearnMorePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <Link href="/login" aria-label="Back to marketing" className="select-none">
          <div className="text-3xl font-black tracking-wide text-[#e50914]">NETFLIX</div>
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

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(229,9,20,0.35),transparent_55%),radial-gradient(circle_at_75%_45%,rgba(124,58,237,0.25),transparent_55%)]" />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/60 to-black" />

        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 py-18 md:grid-cols-2 md:px-10 md:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-white/90 ring-1 ring-white/10">
              <span className="text-[#e50914]">●</span>
              Standard with ads
            </div>

            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Join Standard with ads,
              <br />
              our lowest-priced plan
            </h1>

            <p className="mt-4 max-w-xl text-white/80">
              Watch great movies and TV shows at a lower price. Cancel anytime.
            </p>

            <div className="mt-8 flex flex-col items-start justify-start gap-3 sm:flex-row">
              <Link
                href="/login/signup"
                className="inline-flex items-center justify-center gap-2 rounded bg-[#e50914] px-8 py-3 text-sm font-semibold hover:bg-[#f6121d]"
              >
                Join for $9.99 <span aria-hidden>›</span>
              </Link>

              <Link
                href="/login/plans"
                className="inline-flex items-center justify-center rounded bg-white/15 px-8 py-3 text-sm font-semibold hover:bg-white/20"
              >
                Explore All Plans
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-sm text-white/70">Monthly price</span>
              <span className="text-sm font-semibold">$9.99</span>
            </div>

            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Ads</span>
                <span className="font-semibold">Less than you might think</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Resolution</span>
                <span className="font-semibold">1080p (Full HD)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Devices at the same time</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Download</span>
                <span className="font-semibold">Included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10">
        <h2 className="mb-10 text-center text-4xl font-extrabold">Why you’ll love this plan</h2>

        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mx-auto mb-4 h-18 w-18 rounded-full bg-white/5 ring-1 ring-white/10" />
            <h3 className="text-lg font-semibold">Ads that won’t interrupt the action</h3>
            <p className="mt-2 text-sm text-white/70">
              You’ll see only a few short ads, all timed so you never miss key moments.
            </p>
          </div>
          <div>
            <div className="mx-auto mb-4 h-18 w-18 rounded-full bg-white/5 ring-1 ring-white/10" />
            <h3 className="text-lg font-semibold">Just a few minutes of ads per hour</h3>
            <p className="mt-2 text-sm text-white/70">
              Enough time for a quick stretch or snack before diving right in.
            </p>
          </div>
          <div>
            <div className="mx-auto mb-4 h-18 w-18 rounded-full bg-white/5 ring-1 ring-white/10" />
            <h3 className="text-lg font-semibold">Higher resolution, lower cost</h3>
            <p className="mt-2 text-sm text-white/70">
              Enjoy Full HD (1080p) for less than our Standard plan.
            </p>
          </div>
          <div>
            <div className="mx-auto mb-4 h-18 w-18 rounded-full bg-white/5 ring-1 ring-white/10" />
            <h3 className="text-lg font-semibold">Watch on 2 devices</h3>
            <p className="mt-2 text-sm text-white/70">
              Create up to 5 profiles and stream on 2 devices at once.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold">Try Standard with ads today</h3>
          <p className="mt-2 text-sm text-white/70">Change or cancel your plan anytime.</p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login/signup"
              className="inline-flex items-center justify-center gap-2 rounded bg-[#e50914] px-8 py-3 text-sm font-semibold hover:bg-[#f6121d]"
            >
              Join for $9.99 <span aria-hidden>›</span>
            </Link>
            <Link
              href="/login/plans"
              className="inline-flex items-center justify-center rounded bg-white/15 px-8 py-3 text-sm font-semibold hover:bg-white/20"
            >
              Explore All Plans
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}