import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import { EventCard } from '@/components/EventCard'
import { RichText } from '@/components/RichText'
import {
  SE_NEIGHBOURHOODS,
  getNeighbourhoodBySlug,
  getNeighbourhoodByDistrict,
  isPostcodeDistrict,
} from '@/lib/neighbourhoods'
import type { Event, Venue, Neighbourhood, Media } from '@/payload-types'
import type { Metadata } from 'next'
import type { Where } from 'payload'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return SE_NEIGHBOURHOODS.map((n) => ({ slug: n.slug }))
}

async function getAreaData(slug: string) {
  const payload = await getPayload({ config: configPromise })

  const staticData = getNeighbourhoodBySlug(slug)
  if (!staticData) return null

  // Try to load richer CMS data if it's been seeded
  const { docs } = await payload.find({
    collection: 'neighbourhoods',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  const cmsRecord = (docs[0] as Neighbourhood) ?? null

  // Build area match conditions: neighbourhood relationship (primary) + postcode fallback
  const postcodeConditions: Where[] = staticData.districts.map(
    (d) => ({ postcode: { contains: `${d} ` } } as Where),
  )
  const eventAreaConditions: Where[] = [
    ...(cmsRecord ? [{ 'venue.neighbourhood': { equals: cmsRecord.id } } as Where] : []),
    ...staticData.districts.map((d) => ({ postcode: { contains: `${d} ` } } as Where)),
  ]
  const venueAreaConditions: Where[] = [
    ...(cmsRecord ? [{ neighbourhood: { equals: cmsRecord.id } } as Where] : []),
    ...postcodeConditions,
  ]

  const [eventsResult, venuesResult] = await Promise.all([
    payload.find({
      collection: 'events',
      where: {
        and: [
          { status: { equals: 'published' } },
          { startDate: { greater_than: new Date().toISOString() } },
          { or: eventAreaConditions },
        ],
      },
      sort: 'startDate',
      limit: 8,
      depth: 2,
    }),
    payload.find({
      collection: 'venues',
      where: {
        and: [
          { status: { equals: 'published' } },
          { or: venueAreaConditions },
        ],
      },
      sort: 'name',
      limit: 12,
      depth: 1,
    }),
  ])

  return {
    staticData,
    cmsRecord,
    events: eventsResult.docs as Event[],
    totalEvents: eventsResult.totalDocs,
    venues: venuesResult.docs as Venue[],
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  // Handle postcode aliases like /areas/se15 → redirect
  if (isPostcodeDistrict(slug)) {
    const match = getNeighbourhoodByDistrict(slug)
    if (match) return { title: `${match.name} — SouthEastSocial` }
  }

  const staticData = getNeighbourhoodBySlug(slug)
  if (!staticData) return { title: 'Area not found — SouthEastSocial' }

  return {
    title: `${staticData.name} — SouthEastSocial`,
    description: `${staticData.tagline} Discover upcoming events and venues in ${staticData.name}, SE London.`,
  }
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params

  // Redirect postcode aliases: /areas/SE15 → /areas/peckham
  if (isPostcodeDistrict(slug)) {
    const match = getNeighbourhoodByDistrict(slug)
    if (match) redirect(`/areas/${match.slug}`)
    notFound()
  }

  const data = await getAreaData(slug)
  if (!data) notFound()

  const { staticData, cmsRecord, events, totalEvents, venues } = data
  const heroImage = cmsRecord?.image && typeof cmsRecord.image === 'object'
    ? (cmsRecord.image as Media)
    : null

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <div className="relative border-b border-neutral-800 overflow-hidden">
        {heroImage?.url && (
          <div className="absolute inset-0">
            <Image
              src={heroImage.url}
              alt={heroImage.alt ?? staticData.name}
              fill
              className="object-cover opacity-25"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 to-neutral-950" />
          </div>
        )}
        <PageWrapper>
          <div className="relative py-14 sm:py-20">
            <div className="flex items-center gap-3 mb-6">
              <Link
                href="/areas"
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600 hover:text-neutral-400 transition-colors"
              >
                Areas
              </Link>
              <span className="text-neutral-700">/</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500">
                {staticData.districts.join(', ')}
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-3">
              {staticData.name}
            </h1>
            <p className="text-neutral-400 text-base max-w-xl">
              {cmsRecord?.tagline ?? staticData.tagline}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <Link
                href={`/events?area=${staticData.slug}`}
                className="inline-flex items-center gap-2 bg-primary-400 hover:bg-primary-300 text-black font-bold px-5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                See all events
                {totalEvents > 0 && (
                  <span className="text-black/50 font-medium">({totalEvents})</span>
                )}
              </Link>
              {venues.length > 0 && (
                <span className="text-neutral-600 text-sm">
                  {venues.length} venue{venues.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </PageWrapper>
      </div>

      <PageWrapper>
        <div className="py-10 space-y-14">

          {/* ─── CMS DESCRIPTION ──────────────────────────────────── */}
          {cmsRecord?.description && (
            <section>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-5">
                About {staticData.name}
              </p>
              <div className="prose prose-invert prose-sm max-w-2xl">
                <RichText content={cmsRecord.description} />
              </div>
            </section>
          )}

          {/* ─── UPCOMING EVENTS ──────────────────────────────────── */}
          <section>
            <div className="flex items-end justify-between border-b border-neutral-800 pb-5 mb-6">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-2">
                  Coming up
                </p>
                <h2 className="font-display font-bold text-2xl text-white">
                  Upcoming events
                </h2>
              </div>
              {totalEvents > events.length && (
                <Link
                  href={`/events?area=${staticData.slug}`}
                  className="text-[12px] font-bold text-primary-400 hover:text-primary-300 uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  See all {totalEvents}
                </Link>
              )}
            </div>

            {events.length === 0 ? (
              <div className="py-16 text-center border border-neutral-800">
                <p className="text-neutral-500 text-sm mb-2">No upcoming events in {staticData.name}</p>
                <Link
                  href="/submit"
                  className="text-[12px] font-bold text-primary-400 hover:text-primary-300 uppercase tracking-wider transition-colors"
                >
                  Submit one
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-neutral-800">
                {events.map((event) => (
                  <div key={event.id} className="bg-neutral-950">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ─── VENUES ───────────────────────────────────────────── */}
          {venues.length > 0 && (
            <section>
              <div className="border-b border-neutral-800 pb-5 mb-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-2">
                  Places
                </p>
                <h2 className="font-display font-bold text-2xl text-white">
                  Venues in {staticData.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-800">
                {venues.map((venue) => {
                  const venueImage = venue.image && typeof venue.image === 'object'
                    ? (venue.image as Media)
                    : null
                  return (
                    <Link
                      key={venue.id}
                      href={`/venues/${venue.slug}`}
                      className="group bg-neutral-950 p-5 hover:bg-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-400 flex gap-4 items-start"
                    >
                      {venueImage?.url ? (
                        <div className="relative w-14 h-14 shrink-0 overflow-hidden">
                          <Image
                            src={venueImage.url}
                            alt={venueImage.alt ?? venue.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 shrink-0 bg-neutral-800 flex items-center justify-center">
                          <span className="font-display font-bold text-neutral-600 text-lg">
                            {venue.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-white text-[14px] group-hover:text-primary-300 transition-colors truncate">
                          {venue.name}
                        </p>
                        {venue.postcode && (
                          <p className="text-[11px] text-neutral-600 mt-0.5">{venue.postcode}</p>
                        )}
                        {venue.address && (
                          <p className="text-[12px] text-neutral-500 mt-1 line-clamp-2">
                            {venue.address}
                          </p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* ─── OTHER AREAS ──────────────────────────────────────── */}
          <section>
            <div className="border-b border-neutral-800 pb-5 mb-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-2">
                Nearby
              </p>
              <h2 className="font-display font-bold text-2xl text-white">Other SE areas</h2>
            </div>
            <div className="flex flex-wrap gap-0 border border-neutral-800 divide-x divide-neutral-800">
              {SE_NEIGHBOURHOODS.filter(
                (n) => n.slug !== staticData.slug && n.featured,
              ).map((n) => (
                <Link
                  key={n.slug}
                  href={`/areas/${n.slug}`}
                  className="px-5 py-4 hover:bg-neutral-900 transition-colors text-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <p className="text-[10px] text-neutral-600 mb-0.5">{n.districts[0]}</p>
                  <p className="text-[13px] font-medium">{n.name}</p>
                </Link>
              ))}
            </div>
          </section>

        </div>
        <div className="pb-16" />
      </PageWrapper>
    </div>
  )
}
