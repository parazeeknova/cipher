'use client'

import { useUser } from '@clerk/nextjs'
import { Clock, Trophy } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Lifelines } from './Lifelines'

export function PlayerUIBar() {
  const { user } = useUser()
  const [gameSessionId, setGameSessionId] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState('--:--')

  const { data: gameSession } = trpc.getCurrentGameSession.useQuery()

  const { data: playerStats, refetch: _refetchStats } = trpc.getPlayerStats.useQuery(
    { gameSessionId: gameSessionId ?? 0 },
    { enabled: !!gameSessionId },
  )

  const { data: leaderboard } = trpc.getLeaderboard.useQuery(
    { gameSessionId: gameSessionId ?? 0 },
    { enabled: !!gameSessionId },
  )

  const updatePlayerStatsMutation = trpc.updatePlayerStats.useMutation()

  useEffect(() => {
    if (gameSession) {
      setGameSessionId(gameSession.id)
    }
  }, [gameSession])

  // Initialize player stats if they don't exist
  useEffect(() => {
    if (gameSessionId && user?.id && !playerStats) {
      updatePlayerStatsMutation.mutate({
        gameSessionId,
        points: 0,
        status: 'online',
        lifelines: { snitch: 2, sabotage: 1, boost: 1, intel: 3 } as Record<string, number>,
        currentStreak: 0,
        level: 1,
      })
    }
  }, [gameSessionId, user, playerStats, updatePlayerStatsMutation])

  // Timer effect (placeholder - you can implement actual game timer logic)
  useEffect(() => {
    const timer = setInterval(() => {
      // This is a placeholder - implement actual game timer logic
      const now = new Date()
      const minutes = now.getMinutes()
      const seconds = now.getSeconds()
      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const currentPlayer = leaderboard && playerStats && playerStats.userId
    ? leaderboard.find(player => player.userId === playerStats.userId)
    : null

  const currentRank = currentPlayer?.rank || 0
  const currentPoints = currentPlayer?.points || 0

  // Check if current player is tied with others
  const isTied = leaderboard && currentPlayer
    ? leaderboard.filter(player => player.points === currentPoints && player.userId !== currentPlayer.userId).length > 0
    : false

  const firstName = user?.firstName || ''
  const lastName = user?.lastName || ''
  const username = user?.username || ''
  const fullName = `${firstName} ${lastName}`.trim()
  const imageUrl = user?.imageUrl

  if (!gameSessionId) {
    return null // Don't render if no game session ID is available
  }

  return (
    <div className={`relative backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 shadow-2xl min-w-0 ${
      isTied && currentRank > 0 ? 'ring-1 ring-yellow-400/30 bg-yellow-500/5' : ''
    }`}
    >
      <div className="flex flex-col">
        {/* Top Row - Player Info and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          {/* Player Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center animate-pulse flex-shrink-0 overflow-hidden">
                {imageUrl
                  ? (
                      <Image
                        height={48}
                        width={48}
                        src={imageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )
                  : (
                      <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center">
                        <span className="text-white font-mono text-sm font-bold">
                          {(fullName || username || 'P').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
              </div>
              <div className="min-w-0">
                {fullName && (
                  <p className="text-white font-mono text-sm font-semibold truncate">{fullName}</p>
                )}
                {username && (
                  <p className="text-gray-300 font-mono text-xs truncate">
                    @
                    {username}
                  </p>
                )}
                <p className="text-gray-400 font-mono text-xs">
                  Level
                  {' '}
                  {playerStats?.level || 1}
                  {' '}
                  | Round
                  {' '}
                  {gameSession?.currentRound === 'round_1' ? '1' : gameSession?.currentRound === 'round_2' ? '2' : '3'}
                  {playerStats?.round2Points && playerStats.round2Points > 0 && (
                    <>
                      {' '}
                      | R2:
                      {playerStats.round2Points}
                      {' '}
                      pts
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Points */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1">
              <Trophy className={`w-4 h-4 animate-pulse ${
                isTied && currentRank > 0 ? 'text-yellow-400' : 'text-white'
              }`}
              />
              <span className={`font-mono text-lg font-bold ${
                isTied && currentRank > 0 ? 'text-yellow-300' : 'text-white'
              }`}
              >
                {(playerStats?.points || 0).toLocaleString()}
              </span>
              {isTied && currentRank > 0 && (
                <span className="text-yellow-400 text-xs animate-pulse font-bold ml-1">TIED</span>
              )}
            </div>
            <p className="text-gray-400 text-xs">POINTS</p>
          </div>

          {/* Rank */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1">
              <span className="text-white font-mono text-lg font-bold">
                #
                {currentRank || '--'}
              </span>
              {isTied && currentRank > 0 && (
                <span className="text-yellow-400 text-xs animate-pulse font-bold">T</span>
              )}
            </div>
            <p className="text-gray-400 text-xs">RANK</p>
          </div>

          {/* Timer */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-white font-mono text-lg">{timeLeft}</span>
            </div>
            <p className="text-gray-400 text-xs">TIME LEFT</p>
          </div>
        </div>

        {/* Lifelines Section */}
        <div className="border-t border-gray-800/50 pt-4">
          <Lifelines gameSessionId={gameSessionId} />
        </div>
      </div>
    </div>
  )
}
