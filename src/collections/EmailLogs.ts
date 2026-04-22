import type { CollectionConfig } from 'payload'
import { admins } from '../lib/access'

export const EmailLogs: CollectionConfig = {
  slug: 'email-logs',
  admin: {
    useAsTitle: 'recipient',
    defaultColumns: ['recipient', 'type', 'status', 'createdAt'],
    group: 'Admin',
  },
  access: {
    create: () => false,
    read: admins,
    update: () => false,
    delete: admins,
  },
  fields: [
    {
      name: 'recipient',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Welcome', value: 'welcome' },
        { label: 'Event submitted', value: 'event-submitted' },
        { label: 'Event approved', value: 'event-approved' },
        { label: 'Admin notification', value: 'admin-notification' },
        { label: 'Weekly digest', value: 'digest' },
        { label: 'Test', value: 'test' },
      ],
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'errorMessage',
      type: 'text',
      admin: { readOnly: true },
    },
  ],
}
