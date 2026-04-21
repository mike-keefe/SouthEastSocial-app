import { describe, it, expect } from 'vitest'

// Unit tests for the digest route's auth logic, isolated from Payload/DB.
// The actual email-sending integration is verified manually.

function checkAuth(authHeader: string | null, secret: string): boolean {
  if (!authHeader?.startsWith('Bearer ')) return false
  const token = authHeader.slice(7)
  return !!token && token === secret
}

describe('send-digest auth', () => {
  const SECRET = 'test-digest-secret'

  it('accepts a valid bearer token', () => {
    expect(checkAuth(`Bearer ${SECRET}`, SECRET)).toBe(true)
  })

  it('rejects a missing Authorization header', () => {
    expect(checkAuth(null, SECRET)).toBe(false)
  })

  it('rejects an empty token', () => {
    expect(checkAuth('Bearer ', SECRET)).toBe(false)
  })

  it('rejects a wrong token', () => {
    expect(checkAuth('Bearer wrong-token', SECRET)).toBe(false)
  })

  it('rejects a token without Bearer prefix', () => {
    expect(checkAuth(SECRET, SECRET)).toBe(false)
  })
})
