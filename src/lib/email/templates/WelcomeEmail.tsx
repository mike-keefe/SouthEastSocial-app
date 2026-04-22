import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'
import * as React from 'react'
import {
  SITE_URL,
  emailMain, emailContainer, emailH1, emailText,
  emailButtonSection, emailButton, emailHr, emailFooter, emailLink,
} from '../styles'

interface WelcomeEmailProps {
  displayName?: string
}

export function WelcomeEmail({ displayName }: WelcomeEmailProps) {
  const name = displayName || 'there'

  return (
    <Html>
      <Head />
      <Preview>Welcome to SouthEastSocial — your guide to SE London events</Preview>
      <Body style={emailMain}>
        <Container style={emailContainer}>
          <Heading style={emailH1}>Welcome to SouthEastSocial</Heading>
          <Text style={emailText}>Hey {name},</Text>
          <Text style={emailText}>
            You&apos;re now part of SouthEastSocial — the community listings site for events, gigs,
            markets, and happenings across SE London.
          </Text>
          <Text style={emailText}>
            Browse upcoming events, follow your favourite venues and organisers, and get a weekly
            digest of what&apos;s on near you.
          </Text>
          <Section style={emailButtonSection}>
            <Button style={emailButton} href={`${SITE_URL}/events`}>
              Browse events
            </Button>
          </Section>
          <Hr style={emailHr} />
          <Text style={emailFooter}>
            You&apos;re receiving this because you created an account at SouthEastSocial. You can
            manage your email preferences in your{' '}
            <a href={`${SITE_URL}/account/email-preferences`} style={emailLink}>
              account settings
            </a>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
