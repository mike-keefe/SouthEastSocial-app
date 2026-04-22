import { describe, it, expect, beforeAll, afterAll } from 'vitest'

// Set env var before any imports so the module reads it correctly
process.env.DIGEST_SECRET = 'test-secret-for-unsubscribe'

import { createUnsubscribeToken, verifyUnsubscribeToken } from '../../src/lib/email/unsubscribeToken'

describe('createUnsubscribeToken', () => {
  it('returns a non-empty string', () => {
    expect(createUnsubscribeToken('user-123')).toBeTruthy()
    expect(typeof createUnsubscribeToken('user-123')).toBe('string')
  })

  it('produces different tokens for different user IDs', () => {
    expect(createUnsubscribeToken('user-1')).not.toBe(createUnsubscribeToken('user-2'))
  })

  it('produces consistent tokens for the same user ID', () => {
    expect(createUnsubscribeToken('user-abc')).toBe(createUnsubscribeToken('user-abc'))
  })

  it('throws when DIGEST_SECRET is not set', () => {
    const original = process.env.DIGEST_SECRET
    delete process.env.DIGEST_SECRET
    expect(() => createUnsubscribeToken('user-123')).toThrow('DIGEST_SECRET environment variable is not set')
    process.env.DIGEST_SECRET = original
  })
})

describe('verifyUnsubscribeToken', () => {
  it('returns the userId for a valid token', () => {
    const token = createUnsubscribeToken('user-456')
    expect(verifyUnsubscribeToken(token)).toBe('user-456')
  })

  it('returns null for a tampered token', () => {
    const token = createUnsubscribeToken('user-789')
    const tampered = token.slice(0, -4) + 'xxxx'
    expect(verifyUnsubscribeToken(tampered)).toBeNull()
  })

  it('returns null for an empty string', () => {
    expect(verifyUnsubscribeToken('')).toBeNull()
  })

  it('returns null for a random string', () => {
    expect(verifyUnsubscribeToken('not-a-valid-token')).toBeNull()
  })

  it('returns null when DIGEST_SECRET is not set', () => {
    const original = process.env.DIGEST_SECRET
    delete process.env.DIGEST_SECRET
    const result = verifyUnsubscribeToken('some-token')
    process.env.DIGEST_SECRET = original
    expect(result).toBeNull()
  })
})
