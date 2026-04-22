'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Props = { eventId: number; eventTitle: string }

export function ApproveButton({ eventId, eventTitle }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleApprove() {
    setLoading(true)
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      })
      if (!res.ok) throw new Error()
      toast.success(`"${eventTitle}" is now live`)
      router.refresh()
    } catch {
      toast.error('Could not approve event. Try again or use the admin panel.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="text-xs font-bold text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-50 px-3 py-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      {loading ? 'Approving…' : 'Approve'}
    </button>
  )
}
