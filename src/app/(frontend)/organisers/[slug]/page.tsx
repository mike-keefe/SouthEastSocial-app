import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import { EventCard } from '@/components/EventCard'
import { FollowButton } from '@/components/FollowButton'
import { RichText } from '@/components/RichText'
import type { Organiser, Event, Follow, Media } from '@/payload-types'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

async function getOrganiser(slug: string): Promise<Organiser | null> {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'organisers',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    depth: 1,
    limit: 1,
  })
  return (docs[0] as Organiser) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const organiser = await getOrganiser(slug)
  if (!organiser) return { title: 'Organiser not found — SouthEastSocial' }
  return {
    title: `${organiser.name} — SouthEastSocial`,
    description: `Events by ${organiser.name} in SE London.`,
  }
}

export default async function OrganiserProfilePage({ params }: Props) {
  const { slug } = await params
  const [organiser, headers] = await Promise.all([getOrganiser(slug), getHeaders()])
  if (!organiser) notFound()

  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const [upcomingResult, followResult] = await Promise.all([
    payload.find({
      collection: 'events',
      where: {
        and: [
          { status: { equals: 'published' } },
          { organiser: { equals: organiser.id } },
          { startDate: { greater_than: new Date().toISOString() } },
        ],
      },
      sort: 'startDate',
      limit: 6,
      depth: 2,
    }),
    user
      ? payload.find({
          collection: 'follows',
          where: {
            and: [
              { user: { equals: user.id } },
              { organiser: { equals: organiser.id } },
              { followType: { equals: 'organiser' } },
            ],
          },
          limit: 1,
          overrideAccess: false,
          user,
        })
      : null,
  ])

  const upcomingEvents = upcomingResult.docs as Event[]
  const currentFollow = (followResult?.docs[0] as Follow) ?? null
  const image = typeof organiser.image === 'object' ? (organiser.image as Media) : null

  return (
    <div className="py-10">
      <PageWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {image?.url && (
              <div className="aspect-[16/9] relative rounded-xl overflow-hidden mb-8 bg-neutral-100">
                <Image src={image.url} alt={image.alt ?? organiser.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
              </div>
            )}

            <div className="flex items-start justify-between gap-4 mb-6">
              <h1 className="font-display text-4xl font-bold text-neutral-950">{organiser.name}</h1>
              <FollowButton
                type="organiser"
                targetId={String(organiser.id)}
                followId={currentFollow?.id != null ? String(currentFollow.id) : null}
                isFollowing={!!currentFollow}
                userId={user?.id != null ? String(user.id) : null}
              />
            </div>

            {organiser.bio && (
              <div className="text-neutral-700">
                <RichText content={organiser.bio} />
              </div>
            )}
          </div>

          <aside>
            {organiser.website && (
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Website</p>
                <a href={organiser.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline break-all">
                  {organiser.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </aside>
        </div>

        {upcomingEvents.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold text-neutral-950 mb-6">Events by {organiser.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          </section>
        )}
      </PageWrapper>
    </div>
  )
}
