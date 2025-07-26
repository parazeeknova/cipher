'use client'

import { useUser } from '@clerk/nextjs'
import { Clock, Eye, Search, Sword, TrendingUp, Trophy, Zap } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/shadcn/ui/button'

interface LifelineButtonProps {
  icon: React.ReactNode
  count: number
  maxCount: number
  label: string
  description: string
  onClick: () => void
  disabled?: boolean
  color?: 'default' | 'red' | 'blue' | 'green'
}

function LifelineButton({ icon, count, maxCount, label, description, onClick, disabled = false, color = 'default' }: LifelineButtonProps) {
  const colorClasses = {
    default: 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50',
    red: 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50',
    blue: 'border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50',
    green: 'border-green-500/30 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/50',
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || count <= 0}
        onClick={onClick}
        className={`relative w-20 h-20 rounded-full p-0 font-mono transition-all duration-300 group ${colorClasses[color]} ${
          disabled || count <= 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title={description}
      >
        <div className="absolute inset-0 rounded-full border border-white/20 animate-pulse" />
        <div className="relative z-10 flex items-center justify-center">
          <div className="text-white group-hover:animate-pulse">
            {icon}
          </div>
        </div>
        {count > 0 && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </Button>
      <div className="text-center">
        <p className="text-white font-mono text-xs font-semibold">{label}</p>
        <p className="text-gray-400 font-mono text-xs">
          {count}
          /
          {maxCount}
        </p>
      </div>
    </div>
  )
}

export function PlayerUIBar() {
  const { user } = useUser()
  const [gameSessionId, setGameSessionId] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState('--:--')

  const { data: gameSession } = trpc.getCurrentGameSession.useQuery()

  const { data: playerStats, refetch: refetchStats } = trpc.getPlayerStats.useQuery(
    { gameSessionId: gameSessionId! },
    { enabled: !!gameSessionId },
  )

  const { data: leaderboard } = trpc.getLeaderboard.useQuery(
    { gameSessionId: gameSessionId! },
    { enabled: !!gameSessionId },
  )

  const updatePlayerStatsMutation = trpc.updatePlayerStats.useMutation()
  const useLifelineMutation = trpc.useLifeline.useMutation()
  const sendChatMessageMutation = trpc.sendChatMessage.useMutation()

  useEffect(() => {
    if (gameSession) {
      setGameSessionId(gameSession.id)
    }
  }, [gameSession])

  // Initialize player stats if they don't exist
  useEffect(() => {
    if (gameSessionId && user && !playerStats) {
      updatePlayerStatsMutation.mutate({
        gameSessionId,
        points: 0,
        status: 'online',
        lifelines: { snitch: 2, sabotage: 1, boost: 1, intel: 3 },
        currentStreak: 0,
        level: 1,
      })
    }
  }, [gameSessionId, user, playerStats])

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

  const handleLifelineUse = async (lifelineType: 'snitch' | 'sabotage' | 'boost' | 'intel') => {
    if (!gameSessionId || !playerStats || !user)
      return

    const currentLifelines = playerStats.lifelines as Record<string, number> || {}
    const currentCount = currentLifelines[lifelineType] || 0

    if (currentCount <= 0)
      return

    try {
      const _result = await useLifelineMutation.mutateAsync({
        gameSessionId,
        lifelineType,
        metadata: { usedAt: new Date().toISOString() },
      })

      const displayName = user.username || `${user.firstName} ${user.lastName}`.trim() || 'Player'
      let chatMessage = ''

      switch (lifelineType) {
        case 'snitch':
          chatMessage = `🔍 ${displayName} used SNITCH lifeline - revealing top players' secrets...`
          break
        case 'sabotage':
          chatMessage = `⚔️ ${displayName} used SABOTAGE lifeline - someone's about to lose points!`
          break
        case 'boost':
          chatMessage = `⚡ ${displayName} used BOOST lifeline - next challenge will give double points!`
          break
        case 'intel':
          chatMessage = `🧠 ${displayName} used INTEL lifeline - seeking hints for challenges...`
          break
      }

      await sendChatMessageMutation.mutateAsync({
        gameSessionId,
        message: chatMessage,
      })

      refetchStats()

      // TODO: implement the actual lifeline logic based on type
      switch (lifelineType) {
        case 'snitch':
          // TODO: Show modal with top 3 players' info
          break
        case 'sabotage':
          // TODO: Show player selection modal
          break
        case 'boost':
          // TODO: Show boost confirmation
          break
        case 'intel':
          // TODO: Show challenge selection modal
          break
      }
    }
    catch (error) {
      console.error('Failed to use lifeline:', error)
    }
  }

  const currentPlayer = leaderboard && playerStats
    ? leaderboard.find(player => player.userId === playerStats.userId)
    : null

  const currentRank = currentPlayer?.rank || 0
  const currentPoints = currentPlayer?.points || 0

  // Check if current player is tied with others
  const isTied = leaderboard
    ? leaderboard.filter(player => player.points === currentPoints).length > 1
    : false

  const lifelines = playerStats?.lifelines as Record<string, number> || {}

  const firstName = user?.firstName || ''
  const lastName = user?.lastName || ''
  const username = user?.username || ''
  const fullName = `${firstName} ${lastName}`.trim()
  const imageUrl = user?.imageUrl

  return (
    <div className={`relative backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 shadow-2xl min-w-0 ${
      isTied && currentRank > 0 ? 'ring-1 ring-yellow-400/30 bg-yellow-500/5' : ''
    }`}
    >
      {/* Player Stats Grid - Optimized for PC */}
      <div className="grid grid-cols-5 gap-6 min-w-0">
        {/* Player Info */}
        <div className="space-y-2 min-w-0">
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
            <div className="min-w-0 flex-1">
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
              </p>
            </div>
          </div>
        </div>

        {/* Points */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
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
              <span className="text-yellow-400 text-xs animate-pulse font-bold">TIED</span>
            )}
          </div>
          <p className="text-gray-400 font-mono text-xs">POINTS</p>
        </div>

        {/* Rank */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="text-white font-mono text-lg font-bold animate-pulse">
              #
              {currentRank || '--'}
              {isTied && currentRank > 0 && (
                <span className="text-yellow-400 text-sm ml-1 animate-pulse font-bold">T</span>
              )}
            </div>
          </div>
          <p className="text-gray-400 font-mono text-xs">
            {isTied && currentRank > 0 ? 'RANK (TIED)' : 'RANK'}
          </p>
        </div>

        {/* Time Left */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-4 h-4 text-white animate-pulse" />
            <span className="text-white font-mono text-lg font-bold">{timeLeft}</span>
          </div>
          <p className="text-gray-400 font-mono text-xs">TIME LEFT</p>
        </div>

        {/* Streak */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="w-4 h-4 text-white animate-pulse" />
            <span className="text-white font-mono text-lg font-bold">
              {playerStats?.currentStreak || 0}
            </span>
          </div>
          <p className="text-gray-400 font-mono text-xs">STREAK</p>
        </div>
      </div>

      {/* Lifelines Section */}
      <div className="mt-4 pt-3 border-t border-gray-800/50">
        <div className="flex items-center justify-center mb-3">
          <h3 className="text-white font-mono text-sm font-semibold">
            LIFELINES
          </h3>
        </div>

        <div className="grid grid-cols-4 gap-3 justify-items-center">
          <LifelineButton
            icon={<Eye className="w-6 h-6" />}
            count={lifelines.snitch || 0}
            maxCount={2}
            label="SNITCH"
            description="View top 3 players' current point breakdown and recent activities"
            onClick={() => handleLifelineUse('snitch')}
            color="blue"
          />

          <LifelineButton
            icon={<Sword className="w-6 h-6" />}
            count={lifelines.sabotage || 0}
            maxCount={1}
            label="SABOTAGE"
            description="Force a specific player to lose 25% of their round points"
            onClick={() => handleLifelineUse('sabotage')}
            color="red"
          />

          <LifelineButton
            icon={<TrendingUp className="w-6 h-6" />}
            count={lifelines.boost || 0}
            maxCount={1}
            label="BOOST"
            description="Double points from next completed challenge"
            onClick={() => handleLifelineUse('boost')}
            color="green"
          />

          <LifelineButton
            icon={<Search className="w-6 h-6" />}
            count={lifelines.intel || 0}
            maxCount={3}
            label="INTEL"
            description="Get a hint for any unsolved challenge"
            onClick={() => handleLifelineUse('intel')}
            color="default"
          />
        </div>
      </div>

      {/* Loading overlay */}
      {(updatePlayerStatsMutation.isPending || useLifelineMutation.isPending || sendChatMessageMutation.isPending) && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <div className="text-white font-mono text-sm animate-pulse">Processing...</div>
        </div>
      )}

    </div>
  )
}
