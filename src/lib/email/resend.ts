import { Resend } from 'resend'

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@southeastsocial.com'

// Lazily instantiated so the build phase (no env vars) doesn't throw
let _client: Resend | null = null

function getClient(): Resend {
  if (!_client) _client = new Resend(process.env.RESEND_API_KEY)
  return _client
}

export const resend = new Proxy({} as Resend, {
  get(_, prop: string) {
    return (getClient() as unknown as Record<string, unknown>)[prop]
  },
})
