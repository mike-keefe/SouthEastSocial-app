import { redirect } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from '@/components/PageWrapper'
import { ProfileForm } from './ProfileForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit profile — SouthEastSocial',
}

export default async function ProfilePage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) redirect('/login')

  return (
    <div className="py-10">
      <PageWrapper narrow>
        <h1 className="font-display text-3xl font-bold text-neutral-950 dark:text-white mb-2">
          Edit profile
        </h1>
        <p className="text-neutral-500 text-sm mb-8">
          This is what other members see when you submit events.
        </p>
        <ProfileForm
          userId={user.id}
          displayName={user.displayName ?? ''}
          bio={user.bio ?? ''}
          email={user.email}
        />
      </PageWrapper>
    </div>
  )
}
