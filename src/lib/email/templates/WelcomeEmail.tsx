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

interface WelcomeEmailProps {
  displayName?: string
}

export function WelcomeEmail({ displayName }: WelcomeEmailProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://southeastsocial.com'
  const name = displayName || 'there'

  return (
    <Html>
      <Head />
      <Preview>Welcome to SouthEastSocial — your guide to SE London events</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to SouthEastSocial</Heading>
          <Text style={text}>Hey {name},</Text>
          <Text style={text}>
            You&apos;re now part of SouthEastSocial — the community listings site for events, gigs,
            markets, and happenings across SE London.
          </Text>
          <Text style={text}>
            Browse upcoming events, follow your favourite venues and organisers, and get a weekly
            digest of what&apos;s on near you.
          </Text>
          <Section style={buttonSection}>
            <Button style={button} href={`${siteUrl}/events`}>
              Browse events
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            You&apos;re receiving this because you created an account at SouthEastSocial. You can
            manage your email preferences in your{' '}
            <a href={`${siteUrl}/account/email-preferences`} style={link}>
              account settings
            </a>
            .
          </Text>
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
  lineHeight: '1.5',
}

const link: React.CSSProperties = {
  color: '#f95016',
}
