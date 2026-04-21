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

interface EventApprovedEmailProps {
  eventTitle: string
  eventSlug: string
  displayName?: string
}

export function EventApprovedEmail({ eventTitle, eventSlug, displayName }: EventApprovedEmailProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://southeastsocial.com'
  const name = displayName || 'there'
  const eventUrl = `${siteUrl}/events/${eventSlug}`

  return (
    <Html>
      <Head />
      <Preview>Your event &quot;{eventTitle}&quot; is now live on SouthEastSocial</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your event is live 🎉</Heading>
          <Text style={text}>Hey {name},</Text>
          <Text style={text}>
            Great news — <strong>{eventTitle}</strong> has been reviewed and is now published on
            SouthEastSocial.
          </Text>
          <Section style={buttonSection}>
            <Button style={button} href={eventUrl}>
              View your event
            </Button>
          </Section>
          <Text style={text}>
            Share the link with your community and let people know it&apos;s happening.
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

const buttonSection: React.CSSProperties = {
  margin: '32px 0',
}

const button: React.CSSProperties = {
  backgroundColor: '#f95016',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  padding: '12px 24px',
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
