import { describe, it, expect } from 'vitest'
import { admins, adminsOrSelf, authenticated, publishedOrAdmin } from '../../src/lib/access'

function makeReq(overrides: object = {}) {
  return { user: null, ...overrides } as Parameters<typeof admins>[0]['req']
}

function admin() {
  return makeReq({ user: { id: 1, role: 'admin', collection: 'users', email: 'admin@test.com' } })
}

function member(id: number = 2) {
  return makeReq({ user: { id, role: 'member', collection: 'users', email: `user${id}@test.com` } })
}

function anon() {
  return makeReq({ user: null })
}

describe('admins()', () => {
  it('grants access to admins', () => {
    expect(admins({ req: admin() })).toBe(true)
  })

  it('denies access to members', () => {
    expect(admins({ req: member() })).toBe(false)
  })

  it('denies access to unauthenticated users', () => {
    expect(admins({ req: anon() })).toBe(false)
  })
})

describe('adminsOrSelf()', () => {
  it('grants admins unrestricted access (returns true)', () => {
    expect(adminsOrSelf({ req: admin() })).toBe(true)
  })

  it('grants members a where clause scoped to their own id', () => {
    const result = adminsOrSelf({ req: member(42) })
    expect(result).toEqual({ id: { equals: 42 } })
  })

  it('denies unauthenticated users', () => {
    expect(adminsOrSelf({ req: anon() })).toBe(false)
  })
})

describe('authenticated()', () => {
  it('grants access to any logged-in user', () => {
    expect(authenticated({ req: admin() })).toBe(true)
    expect(authenticated({ req: member() })).toBe(true)
  })

  it('denies access to unauthenticated users', () => {
    expect(authenticated({ req: anon() })).toBe(false)
  })
})

describe('publishedOrAdmin()', () => {
  it('grants admins unrestricted access', () => {
    expect(publishedOrAdmin({ req: admin() })).toBe(true)
  })

  it('restricts public users to published records only', () => {
    const result = publishedOrAdmin({ req: anon() })
    expect(result).toEqual({ status: { equals: 'published' } })
  })

  it('restricts members to published records only', () => {
    const result = publishedOrAdmin({ req: member() })
    expect(result).toEqual({ status: { equals: 'published' } })
  })
})
