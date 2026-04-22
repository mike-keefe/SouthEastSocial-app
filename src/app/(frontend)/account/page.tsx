import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import { UnfollowButton } from './UnfollowButton'
import { formatEventDateShort } from '@/lib/dates'
import type { Event, Follow, Venue, Organiser } from '@/payload-types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Account — SouthEastSocial',
  description: 'Manage your submitted events and followed venues.',
}

const statusConfig: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Pending',   cls: 'text-amber-400 border border-amber-400/25' },
  published: { label: 'Published', cls: 'text-primary-400 border border-primary-400/25' },
  draft:     { label: 'Draft',     cls: 'text-neutral-400 border border-neutral-700' },
}

const formatDate = formatEventDateShort

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
    <div className="bg-neutral-950 min-h-screen">
      <div className="border-b border-neutral-800">
        <PageWrapper>
          <div className="py-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600 mb-2">
                Account
              </p>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
                {user.displayName ?? user.email}
              </h1>
              {user.displayName && (
                <p className="text-sm text-neutral-600 mt-0.5">{user.email}</p>
              )}
            </div>
            <div className="flex items-center gap-4 shrink-0 pt-1">
              <Link
                href="/account/profile"
                className="text-[12px] text-neutral-500 hover:text-white transition-colors"
              >
                Edit profile
              </Link>
              <Link
                href="/account/email-preferences"
                className="text-[12px] text-neutral-500 hover:text-white transition-colors"
              >
                Email preferences
              </Link>
            </div>
          </div>
        </PageWrapper>
      </div>

      <PageWrapper>
        <div className="py-8 space-y-10">
          {/* Submitted events */}
          <section>
            <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-4">
              <h2 className="font-display font-bold text-base text-white">
                My events
              </h2>
              <Link
                href="/submit"
                className="text-[11px] font-bold text-primary-400 hover:text-primary-300 uppercase tracking-wider transition-colors"
              >
                + Submit
              </Link>
            </div>

            {myEvents.length === 0 ? (
              <div className="border border-neutral-800 p-8 text-center">
                <p className="text-neutral-500 text-sm mb-3">
                  You haven&apos;t submitted any events yet.
                </p>
                <Link
                  href="/submit"
                  className="text-primary-400 hover:text-primary-300 font-medium text-sm transition-colors"
                >
                  Submit your first event
                </Link>
              </div>
            ) : (
              <div className="border border-neutral-800 divide-y divide-neutral-800">
                {myEvents.map((event) => {
                  const sc = statusConfig[event.status ?? 'draft']
                  return (
                    <div key={event.id} className="flex items-center justify-between px-5 py-4 gap-4">
                      <div className="min-w-0 flex-1">
                        {event.slug ? (
                          <Link
                            href={`/events/${event.slug}`}
                            className="font-medium text-white hover:text-primary-400 transition-colors truncate block text-sm"
                          >
                            {event.title}
                          </Link>
                        ) : (
                          <p className="font-medium text-white truncate text-sm">{event.title}</p>
                        )}
                        {event.startDate && (
                          <p className="text-xs text-neutral-600 mt-0.5">{formatDate(event.startDate)}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {event.slug && event.status !== 'published' && (
                          <Link
                            href={`/events/${event.slug}/edit`}
                            className="text-[11px] font-medium text-neutral-600 hover:text-primary-400 transition-colors"
                          >
                            Edit
                          </Link>
                        )}
                        <span className={`text-[9px] font-bold px-2 py-0.5 capitalize ${sc.cls}`}>
                          {sc.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Follows */}
          <section>
            <h2 className="font-display font-bold text-base text-white mb-4 border-b border-neutral-800 pb-4">
              Following
            </h2>

            {myFollows.length === 0 ? (
              <div className="border border-neutral-800 p-8 text-center">
                <p className="text-neutral-500 text-sm">
                  You&apos;re not following any venues or organisers yet.
                </p>
                <p className="text-xs mt-1 text-neutral-600">
                  Follow them to get personalised weekly digests.
                </p>
              </div>
            ) : (
              <div className="border border-neutral-800 divide-y divide-neutral-800">
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
                          className="font-medium text-white hover:text-primary-400 transition-colors text-sm"
                        >
                          {name}
                        </Link>
                        <p className="text-xs text-neutral-600 capitalize mt-0.5">
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
        </div>
        <div className="pb-16" />
      </PageWrapper>
    </div>
  )
}
