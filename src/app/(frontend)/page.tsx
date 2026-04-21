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

const NEIGHBOURHOODS = ['Peckham', 'Deptford', 'New Cross', 'Bermondsey', 'Camberwell', 'Lewisham']

export default async function HomePage() {
  const events = await getFeaturedEvents()

  return (
    <>
      {/* Hero */}
      <section
        className="relative bg-[#1a1614] text-white overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 20% 50%, rgba(249,80,22,0.10) 0%, #1a1614 65%)',
        }}
      >
        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: '256px 256px',
          }}
        />

        {/* Large decorative "SE" watermark */}
        <div
          className="absolute -right-4 top-1/2 -translate-y-1/2 select-none pointer-events-none"
          aria-hidden="true"
        >
          <span
            className="font-display font-bold leading-none"
            style={{
              fontSize: 'clamp(14rem, 32vw, 22rem)',
              color: 'rgba(255,255,255,0.025)',
            }}
          >
            SE
          </span>
        </div>

        {/* Top accent stripe */}
        <div className="absolute top-0 left-0 w-24 h-[3px] bg-primary-500" />

        <PageWrapper>
          <div className="relative py-24 sm:py-36 max-w-3xl">
            {/* Eyebrow */}
            <p className="text-primary-500 text-xs font-bold tracking-[0.22em] uppercase mb-8">
              SE London &nbsp;·&nbsp; Events &amp; Culture
            </p>

            {/* Heading */}
            <h1 className="font-display font-bold leading-[0.95] mb-8">
              <span
                className="block text-white"
                style={{ fontSize: 'clamp(3.2rem, 9vw, 6.5rem)' }}
              >
                What&apos;s on
              </span>
              <span
                className="block text-primary-500 italic"
                style={{ fontSize: 'clamp(3.2rem, 9vw, 6.5rem)' }}
              >
                near you.
              </span>
            </h1>

            <p className="text-neutral-400 text-base sm:text-lg max-w-lg leading-relaxed mb-12">
              Gigs, markets, community events, and culture — all in one place. From Peckham to
              Bermondsey, find what&apos;s happening this week.
            </p>

            {/* Search */}
            <form action="/events" method="GET" className="max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  name="q"
                  type="text"
                  placeholder="Search events, venues…"
                  aria-label="Search events by keyword"
                  className="flex-1 h-12 px-5 bg-white/[0.07] border border-white/[0.12] rounded-xl text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
                <input
                  name="postcode"
                  type="text"
                  placeholder="SE postcode"
                  aria-label="Filter by postcode"
                  className="w-full sm:w-36 h-12 px-5 bg-white/[0.07] border border-white/[0.12] rounded-xl text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
                <button
                  type="submit"
                  className="h-12 px-7 bg-primary-500 hover:bg-primary-400 text-white font-bold text-sm rounded-xl transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-[#1a1614]"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Neighbourhood pills */}
            <div className="mt-10 flex items-center flex-wrap gap-2">
              <span className="text-neutral-600 text-xs uppercase tracking-widest mr-1">
                Browse
              </span>
              {NEIGHBOURHOODS.map((n) => (
                <Link
                  key={n}
                  href={`/events?postcode=${encodeURIComponent(n)}`}
                  className="text-xs text-neutral-500 hover:text-white border border-neutral-800 hover:border-neutral-600 px-3 py-1 rounded-full transition-colors"
                >
                  {n}
                </Link>
              ))}
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Featured events */}
      <section className="py-16 sm:py-20">
        <PageWrapper>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary-600 text-xs font-bold tracking-[0.2em] uppercase mb-2">
                Coming up
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-950">
                Upcoming events
              </h2>
            </div>
            <Link
              href="/events"
              className="text-sm font-semibold text-neutral-600 hover:text-neutral-950 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded pb-1"
            >
              See all →
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400">
              <p className="text-lg mb-3 font-medium">No upcoming events yet</p>
              <p className="text-sm mb-6 text-neutral-400">Be the first to list something.</p>
              <Link
                href="/submit"
                className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                Submit an event →
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
      <section className="bg-[#1a1614] text-white py-14 sm:py-16">
        <PageWrapper>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-primary-500 text-xs font-bold tracking-[0.2em] uppercase mb-3">
                List your event
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">
                Running something in SE London?
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base">
                Get it in front of your community — free, always.
              </p>
            </div>
            <Link
              href="/submit"
              className="shrink-0 bg-primary-500 hover:bg-primary-400 text-white font-bold px-8 py-3.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-[#1a1614] whitespace-nowrap"
            >
              Submit your event
            </Link>
          </div>
        </PageWrapper>
      </section>
    </>
  )
}
