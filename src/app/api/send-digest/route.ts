import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { render } from '@react-email/render'
import { NextResponse } from 'next/server'
import { resend, FROM_EMAIL } from '@/lib/email/resend'
import { WeeklyDigestEmail, type DigestEvent } from '@/lib/email/templates/WeeklyDigestEmail'
import { createUnsubscribeToken } from '@/lib/email/unsubscribeToken'

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized', code: 'INVALID_TOKEN' }, { status: 401 })
  }
  const token = authHeader.slice(7)

  if (!token || token !== process.env.DIGEST_SECRET) {
    return NextResponse.json({ error: 'Unauthorized', code: 'INVALID_TOKEN' }, { status: 401 })
  }

  const payload = await getPayload({ config })

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const now = new Date().toISOString()

  // Fetch 4 featured upcoming published events
  const featuredResult = await payload.find({
    collection: 'events',
    where: {
      and: [{ status: { equals: 'published' } }, { startDate: { greater_than: now } }],
    },
    sort: 'startDate',
    limit: 4,
    depth: 1,
  })

  const featuredEvents: DigestEvent[] = featuredResult.docs.map((e) => ({
    title: e.title,
    slug: e.slug ?? '',
    startDate: e.startDate,
    price: e.price ?? undefined,
    postcode: e.postcode ?? undefined,
    venueName: typeof e.venue === 'object' && e.venue ? (e.venue as { name: string }).name : undefined,
  }))

  // Fetch all users with weeklyDigest opted in
  const usersResult = await payload.find({
    collection: 'users',
    where: { 'emailPreferences.weeklyDigest': { equals: true } },
    limit: 1000,
    depth: 0,
  })

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://southeastsocial.mikekeefe.com'
  let sent = 0
  let failed = 0

  for (const user of usersResult.docs) {
    const userId = user.id
    const userEmail = user.email
    const displayName = user.displayName

    // Fetch this user's follows
    const followsResult = await payload.find({
      collection: 'follows',
      where: { user: { equals: userId } },
      limit: 100,
      depth: 1,
    })

    const hasFollows = followsResult.docs.length > 0
    let personalisedEvents: DigestEvent[] = []

    if (hasFollows) {
      const venueIds: (string | number)[] = []
      const organiserIds: (string | number)[] = []

      for (const follow of followsResult.docs) {
        if (follow.followType === 'venue' && follow.venue) {
          const id = typeof follow.venue === 'object' ? follow.venue.id : follow.venue
          venueIds.push(id)
        }
        if (follow.followType === 'organiser' && follow.organiser) {
          const id = typeof follow.organiser === 'object' ? follow.organiser.id : follow.organiser
          organiserIds.push(id)
        }
      }

      const conditions: Where[] = [
        { status: { equals: 'published' } },
        { startDate: { greater_than: sevenDaysAgo } },
      ]

      const followConditions: Where[] = []
      if (venueIds.length > 0) followConditions.push({ venue: { in: venueIds } })
      if (organiserIds.length > 0) followConditions.push({ organiser: { in: organiserIds } })

      if (followConditions.length > 0) {
        conditions.push({ or: followConditions })
        const personalisedResult = await payload.find({
          collection: 'events',
          where: { and: conditions },
          sort: 'startDate',
          limit: 10,
          depth: 1,
        })

        personalisedEvents = personalisedResult.docs.map((e) => ({
          title: e.title,
          slug: e.slug ?? '',
          startDate: e.startDate,
          price: e.price ?? undefined,
          postcode: e.postcode ?? undefined,
          venueName:
            typeof e.venue === 'object' && e.venue
              ? (e.venue as { name: string }).name
              : undefined,
        }))
      }
    }

    const unsubscribeToken = createUnsubscribeToken(String(userId))
    const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${unsubscribeToken}`

    try {
      const html = await render(
        WeeklyDigestEmail({
          displayName: displayName ?? undefined,
          featuredEvents,
          personalisedEvents,
          hasFollows,
          unsubscribeUrl,
        }),
      )
      await resend.emails.send({
        from: FROM_EMAIL,
        to: userEmail,
        subject: 'This week in SE London — your SouthEastSocial digest',
        html,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      })
      sent++
    } catch (err) {
      console.error(`[send-digest] Failed to send to ${userEmail}:`, err)
      failed++
    }
  }

  return NextResponse.json({ ok: true, sent, failed })
}
