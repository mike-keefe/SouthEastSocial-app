'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Props = {
  type: 'venue' | 'organiser'
  targetId: string
  followId?: string | null
  isFollowing: boolean
  userId: string | null
}

export function FollowButton({ type, targetId, followId, isFollowing: initialFollowing, userId }: Props) {
  const router = useRouter()
  const [following, setFollowing] = useState(initialFollowing)
  const [currentFollowId, setCurrentFollowId] = useState(followId ?? null)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (!userId) {
      router.push('/login')
      return
    }

    setLoading(true)

    try {
      if (following && currentFollowId) {
        const res = await fetch(`/api/follows/${currentFollowId}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to unfollow')
        setFollowing(false)
        setCurrentFollowId(null)
        toast.success(`Unfollowed ${type}`)
      } else {
        const body: Record<string, unknown> = {
          user: userId,
          followType: type,
        }
        if (type === 'venue') body.venue = targetId
        if (type === 'organiser') body.organiser = targetId

        const res = await fetch('/api/follows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error('Failed to follow')
        const data = await res.json()
        setFollowing(true)
        setCurrentFollowId(data.doc?.id ?? null)
        toast.success(`Now following this ${type}`)
      }

      router.refresh()
    } catch {
      toast.error(`Something went wrong. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-pressed={following}
      className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 ${
        following
          ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          : 'bg-primary-500 text-white hover:bg-primary-600'
      }`}
    >
      {loading ? 'Loading…' : following ? 'Following' : 'Follow'}
    </button>
  )
}
