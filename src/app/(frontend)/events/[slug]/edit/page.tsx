import { notFound, redirect } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import { EditEventForm } from './EditEventForm'
import type { Event, Category, Venue } from '@/payload-types'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export const metadata: Metadata = { title: 'Edit event — SouthEastSocial' }

export default async function EditEventPage({ params }: Props) {
  const { slug } = await params
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) redirect('/login')

  const [eventResult, categoriesResult, venuesResult] = await Promise.all([
    payload.find({
      collection: 'events',
      where: { slug: { equals: slug } },
      depth: 1,
      limit: 1,
      overrideAccess: false,
      user,
    }),
    payload.find({ collection: 'categories', limit: 100, sort: 'name' }),
    payload.find({
      collection: 'venues',
      where: { status: { equals: 'published' } },
      limit: 500,
      sort: 'name',
    }),
  ])

  const event = eventResult.docs[0] as Event | undefined
  if (!event) notFound()

  const isAdmin = (user as { role?: string }).role === 'admin'
  const submittedById =
    typeof event.submittedBy === 'object' ? event.submittedBy?.id : event.submittedBy
  if (!isAdmin && submittedById !== user.id) notFound()

  return (
    <div className="bg-neutral-950 min-h-screen">
      <div className="border-b border-neutral-800">
        <PageWrapper narrow>
          <div className="py-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600 mb-2">
              Edit
            </p>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">Edit event</h1>
            <p className="text-neutral-500 text-sm mt-1">
              Changes go back into review unless the event is already published.
            </p>
          </div>
        </PageWrapper>
      </div>
      <PageWrapper narrow>
        <div className="py-8">
          <EditEventForm
            event={event}
            categories={categoriesResult.docs as Category[]}
            venues={venuesResult.docs as Venue[]}
          />
        </div>
        <div className="pb-16" />
      </PageWrapper>
    </div>
  )
}
