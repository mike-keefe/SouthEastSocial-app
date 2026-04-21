import { Body, Container, Head, Heading, Html, Preview, Text, Button, Section } from '@react-email/components'
import * as React from 'react'

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
  const adminUrl = process.env.NEXT_PUBLIC_SERVER_URL
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/events/${eventId}`
    : `/admin/collections/events/${eventId}`

  return (
    <Html>
      <Head />
      <Preview>New event submission: {eventTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New event submitted</Heading>
          <Text style={text}>
            <strong>{submitterName || submitterEmail}</strong> has submitted a new event for review.
          </Text>
          <Section style={infoBox}>
            <Text style={infoLabel}>Event title</Text>
            <Text style={infoValue}>{eventTitle}</Text>
            <Text style={infoLabel}>Submitted by</Text>
            <Text style={infoValue}>{submitterEmail}</Text>
          </Section>
          <Section style={{ margin: '24px 0' }}>
            <Button style={button} href={adminUrl}>
              Review in admin panel
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main: React.CSSProperties = {
  backgroundColor: '#faf9f7',
  fontFamily: 'system-ui, -apple-system, sans-serif',
}
const container: React.CSSProperties = { margin: '0 auto', padding: '40px 20px', maxWidth: '560px' }
const h1: React.CSSProperties = { color: '#1a1614', fontSize: '24px', fontWeight: '700', margin: '0 0 16px' }
const text: React.CSSProperties = { color: '#4e443d', fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px' }
const infoBox: React.CSSProperties = { backgroundColor: '#f0ede8', borderRadius: '8px', padding: '16px 20px', margin: '16px 0' }
const infoLabel: React.CSSProperties = { color: '#9e8f7e', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }
const infoValue: React.CSSProperties = { color: '#1a1614', fontSize: '15px', fontWeight: '500', margin: '0 0 12px' }
const button: React.CSSProperties = {
  backgroundColor: '#f95016', borderRadius: '8px', color: '#ffffff',
  display: 'inline-block', fontSize: '15px', fontWeight: '600',
  padding: '10px 20px', textDecoration: 'none',
}
