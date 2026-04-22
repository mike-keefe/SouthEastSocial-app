import { redirect } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import { EmailPreferencesForm } from './EmailPreferencesForm'
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

  return (
    <div className="py-10">
      <PageWrapper narrow>
        <h1 className="font-display text-4xl font-bold text-neutral-950 dark:text-white mb-2">
          Email preferences
        </h1>
        <p className="text-neutral-500 mb-8">
          Choose which emails you receive from SouthEastSocial.
        </p>
        <EmailPreferencesForm
          userId={user.id}
          weeklyDigest={user.emailPreferences?.weeklyDigest ?? true}
          eventApproved={user.emailPreferences?.eventApproved ?? true}
          welcomeEmail={user.emailPreferences?.welcomeEmail ?? true}
        />
      </PageWrapper>
    </div>
  )
}
