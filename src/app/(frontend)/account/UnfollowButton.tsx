'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Props = {
  followId: string
  name: string
}

export function UnfollowButton({ followId, name }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleUnfollow() {
    setLoading(true)
    try {
      const res = await fetch(`/api/follows/${followId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success(`Unfollowed ${name}`)
      router.refresh()
    } catch {
      toast.error('Could not unfollow. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUnfollow}
      disabled={loading}
      className="text-xs text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
    >
      {loading ? 'Unfollowing…' : 'Unfollow'}
    </button>
  )
}
