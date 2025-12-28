'use client'

import { useCallback, useMemo } from 'react'
import { useProfileStore } from '../stores/profileStore'
import type { Profile } from '../stores/profileStore'

export default function useProfile() {
  const profiles = useProfileStore((s) => s.profiles)
  const activeId = useProfileStore((s) => s.activeProfileId)

  const setActiveProfileIdStore = useProfileStore((s) => s.setActiveProfileId)
  const addProfileStore = useProfileStore((s) => s.addProfile)
  const updateProfileStore = useProfileStore((s) => s.updateProfile)
  const deleteProfileStore = useProfileStore((s) => s.deleteProfile)

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeId) ?? profiles[0] ?? null,
    [profiles, activeId]
  )

  const setActiveProfileId = useCallback(
    (id: string) => setActiveProfileIdStore(id),
    [setActiveProfileIdStore]
  )

  const addProfile = useCallback(
    (input: Omit<Profile, 'id'> & { id?: string }) => addProfileStore(input),
    [addProfileStore]
  )

  const updateProfile = useCallback(
    (id: string, patch: Partial<Omit<Profile, 'id'>>) => updateProfileStore(id, patch),
    [updateProfileStore]
  )

  const deleteProfile = useCallback((id: string) => deleteProfileStore(id), [deleteProfileStore])

  return {
    profiles,
    activeProfile,
    setActiveProfileId,
    addProfile,
    updateProfile,
    deleteProfile,
  }
}