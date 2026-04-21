import { Suspense } from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import { EventCard } from '@/components/EventCard'
import { EventFilters } from '@/components/EventFilters'
import type { Event, Category } from '@/payload-types'
import type { Metadata } from 'next'
import type { Where } from 'payload'

export const metadata: Metadata = {
  title: 'Events — SouthEastSocial',
  description: 'Browse all upcoming events in South East London.',
}

type SearchParams = {
  q?: string
  category?: string
  postcode?: string
  free?: string
  page?: string
}

const PAGE_SIZE = 12

async function getEvents(params: SearchParams) {
  const payload = await getPayload({ config: configPromise })

  const conditions: Where[] = [
    { status: { equals: 'published' } },
    { startDate: { greater_than: new Date().toISOString() } },
  ]

  if (params.q) conditions.push({ title: { contains: params.q } })
  if (params.category) conditions.push({ 'category.slug': { equals: params.category } })
  if (params.postcode)
    conditions.push({ postcode: { contains: params.postcode.toUpperCase() } })
  if (params.free === 'true') conditions.push({ price: { contains: 'Free' } })

  return payload.find({
    collection: 'events',
    where: { and: conditions },
    sort: 'startDate',
    limit: PAGE_SIZE,
    page: Number(params.page) || 1,
    depth: 2,
  })
}

async function getCategories(): Promise<Category[]> {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({ collection: 'categories', limit: 50 })
  return docs as Category[]
}

type Props = { searchParams: Promise<SearchParams> }

export default async function EventsPage({ searchParams }: Props) {
  const params = await searchParams
  const [{ docs: events, totalPages, page }, categories] = await Promise.all([
    getEvents(params),
    getCategories(),
  ])

  const currentPage = Number(page) || 1
  const hasFilters = !!(params.q || params.category || params.postcode || params.free)

  return (
    <>
      {/* Page header */}
      <section className="bg-neutral-950 text-white border-b border-neutral-800/60 py-12 sm:py-16">
        <PageWrapper>
          <p className="font-display text-[10px] uppercase tracking-[0.3em] text-neutral-600 mb-4">
            SE London
          </p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
            What&apos;s on
          </h1>
          {hasFilters && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-neutral-500 text-sm">Filtered results</span>
              <Link
                href="/events"
                className="text-xs text-primary-400 hover:text-primary-300 underline underline-offset-2"
              >
                Clear all
              </Link>
            </div>
          )}
        </PageWrapper>
      </section>

      <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen">
        <PageWrapper>
          {/* Filters */}
          <div className="pt-6 pb-5">
            <Suspense>
              <EventFilters categories={categories} />
            </Suspense>
          </div>

          {/* Results */}
          {(events as Event[]).length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded">
              <p className="text-neutral-500 text-base font-medium mb-2">No events found</p>
              <p className="text-neutral-400 text-sm mb-6">
                {hasFilters ? 'Try adjusting your filters.' : 'Check back soon.'}
              </p>
              {hasFilters && (
                <Link
                  href="/events"
                  className="inline-block bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-semibold px-5 py-2.5 rounded text-sm hover:opacity-90 transition-opacity"
                >
                  Clear filters
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-16">
                {(events as Event[]).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-1.5 pb-16">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const ps = new URLSearchParams()
                    if (params.q) ps.set('q', params.q)
                    if (params.category) ps.set('category', params.category)
                    if (params.postcode) ps.set('postcode', params.postcode)
                    if (params.free) ps.set('free', params.free)
                    ps.set('page', String(p))

                    return (
                      <Link
                        key={p}
                        href={`/events?${ps.toString()}`}
                        className={`w-9 h-9 flex items-center justify-center rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          p === currentPage
                            ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                            : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500'
                        }`}
                        aria-current={p === currentPage ? 'page' : undefined}
                      >
                        {p}
                      </Link>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </PageWrapper>
      </div>
    </>
  )
}
