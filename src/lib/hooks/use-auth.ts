'use client'

import { useUser } from '@clerk/nextjs'

export function useGamemaster() {
  const { user } = useUser()

  // On client-side, we can only access publicMetadata
  const publicMetadata = user?.publicMetadata as { role?: string } | undefined
  const userRole = publicMetadata?.role
  const isGamemaster = userRole === 'gamemaster'

  return {
    isGamemaster,
    userRole,
    user,
  }
}

export function useUserRole() {
  const { user } = useUser()

  // On client-side, we can only access publicMetadata
  const publicMetadata = user?.publicMetadata as { role?: string } | undefined
  return publicMetadata?.role || 'player'
}
