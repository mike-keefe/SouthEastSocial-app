import type { CollectionConfig } from 'payload'
import { admins, ownRecordsOnly } from '../lib/access'

export const EmailSubscriptions: CollectionConfig = {
  slug: 'email-subscriptions',
  admin: {
    useAsTitle: 'user',
    defaultColumns: ['user', 'weeklyDigest', 'eventApproved', 'createdAt'],
    group: 'Admin',
    description: 'One record per user, auto-created on registration.',
  },
  access: {
    create: admins, // Only created programmatically via Users hook
    read: ownRecordsOnly,
    update: ownRecordsOnly,
    delete: admins,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },
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
}
