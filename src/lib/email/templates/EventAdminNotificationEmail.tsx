import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text,
} from '@react-email/components'
import * as React from 'react'
import {
  SITE_URL,
  emailMain, emailContainer, emailH1Sm, emailTextSm,
  emailInfoBoxSm, emailInfoLabel, emailInfoValue, emailButtonSm,
} from '../styles'

interface EventAdminNotificationEmailProps {
  eventTitle: string
  eventId: string
  submitterEmail: string
  submitterName?: string
}

export function EventAdminNotificationEmail({
  eventTitle,
  eventId,
  submitterEmail,
  submitterName,
}: EventAdminNotificationEmailProps) {
  const adminUrl = `${SITE_URL}/admin/collections/events/${eventId}`

  return (
    <Html>
      <Head />
      <Preview>New event submission: {eventTitle}</Preview>
      <Body style={emailMain}>
        <Container style={emailContainer}>
          <Heading style={emailH1Sm}>New event submitted</Heading>
          <Text style={emailTextSm}>
            <strong>{submitterName || submitterEmail}</strong> has submitted a new event for review.
          </Text>
          <Section style={emailInfoBoxSm}>
            <Text style={emailInfoLabel}>Event title</Text>
            <Text style={emailInfoValue}>{eventTitle}</Text>
            <Text style={emailInfoLabel}>Submitted by</Text>
            <Text style={emailInfoValue}>{submitterEmail}</Text>
          </Section>
          <Section style={{ margin: '24px 0' }}>
            <Button style={emailButtonSm} href={adminUrl}>
              Review in admin panel
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
