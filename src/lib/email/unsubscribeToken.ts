import { createHmac, timingSafeEqual } from 'crypto'

function secret(): string {
  return process.env.DIGEST_SECRET || ''
}

export function createUnsubscribeToken(userId: string): string {
  const hmac = createHmac('sha256', secret()).update(userId).digest('hex')
  return Buffer.from(`${userId}:${hmac}`).toString('base64url')
}

export function verifyUnsubscribeToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const colonIdx = decoded.lastIndexOf(':')
    if (colonIdx === -1) return null
    const userId = decoded.slice(0, colonIdx)
    const providedHmac = decoded.slice(colonIdx + 1)
    const expectedHmac = createHmac('sha256', secret()).update(userId).digest('hex')
    const expected = Buffer.from(expectedHmac, 'utf8')
    const provided = Buffer.from(providedHmac, 'utf8')
    if (expected.length !== provided.length) return null
    if (!timingSafeEqual(expected, provided)) return null
    return userId
  } catch {
    return null
  }
}
