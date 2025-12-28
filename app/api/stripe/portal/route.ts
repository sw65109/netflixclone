import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type PortalBody = {
  returnUrl?: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as PortalBody

    const origin = req.headers.get('origin') ?? ''
    const returnUrl = body.returnUrl ?? `${origin}/account`

    return NextResponse.json(
      {
        error:
          'Billing portal endpoint is not configured yet. See app/api/stripe/portal/route.ts comments.',
        returnUrl,
      },
      { status: 501 }
    )
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : 'Unknown error creating billing portal link.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}