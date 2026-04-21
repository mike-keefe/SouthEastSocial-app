import type { CollectionConfig } from 'payload'
import { admins, authenticated, publishedOrAdmin } from '../lib/access'
import { slugify } from '../lib/slugify'
import { resend, FROM_EMAIL } from '../lib/email/resend'
import { EventSubmittedEmail } from '../lib/email/templates/EventSubmittedEmail'
import { EventApprovedEmail } from '../lib/email/templates/EventApprovedEmail'
import { EventAdminNotificationEmail } from '../lib/email/templates/EventAdminNotificationEmail'
import { render } from '@react-email/render'

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
        // Resolve the submitter's email and display name for both email types
        const getSubmitter = async () => {
          if (!doc.submittedBy) return null
          const userId = typeof doc.submittedBy === 'object' ? doc.submittedBy.id : doc.submittedBy
          try {
            return await req.payload.findByID({ collection: 'users', id: userId, req })
          } catch {
            return null
          }
        }

        if (operation === 'create') {
          const submitter = await getSubmitter()
          if (submitter?.email) {
            try {
              const html = await render(
                EventSubmittedEmail({ eventTitle: doc.title, displayName: submitter.displayName ?? undefined }),
              )
              await resend.emails.send({
                from: FROM_EMAIL,
                to: submitter.email,
                subject: `Your event "${doc.title}" has been submitted`,
                html,
              })
            } catch (err) {
              console.error('[Events] Failed to send EventSubmittedEmail:', err)
            }

            // Notify admin that a new event needs review
            const adminEmail = process.env.ADMIN_EMAIL
            if (adminEmail) {
              try {
                const adminHtml = await render(
                  EventAdminNotificationEmail({
                    eventTitle: doc.title,
                    eventId: String(doc.id),
                    submitterEmail: submitter.email,
                    submitterName: submitter.displayName ?? undefined,
                  }),
                )
                await resend.emails.send({
                  from: FROM_EMAIL,
                  to: adminEmail,
                  subject: `New event submission: "${doc.title}"`,
                  html: adminHtml,
                })
              } catch (err) {
                console.error('[Events] Failed to send admin notification:', err)
              }
            }
          }
        }

        const justPublished =
          operation === 'update' &&
          previousDoc?.status !== 'published' &&
          doc.status === 'published'

        if (justPublished) {
          const submitter = await getSubmitter()
          if (submitter?.email) {
            try {
              const html = await render(
                EventApprovedEmail({
                  eventTitle: doc.title,
                  eventSlug: doc.slug ?? '',
                  displayName: submitter.displayName ?? undefined,
                }),
              )
              await resend.emails.send({
                from: FROM_EMAIL,
                to: submitter.email,
                subject: `Your event "${doc.title}" is now live`,
                html,
              })
            } catch (err) {
              console.error('[Events] Failed to send EventApprovedEmail:', err)
            }
          }
        }

        return doc
      },
    ],
  },
}
