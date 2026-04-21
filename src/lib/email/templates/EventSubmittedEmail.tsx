import {
  Body,
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

interface EventSubmittedEmailProps {
  eventTitle: string
  displayName?: string
}

export function EventSubmittedEmail({ eventTitle, displayName }: EventSubmittedEmailProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://southeastsocial.com'
  const name = displayName || 'there'

  return (
    <Html>
      <Head />
      <Preview>Your event &quot;{eventTitle}&quot; has been submitted for review</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Event submitted</Heading>
          <Text style={text}>Hey {name},</Text>
          <Text style={text}>
            Thanks for submitting <strong>{eventTitle}</strong> to SouthEastSocial.
          </Text>
          <Section style={infoBox}>
            <Text style={infoText}>
              Your event is now <strong>pending review</strong>. We&apos;ll check it over and
              publish it shortly. You&apos;ll receive another email as soon as it goes live.
            </Text>
          </Section>
          <Text style={text}>
            You can track the status of your event from your{' '}
            <a href={`${siteUrl}/account`} style={link}>
              account dashboard
            </a>
            .
          </Text>
          <Hr style={hr} />
          <Text style={footer}>SouthEastSocial · Made in SE London</Text>
        </Container>
      </Body>
    </Html>
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

const text: React.CSSProperties = {
  color: '#4e443d',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
}

const infoBox: React.CSSProperties = {
  backgroundColor: '#f0ede8',
  borderRadius: '8px',
  margin: '24px 0',
  padding: '16px 20px',
}

const infoText: React.CSSProperties = {
  color: '#4e443d',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
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
