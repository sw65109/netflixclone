export type TmdbImageSize = 'original' | 'w780' | 'w500' | 'w342' | 'w185'

export function tmdbImageUrl(
  path?: string | null,
  size: TmdbImageSize = 'original'
) {
  if (!path) return ''
  return `https://image.tmdb.org/t/p/${size}${path}`
}