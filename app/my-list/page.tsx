'use client'

import Footer from '../../components/Footer'
import MyList from '../../components/MyList'
import useAuth from '../../hooks/useAuth'
import useList from '../../hooks/useList'

export default function MyListPage() {
  const { user } = useAuth()
  const list = useList(user?.uid)

  const isEmpty = !user || !list || list.length === 0

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-16">
        <h1 className="text-3xl font-semibold md:text-4xl">My List</h1>

        {isEmpty ? (
          <p className="mt-2 text-sm text-gray-300">
            Add titles from “More Info” → “+” to save them here.
          </p>
        ) : null}

        <div className="mt-8">
          <MyList variant='grid' />
        </div>
      </main>

      <Footer />
    </div>
  )
}