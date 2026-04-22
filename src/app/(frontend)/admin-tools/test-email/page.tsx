import { notFound } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { PageWrapper } from '@/components/PageWrapper'
import { TestEmailForm } from './TestEmailForm'
import type { User } from '@/payload-types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Test email — SouthEastSocial Admin' }

export default async function TestEmailPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if ((user as (User & { role?: string }) | null)?.role !== 'admin') notFound()

  return (
    <div className="bg-neutral-950 min-h-screen">
      <div className="border-b border-neutral-800">
        <PageWrapper>
          <div className="py-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600 mb-2">
                Admin
              </p>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
                Send test email
              </h1>
              <p className="text-neutral-500 text-sm mt-1">
                Fire any email template with sample data to verify it renders correctly.
              </p>
            </div>
            <Link
              href="/account"
              className="text-[12px] text-neutral-600 hover:text-neutral-400 transition-colors pt-1"
            >
              ← Account
            </Link>
          </div>
        </PageWrapper>
      </div>
      <PageWrapper>
        <div className="py-8">
          <TestEmailForm defaultRecipient={user?.email ?? ''} />
        </div>
      </PageWrapper>
    </div>
  )
}
