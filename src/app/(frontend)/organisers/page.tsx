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
    <div className="bg-neutral-950 min-h-screen">
      <div className="border-b border-neutral-800">
        <PageWrapper>
          <div className="py-12 sm:py-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600 mb-3">
              SE London
            </p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">Organisers</h1>
            <p className="text-neutral-500 mt-3 text-sm max-w-sm">
              The people and collectives putting on events across SE London.
            </p>
          </div>
        </PageWrapper>
      </div>

      <PageWrapper>
        <div className="py-8">
          {organisers.length === 0 ? (
            <div className="text-center py-28 border border-neutral-800">
              <p className="text-neutral-500 text-base font-medium">No organisers listed yet</p>
              <p className="text-neutral-600 text-sm mt-2">Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-800">
              {(organisers as Organiser[]).map((organiser) => {
                const image = typeof organiser.image === 'object' ? (organiser.image as Media) : null
                return (
                  <Link
                    key={organiser.id}
                    href={`/organisers/${organiser.slug}`}
                    className="group flex items-center gap-4 bg-neutral-950 p-5 hover:bg-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-400"
                  >
                    <div className="w-11 h-11 overflow-hidden bg-neutral-800 shrink-0">
                      {image?.url ? (
                        <Image
                          src={image.url}
                          alt={image.alt ?? organiser.name}
                          width={44}
                          height={44}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-500 font-display font-bold text-base bg-neutral-800">
                          {organiser.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm group-hover:text-primary-400 transition-colors truncate">
                        {organiser.name}
                      </p>
                      {organiser.website && (
                        <p className="text-xs text-neutral-600 truncate mt-0.5">
                          {organiser.website.replace(/^https?:\/\//, '')}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
        <div className="pb-16" />
      </PageWrapper>
    </div>
  )
}
