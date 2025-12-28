export type Movie = {
    id: number
    title?: string
    name?: string
    original_name?: string
    overview?: string
    poster_path?: string | null
    backdrop_path?: string | null
    media_type?: 'movie' | 'tv'
    release_date?: string
    first_air_date?: string
    vote_average: number
    vote_count: number
    original_language?: string
  }
  
  export type Genre = {
    id: number
    name: string
  }
  
  export type Element = {
    type: string
    key: string
  }