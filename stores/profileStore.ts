import { create } from 'zustand'

export type Profile = {
  id: string
  name: string
  avatarUrl: string
  isKids: boolean
}

type ProfileState = {
  profiles: Profile[]
  activeProfileId: string
  setActiveProfileId: (id: string) => void
  addProfile: (input: Omit<Profile, 'id'> & { id?: string }) => string
  updateProfile: (id: string, patch: Partial<Omit<Profile, 'id'>>) => void
  deleteProfile: (id: string) => void
}

function makeId() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
}

const defaultProfiles: Profile[] = [
  {
    id: 'default',
    name: 'Profile',
    avatarUrl: 'https://rb.gy/g1pwyx',
    isKids: false,
  },
]

export const useProfileStore = create<ProfileState>()((set, get) => ({
  profiles: defaultProfiles,
  activeProfileId: 'default',

  setActiveProfileId: (id) => set({ activeProfileId: id }),

  addProfile: (input) => {
    const id = input.id?.trim() ? input.id : makeId()

    set((state) => {
      if (state.profiles.some((p) => p.id === id)) return state
      return {
        profiles: [
          ...state.profiles,
          {
            id,
            name: input.name,
            avatarUrl: input.avatarUrl,
            isKids: input.isKids,
          },
        ],
      }
    })

    return id
  },

  updateProfile: (id, patch) => {
    set((state) => ({
      profiles: state.profiles.map((p) =>
        p.id === id ? { ...p, ...patch } : p
      ),
    }))
  },

  deleteProfile: (id) => {
    const current = get().activeProfileId
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== id),
      activeProfileId: current === id ? 'default' : current,
    }))
  },
}))