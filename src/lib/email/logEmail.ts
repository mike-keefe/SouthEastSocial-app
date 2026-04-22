import type { Payload } from 'payload'

type EmailType = 'welcome' | 'event-submitted' | 'event-approved' | 'admin-notification' | 'digest' | 'test'
type EmailStatus = 'sent' | 'failed'

export async function logEmail(
  payload: Payload,
  data: {
    recipient: string
    type: EmailType
    subject: string
    status: EmailStatus
    errorMessage?: string
  },
): Promise<void> {
  try {
    await payload.create({ collection: 'email-logs', data })
  } catch (err) {
    console.error('[logEmail] Failed to write email log:', err)
  }
}
