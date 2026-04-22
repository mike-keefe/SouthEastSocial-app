import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://southeastsocial.com'
  const payload = await getPayload({ config: configPromise })

  const [events, venues, organisers] = await Promise.all([
    payload.find({
      collection: 'events',
      where: { status: { equals: 'published' } },
      limit: 1000,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'venues',
      where: { status: { equals: 'published' } },
      limit: 500,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'organisers',
      where: { status: { equals: 'published' } },
      limit: 500,
      select: { slug: true, updatedAt: true },
    }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, priority: 1.0, changeFrequency: 'daily' },
    { url: `${siteUrl}/events`, priority: 0.9, changeFrequency: 'hourly' },
    { url: `${siteUrl}/venues`, priority: 0.8, changeFrequency: 'daily' },
    { url: `${siteUrl}/organisers`, priority: 0.7, changeFrequency: 'daily' },
    { url: `${siteUrl}/submit`, priority: 0.6, changeFrequency: 'monthly' },
  ]

  const eventRoutes: MetadataRoute.Sitemap = events.docs.map((e) => ({
    url: `${siteUrl}/events/${e.slug}`,
    lastModified: e.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const venueRoutes: MetadataRoute.Sitemap = venues.docs.map((v) => ({
    url: `${siteUrl}/venues/${v.slug}`,
    lastModified: v.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const organiserRoutes: MetadataRoute.Sitemap = organisers.docs.map((o) => ({
    url: `${siteUrl}/organisers/${o.slug}`,
    lastModified: o.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...eventRoutes, ...venueRoutes, ...organiserRoutes]
}
