'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import Footer from '../../../components/Footer'
import useProfile from '../../../hooks/useProfile'
import type { Profile } from '../../../stores/profileStore'
import Image from 'next/image'

const MAX_PROFILES = 5

const AVATAR_OPTIONS: string[] = [
  'https://rb.gy/g1pwyx',
  'https://rb.gy/4vfk4r',
  'https://rb.gy/g1pwyx',
  'https://rb.gy/4vfk4r',
]

type EditorMode = 'none' | 'create' | 'edit'

function clampName(name: string) {
  return name.trim().slice(0, 20)
}

export default function ManageProfilesPage() {
  const { profiles, addProfile, updateProfile, deleteProfile } = useProfile()

  const [mode, setMode] = useState<EditorMode>('none')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [draftName, setDraftName] = useState('')
  const [draftAvatarUrl, setDraftAvatarUrl] = useState(
    AVATAR_OPTIONS[0] ?? 'https://rb.gy/g1pwyx'
  )
  const [draftIsKids, setDraftIsKids] = useState(false)

  const canAddMore = profiles.length < MAX_PROFILES

  const editingProfile = useMemo<Profile | null>(() => {
    if (mode !== 'edit' || !editingId) return null
    return profiles.find((p) => p.id === editingId) ?? null
  }, [mode, editingId, profiles])

  const openCreate = () => {
    setMode('create')
    setEditingId(null)
    setDraftName('')
    setDraftAvatarUrl(AVATAR_OPTIONS[0] ?? 'https://rb.gy/g1pwyx')
    setDraftIsKids(false)
  }

  const openEdit = (profile: Profile) => {
    setMode('edit')
    setEditingId(profile.id)
    setDraftName(profile.name)
    setDraftAvatarUrl(profile.avatarUrl)
    setDraftIsKids(Boolean(profile.isKids))
  }

  const closeEditor = () => {
    setMode('none')
    setEditingId(null)
    setDraftName('')
    setDraftIsKids(false)
    setDraftAvatarUrl(AVATAR_OPTIONS[0] ?? 'https://rb.gy/g1pwyx')
  }

  const save = () => {
    const name = clampName(draftName) || (draftIsKids ? 'Kids' : 'Profile')

    if (mode === 'create') {
      addProfile({
        name,
        avatarUrl: draftAvatarUrl,
        isKids: draftIsKids,
      })
      closeEditor()
      return
    }

    if (mode === 'edit' && editingId) {
      updateProfile(editingId, {
        name,
        avatarUrl: draftAvatarUrl,
        isKids: draftIsKids,
      })
      closeEditor()
    }
  }

  const remove = () => {
    if (!editingId) return
    deleteProfile(editingId)
    closeEditor()
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6">
        <h1 className="text-3xl font-medium md:text-5xl">Manage Profiles</h1>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => openEdit(profile)}
              className="group flex flex-col items-center"
              aria-label={`Edit profile ${profile.name}`}
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-md md:h-32 md:w-32">
                <Image
                  src={profile.avatarUrl}
                  alt=""
                  className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                  fill
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                  <span className="text-sm tracking-widest">EDIT</span>
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-300 transition group-hover:text-white md:text-base">
                {profile.name}
                {profile.isKids ? ' (Kids)' : ''}
              </p>
            </button>
          ))}

          {canAddMore && (
            <button
              type="button"
              onClick={openCreate}
              className="group flex flex-col items-center"
              aria-label="Add profile"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-md border border-white/20 bg-black/30 transition group-hover:border-white/60 md:h-32 md:w-32">
                <span className="text-4xl font-light text-gray-300 transition group-hover:text-white">
                  +
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-300 transition group-hover:text-white md:text-base">
                Add Profile
              </p>
            </button>
          )}
        </div>

        <Link
          href="/profiles"
          className="mt-12 rounded border border-gray-500/80 px-10 py-2 text-sm tracking-widest text-gray-300 transition hover:border-white hover:text-white"
        >
          DONE
        </Link>

        {(mode === 'create' || mode === 'edit') && (
          <div className="mt-10 w-full max-w-2xl rounded border border-white/10 bg-black/40 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium">
                  {mode === 'create' ? 'Add Profile' : 'Edit Profile'}
                </h2>
                <p className="mt-1 text-sm text-gray-300">
                  Choose an avatar and name.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditor}
                className="rounded border border-white/10 px-3 py-1.5 text-sm text-gray-300 hover:border-white/30 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-300">Avatar</p>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {AVATAR_OPTIONS.map((url, idx) => {
                    const selected = url === draftAvatarUrl
                    return (
                      <button
                        key={`${url}_${idx}`}
                        type="button"
                        onClick={() => setDraftAvatarUrl(url)}
                        className={
                          'overflow-hidden rounded-md ' +
                          (selected ? 'ring-2 ring-white' : 'ring-0')
                        }
                        aria-label="Select avatar"
                      >
                        <Image
                          src={url}
                          alt=""
                          className="h-14 w-14 object-cover"
                          width={56}
                          height={56}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300" htmlFor="profileName">
                  Name
                </label>
                <input
                  id="profileName"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="mt-2 w-full rounded bg-[#333] px-4 py-3 text-sm outline-none focus:bg-[#454545]"
                  placeholder={draftIsKids ? 'Kids' : 'Profile'}
                  maxLength={20}
                />

                <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={draftIsKids}
                    onChange={(e) => setDraftIsKids(e.target.checked)}
                  />
                  Kids profile
                </label>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={save}
                    className="rounded border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:border-white/50"
                  >
                    Save
                  </button>

                  {mode === 'edit' && (
                    <button
                      type="button"
                      onClick={remove}
                      className="rounded border border-white/10 px-4 py-2 text-sm text-gray-300 hover:border-white/30 hover:text-white"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>

            {mode === 'edit' && editingProfile?.id === 'default' && (
              <p className="mt-5 text-xs text-gray-400">
                Tip: You can edit this profile, but deleting it is discouraged in
                many clones.
              </p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}