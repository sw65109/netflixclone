export const ROUTES = {
    home: '/',
    search: '/search',
    kids: '/kids',
    help: '/help',
    account: '/account',
    profiles: '/profiles',
    manageProfiles: '/profiles/manage',
    login: '/login',
  } as const
  
  export type RouteKey = keyof typeof ROUTES
  export type RoutePath = (typeof ROUTES)[RouteKey]