import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import { UnfollowButton } from './UnfollowButton'
import type { Event, Follow, Venue, Organiser } from '@/payload-types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Account — SouthEastSocial',
  description: 'Manage your submitted events and followed venues.',
}

const statusColours: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  published: 'bg-green-100 text-green-800',
  draft: 'bg-neutral-100 text-neutral-600',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AccountPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) redirect('/login')

  const [eventsResult, followsResult] = await Promise.all([
    payload.find({
      collection: 'events',
      where: { submittedBy: { equals: user.id } },
      sort: '-createdAt',
      limit: 50,
      depth: 1,
      overrideAccess: true, // user sees their own drafts/pending
    }),
    payload.find({
      collection: 'follows',
      where: { user: { equals: user.id } },
      sort: '-createdAt',
      limit: 50,
      depth: 2,
      overrideAccess: false,
      user,
    }),
  ])

  const myEvents = eventsResult.docs as Event[]
  const myFollows = followsResult.docs as Follow[]

  return (
    <div className="py-10">
      <PageWrapper>
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-display text-4xl font-bold text-neutral-950">My account</h1>
          <Link href="/account/email-preferences" className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors">
            Email preferences →
          </Link>
        </div>

        {/* Submitted events */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-bold text-neutral-800">My events</h2>
            <Link href="/submit" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
              + Submit event
            </Link>
          </div>

          {myEvents.length === 0 ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-neutral-500">
              <p className="mb-3">You haven&apos;t submitted any events yet.</p>
              <Link href="/submit" className="text-primary-600 font-medium hover:underline">Submit your first event →</Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100">
              {myEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between px-5 py-4 gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-neutral-900 truncate">{event.title}</p>
                    {event.startDate && (
                      <p className="text-sm text-neutral-500 mt-0.5">{formatDate(event.startDate)}</p>
                    )}
                  </div>
                  <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColours[event.status ?? 'draft']}`}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Follows */}
        <section>
          <h2 className="font-display text-2xl font-bold text-neutral-800 mb-5">Following</h2>

          {myFollows.length === 0 ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-neutral-500">
              <p>You&apos;re not following any venues or organisers yet.</p>
              <p className="text-sm mt-1">Follow them to get personalised weekly digests.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100">
              {myFollows.map((follow) => {
                const venue = follow.followType === 'venue' && typeof follow.venue === 'object'
                  ? (follow.venue as Venue) : null
                const organiser = follow.followType === 'organiser' && typeof follow.organiser === 'object'
                  ? (follow.organiser as Organiser) : null
                const name = venue?.name ?? organiser?.name ?? 'Unknown'
                const href = venue ? `/venues/${venue.slug}` : organiser ? `/organisers/${organiser.slug}` : '#'

                return (
                  <div key={follow.id} className="flex items-center justify-between px-5 py-4 gap-4">
                    <div>
                      <Link href={href} className="font-medium text-neutral-900 hover:text-primary-600 transition-colors">
                        {name}
                      </Link>
                      <p className="text-xs text-neutral-400 capitalize mt-0.5">{follow.followType}</p>
                    </div>
                    <UnfollowButton followId={String(follow.id)} name={name} />
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </PageWrapper>
    </div>
  )
}
