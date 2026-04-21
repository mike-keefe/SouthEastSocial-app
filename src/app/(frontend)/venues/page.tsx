import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import { VenueCard } from '@/components/VenueCard'
import type { Venue } from '@/payload-types'
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Venues — SouthEastSocial',
  description: 'Discover the venues hosting events across South East London.',
}

export default async function VenuesPage() {
  const payload = await getPayload({ config: configPromise })
  const { docs: venues } = await payload.find({
    collection: 'venues',
    where: { status: { equals: 'published' } },
    sort: 'name',
    limit: 100,
    depth: 1,
  })

  return (
    <>
      {/* Page header */}
      <section className="bg-neutral-950 text-white border-b border-neutral-800/60 py-12 sm:py-16">
        <PageWrapper>
          <p className="font-display text-[10px] uppercase tracking-[0.3em] text-neutral-600 mb-4">
            SE London
          </p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">Venues</h1>
          <p className="text-neutral-500 mt-3 text-sm max-w-md">
            The pubs, studios, galleries, and arches that make SE London tick.
          </p>
        </PageWrapper>
      </section>

      <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen py-10">
        <PageWrapper>
          {venues.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded">
              <p className="text-neutral-500 text-base font-medium">No venues listed yet</p>
              <p className="text-neutral-400 text-sm mt-2">Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(venues as Venue[]).map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </PageWrapper>
      </div>
    </>
  )
}
