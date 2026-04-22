import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import type { Organiser, Media } from '@/payload-types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Organisers — SouthEastSocial',
  description: 'Discover the people and collectives putting on events across SE London.',
}

export default async function OrganisersPage() {
  const payload = await getPayload({ config: configPromise })
  const { docs: organisers } = await payload.find({
    collection: 'organisers',
    where: { status: { equals: 'published' } },
    sort: 'name',
    limit: 100,
    depth: 1,
  })

  return (
    <div className="py-10">
      <PageWrapper>
        <div className="mb-10">
          <h1 className="font-display font-bold text-neutral-950 dark:text-white leading-tight mb-2"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Organisers
          </h1>
          <p className="text-neutral-500 text-sm">
            The people and collectives putting on events across SE London.
          </p>
        </div>

        {organisers.length === 0 ? (
          <p className="text-neutral-500 text-sm">No organisers listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(organisers as Organiser[]).map((organiser) => {
              const image = typeof organiser.image === 'object' ? (organiser.image as Media) : null
              return (
                <Link
                  key={organiser.id}
                  href={`/organisers/${organiser.slug}`}
                  className="group flex items-center gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-5 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <div className="w-12 h-12 rounded-sm overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                    {image?.url ? (
                      <Image
                        src={image.url}
                        alt={image.alt ?? organiser.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 font-display font-bold text-lg">
                        {organiser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-neutral-950 dark:text-white text-sm group-hover:text-primary-600 transition-colors truncate">
                      {organiser.name}
                    </p>
                    {organiser.website && (
                      <p className="text-xs text-neutral-400 truncate mt-0.5">
                        {organiser.website.replace(/^https?:\/\//, '')}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </PageWrapper>
    </div>
  )
}
