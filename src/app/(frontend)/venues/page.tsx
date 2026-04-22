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
    <div className="min-h-screen bg-neutral-950">
      {/* Page header */}
      <div className="border-b border-neutral-800">
        <PageWrapper>
          <div className="py-12 sm:py-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600 mb-3">
              SE London
            </p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Venues
            </h1>
            <p className="text-neutral-500 mt-3 text-sm max-w-sm">
              The pubs, studios, galleries, and arches that make SE London tick.
            </p>
          </div>
        </PageWrapper>
      </div>

      <PageWrapper>
        <div className="py-8">
          {venues.length === 0 ? (
            <div className="text-center py-28 border border-neutral-800">
              <p className="text-neutral-500 text-base font-medium">No venues listed yet</p>
              <p className="text-neutral-600 text-sm mt-2">Check back soon.</p>
            </div>
          ) : (
            <>
              <p className="text-[11px] text-neutral-700 mb-5">
                {venues.length} venue{venues.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-800">
                {(venues as Venue[]).map((venue) => (
                  <div key={venue.id} className="bg-neutral-950">
                    <VenueCard venue={venue} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="pb-16" />
      </PageWrapper>
    </div>
  )
}
