import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import { EventCard } from '@/components/EventCard'
import { FollowButton } from '@/components/FollowButton'
import { RichText } from '@/components/RichText'
import { MapEmbed } from '@/components/MapEmbed'
import type { Venue, Event, Follow, Media } from '@/payload-types'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

async function getVenue(slug: string): Promise<Venue | null> {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'venues',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    depth: 1,
    limit: 1,
  })
  return (docs[0] as Venue) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const venue = await getVenue(slug)
  if (!venue) return { title: 'Venue not found — SouthEastSocial' }
  return {
    title: `${venue.name} — SouthEastSocial`,
    description: `Events at ${venue.name}, ${venue.postcode ?? 'SE London'}.`,
  }
}

export default async function VenueProfilePage({ params }: Props) {
  const { slug } = await params
  const [venue, headers] = await Promise.all([getVenue(slug), getHeaders()])
  if (!venue) notFound()

  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const [upcomingResult, followResult] = await Promise.all([
    payload.find({
      collection: 'events',
      where: {
        and: [
          { status: { equals: 'published' } },
          { venue: { equals: venue.id } },
          { startDate: { greater_than: new Date().toISOString() } },
        ],
      },
      sort: 'startDate',
      limit: 6,
      depth: 2,
    }),
    user
      ? payload.find({
          collection: 'follows',
          where: {
            and: [
              { user: { equals: user.id } },
              { venue: { equals: venue.id } },
              { followType: { equals: 'venue' } },
            ],
          },
          limit: 1,
          overrideAccess: false,
          user,
        })
      : null,
  ])

  const upcomingEvents = upcomingResult.docs as Event[]
  const currentFollow = (followResult?.docs[0] as Follow) ?? null
  const image = typeof venue.image === 'object' ? (venue.image as Media) : null

  return (
    <div className="bg-neutral-950 min-h-screen">
      <PageWrapper>
        <div className="py-8">
          <Link
            href="/venues"
            className="text-[12px] text-neutral-600 hover:text-neutral-400 transition-colors mb-8 inline-block"
          >
            ← All venues
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              {image?.url && (
                <div className="aspect-[16/9] relative overflow-hidden mb-8 bg-neutral-900">
                  <Image
                    src={image.url}
                    alt={image.alt ?? venue.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
              )}

              <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
                  {venue.name}
                </h1>
                <FollowButton
                  type="venue"
                  targetId={String(venue.id)}
                  followId={currentFollow?.id != null ? String(currentFollow.id) : null}
                  isFollowing={!!currentFollow}
                  userId={user?.id != null ? String(user.id) : null}
                />
              </div>

              {venue.description && (
                <div className="text-neutral-300 leading-relaxed">
                  <RichText content={venue.description} />
                </div>
              )}
            </div>

            <aside className="space-y-3">
              <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-4">
                {venue.address && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-1.5">
                      Address
                    </p>
                    <p className="text-sm text-white">{venue.address}</p>
                    {venue.postcode && (
                      <p className="text-sm text-neutral-500 mt-0.5">{venue.postcode}</p>
                    )}
                  </div>
                )}
                {venue.website && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-1.5">
                      Website
                    </p>
                    <a
                      href={venue.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-400 hover:text-primary-300 break-all transition-colors"
                    >
                      {venue.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}

                {venue.postcode && (
                  <MapEmbed postcode={venue.postcode} label={venue.name} />
                )}
              </div>
            </aside>
          </div>

          {upcomingEvents.length > 0 && (
            <section className="mt-14 border-t border-neutral-800 pt-10">
              <h2 className="font-display font-bold text-xl text-white mb-6">
                Upcoming at {venue.name}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-neutral-800">
                {upcomingEvents.map((e) => (
                  <div key={e.id} className="bg-neutral-950">
                    <EventCard event={e} />
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="pb-16" />
        </div>
      </PageWrapper>
    </div>
  )
}
