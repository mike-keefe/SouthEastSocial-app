import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'
import * as React from 'react'
import {
  SITE_URL,
  emailMain, emailContainer, emailH1, emailText,
  emailButtonSection, emailButton, emailHr, emailFooter,
} from '../styles'

interface EventApprovedEmailProps {
  eventTitle: string
  eventSlug: string
  displayName?: string
}

export function EventApprovedEmail({ eventTitle, eventSlug, displayName }: EventApprovedEmailProps) {
  const name = displayName || 'there'
  const eventUrl = `${SITE_URL}/events/${eventSlug}`

  return (
    <Html>
      <Head />
      <Preview>Your event &quot;{eventTitle}&quot; is now live on SouthEastSocial</Preview>
      <Body style={emailMain}>
        <Container style={emailContainer}>
          <Heading style={emailH1}>Your event is live 🎉</Heading>
          <Text style={emailText}>Hey {name},</Text>
          <Text style={emailText}>
            Great news — <strong>{eventTitle}</strong> has been reviewed and is now published on
            SouthEastSocial.
          </Text>
          <Section style={emailButtonSection}>
            <Button style={emailButton} href={eventUrl}>
              View your event
            </Button>
          </Section>
          <Text style={emailText}>
            Share the link with your community and let people know it&apos;s happening.
          </Text>
          <Hr style={emailHr} />
          <Text style={emailFooter}>SouthEastSocial · Made in SE London</Text>
        </Container>
      </Body>
    </Html>
  )
}
