import { ROUTES, type RoutePath } from './routes'

export const NETFLIX_LOGO_URL = 'https://rb.gy/ulxxee'
export const DEFAULT_AVATAR_URL = 'https://rb.gy/g1pwyx'

export const HEADER_SCROLL_Y = 24

export type NavItem = {
  label: string
  href: RoutePath
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', href: ROUTES.home },
  { label: 'TV Shows', href: ROUTES.tvShows },
  { label: 'Movies', href: ROUTES.movies },
  { label: 'New & Popular', href: ROUTES.newAndPopular },
  { label: 'My List', href: ROUTES.myList },
] as const

export const ACCOUNT_MENU_ITEMS: readonly NavItem[] = [
  { label: 'Switch Profile', href: ROUTES.profiles },
  { label: 'Manage Profiles', href: ROUTES.manageProfiles },
  { label: 'Kids', href: ROUTES.kids },
  { label: 'Account', href: ROUTES.account },
  { label: 'Help Center', href: ROUTES.help },
] as const