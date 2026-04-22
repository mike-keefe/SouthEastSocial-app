import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'
import * as React from 'react'
import {
  SITE_URL,
  emailMain, emailContainer, emailH1, emailText,
  emailInfoBox, emailInfoText, emailHr, emailFooter, emailLink,
} from '../styles'

interface EventSubmittedEmailProps {
  eventTitle: string
  displayName?: string
}

export function EventSubmittedEmail({ eventTitle, displayName }: EventSubmittedEmailProps) {
  const name = displayName || 'there'

  return (
    <Html>
      <Head />
      <Preview>Your event &quot;{eventTitle}&quot; has been submitted for review</Preview>
      <Body style={emailMain}>
        <Container style={emailContainer}>
          <Heading style={emailH1}>Event submitted</Heading>
          <Text style={emailText}>Hey {name},</Text>
          <Text style={emailText}>
            Thanks for submitting <strong>{eventTitle}</strong> to SouthEastSocial.
          </Text>
          <Section style={emailInfoBox}>
            <Text style={emailInfoText}>
              Your event is now <strong>pending review</strong>. We&apos;ll check it over and
              publish it shortly. You&apos;ll receive another email as soon as it goes live.
            </Text>
          </Section>
          <Text style={emailText}>
            You can track the status of your event from your{' '}
            <a href={`${SITE_URL}/account`} style={emailLink}>
              account dashboard
            </a>
            .
          </Text>
          <Hr style={emailHr} />
          <Text style={emailFooter}>SouthEastSocial · Made in SE London</Text>
        </Container>
      </Body>
    </Html>
  )
}
