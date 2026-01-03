export const ROUTES = {
  home: '/',
  search: '/search',
  kids: '/kids',
  tvShows: '/tv-shows',
  movies: '/movies',
  newAndPopular: '/new-and-popular',
  myList: '/my-list',
  account: '/account',
  profiles: '/profiles',
  manageProfiles: '/profiles/manage',
  help: '/help',
} as const
  
  export type RouteKey = keyof typeof ROUTES
  export type RoutePath = (typeof ROUTES)[RouteKey]