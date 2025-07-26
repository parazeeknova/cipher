import { requireGamemaster } from '@/lib/auth'
import { GamemasterClient } from './gamemaster-client'

export default async function GamemasterDashboard() {
  // Server-side protection - this will redirect if not gamemaster
  await requireGamemaster()

  return <GamemasterClient />
}
