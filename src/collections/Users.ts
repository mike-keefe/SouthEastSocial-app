import type { CollectionConfig } from 'payload'
import { admins, adminsOrSelf } from '../lib/access'
import { resend, FROM_EMAIL } from '../lib/email/resend'
import { WelcomeEmail } from '../lib/email/templates/WelcomeEmail'
import { render } from '@react-email/render'

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
    {
      name: 'emailPreferences',
      type: 'group',
      label: 'Email Preferences',
      admin: { description: 'Which emails this user receives.' },
      fields: [
        {
          name: 'weeklyDigest',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Receive weekly event digest emails' },
        },
        {
          name: 'eventApproved',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Receive an email when a submitted event is approved' },
        },
        {
          name: 'welcomeEmail',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Receive a welcome email on sign-up' },
        },
      ],
    },
  ],
  hooks: {
    beforeDelete: [
      async ({ id, req }) => {
        await Promise.allSettled([
          req.payload.delete({
            collection: 'follows',
            where: { user: { equals: id } },
            req,
          }),
          // Null out linkedUser on any Organiser pointing to this user
          req.payload.update({
            collection: 'organisers',
            where: { linkedUser: { equals: id } },
            data: { linkedUser: null },
            req,
          }),
        ])
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc

        try {
          const html = await render(WelcomeEmail({ displayName: doc.displayName }))
          await resend.emails.send({
            from: FROM_EMAIL,
            to: doc.email,
            subject: 'Welcome to SouthEastSocial',
            html,
          })
        } catch (err) {
          console.error('[Users] Failed to send WelcomeEmail:', err)
        }

        return doc
      },
    ],
  },
}
