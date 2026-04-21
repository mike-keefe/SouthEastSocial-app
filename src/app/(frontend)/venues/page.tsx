import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import { VenueCard } from '@/components/VenueCard'
import type { Venue } from '@/payload-types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Venues — SouthEastSocial',
  description: 'Discover venues hosting events across South East London.',
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
    <div className="py-10">
      <PageWrapper>
        <h1 className="font-display text-4xl font-bold text-neutral-950 mb-10">Venues</h1>

        {venues.length === 0 ? (
          <p className="text-neutral-500 text-center py-16">No venues yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(venues as Venue[]).map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </PageWrapper>
    </div>
  )
}
