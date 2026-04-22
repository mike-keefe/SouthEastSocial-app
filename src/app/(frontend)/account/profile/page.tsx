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
    <div className="bg-neutral-950 min-h-screen">
      <div className="border-b border-neutral-800">
        <PageWrapper narrow>
          <div className="py-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600 mb-2">
              Account
            </p>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">Edit profile</h1>
            <p className="text-neutral-500 text-sm mt-1">
              This is what other members see when you submit events.
            </p>
          </div>
        </PageWrapper>
      </div>
      <PageWrapper narrow>
        <div className="py-8">
          <ProfileForm
            userId={user.id}
            displayName={user.displayName ?? ''}
            bio={user.bio ?? ''}
            email={user.email}
          />
        </div>
        <div className="pb-16" />
      </PageWrapper>
    </div>
  )
}
