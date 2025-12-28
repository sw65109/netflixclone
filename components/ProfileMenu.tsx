"use client"

import Image from 'next/image'
import useProfile from '../hooks/useProfile'

export default function ProfileMenu() {
  const { profiles, activeProfile, setActiveProfileId } = useProfile()

  return (
    <div className="rounded border border-white/10 bg-black/40 p-3 text-sm">
      <p className="mb-2 text-gray-300">Profiles</p>
      <div className="space-y-2">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveProfileId(p.id)}
            className={`flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-white/10 ${
              activeProfile?.id === p.id ? 'bg-white/10' : ''
            }`}
          >
            <Image
             src={p.avatarUrl} 
             className="h-7 w-7 
             rounded" alt="" 
             width={28}
             height={28}
            />
            <span>{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}