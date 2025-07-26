import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function requireGamemasterAPI() {
  const { userId, sessionClaims } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const publicMetadata = sessionClaims?.publicMetadata as { role?: string } | undefined
  const privateMetadata = sessionClaims?.privateMetadata as { role?: string } | undefined

  const userRole = publicMetadata?.role || privateMetadata?.role

  if (userRole !== 'gamemaster') {
    return NextResponse.json({ error: 'Forbidden - Gamemaster access required' }, { status: 403 })
  }

  return null // No error, continue
}
