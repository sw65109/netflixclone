import Link from 'next/link'
import PlansSection from '../learn-more/PlansSection'

export const metadata = {
  title: 'Plans - Netflix Clone',
}

export default function LoginPlansPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <Link href="/login" aria-label="Back to marketing" className="select-none">
          <div className="text-3xl font-black tracking-wide text-[#e50914]">NETFLIX</div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login/signin"
            className="rounded bg-[#e50914] px-4 py-2 text-sm font-semibold hover:bg-[#f6121d]"
          >
            Sign In
          </Link>
        </div>
      </div>

      <PlansSection />
    </main>
  )
}