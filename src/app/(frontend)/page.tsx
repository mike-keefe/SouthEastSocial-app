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

async function getUpcomingEvents(): Promise<Event[]> {
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
    limit: 8,
    depth: 2,
  })
  return docs as Event[]
}

const NEIGHBOURHOODS = [
  { label: 'Peckham',    postcode: 'SE15' },
  { label: 'Deptford',   postcode: 'SE8'  },
  { label: 'New Cross',  postcode: 'SE14' },
  { label: 'Bermondsey', postcode: 'SE1'  },
  { label: 'Camberwell', postcode: 'SE5'  },
  { label: 'Lewisham',   postcode: 'SE13' },
]

function formatTickerDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()
}

export default async function HomePage() {
  const events = await getUpcomingEvents()

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative bg-neutral-950 overflow-hidden">
        {/* Ruled-line background */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(255,255,255,0.025) 47px, rgba(255,255,255,0.025) 48px)',
          }}
        />

        <PageWrapper>
          <div className="relative pt-16 pb-0 sm:pt-20 lg:pt-24">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-5 h-px bg-primary-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500">
                SE London &mdash; Community Events
              </span>
            </div>

            {/* Headline — fills container width */}
            <h1 className="font-display font-bold leading-[0.88] mb-10">
              <span
                className="block text-white"
                style={{ fontSize: 'clamp(3.8rem, 12.5vw, 9rem)' }}
              >
                What&apos;s
              </span>
              <span
                className="block text-primary-400"
                style={{ fontSize: 'clamp(3.8rem, 12.5vw, 9rem)' }}
              >
                on.
              </span>
            </h1>

            {/* Rule + descriptor */}
            <div className="border-t border-neutral-800 pt-6 mb-8 max-w-xl">
              <p className="text-neutral-400 text-[13px] leading-relaxed">
                Gigs, markets, community nights, talks, and culture — from Peckham to Bermondsey.
              </p>
            </div>

            {/* Search form */}
            <form action="/events" method="GET" className="max-w-xl mb-8">
              <div className="flex flex-col sm:flex-row gap-0 border border-neutral-700 focus-within:border-primary-400 transition-colors">
                <input
                  name="q"
                  type="text"
                  placeholder="Search events or venues"
                  aria-label="Search events by keyword"
                  className="flex-1 h-12 px-4 bg-neutral-900 text-white placeholder:text-neutral-600 text-sm focus:outline-none border-b sm:border-b-0 sm:border-r border-neutral-700"
                />
                <input
                  name="postcode"
                  type="text"
                  placeholder="Postcode"
                  aria-label="Filter by SE postcode"
                  className="w-full sm:w-28 h-12 px-4 bg-neutral-900 text-white placeholder:text-neutral-600 text-sm focus:outline-none uppercase"
                />
                <button
                  type="submit"
                  className="h-12 px-6 bg-primary-400 hover:bg-primary-300 text-black font-bold text-sm transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-inset shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Neighbourhood row */}
            <div className="flex items-center flex-wrap gap-x-0 gap-y-0 pb-16 -mx-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 px-1 mr-2">
                Areas
              </span>
              {NEIGHBOURHOODS.map(({ label, postcode }) => (
                <Link
                  key={label}
                  href={`/events?postcode=${encodeURIComponent(postcode)}`}
                  className="text-[12px] text-neutral-500 hover:text-white hover:bg-neutral-800 px-3 py-1.5 transition-colors border-l border-neutral-800 first-of-type:border-l-0 focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* ─── TICKER ───────────────────────────────────────────────── */}
      {events.length > 0 && (
        <div className="bg-primary-400 overflow-hidden py-2.5 border-y border-primary-300/30">
          <div className="flex whitespace-nowrap animate-marquee" aria-hidden="true">
            {[...events, ...events].map((event, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-4 mx-10 text-[12px] font-bold text-black font-display uppercase tracking-wide"
              >
                <span className="text-black/30">◆</span>
                <span>{event.title}</span>
                <span className="text-black/50 font-medium text-[10px]">
                  {formatTickerDate(event.startDate)}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ─── UPCOMING EVENTS ──────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-neutral-950">
        <PageWrapper>
          <div className="flex items-end justify-between mb-8 border-b border-neutral-800 pb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600 mb-2">
                Coming up
              </p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
                Upcoming events
              </h2>
            </div>
            <Link
              href="/events"
              className="text-[12px] font-bold text-primary-400 hover:text-primary-300 uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              See all
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-24 border border-neutral-800 text-neutral-500">
              <p className="text-base font-medium mb-3">No upcoming events yet</p>
              <p className="text-sm text-neutral-600 mb-6">Be the first to list something.</p>
              <Link
                href="/submit"
                className="inline-block bg-primary-400 hover:bg-primary-300 text-black font-bold px-6 py-3 transition-colors text-sm"
              >
                Submit an event
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
        </PageWrapper>
      </section>

      {/* ─── BROWSE BY AREA ───────────────────────────────────────── */}
      <section className="border-t border-neutral-800 py-16 sm:py-20 bg-neutral-950">
        <PageWrapper>
          <div className="border-b border-neutral-800 pb-5 mb-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600 mb-2">
              Explore
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Browse by area
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-neutral-800 border-x border-b border-neutral-800">
            {NEIGHBOURHOODS.map(({ label, postcode }) => (
              <Link
                key={label}
                href={`/events?postcode=${encodeURIComponent(postcode)}`}
                className="group p-6 sm:p-8 hover:bg-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-400"
              >
                <p className="font-display font-bold text-2xl sm:text-3xl text-neutral-700 group-hover:text-primary-400 transition-colors mb-1 tabular-nums">
                  {postcode}
                </p>
                <p className="text-[13px] font-medium text-neutral-400 group-hover:text-white transition-colors">
                  {label}
                </p>
              </Link>
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-primary-400 py-16 sm:py-20">
        <PageWrapper>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/50 mb-3">
                Running something?
              </p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-black leading-tight">
                List your event<br />in SE London
              </h2>
              <p className="text-black/60 text-sm mt-3">
                Free, always. Seen by your community.
              </p>
            </div>
            <Link
              href="/submit"
              className="shrink-0 bg-black hover:bg-neutral-900 text-primary-400 font-bold px-8 py-4 transition-colors focus:outline-none focus:ring-2 focus:ring-black text-sm tracking-wide uppercase"
            >
              Submit your event
            </Link>
          </div>
        </PageWrapper>
      </section>
    </>
  )
}
