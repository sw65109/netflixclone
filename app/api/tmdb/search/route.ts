import { NextResponse } from 'next/server'
import { tmdbFetch } from '../../../../lib/tmdb/client'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') ?? searchParams.get('query') ?? '')
      .toString()
      .trim()

    if (!q) {
      return NextResponse.json(
        { error: 'Missing query param: q' },
        { status: 400 }
      )
    }

    const data = await tmdbFetch('/search/multi', {
      query: q,
      language: 'en-US',
      include_adult: false,
      page: 1,
    })

    return NextResponse.json(data, { status: 200 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'TMDB search failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}