import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { verifyUnsubscribeToken } from '@/lib/email/unsubscribeToken'

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://southeastsocial.mikekeefe.com'

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token')
  if (!token) {
    return NextResponse.redirect(`${siteUrl}/account/email-preferences`)
  }

  const userId = verifyUnsubscribeToken(token)
  if (!userId) {
    return NextResponse.redirect(`${siteUrl}/account/email-preferences`)
  }

  const payload = await getPayload({ config })
  await payload.update({
    collection: 'users',
    id: userId,
    data: { emailPreferences: { weeklyDigest: false } },
  })

  return NextResponse.redirect(`${siteUrl}/account/email-preferences?unsubscribed=1`)
}

export async function POST(req: Request) {
  const token = new URL(req.url).searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  const userId = verifyUnsubscribeToken(token)
  if (!userId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  await payload.update({
    collection: 'users',
    id: userId,
    data: { emailPreferences: { weeklyDigest: false } },
  })

  return NextResponse.json({ ok: true })
}
