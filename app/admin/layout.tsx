'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin) {
      router.push('/login')
    }
  }, [isAdmin, router])

  if (!isAdmin) {
    return null
  }

  return <div>{children}</div>
}

