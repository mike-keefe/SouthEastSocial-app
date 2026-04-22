import { Suspense } from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import { EventCard } from '@/components/EventCard'
import { EventFilters } from '@/components/EventFilters'
import { SE_NEIGHBOURHOODS, getNeighbourhoodBySlug } from '@/lib/neighbourhoods'
import type { Event, Category } from '@/payload-types'
import type { Metadata } from 'next'
import type { Where } from 'payload'

export const metadata: Metadata = {
  title: 'Events — SouthEastSocial',
  description: 'Browse all upcoming events in South East London.',
}

type SearchParams = {
  q?: string
  area?: string
  category?: string
  free?: string
  page?: string
}

const PAGE_SIZE = 12

async function getPageData(params: SearchParams) {
  const payload = await getPayload({ config: configPromise })

  const conditions: Where[] = [
    { status: { equals: 'published' } },
    { startDate: { greater_than: new Date().toISOString() } },
  ]

  if (params.q)        conditions.push({ title: { contains: params.q } })
  if (params.category) conditions.push({ 'category.slug': { equals: params.category } })
  if (params.free === 'true') conditions.push({ price: { contains: 'Free' } })

  if (params.area) {
    const staticNb = getNeighbourhoodBySlug(params.area)
    if (staticNb) {
      const { docs: nbDocs } = await payload.find({
        collection: 'neighbourhoods',
        where: { slug: { equals: params.area } },
        limit: 1,
      })
      const nbId = nbDocs[0]?.id
      const areaConditions: Where[] = [
        ...(nbId ? [{ 'venue.neighbourhood': { equals: nbId } } as Where] : []),
        ...staticNb.districts.map((d) => ({ postcode: { contains: `${d} ` } } as Where)),
      ]
      conditions.push({ or: areaConditions })
    }
  }

  const [eventsResult, categoriesResult] = await Promise.all([
    payload.find({
      collection: 'events',
      where: { and: conditions },
      sort: 'startDate',
      limit: PAGE_SIZE,
      page: Number(params.page) || 1,
      depth: 2,
    }),
    payload.find({ collection: 'categories', limit: 50 }),
  ])

  return { eventsResult, categories: categoriesResult.docs as Category[] }
}

type Props = { searchParams: Promise<SearchParams> }

export default async function EventsPage({ searchParams }: Props) {
  const params = await searchParams
  const { eventsResult: { docs: events, totalPages, page }, categories } = await getPageData(params)

  const currentPage = Number(page) || 1
  const hasFilters = !!(params.q || params.area || params.category || params.free)
  const activeNeighbourhood = params.area ? getNeighbourhoodBySlug(params.area) : null

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Page header */}
      <div className="border-b border-neutral-800">
        <PageWrapper>
          <div className="py-12 sm:py-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600 mb-3">
              SE London
            </p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
              {activeNeighbourhood ? `What's on in ${activeNeighbourhood.name}` : "What's on"}
            </h1>
            {activeNeighbourhood && (
              <p className="text-neutral-500 text-sm mt-2">{activeNeighbourhood.tagline}</p>
            )}
            {hasFilters && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-neutral-500 text-sm">Filtered results</span>
                <Link
                  href="/events"
                  className="text-[11px] font-bold text-primary-400 hover:text-primary-300 uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  Clear all
                </Link>
              </div>
            )}
          </div>
        </PageWrapper>
      </div>

      <PageWrapper>
        {/* Filters */}
        <div className="border-b border-neutral-800 py-5">
          <Suspense>
            <EventFilters categories={categories} neighbourhoods={SE_NEIGHBOURHOODS} />
          </Suspense>
        </div>

        {/* Results count */}
        {hasFilters && (events as Event[]).length > 0 && (
          <p className="text-[11px] text-neutral-600 pt-4 pb-0">
            {(events as Event[]).length} result{(events as Event[]).length !== 1 ? 's' : ''}
            {totalPages > 1 ? `, page ${currentPage} of ${totalPages}` : ''}
          </p>
        )}

        {/* Results */}
        {(events as Event[]).length === 0 ? (
          <div className="text-center py-28 border border-neutral-800 mt-6">
            <p className="text-neutral-500 text-base font-medium mb-2">No events found</p>
            <p className="text-neutral-600 text-sm mb-6">
              {hasFilters ? 'Try adjusting your filters.' : 'Check back soon.'}
            </p>
            {hasFilters && (
              <Link
                href="/events"
                className="inline-block bg-primary-400 hover:bg-primary-300 text-black font-bold px-6 py-3 transition-colors text-sm"
              >
                Clear filters
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-neutral-800 mb-1">
              {(events as Event[]).map((event) => (
                <div key={event.id} className="bg-neutral-950">
                  <EventCard event={event} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-0 py-12 border-t border-neutral-800 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const ps = new URLSearchParams()
                  if (params.q)        ps.set('q', params.q)
                  if (params.area)     ps.set('area', params.area)
                  if (params.category) ps.set('category', params.category)
                  if (params.free)     ps.set('free', params.free)
                  ps.set('page', String(p))

                  return (
                    <Link
                      key={p}
                      href={`/events?${ps.toString()}`}
                      className={`w-10 h-10 flex items-center justify-center text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-inset ${
                        p === currentPage
                          ? 'bg-primary-400 text-black'
                          : 'text-neutral-500 hover:text-white hover:bg-neutral-800 border-r border-neutral-800 last:border-r-0'
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

        <div className="pb-16" />
      </PageWrapper>
    </div>
  )
}
