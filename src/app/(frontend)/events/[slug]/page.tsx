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
    limit: 3,
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

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const [event, related] = await Promise.all([
    getEvent(slug, user as User | null),
    // related events fetched after we know the event exists — sequential is fine
    Promise.resolve(null as Event[] | null),
  ])
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
    <div className="py-10">
      <PageWrapper>
        {/* Draft/pending banner */}
        {isUnpublished && (
          <div className="mb-6 flex items-center justify-between gap-4 bg-amber-500/10 border border-amber-500/30 rounded px-4 py-3">
            <p className="text-sm text-amber-400 font-medium capitalize">
              This event is {event.status} — only you and admins can see it.
            </p>
            {canEdit && event.slug && (
              <Link
                href={`/events/${event.slug}/edit`}
                className="text-sm font-semibold text-amber-400 hover:text-amber-300 shrink-0"
              >
                Edit event →
              </Link>
            )}
          </div>
        )}

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-neutral-500 mb-6 flex items-center justify-between">
          <div>
            <Link href="/events" className="hover:text-neutral-800 transition-colors">
              Events
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-neutral-800 dark:text-neutral-200">{event.title}</span>
          </div>
          {canEdit && !isUnpublished && event.slug && (
            <Link
              href={`/events/${event.slug}/edit`}
              className="text-sm font-medium text-neutral-400 hover:text-primary-500 transition-colors"
            >
              Edit
            </Link>
          )}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            {image?.url && (
              <div className="aspect-[16/9] relative rounded overflow-hidden mb-8 bg-neutral-100">
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

            <h1 className="font-display text-4xl sm:text-5xl font-bold text-neutral-950 dark:text-white mb-6 leading-tight">
              {event.title}
            </h1>

            <div className="prose-like text-neutral-700 dark:text-neutral-300">
              <RichText content={event.description} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800 p-6 space-y-5">
              {event.startDate && (
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Date &amp; Time
                  </p>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
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
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Location
                  </p>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {venue ? `${venue.name}` : ''}
                    {venue && event.postcode ? ', ' : ''}
                    {event.postcode}
                  </p>
                  {venue?.address && (
                    <p className="text-xs text-neutral-500 mt-0.5">{venue.address}</p>
                  )}
                </div>
              )}

              {event.price && (
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Price
                  </p>
                  <p className="text-sm font-medium text-primary-600">{event.price}</p>
                </div>
              )}

              {event.ticketUrl && (
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Get tickets →
                </a>
              )}
            </div>

            {venue && (
              <div className="bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800 p-6">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                  Venue
                </p>
                <Link
                  href={`/venues/${venue.slug}`}
                  className="font-semibold text-neutral-950 dark:text-white hover:text-primary-600 transition-colors"
                >
                  {venue.name}
                </Link>
                {venue.postcode && (
                  <p className="text-sm text-neutral-500 mt-0.5">{venue.postcode}</p>
                )}
              </div>
            )}

            {organiser && (
              <div className="bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800 p-6">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                  Organiser
                </p>
                <Link
                  href={`/organisers/${organiser.slug}`}
                  className="font-semibold text-neutral-950 dark:text-white hover:text-primary-600 transition-colors"
                >
                  {organiser.name}
                </Link>
              </div>
            )}
          </aside>
        </div>

        {/* Related events */}
        {relatedEvents.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold text-neutral-950 dark:text-white mb-6">
              More {category?.name ?? ''} events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}
      </PageWrapper>
    </div>
  )
}
