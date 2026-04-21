import { redirect } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SubmitEventForm } from './SubmitEventForm'
import { PageWrapper } from '@/components/PageWrapper'
import type { Category, Venue } from '@/payload-types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Submit an Event — SouthEastSocial',
  description: 'List your SE London event for free on SouthEastSocial.',
}

export default async function SubmitPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) redirect('/login')

  const [{ docs: categories }, { docs: venues }] = await Promise.all([
    payload.find({ collection: 'categories', limit: 50 }),
    payload.find({ collection: 'venues', where: { status: { equals: 'published' } }, limit: 100 }),
  ])

  return (
    <div className="py-10">
      <PageWrapper narrow>
        <h1 className="font-display text-4xl font-bold text-neutral-950 mb-2">Submit an event</h1>
        <p className="text-neutral-500 mb-8">
          All submissions are reviewed before going live. You&apos;ll receive an email when your event is approved.
        </p>
        <SubmitEventForm categories={categories as Category[]} venues={venues as Venue[]} />
      </PageWrapper>
    </div>
  )
}
