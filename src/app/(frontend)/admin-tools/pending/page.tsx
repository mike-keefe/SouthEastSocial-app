import { notFound } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { PageWrapper } from '@/components/PageWrapper'
import { ApproveButton } from './ApproveButton'
import type { Event, User } from '@/payload-types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pending events — SouthEastSocial Admin' }

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function PendingEventsPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if ((user as (User & { role?: string }) | null)?.role !== 'admin') notFound()

  const { docs: pending } = await payload.find({
    collection: 'events',
    where: { status: { equals: 'pending' } },
    sort: 'createdAt',
    limit: 100,
    depth: 1,
    overrideAccess: true,
  })

  const events = pending as Event[]

  return (
    <div className="py-10">
      <PageWrapper>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white tracking-tight">
              Pending events
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              {events.length} event{events.length !== 1 ? 's' : ''} awaiting review
            </p>
          </div>
          <Link
            href="/account"
            className="text-sm text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            ← My account
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-12 text-center">
            <p className="text-neutral-500 text-sm">No pending events — all caught up.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded divide-y divide-neutral-100 dark:divide-neutral-800">
            {events.map((event) => {
              const submitter =
                typeof event.submittedBy === 'object' ? (event.submittedBy as User) : null
              return (
                <div key={event.id} className="px-5 py-4 flex items-start justify-between gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                        {event.title}
                      </p>
                      {event.startDate && (
                        <span className="text-xs text-neutral-400">
                          {formatDate(event.startDate)}
                        </span>
                      )}
                    </div>
                    {submitter && (
                      <p className="text-xs text-neutral-400 mt-1">
                        Submitted by{' '}
                        <span className="text-neutral-600 dark:text-neutral-300">
                          {submitter.displayName ?? submitter.email}
                        </span>
                        {submitter.email && submitter.displayName ? ` (${submitter.email})` : ''}
                        {event.createdAt ? ` · ${formatDate(event.createdAt)}` : ''}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {event.slug && (
                      <Link
                        href={`/events/${event.slug}`}
                        className="text-xs font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        target="_blank"
                      >
                        Preview
                      </Link>
                    )}
                    <a
                      href={`/admin/collections/events/${event.id}`}
                      className="text-xs font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      target="_blank"
                    >
                      Edit in admin
                    </a>
                    <ApproveButton eventId={event.id} eventTitle={event.title} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </PageWrapper>
    </div>
  )
}
