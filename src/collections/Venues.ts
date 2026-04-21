import type { CollectionConfig } from 'payload'
import { admins, anyone, publishedOrAdmin } from '../lib/access'
import { slugify } from '../lib/slugify'

const SE_POSTCODE_REGEX = /^SE\d/i

export const Venues: CollectionConfig = {
  slug: 'venues',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'postcode', 'updatedAt'],
    group: 'Content',
  },
  access: {
    create: admins,
    read: publishedOrAdmin,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'name',
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
        description: 'Auto-generated from name. Can be overridden.',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'postcode',
      type: 'text',
      required: true,
      validate: (value: string | null | undefined) => {
        if (!value) return 'Postcode is required'
        if (!SE_POSTCODE_REGEX.test(value)) return 'Postcode must be an SE postcode (e.g. SE1 7PB)'
        return true
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'website',
      type: 'text',
      admin: { placeholder: 'https://...' },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create' && data && !data.slug && data.name) {
          data.slug = slugify(data.name as string)
        }
        return data
      },
    ],
  },
}
