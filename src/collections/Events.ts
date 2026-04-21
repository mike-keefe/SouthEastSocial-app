import type { CollectionConfig } from 'payload'
import { admins, authenticated, publishedOrAdmin } from '../lib/access'
import { slugify } from '../lib/slugify'

const SE_POSTCODE_REGEX = /^SE\d/i

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'startDate', 'submittedBy'],
    group: 'Content',
  },
  access: {
    create: authenticated,
    read: publishedOrAdmin,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title. Can be overridden by admins.',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Pending Review', value: 'pending' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'pending',
      required: true,
      admin: { position: 'sidebar' },
      // Members cannot change status — enforced in beforeChange hook
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'venue',
      type: 'relationship',
      relationTo: 'venues',
      admin: { position: 'sidebar' },
    },
    {
      name: 'organiser',
      type: 'relationship',
      relationTo: 'organisers',
      admin: { position: 'sidebar' },
    },
    {
      name: 'postcode',
      type: 'text',
      admin: { position: 'sidebar' },
      validate: (value: string | null | undefined) => {
        if (!value) return true // not required — venue may supply location
        if (!SE_POSTCODE_REGEX.test(value)) return 'Postcode must be an SE postcode (e.g. SE15 4NX)'
        return true
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
    },
    {
      name: 'price',
      type: 'text',
      admin: {
        placeholder: 'e.g. Free or £5–£15',
        position: 'sidebar',
      },
    },
    {
      name: 'ticketUrl',
      type: 'text',
      admin: {
        placeholder: 'https://...',
        position: 'sidebar',
      },
    },
    {
      name: 'submittedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Set automatically to the logged-in user on create.',
      },
      // Members cannot set this field — enforced in beforeChange hook
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create' && data && !data.slug && data.title) {
          data.slug = slugify(data.title as string)
        }
        return data
      },
    ],
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const isAdmin = (req.user as any)?.role === 'admin'

          // Lock status to pending for non-admins
          if (!isAdmin) {
            data.status = 'pending'
          }

          // Auto-set submittedBy to the current user
          if (req.user) {
            data.submittedBy = req.user.id
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        // Trigger EventApprovedEmail when an admin publishes an event
        const justPublished =
          operation === 'update' &&
          previousDoc?.status !== 'published' &&
          doc.status === 'published'

        if (justPublished) {
          // Email sending wired up in Phase 4.
          // Placeholder: log so we can verify the hook fires correctly.
          req.payload.logger.info(`[Events] Event published: ${doc.id} — approval email queued`)
        }

        // Trigger EventSubmittedEmail on creation
        if (operation === 'create') {
          req.payload.logger.info(`[Events] Event created: ${doc.id} — submission email queued`)
        }

        return doc
      },
    ],
  },
}
