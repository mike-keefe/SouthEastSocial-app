import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

export interface DigestEvent {
  title: string
  slug: string
  startDate: string
  price?: string
  postcode?: string
  venueName?: string
}

interface WeeklyDigestEmailProps {
  displayName?: string
  featuredEvents: DigestEvent[]
  personalisedEvents?: DigestEvent[]
  hasFollows: boolean
}

export function WeeklyDigestEmail({
  displayName,
  featuredEvents,
  personalisedEvents = [],
  hasFollows,
}: WeeklyDigestEmailProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://southeastsocial.com'
  const name = displayName || 'there'

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })

  return (
    <Html>
      <Head />
      <Preview>This week in SE London — your SouthEastSocial digest</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>This week in SE London</Heading>
          <Text style={text}>Hey {name},</Text>
          <Text style={text}>Here&apos;s what&apos;s on across South East London this week.</Text>

          {hasFollows && personalisedEvents.length > 0 && (
            <Section>
              <Heading style={h2}>From venues &amp; organisers you follow</Heading>
              {personalisedEvents.map((event) => (
                <EventRow key={event.slug} event={event} siteUrl={siteUrl} formatDate={formatDate} />
              ))}
              <Hr style={hr} />
            </Section>
          )}

          <Section>
            <Heading style={h2}>Featured events</Heading>
            {featuredEvents.length > 0 ? (
              featuredEvents.map((event) => (
                <EventRow
                  key={event.slug}
                  event={event}
                  siteUrl={siteUrl}
                  formatDate={formatDate}
                />
              ))
            ) : (
              <Text style={text}>No featured events this week — check back soon.</Text>
            )}
          </Section>

          {!hasFollows && (
            <Section style={ctaBox}>
              <Text style={ctaText}>
                Follow venues and organisers to get a personalised section in your weekly digest.
              </Text>
              <Button style={button} href={`${siteUrl}/venues`}>
                Explore venues
              </Button>
            </Section>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            SouthEastSocial · Made in SE London ·{' '}
            <a href={`${siteUrl}/account/email-preferences`} style={link}>
              Manage preferences
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

function EventRow({
  event,
  siteUrl,
  formatDate,
}: {
  event: DigestEvent
  siteUrl: string
  formatDate: (iso: string) => string
}) {
  return (
    <Section style={eventRow}>
      <Text style={eventTitle}>
        <a href={`${siteUrl}/events/${event.slug}`} style={eventLink}>
          {event.title}
        </a>
      </Text>
      <Text style={eventMeta}>
        {formatDate(event.startDate)}
        {event.venueName ? ` · ${event.venueName}` : ''}
        {event.postcode ? ` · ${event.postcode}` : ''}
        {event.price ? ` · ${event.price}` : ''}
      </Text>
    </Section>
  )
}

const main: React.CSSProperties = {
  backgroundColor: '#faf9f7',
  fontFamily: 'system-ui, -apple-system, sans-serif',
}

const container: React.CSSProperties = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
}

const h1: React.CSSProperties = {
  color: '#1a1614',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 24px',
}

const h2: React.CSSProperties = {
  color: '#1a1614',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
}

const text: React.CSSProperties = {
  color: '#4e443d',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
}

const eventRow: React.CSSProperties = {
  borderLeft: '3px solid #f95016',
  margin: '0 0 16px',
  paddingLeft: '12px',
}

const eventTitle: React.CSSProperties = {
  color: '#1a1614',
  fontSize: '15px',
  fontWeight: '600',
  margin: '0 0 4px',
}

const eventLink: React.CSSProperties = {
  color: '#1a1614',
  textDecoration: 'none',
}

const eventMeta: React.CSSProperties = {
  color: '#9e8f7e',
  fontSize: '13px',
  margin: '0',
}

const ctaBox: React.CSSProperties = {
  backgroundColor: '#fff4ed',
  borderRadius: '8px',
  margin: '24px 0',
  padding: '20px',
}

const ctaText: React.CSSProperties = {
  color: '#4e443d',
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '0 0 16px',
}

const button: React.CSSProperties = {
  backgroundColor: '#f95016',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: '600',
  padding: '10px 20px',
  textDecoration: 'none',
}

const hr: React.CSSProperties = {
  borderColor: '#e2ddd5',
  margin: '32px 0',
}

const footer: React.CSSProperties = {
  color: '#9e8f7e',
  fontSize: '13px',
}

const link: React.CSSProperties = {
  color: '#f95016',
}
