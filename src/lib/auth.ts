import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

async function getUserRole() {
  const user = await currentUser()
  const publicMetadata = user?.publicMetadata as { role?: string } | undefined
  const privateMetadata = user?.privateMetadata as { role?: string } | undefined

  return publicMetadata?.role || privateMetadata?.role
}

export async function requireGamemaster() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  const userRole = await getUserRole()

  if (userRole !== 'gamemaster') {
    redirect('/game')
  }

  return { userId, userRole }
}

export async function isGamemaster() {
  const userRole = await getUserRole()
  return userRole === 'gamemaster'
}

export async function getUserRoleFromAuth() {
  return await getUserRole() || 'player'
}
