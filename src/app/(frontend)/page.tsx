import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import { EventCard } from '@/components/EventCard'
import type { Event } from '@/payload-types'
import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://southeastsocial.com'

export const metadata: Metadata = {
  title: 'SouthEastSocial — Events for SE London',
  description: 'Discover community events, gigs, markets, and more across South East London.',
  openGraph: {
    title: 'SouthEastSocial — Events for SE London',
    description: 'Discover community events, gigs, markets, and more across South East London.',
    url: siteUrl,
    siteName: 'SouthEastSocial',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export const revalidate = 300

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

const NEIGHBOURHOODS: { label: string; postcode: string }[] = [
  { label: 'Peckham', postcode: 'SE15' },
  { label: 'Deptford', postcode: 'SE8' },
  { label: 'New Cross', postcode: 'SE14' },
  { label: 'Bermondsey', postcode: 'SE1' },
  { label: 'Camberwell', postcode: 'SE5' },
  { label: 'Lewisham', postcode: 'SE13' },
]

export default async function HomePage() {
  const events = await getFeaturedEvents()

  return (
    <>
      {/* Hero */}
      <section className="relative bg-neutral-950 text-white overflow-hidden">
        {/* Dot-grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Vignette — fades dot grid toward edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 30%, #09090b 100%)',
          }}
        />

        <PageWrapper>
          <div className="relative py-16 sm:py-24 lg:py-28">
            {/* Eyebrow */}
            <p className="font-display text-[10px] font-medium tracking-[0.35em] uppercase text-neutral-600 mb-10">
              SE London&nbsp; //&nbsp; Community Events
            </p>

            {/* Stacked headline in Geist Mono */}
            <h1
              className="font-display font-bold leading-[0.87] mb-10"
            >
              <span
                className="block text-white"
                style={{ fontSize: 'clamp(3.2rem, 9.5vw, 7rem)' }}
              >
                What&apos;s
              </span>
              <span
                className="block text-primary-400"
                style={{ fontSize: 'clamp(3.2rem, 9.5vw, 7rem)' }}
              >
                on —
              </span>
              <span
                className="block text-neutral-600"
                style={{ fontSize: 'clamp(1.9rem, 5.5vw, 4.2rem)' }}
              >
                SE London.
              </span>
            </h1>

            {/* Divider + tagline */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-8 bg-primary-500 shrink-0" />
              <p className="text-neutral-400 text-sm">
                Gigs, markets, community nights, and culture — from Peckham to Bermondsey.
              </p>
            </div>

            {/* Search form */}
            <form action="/events" method="GET" className="max-w-xl mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  name="q"
                  type="text"
                  placeholder="Search events, venues…"
                  aria-label="Search events by keyword"
                  className="flex-1 h-11 px-4 bg-neutral-900 border border-neutral-700 rounded text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <input
                  name="postcode"
                  type="text"
                  placeholder="SE postcode"
                  aria-label="Filter by SE postcode"
                  className="w-full sm:w-32 h-11 px-4 bg-neutral-900 border border-neutral-700 rounded text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all uppercase"
                />
                <button
                  type="submit"
                  className="h-11 px-6 bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm rounded transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Neighbourhood chips */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-neutral-700 text-[10px] uppercase tracking-[0.22em] font-bold mr-1">
                Browse
              </span>
              {NEIGHBOURHOODS.map(({ label, postcode }) => (
                <Link
                  key={label}
                  href={`/events?postcode=${encodeURIComponent(postcode)}`}
                  className="text-xs text-neutral-500 hover:text-white border border-neutral-800 hover:border-neutral-600 px-2.5 py-1 rounded transition-all hover:bg-neutral-900"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Featured events */}
      <section className="py-14 sm:py-16 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800">
        <PageWrapper>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-display text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-2">
                Coming up
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white">
                Upcoming events
              </h2>
            </div>
            <Link
              href="/events"
              className="text-sm font-medium text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-sm"
            >
              See all →
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded text-neutral-400">
              <p className="text-base mb-3 font-medium">No upcoming events yet</p>
              <p className="text-sm mb-6">Be the first to list something.</p>
              <Link
                href="/submit"
                className="inline-block bg-primary-600 hover:bg-primary-500 text-white font-semibold px-5 py-2.5 rounded transition-colors text-sm"
              >
                Submit an event →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </PageWrapper>
      </section>

      {/* CTA strip */}
      <section className="bg-neutral-950 text-white border-t border-neutral-800/60 py-14 sm:py-16">
        <PageWrapper>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-display text-[10px] uppercase tracking-widest text-primary-500 mb-3">
                List your event
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-bold mb-2">
                Running something in SE London?
              </h2>
              <p className="text-neutral-400 text-sm">
                Get it in front of your community — free, always.
              </p>
            </div>
            <Link
              href="/submit"
              className="shrink-0 bg-primary-600 hover:bg-primary-500 text-white font-bold px-6 py-3 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950 text-sm whitespace-nowrap"
            >
              Submit your event
            </Link>
          </div>
        </PageWrapper>
      </section>
    </>
  )
}
