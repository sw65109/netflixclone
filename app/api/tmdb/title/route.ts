import { NextResponse } from 'next/server'
import { tmdbFetch } from '../../../../lib/tmdb/client'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = (searchParams.get('id') ?? '').toString().trim()
    const type = (searchParams.get('type') ?? 'movie').toString().trim() 

    if (!id) {
      return NextResponse.json(
        { error: 'Missing query param: id' },
        { status: 400 }
      )
    }

    if (type !== 'movie' && type !== 'tv') {
      return NextResponse.json(
        { error: 'Invalid type (use movie|tv)' },
        { status: 400 }
      )
    }

    const data = await tmdbFetch(`/${type}/${id}`, {
      language: 'en-US',
      append_to_response: 'videos',
    })

    return NextResponse.json(data, { status: 200 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'TMDB title fetch failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}