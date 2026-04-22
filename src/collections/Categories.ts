import type { CollectionConfig } from 'payload'
import { admins, anyone } from '../lib/access'
import { slugify } from '../lib/slugify'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'colour'],
    group: 'Content',
  },
  access: {
    create: admins,
    read: anyone,
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
      name: 'colour',
      type: 'text',
      admin: {
        description: 'Hex colour used for UI badges (e.g. #6366f1)',
        placeholder: '#6366f1',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        if (/^#[0-9a-fA-F]{3,6}$/.test(value)) return true
        return 'Must be a valid hex colour (e.g. #6366f1 or #fff)'
      },
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
