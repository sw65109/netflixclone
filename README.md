# Netflix Clone (Next.js + Firebase + Stripe)

A Netflix-style clone built with **Next.js App Router**, **Firebase Auth + Firestore**, **TMDB** for catalog data, and the **Stripe Firebase Extension** for subscriptions.

This repo focuses on:

- A pre-auth funnel (landing/login → plans → Stripe checkout)
- Subscription-gated access to the app
- Netflix-like browsing (rows, modal preview) and search

## ✅ Tech stack

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Firebase**: Auth + Firestore
- **Stripe**: Firestore Stripe Payments / Firebase Extension checkout flow
- **TMDB**: server routes under `app/api/tmdb/*`
- **Zustand**: UI + profile state
- **MUI Modal** + **react-player**: trailer modal

## 🧭 App routes

Common routes in this project:

- `/login` — landing + auth entry (pre-auth)
- `/login/plans` — plan selection / checkout start
- `/profiles` — profile selection
- `/profiles/manage` — create/edit profiles (currently stored client-side unless you add persistence)
- `/` — main home feed (subscription-gated)
- `/search` — search results page
- `/kids` — kids experience (restricted by kids profile)
- `/account` — account page

## 🔐 Subscription model (important)

Subscriptions are read from Firestore at:

`customers/{uid}/subscriptions`

Only statuses `active` and `trialing` count as subscribed.

Checkout uses the Stripe Firebase Extension pattern:

`customers/{uid}/checkout_sessions`

The extension writes back a `url` field, and the client redirects to it.

## 🚀 Getting started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env.local` at the project root.

Firebase (required by `firebase.ts`):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

TMDB (used by the TMDB client/handlers and the trailer modal):

```bash
NEXT_PUBLIC_API_KEY=
```

Notes:

- `NEXT_PUBLIC_API_KEY` is currently used by the trailer modal to hit TMDB.
- If you prefer not exposing an API key client-side, move trailer fetching into a server route and call that instead.

### 3) Firebase setup

In Firebase Console:

1. Enable **Authentication** (Email/Password)
2. Create **Firestore**

Your Firestore data model is expected to include:

- `customers/{uid}/subscriptions/*` (written by Stripe extension)
- `customers/{uid}/checkout_sessions/*` (created by client, completed by Stripe extension)
- `customers/{uid}/myList/*` (used by `components/Modal.tsx` My List)

### 4) Stripe setup (Firebase Extension)

This project assumes you are using the **Stripe Firebase Extension** that:

- syncs products → Firestore `products` + nested `prices`
- creates Checkout Sessions when docs are added to `customers/{uid}/checkout_sessions`
- writes subscription state under `customers/{uid}/subscriptions`

Once configured, plan data is read directly from Firestore.

### 5) Run the app

```bash
npm run dev
```

Open http://localhost:3000

## 🧪 Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## 🔎 API routes

TMDB:

- `GET /api/tmdb/search?q=...` — multi-search via TMDB

Stripe:

- `POST /api/stripe/portal` — placeholder (currently returns 501)

## 🧰 Troubleshooting

### “I briefly see home when logging out” / “plans flashes after signing in”

That typically happens when content renders during auth/subscription transitions.
The fix is to **gate rendering** in `app/providers.tsx` so protected routes return `null` until auth + subscription state is known.

### “Checkout does nothing”

- Ensure the Stripe extension is installed and configured.
- Ensure `customers/{uid}/checkout_sessions` is being created.
- The extension must write back a `url` in the created doc.

### “Billing portal doesn’t work”

`/api/stripe/portal` is currently a stub returning `501` by design.

### “Profiles don’t persist after refresh”

Profiles are currently stored in a client-side Zustand store (`stores/profileStore.ts`).
To persist them, add either:

- `zustand` `persist` middleware (localStorage), or
- a Firestore-backed profiles collection per user.

## 🙏 Attribution & Disclaimer

- This project is an educational demo and is **not affiliated with, endorsed, or sponsored by Netflix, Inc.**
- “Netflix” is a trademark of Netflix, Inc. Other trademarks, logos, and brand names are the property of their respective owners.
- **TMDB**: This product uses the TMDB API but is not endorsed or certified by TMDB. TMDB: https://www.themoviedb.org/
- Movie/TV metadata and images are provided via TMDB and are © their respective owners.
- **Stripe/Firebase**: Subscriptions and payments follow the Stripe Firebase Extension pattern (Firestore Stripe Payments). Authentication and app data use Firebase.
- **Ali Code**: Parts of this project were built by following Ali Code’s 3-part Netflix clone series and then updated to modern versions (Next.js/React) and project choices (e.g., Zustand instead of Recoil):
  - Build and Deploy a Fullstack Netflix Clone: Tailwind Introduction & Server Side Rendering (Part 1)
  - Build and Deploy a Fullstack Netflix Clone: Implementing Auth and using Recoil (Part 2)
  - Build and Deploy a Fullstack Netflix Clone: Integrating Stripe & building Plans Screen (Part 3)

## 📄 License

This project is for educational purposes.




