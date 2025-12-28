'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useProfile from '../../hooks/useProfile'
import Image from 'next/image'

export default function ProfilesPage() {
  const router = useRouter()
  const { profiles, activeProfile, setActiveProfileId } = useProfile()

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6">
        <h1 className="text-3xl font-medium md:text-5xl">Who&apos;s watching?</h1>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
          {profiles.map((profile) => {
            const isActive = activeProfile?.id === profile.id

            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => {
                  setActiveProfileId(profile.id)
                  router.push(profile.isKids ? '/kids' : '/')
                }}
                className="group flex flex-col items-center"
                aria-label={`Use profile ${profile.name}`}
              >
                <div
                  className={
                    'relative h-24 w-24 overflow-hidden rounded-md transition md:h-32 md:w-32 ' +
                    (isActive ? 'ring-2 ring-white' : 'ring-0') +
                    ' group-hover:ring-2 group-hover:ring-white'
                  }
                >
                  <Image
                    src={profile.avatarUrl}
                    alt=""
                    className="h-full w-full object-cover transition group-hover:opacity-90"
                    fill
                  />

                  {profile.isKids && (
                    <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-[10px] tracking-widest text-gray-200">
                      KIDS
                    </div>
                  )}
                </div>

                <p className="mt-3 text-sm text-gray-300 transition group-hover:text-white md:text-base">
                  {profile.name}
                </p>
              </button>
            )
          })}
        </div>

        <Link
          href="/profiles/manage"
          className="mt-12 rounded border border-gray-500/80 px-6 py-2 text-sm tracking-widest text-gray-300 transition hover:border-white hover:text-white"
        >
          MANAGE PROFILES
        </Link>
      </main>
    </div>
  )
}