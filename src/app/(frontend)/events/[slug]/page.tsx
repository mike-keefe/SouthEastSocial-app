import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import { CategoryPill } from '@/components/CategoryPill'
import { EventCard } from '@/components/EventCard'
import { RichText } from '@/components/RichText'
import { formatEventDateTime } from '@/lib/dates'
import { MapEmbed } from '@/components/MapEmbed'
import type { Event, Category, Venue, Organiser, Media, User } from '@/payload-types'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

async function getEvent(slug: string, user: User | null): Promise<Event | null> {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    depth: 3,
    limit: 1,
    overrideAccess: false,
    user: user ?? undefined,
  })
  return (docs[0] as Event) ?? null
}

async function getRelatedEvents(event: Event): Promise<Event[]> {
  if (!event.category) return []
  const payload = await getPayload({ config: configPromise })
  const categoryId = typeof event.category === 'object' ? event.category.id : event.category
  const { docs } = await payload.find({
    collection: 'events',
    where: {
      and: [
        { status: { equals: 'published' } },
        { 'category.id': { equals: categoryId } },
        { id: { not_equals: event.id } },
        { startDate: { greater_than: new Date().toISOString() } },
      ],
    },
    sort: 'startDate',
    limit: 4,
    depth: 2,
  })
  return docs as Event[]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug, null)
  if (!event) return { title: 'Event not found — SouthEastSocial' }
  return {
    title: `${event.title} — SouthEastSocial`,
    description: `${event.title} in ${event.postcode ?? 'SE London'}. ${event.price ? `${event.price}.` : ''}`,
  }
}

const formatDateTime = formatEventDateTime

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const event = await getEvent(slug, user as User | null)
  if (!event) notFound()

  const relatedEvents = await getRelatedEvents(event)

  const category = typeof event.category === 'object' ? (event.category as Category) : null
  const venue = typeof event.venue === 'object' ? (event.venue as Venue) : null
  const organiser = typeof event.organiser === 'object' ? (event.organiser as Organiser) : null
  const image = typeof event.image === 'object' ? (event.image as Media) : null

  const isAdmin = (user as (User & { role?: string }) | null)?.role === 'admin'
  const submittedById =
    typeof event.submittedBy === 'object' ? event.submittedBy?.id : event.submittedBy
  const canEdit = isAdmin || (user && submittedById === user.id)
  const isUnpublished = event.status !== 'published'

  return (
    <div className="bg-neutral-950 min-h-screen">
      <PageWrapper>
        <div className="py-8">
          {/* Draft/pending banner */}
          {isUnpublished && (
            <div className="mb-6 flex items-center justify-between gap-4 bg-amber-400/10 border border-amber-400/25 px-4 py-3">
              <p className="text-sm text-amber-400 font-medium capitalize">
                This event is {event.status} — only you and admins can see it.
              </p>
              {canEdit && event.slug && (
                <Link
                  href={`/events/${event.slug}/edit`}
                  className="text-sm font-bold text-amber-400 hover:text-amber-300 shrink-0"
                >
                  Edit
                </Link>
              )}
            </div>
          )}

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-[12px] text-neutral-600">
              <Link href="/events" className="hover:text-neutral-400 transition-colors">
                Events
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-neutral-400 truncate max-w-xs">{event.title}</span>
            </div>
            {canEdit && !isUnpublished && event.slug && (
              <Link
                href={`/events/${event.slug}/edit`}
                className="text-[11px] font-bold text-neutral-600 hover:text-primary-400 uppercase tracking-wider transition-colors"
              >
                Edit
              </Link>
            )}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2">
              {image?.url && (
                <div className="aspect-[16/9] relative overflow-hidden mb-8 bg-neutral-900">
                  <Image
                    src={image.url}
                    alt={image.alt ?? event.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
              )}

              {category && (
                <div className="mb-4">
                  <CategoryPill name={category.name} colour={category.colour} size="md" />
                </div>
              )}

              <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-6 leading-tight">
                {event.title}
              </h1>

              <div className="text-neutral-300 leading-relaxed">
                <RichText content={event.description} />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-3">
              <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-5">
                {event.startDate && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-1.5">
                      Date &amp; time
                    </p>
                    <p className="text-sm font-medium text-white">
                      {formatDateTime(event.startDate)}
                    </p>
                    {event.endDate && (
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Until {formatDateTime(event.endDate)}
                      </p>
                    )}
                  </div>
                )}

                {(event.postcode || venue) && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-1.5">
                      Location
                    </p>
                    <p className="text-sm font-medium text-white">
                      {venue?.name ?? ''}
                      {venue && event.postcode ? ', ' : ''}
                      {event.postcode}
                    </p>
                    {venue?.address && (
                      <p className="text-xs text-neutral-500 mt-0.5">{venue.address}</p>
                    )}
                  </div>
                )}

                {(event.postcode || venue?.postcode) && (
                  <MapEmbed
                    postcode={(event.postcode ?? venue?.postcode) as string}
                    label={venue?.name}
                  />
                )}

                {event.price && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-1.5">
                      Price
                    </p>
                    <p className="text-sm font-medium text-primary-400">{event.price}</p>
                  </div>
                )}

                {event.ticketUrl && (
                  <a
                    href={event.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-primary-400 hover:bg-primary-300 text-black font-bold py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    Get tickets
                  </a>
                )}
              </div>

              {venue && (
                <div className="bg-neutral-900 border border-neutral-800 p-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-2">
                    Venue
                  </p>
                  <Link
                    href={`/venues/${venue.slug}`}
                    className="font-semibold text-white hover:text-primary-400 transition-colors text-sm"
                  >
                    {venue.name}
                  </Link>
                  {venue.postcode && (
                    <p className="text-xs text-neutral-500 mt-0.5">{venue.postcode}</p>
                  )}
                </div>
              )}

              {organiser && (
                <div className="bg-neutral-900 border border-neutral-800 p-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-2">
                    Organiser
                  </p>
                  <Link
                    href={`/organisers/${organiser.slug}`}
                    className="font-semibold text-white hover:text-primary-400 transition-colors text-sm"
                  >
                    {organiser.name}
                  </Link>
                </div>
              )}
            </aside>
          </div>

          {/* Related events */}
          {relatedEvents.length > 0 && (
            <section className="mt-16 border-t border-neutral-800 pt-12">
              <h2 className="font-display font-bold text-xl text-white mb-6">
                More {category?.name ?? ''} events
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-neutral-800">
                {relatedEvents.map((e) => (
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
