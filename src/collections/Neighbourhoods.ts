import type { CollectionConfig } from 'payload'

export const Neighbourhoods: CollectionConfig = {
  slug: 'neighbourhoods',
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'postcodeDistricts', 'featured', 'sortOrder'],
    description: 'SE London areas used for filtering, search, and area landing pages.',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug for the area page, e.g. "peckham" → /areas/peckham',
      },
    },
    {
      name: 'postcodeDistricts',
      type: 'array',
      label: 'Postcode Districts',
      required: true,
      minRows: 1,
      admin: {
        description:
          'SE postcode districts this area covers, e.g. SE15. Events and venues are matched by these.',
      },
      fields: [
        {
          name: 'district',
          type: 'text',
          required: true,
          label: 'District (e.g. SE15)',
        },
      ],
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'Short one-liner shown under the area name, e.g. "Market stalls, record shops, and late nights."',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Longer area guide — shown on the area landing page.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Hero image for the area landing page.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Featured areas appear in the footer, homepage, and area filter.',
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first in lists.',
        position: 'sidebar',
      },
    },
  ],
}
