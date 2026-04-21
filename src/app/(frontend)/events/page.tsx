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
  description: 'Browse all upcoming events in South East London. Filter by category, postcode, date, or price.',
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
  if (params.postcode) conditions.push({ postcode: { contains: params.postcode.toUpperCase() } })
  if (params.free === 'true') conditions.push({ price: { contains: 'Free' } })

  const result = await payload.find({
    collection: 'events',
    where: { and: conditions },
    sort: 'startDate',
    limit: PAGE_SIZE,
    page: Number(params.page) || 1,
    depth: 2,
  })

  return result
}

async function getCategories(): Promise<Category[]> {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({ collection: 'categories', limit: 50 })
  return docs as Category[]
}

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function EventsPage({ searchParams }: Props) {
  const params = await searchParams
  const [{ docs: events, totalPages, page }, categories] = await Promise.all([
    getEvents(params),
    getCategories(),
  ])

  const currentPage = Number(page) || 1

  return (
    <div className="py-10">
      <PageWrapper>
        <h1 className="font-display text-4xl font-bold text-neutral-950 mb-6">Events</h1>

        <Suspense>
          <EventFilters categories={categories} />
        </Suspense>

        <div className="mt-8">
          {(events as Event[]).length === 0 ? (
            <div className="text-center py-20 text-neutral-500">
              <p className="text-lg mb-2">No events match your filters.</p>
              <Link href="/events" className="text-primary-600 hover:underline font-medium">
                Clear filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(events as Event[]).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
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
                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          p === currentPage
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-neutral-700 border border-neutral-200 hover:border-primary-300'
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
        </div>
      </PageWrapper>
    </div>
  )
}
