"use client"

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation' 

export default function SearchBar() {
  const router = useRouter()
  const [value, setValue] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-xl px-4 pt-28">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search titles"
          className="w-full rounded bg-white/10 px-4 py-3 text-white outline-none ring-1 ring-white/10 focus:ring-white/30"
        />
        <button
          type="submit"
          className="rounded bg-[#E50914] px-4 py-3 font-semibold hover:bg-[#f6121d]"
        >
          Search
        </button>
      </div>
    </form>
  )
}
