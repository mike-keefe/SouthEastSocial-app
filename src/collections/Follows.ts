import type { CollectionConfig } from 'payload'
import { ownRecordsOnly, authenticated } from '../lib/access'

export const Follows: CollectionConfig = {
  slug: 'follows',
  admin: {
    useAsTitle: 'followType',
    defaultColumns: ['user', 'followType', 'venue', 'organiser', 'createdAt'],
    group: 'Content',
  },
  access: {
    create: authenticated,
    read: ownRecordsOnly,
    update: ownRecordsOnly,
    delete: ownRecordsOnly,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
        description: 'Set automatically to the logged-in user.',
      },
    },
    {
      name: 'followType',
      type: 'select',
      options: [
        { label: 'Venue', value: 'venue' },
        { label: 'Organiser', value: 'organiser' },
      ],
      required: true,
    },
    {
      name: 'venue',
      type: 'relationship',
      relationTo: 'venues',
      admin: {
        condition: (data) => data?.followType === 'venue',
        description: 'Required when followType is "venue".',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validate: (value: any, { siblingData }: { siblingData: any }) => {
        if (siblingData?.followType === 'venue' && !value) {
          return 'A venue is required when followType is "venue"'
        }
        return true
      },
    },
    {
      name: 'organiser',
      type: 'relationship',
      relationTo: 'organisers',
      admin: {
        condition: (data) => data?.followType === 'organiser',
        description: 'Required when followType is "organiser".',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validate: (value: any, { siblingData }: { siblingData: any }) => {
        if (siblingData?.followType === 'organiser' && !value) {
          return 'An organiser is required when followType is "organiser"'
        }
        return true
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && req.user) {
          data.user = req.user.id

          // Prevent duplicate follows for the same (user, followType, target)
          const targetField = data.followType === 'venue' ? 'venue' : 'organiser'
          const targetId = data[targetField]
          if (targetId) {
            const existing = await req.payload.find({
              collection: 'follows',
              where: {
                and: [
                  { user: { equals: req.user.id } },
                  { followType: { equals: data.followType } },
                  { [targetField]: { equals: targetId } },
                ],
              },
              limit: 1,
              overrideAccess: true,
            })
            if (existing.totalDocs > 0) {
              throw new Error('You are already following this.')
            }
          }
        }
        return data
      },
    ],
  },
}
