'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  className?: string
  children?: React.ReactNode
}

export function LogoutButton({ className, children }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await fetch('/api/users/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <button onClick={handleLogout} disabled={loading} className={className}>
      {loading ? 'Logging out…' : (children ?? 'Log out')}
    </button>
  )
}
