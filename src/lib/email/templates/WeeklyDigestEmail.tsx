import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'
import * as React from 'react'
import {
  SITE_URL,
  emailMain, emailContainer, emailH1, emailH2, emailText,
  emailCtaBox, emailCtaText, emailButtonSm, emailHr, emailFooter, emailLink,
  emailEventRow, emailEventTitle, emailEventLink, emailEventMeta,
} from '../styles'

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
  unsubscribeUrl: string
}

export function WeeklyDigestEmail({
  displayName,
  featuredEvents,
  personalisedEvents = [],
  hasFollows,
  unsubscribeUrl,
}: WeeklyDigestEmailProps) {
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
      <Body style={emailMain}>
        <Container style={emailContainer}>
          <Heading style={emailH1}>This week in SE London</Heading>
          <Text style={emailText}>Hey {name},</Text>
          <Text style={emailText}>Here&apos;s what&apos;s on across South East London this week.</Text>

          {hasFollows && personalisedEvents.length > 0 && (
            <Section>
              <Heading style={emailH2}>From venues &amp; organisers you follow</Heading>
              {personalisedEvents.map((event) => (
                <EventRow key={event.slug} event={event} formatDate={formatDate} />
              ))}
              <Hr style={emailHr} />
            </Section>
          )}

          <Section>
            <Heading style={emailH2}>Featured events</Heading>
            {featuredEvents.length > 0 ? (
              featuredEvents.map((event) => (
                <EventRow key={event.slug} event={event} formatDate={formatDate} />
              ))
            ) : (
              <Text style={emailText}>No featured events this week — check back soon.</Text>
            )}
          </Section>

          {!hasFollows && (
            <Section style={emailCtaBox}>
              <Text style={emailCtaText}>
                Follow venues and organisers to get a personalised section in your weekly digest.
              </Text>
              <Button style={emailButtonSm} href={`${SITE_URL}/venues`}>
                Explore venues
              </Button>
            </Section>
          )}

          <Hr style={emailHr} />
          <Text style={emailFooter}>
            SouthEastSocial · Made in SE London ·{' '}
            <a href={`${SITE_URL}/account/email-preferences`} style={emailLink}>
              Manage preferences
            </a>
            {' · '}
            <a href={unsubscribeUrl} style={emailLink}>
              Unsubscribe
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

function EventRow({
  event,
  formatDate,
}: {
  event: DigestEvent
  formatDate: (iso: string) => string
}) {
  return (
    <Section style={emailEventRow}>
      <Text style={emailEventTitle}>
        <a href={`${SITE_URL}/events/${event.slug}`} style={emailEventLink}>
          {event.title}
        </a>
      </Text>
      <Text style={emailEventMeta}>
        {formatDate(event.startDate)}
        {event.venueName ? ` · ${event.venueName}` : ''}
        {event.postcode ? ` · ${event.postcode}` : ''}
        {event.price ? ` · ${event.price}` : ''}
      </Text>
    </Section>
  )
}
