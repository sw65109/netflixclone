import { create } from 'zustand'
import type { Movie } from '../typings'

type UiState = {
  showModal: boolean
  currentMovie: Movie | null
  autoplayTrailer: boolean
  openModal: (movie: Movie, opts?: { autoplayTrailer?: boolean }) => void
  closeModal: () => void
  setAutoplayTrailer: (value: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  showModal: false,
  currentMovie: null,
  autoplayTrailer: false,

  openModal: (movie, opts) =>
    set({
      showModal: true,
      currentMovie: movie,
      autoplayTrailer: opts?.autoplayTrailer ?? false,
    }),

  closeModal: () =>
    set({
      showModal: false,
      autoplayTrailer: false,
    }),

  setAutoplayTrailer: (value) => set({ autoplayTrailer: value }),
}))