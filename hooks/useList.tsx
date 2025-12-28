'use client'

import { useEffect, useState } from 'react'
import type { Movie } from '../typings'
import { collection, onSnapshot, type DocumentData } from 'firebase/firestore'
import { getDb } from '../firebase'

export default function useList(uid: string | undefined) {
  const [list, setList] = useState<Movie[] | DocumentData[]>([])

  useEffect(() => {
    if (!uid) return

    const db = getDb()
    if (!db) return

    return onSnapshot(collection(db, 'customers', uid, 'myList'), (snapshot) => {
      setList(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      )
    })
  }, [uid])

  return list
}