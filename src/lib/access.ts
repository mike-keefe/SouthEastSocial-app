import type { Access } from 'payload'

// Payload doesn't ship a roles system — role is stored on the user document
// and saved to the JWT via saveToJWT: true on the Users role field.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAdmin = (user: any) => user?.role === 'admin'

export const anyone: Access = () => true

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const admins: Access = ({ req: { user } }) => isAdmin(user)

/** Admins see all; public sees only published records. */
export const publishedOrAdmin: Access = ({ req: { user } }) => {
  if (isAdmin(user)) return true
  return { status: { equals: 'published' } }
}

/** Admins can update any record; members can only update their own. */
export const adminsOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdmin(user)) return true
  return { id: { equals: user.id } }
}

/** User can only access records where the `user` field equals their own id. */
export const ownRecordsOnly: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdmin(user)) return true
  return { user: { equals: user.id } }
}
