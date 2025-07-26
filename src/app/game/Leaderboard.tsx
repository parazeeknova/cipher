'use client'

import { Crown, Trophy, User, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PlayerActionModal } from '@/components/PlayerActionModal'
import { trpc } from '@/lib/trpc/client'
import { Badge } from '@/shadcn/ui/badge'
import { ScrollArea } from '@/shadcn/ui/scroll-area'

interface LeaderboardPlayer {
  id: number
  userId: number
  points: number
  rank: number
  status: 'online' | 'away' | 'offline'
  username: string | null
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  playerStatsId: number | null
}

interface LeaderboardProps {
  playerGlitch: number | null
}

export function Leaderboard({ playerGlitch }: LeaderboardProps) {
  const [gameSessionId, setGameSessionId] = useState<number | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardPlayer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: gameSession } = trpc.getCurrentGameSession.useQuery()
  const { data: currentUser } = trpc.getUser.useQuery()

  const { data: leaderboard, refetch: refetchLeaderboard } = trpc.getLeaderboard.useQuery(
    { gameSessionId: gameSessionId! },
    { enabled: !!gameSessionId },
  )

  useEffect(() => {
    if (gameSession) {
      setGameSessionId(gameSession.id)
    }
  }, [gameSession])

  const handlePlayerClick = (player: LeaderboardPlayer) => {
    // Don't open modal if clicking on yourself
    if (currentUser && player.userId === currentUser.id) {
      return
    }

    setSelectedPlayer(player)
    setIsModalOpen(true)
  }

  const handleActionComplete = () => {
    refetchLeaderboard()
  }

  const getDisplayName = (player: LeaderboardPlayer) => {
    if (player.firstName && player.lastName) {
      return `${player.firstName} ${player.lastName}`.trim()
    }
    return player.username || 'Unknown Player'
  }

  const players = leaderboard || []
  return (
    <div className="h-full backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-white animate-pulse" />
          <h3 className="text-white font-mono text-sm font-semibold">LEADERBOARD</h3>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 animate-pulse">
            {players.length}
          </Badge>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3 px-2">
          {players.map((player, index) => {
            const isCurrentUser = currentUser && player.userId === currentUser.id
            const displayName = getDisplayName(player)

            const isTied = players.filter(p => p.points === player.points).length > 1

            return (
              <div
                key={player.id}
                onClick={() => handlePlayerClick(player)}
                className={`backdrop-blur-sm bg-white/5 rounded-xl p-3 transition-all relative ${
                  playerGlitch === index ? 'animate-pulse border-red-500/50 bg-red-500/10 border-2' : ''
                } ${
                  isCurrentUser
                    ? 'border-2 border-blue-400/80 bg-blue-500/15 shadow-lg shadow-blue-500/30 ring-1 ring-inset ring-blue-300/20'
                    : 'border border-gray-800/50 cursor-pointer hover:bg-white/10 hover:border-white/30'
                } ${
                  isTied && !isCurrentUser ? 'bg-yellow-500/5 border-yellow-500/20' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {player.rank <= 3 && (
                      <Crown
                        className={`w-4 h-4 animate-pulse ${
                          player.rank === 1
                            ? 'text-yellow-400'
                            : player.rank === 2
                              ? 'text-gray-300'
                              : 'text-orange-400'
                        }`}
                      />
                    )}
                    <span
                      className={`text-gray-300 font-mono text-sm font-semibold ${
                        playerGlitch === index ? 'animate-pulse' : ''
                      }`}
                    >
                      #
                      {player.rank}
                      {/* Show tie indicator if there are multiple players with same points */}
                      {players.filter(p => p.points === player.points).length > 1 && (
                        <span className="text-yellow-400 text-xs ml-1 animate-pulse font-bold">T</span>
                      )}
                    </span>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      player.status === 'online'
                        ? 'bg-green-400'
                        : player.status === 'away'
                          ? 'bg-yellow-400'
                          : 'bg-gray-400'
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className={`text-white font-mono text-sm font-semibold truncate ${
                      playerGlitch === index ? 'animate-pulse' : ''
                    }`}
                    >
                      {displayName}
                      {isCurrentUser && (
                        <>
                          <User className="w-3 h-3 text-blue-300 ml-1 inline animate-pulse" />
                          <span className="text-blue-300 text-xs ml-1 animate-pulse">(You)</span>
                        </>
                      )}
                    </div>
                    {player.username && (
                      <div className="text-gray-400 font-mono text-xs truncate">
                        @
                        {player.username}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <Trophy className="w-3 h-3 text-white animate-pulse" />
                    <span
                      className={`text-white font-mono text-sm font-bold ${
                        playerGlitch === index ? 'animate-pulse' : ''
                      }`}
                    >
                      {player.points.toLocaleString()}
                    </span>
                  </div>
                </div>

                {!isCurrentUser && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
                )}

                {playerGlitch === index && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array.from({ length: 5 })].map((_, i) => (
                      <div
                        key={i}
                        className="absolute h-px bg-red-500/30"
                        style={{
                          top: `${Math.floor(Math.random() * 100)}%`,
                          left: 0,
                          right: 0,
                          height: '1px',
                          opacity: Math.random() * 0.8 + 0.2,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {players.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 font-mono text-sm">No players found</p>
              <p className="text-gray-500 font-mono text-xs">Waiting for game to start...</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <PlayerActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetPlayer={selectedPlayer}
        gameSessionId={gameSessionId || 0}
        onActionComplete={handleActionComplete}
      />
    </div>
  )
}
