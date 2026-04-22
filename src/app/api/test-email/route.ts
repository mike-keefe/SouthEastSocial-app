import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { render } from '@react-email/render'
import { resend, FROM_EMAIL } from '@/lib/email/resend'
import { logEmail } from '@/lib/email/logEmail'
import { WelcomeEmail } from '@/lib/email/templates/WelcomeEmail'
import { EventSubmittedEmail } from '@/lib/email/templates/EventSubmittedEmail'
import { EventApprovedEmail } from '@/lib/email/templates/EventApprovedEmail'
import { WeeklyDigestEmail } from '@/lib/email/templates/WeeklyDigestEmail'
import { SITE_URL } from '@/lib/email/styles'
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

  const sampleDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const sampleEvent = { title: 'Summer Jazz Night at The Anchor', slug: 'summer-jazz-night-the-anchor' }

  let html: string
  let subject: string

  switch (type) {
    case 'welcome':
      subject = '[TEST] Welcome to SouthEastSocial'
      html = await render(WelcomeEmail({ displayName: 'Test User' }))
      break
    case 'event-submitted':
      subject = `[TEST] Your event "${sampleEvent.title}" has been submitted`
      html = await render(EventSubmittedEmail({ eventTitle: sampleEvent.title, displayName: 'Test User' }))
      break
    case 'event-approved':
      subject = `[TEST] Your event "${sampleEvent.title}" is now live`
      html = await render(EventApprovedEmail({ eventTitle: sampleEvent.title, eventSlug: sampleEvent.slug, displayName: 'Test User' }))
      break
    case 'digest':
      subject = '[TEST] This week in SE London — your SouthEastSocial digest'
      html = await render(WeeklyDigestEmail({
        displayName: 'Test User',
        featuredEvents: [
          { title: sampleEvent.title, slug: sampleEvent.slug, startDate: sampleDate, price: '£10', postcode: 'SE1 7PB', venueName: 'The Anchor' },
          { title: 'Deptford Market Yard Open Day', slug: 'deptford-market-yard-open-day', startDate: sampleDate, postcode: 'SE8 4BX' },
        ],
        personalisedEvents: [],
        hasFollows: false,
        unsubscribeUrl: `${SITE_URL}/account/email-preferences`,
      }))
      break
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
