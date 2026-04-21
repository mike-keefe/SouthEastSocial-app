import type { CollectionConfig } from 'payload'
import { admins, adminsOrSelf } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'displayName', 'role', 'createdAt'],
    group: 'Admin',
  },
  access: {
    create: () => true, // public registration
    read: adminsOrSelf,
    update: adminsOrSelf,
    delete: admins,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    admin: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Member', value: 'member' },
      ],
      defaultValue: 'member',
      required: true,
      // Saves role into JWT so access control functions can read it without a DB lookup
      saveToJWT: true,
      access: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        update: ({ req: { user } }) => (user as any)?.role === 'admin',
      },
    },
    {
      name: 'displayName',
      type: 'text',
      admin: { placeholder: 'Your public name' },
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc

        // Auto-create an EmailSubscriptions record for every new user.
        // Wrapped in try/catch so a failure doesn't break registration.
        try {
          await req.payload.create({
            collection: 'email-subscriptions',
            data: { user: doc.id },
            req,
          })
        } catch (err) {
          console.error('[Users] Failed to create EmailSubscriptions record:', err)
        }

        return doc
      },
    ],
  },
}
