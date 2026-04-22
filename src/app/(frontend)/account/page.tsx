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

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  published: 'bg-primary-500/10 text-primary-400 border border-primary-500/20',
  draft: 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
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
      overrideAccess: true,
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
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen py-10">
      <PageWrapper>
        <div className="flex items-start justify-between mb-10 gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white tracking-tight">
              {user.displayName ?? user.email}
            </h1>
            {user.displayName && (
              <p className="text-sm text-neutral-400 mt-0.5">{user.email}</p>
            )}
          </div>
          <div className="flex items-center gap-4 shrink-0 pt-1">
            <Link
              href="/account/profile"
              className="text-sm text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              Edit profile
            </Link>
            <Link
              href="/account/email-preferences"
              className="text-sm text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              Email preferences
            </Link>
          </div>
        </div>

        {/* Submitted events */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-neutral-800 dark:text-neutral-200">
              My events
            </h2>
            <Link
              href="/submit"
              className="text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors"
            >
              + Submit event
            </Link>
          </div>

          {myEvents.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-8 text-center">
              <p className="text-neutral-500 mb-3 text-sm">
                You haven&apos;t submitted any events yet.
              </p>
              <Link
                href="/submit"
                className="text-primary-500 font-medium hover:underline text-sm"
              >
                Submit your first event →
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded divide-y divide-neutral-100 dark:divide-neutral-800">
              {myEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between px-5 py-4 gap-4">
                  <div className="min-w-0 flex-1">
                    {event.slug ? (
                      <Link
                        href={`/events/${event.slug}`}
                        className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-primary-500 dark:hover:text-primary-400 transition-colors truncate block text-sm"
                      >
                        {event.title}
                      </Link>
                    ) : (
                      <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate text-sm">
                        {event.title}
                      </p>
                    )}
                    {event.startDate && (
                      <p className="text-xs text-neutral-400 mt-0.5">{formatDate(event.startDate)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {event.slug && event.status !== 'published' && (
                      <Link
                        href={`/events/${event.slug}/edit`}
                        className="text-xs font-medium text-neutral-400 hover:text-primary-500 transition-colors"
                      >
                        Edit
                      </Link>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-sm capitalize ${statusStyles[event.status ?? 'draft']}`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Follows */}
        <section>
          <h2 className="font-display text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-4">
            Following
          </h2>

          {myFollows.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-8 text-center text-neutral-500">
              <p className="text-sm">You&apos;re not following any venues or organisers yet.</p>
              <p className="text-xs mt-1 text-neutral-400">
                Follow them to get personalised weekly digests.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded divide-y divide-neutral-100 dark:divide-neutral-800">
              {myFollows.map((follow) => {
                const venue =
                  follow.followType === 'venue' && typeof follow.venue === 'object'
                    ? (follow.venue as Venue)
                    : null
                const organiser =
                  follow.followType === 'organiser' && typeof follow.organiser === 'object'
                    ? (follow.organiser as Organiser)
                    : null
                const name = venue?.name ?? organiser?.name ?? 'Unknown'
                const href = venue
                  ? `/venues/${venue.slug}`
                  : organiser
                    ? `/organisers/${organiser.slug}`
                    : '#'

                return (
                  <div key={follow.id} className="flex items-center justify-between px-5 py-4 gap-4">
                    <div>
                      <Link
                        href={href}
                        className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-primary-500 dark:hover:text-primary-400 transition-colors text-sm"
                      >
                        {name}
                      </Link>
                      <p className="text-xs text-neutral-400 capitalize mt-0.5">
                        {follow.followType}
                      </p>
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
