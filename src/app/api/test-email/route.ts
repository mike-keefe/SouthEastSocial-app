import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { render } from '@react-email/render'
import { resend, FROM_EMAIL } from '@/lib/email/resend'
import { logEmail } from '@/lib/email/logEmail'
import { WelcomeEmail } from '@/lib/email/templates/WelcomeEmail'
import { EventSubmittedEmail } from '@/lib/email/templates/EventSubmittedEmail'
import { EventApprovedEmail } from '@/lib/email/templates/EventApprovedEmail'
import { WeeklyDigestEmail, type DigestEvent } from '@/lib/email/templates/WeeklyDigestEmail'
import { SITE_URL } from '@/lib/email/styles'
import { createUnsubscribeToken } from '@/lib/email/unsubscribeToken'
import type { User } from '@/payload-types'

const EMAIL_TYPES = ['welcome', 'event-submitted', 'event-approved', 'digest'] as const
type EmailType = (typeof EMAIL_TYPES)[number]

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers as unknown as Headers })

  if ((user as (User & { role?: string }) | null)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { type, to }: { type: EmailType; to: string } = body

  if (!EMAIL_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
  }
  if (!to || !to.includes('@')) {
    return NextResponse.json({ error: 'Invalid recipient' }, { status: 400 })
  }

  const displayName = (user as User).displayName ?? 'there'

  // Fetch a real published event for event-type emails
  const eventResult = await payload.find({
    collection: 'events',
    where: { status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 1,
    depth: 0,
  })
  const realEvent = eventResult.docs[0]
  const eventTitle = realEvent?.title ?? 'Sample Event'
  const eventSlug = realEvent?.slug ?? 'sample-event'

  let html: string
  let subject: string

  switch (type) {
    case 'welcome':
      subject = '[TEST] Welcome to SouthEastSocial'
      html = await render(WelcomeEmail({ displayName }))
      break

    case 'event-submitted':
      subject = `[TEST] Your event "${eventTitle}" has been submitted`
      html = await render(EventSubmittedEmail({ eventTitle, displayName }))
      break

    case 'event-approved':
      subject = `[TEST] Your event "${eventTitle}" is now live`
      html = await render(EventApprovedEmail({ eventTitle, eventSlug, displayName }))
      break

    case 'digest': {
      const now = new Date().toISOString()
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

      // Featured events — same query as the real digest
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

      // Look up the recipient user to personalise with their real follows
      const recipientResult = await payload.find({
        collection: 'users',
        where: { email: { equals: to } },
        limit: 1,
        depth: 0,
      })
      const recipient = recipientResult.docs[0]

      let personalisedEvents: DigestEvent[] = []
      let hasFollows = false

      if (recipient) {
        const followsResult = await payload.find({
          collection: 'follows',
          where: { user: { equals: recipient.id } },
          limit: 100,
          depth: 1,
        })

        hasFollows = followsResult.docs.length > 0

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
              venueName: typeof e.venue === 'object' && e.venue ? (e.venue as { name: string }).name : undefined,
            }))
          }
        }
      }

      const recipientId = recipient?.id ?? 'test'
      const unsubscribeToken = createUnsubscribeToken(String(recipientId))
      const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?token=${unsubscribeToken}`

      subject = '[TEST] This week in SE London — your SouthEastSocial digest'
      html = await render(
        WeeklyDigestEmail({
          displayName: recipient?.displayName ?? displayName,
          featuredEvents,
          personalisedEvents,
          hasFollows,
          unsubscribeUrl,
        }),
      )
      break
    }

    default:
      return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
  }

  try {
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html })
    await logEmail(payload, { recipient: to, type: 'test', subject, status: 'sent' })
    return NextResponse.json({ ok: true })
  } catch (err) {
    await logEmail(payload, { recipient: to, type: 'test', subject, status: 'failed', errorMessage: err instanceof Error ? err.message : String(err) })
    return NextResponse.json({ error: 'Send failed' }, { status: 500 })
  }
}
