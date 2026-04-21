import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import { EventCard } from '@/components/EventCard'
import type { Event } from '@/payload-types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SouthEastSocial — Events for SE London',
  description: 'Discover community events, gigs, markets, and more across South East London.',
}

async function getFeaturedEvents(): Promise<Event[]> {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'events',
    where: {
      and: [
        { status: { equals: 'published' } },
        { startDate: { greater_than: new Date().toISOString() } },
      ],
    },
    sort: 'startDate',
    limit: 6,
    depth: 2,
  })
  return docs as Event[]
}

export default async function HomePage() {
  const events = await getFeaturedEvents()

  return (
    <>
      {/* Hero */}
      <section className="bg-neutral-950 text-white py-20 sm:py-28">
        <PageWrapper>
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl sm:text-6xl font-bold leading-tight mb-6">
              What&apos;s on in{' '}
              <span className="text-primary-400">SE London</span>
            </h1>
            <p className="text-neutral-300 text-lg sm:text-xl mb-10 leading-relaxed">
              Gigs, markets, community events, and culture — all in one place.
              Find what&apos;s happening near you this week.
            </p>

            <form action="/events" method="GET" className="flex flex-col sm:flex-row gap-3">
              <input
                name="q"
                type="text"
                placeholder="Search events…"
                aria-label="Search events by keyword"
                className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
              />
              <input
                name="postcode"
                type="text"
                placeholder="Postcode (e.g. SE15)"
                aria-label="Filter by postcode"
                className="w-full sm:w-36 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
              />
              <button
                type="submit"
                className="h-12 px-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-neutral-950"
              >
                Search
              </button>
            </form>
          </div>
        </PageWrapper>
      </section>

      {/* Featured events */}
      <section className="py-16">
        <PageWrapper>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-bold text-neutral-950">Upcoming events</h2>
            <Link
              href="/events"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            >
              See all →
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-16 text-neutral-500">
              <p className="text-lg">No upcoming events yet — check back soon.</p>
              <Link href="/submit" className="mt-4 inline-block text-primary-600 font-medium hover:underline">
                Got an event? Submit it →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </PageWrapper>
      </section>

      {/* CTA strip */}
      <section className="bg-primary-50 border-t border-primary-100 py-12">
        <PageWrapper>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-neutral-950 mb-1">Running an event in SE London?</h2>
              <p className="text-neutral-600">Get it in front of thousands of local people — for free.</p>
            </div>
            <Link
              href="/submit"
              className="shrink-0 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Submit your event
            </Link>
          </div>
        </PageWrapper>
      </section>
    </>
  )
}
