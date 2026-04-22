import { describe, it, expect, beforeAll } from 'vitest'

// Set DIGEST_SECRET before importing the module so createHmac uses it
beforeAll(() => {
  process.env.DIGEST_SECRET = 'test-secret-for-unsubscribe'
})

// Dynamic import so the env var is set first
const getModule = () => import('../../src/lib/email/unsubscribeToken')

describe('createUnsubscribeToken', () => {
  it('returns a non-empty string', async () => {
    const { createUnsubscribeToken } = await getModule()
    expect(createUnsubscribeToken('user-123')).toBeTruthy()
    expect(typeof createUnsubscribeToken('user-123')).toBe('string')
  })

  it('produces different tokens for different user IDs', async () => {
    const { createUnsubscribeToken } = await getModule()
    expect(createUnsubscribeToken('user-1')).not.toBe(createUnsubscribeToken('user-2'))
  })

  it('produces consistent tokens for the same user ID', async () => {
    const { createUnsubscribeToken } = await getModule()
    expect(createUnsubscribeToken('user-abc')).toBe(createUnsubscribeToken('user-abc'))
  })
})

describe('verifyUnsubscribeToken', () => {
  it('returns the userId for a valid token', async () => {
    const { createUnsubscribeToken, verifyUnsubscribeToken } = await getModule()
    const token = createUnsubscribeToken('user-456')
    expect(verifyUnsubscribeToken(token)).toBe('user-456')
  })

  it('returns null for a tampered token', async () => {
    const { createUnsubscribeToken, verifyUnsubscribeToken } = await getModule()
    const token = createUnsubscribeToken('user-789')
    const tampered = token.slice(0, -4) + 'xxxx'
    expect(verifyUnsubscribeToken(tampered)).toBeNull()
  })

  it('returns null for an empty string', async () => {
    const { verifyUnsubscribeToken } = await getModule()
    expect(verifyUnsubscribeToken('')).toBeNull()
  })

  it('returns null for a random string', async () => {
    const { verifyUnsubscribeToken } = await getModule()
    expect(verifyUnsubscribeToken('not-a-valid-token')).toBeNull()
  })
})
