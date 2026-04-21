import { redirect } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import { EmailPreferencesForm } from './EmailPreferencesForm'
import type { EmailSubscription } from '@/payload-types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Email Preferences — SouthEastSocial',
  description: 'Manage which emails you receive from SouthEastSocial.',
}

export default async function EmailPreferencesPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) redirect('/login')

  const { docs } = await payload.find({
    collection: 'email-subscriptions',
    where: { user: { equals: user.id } },
    limit: 1,
    overrideAccess: false,
    user,
  })

  const prefs = docs[0] as EmailSubscription | undefined

  return (
    <div className="py-10">
      <PageWrapper narrow>
        <h1 className="font-display text-4xl font-bold text-neutral-950 mb-2">Email preferences</h1>
        <p className="text-neutral-500 mb-8">Choose which emails you receive from SouthEastSocial.</p>

        {prefs ? (
          <EmailPreferencesForm prefs={prefs} />
        ) : (
          <p className="text-neutral-500">No preferences found — please contact support.</p>
        )}
      </PageWrapper>
    </div>
  )
}
