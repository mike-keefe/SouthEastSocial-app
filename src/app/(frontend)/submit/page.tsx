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
    <div className="bg-neutral-950 min-h-screen">
      <div className="border-b border-neutral-800">
        <PageWrapper narrow>
          <div className="py-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600 mb-2">
              SouthEastSocial
            </p>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">Submit an event</h1>
            <p className="text-neutral-500 text-sm mt-1">
              Free, always. We&apos;ll review it before it goes live.
            </p>
          </div>
        </PageWrapper>
      </div>
      <PageWrapper narrow>
        <div className="py-8">
          <SubmitEventForm categories={categories as Category[]} venues={venues as Venue[]} />
        </div>
        <div className="pb-16" />
      </PageWrapper>
    </div>
  )
}
