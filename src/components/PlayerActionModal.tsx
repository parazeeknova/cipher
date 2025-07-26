'use client'

import { useUser } from '@clerk/nextjs'
import { Crown, Eye, Search, Sword, TrendingUp, Trophy, Users } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import { ScrollArea } from '@/shadcn/ui/scroll-area'

interface PlayerActionModalProps {
  isOpen: boolean
  onClose: () => void
  targetPlayer: {
    id: number
    userId: number
    username: string | null
    firstName: string | null
    lastName: string | null
    points: number
    rank: number
    status: 'online' | 'away' | 'offline'
  } | null
  gameSessionId: number
  onActionComplete: () => void
}

export function PlayerActionModal({
  isOpen,
  onClose,
  targetPlayer,
  gameSessionId,
  onActionComplete,
}: PlayerActionModalProps) {
  const { user } = useUser()
  const [selectedAction, setSelectedAction] = useState<'sabotage' | 'snitch' | 'underdog' | 'intel' | 'boost' | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const { data: currentUser } = trpc.getUser.useQuery()
  const { data: playerStats } = trpc.getPlayerStats.useQuery(
    { gameSessionId },
    { enabled: !!gameSessionId },
  )

  const { data: playerDetails } = trpc.getPlayerDetails.useQuery(
    { gameSessionId, targetUserId: targetPlayer?.userId || 0 },
    { enabled: !!targetPlayer?.userId && selectedAction === 'snitch' },
  )

  const { data: topPlayersDetails } = trpc.getTopPlayersDetails.useQuery(
    { gameSessionId },
    { enabled: selectedAction === 'snitch' },
  )

  const sabotagePlayerMutation = trpc.sabotagePlayer.useMutation()
  const sendChatMessageMutation = trpc.sendChatMessage.useMutation()
  const useLifelineMutation = trpc.useLifeline.useMutation()

  if (!targetPlayer)
    return null

  const displayName = targetPlayer.firstName && targetPlayer.lastName
    ? `${targetPlayer.firstName} ${targetPlayer.lastName}`.trim()
    : targetPlayer.username || 'Unknown Player'

  const currentUserDisplayName = user?.username || `${user?.firstName} ${user?.lastName}`.trim() || 'Player'
  const isTargetingSelf = currentUser && targetPlayer.userId === currentUser.id

  const lifelines = playerStats?.lifelines as Record<string, number> || {}

  const handleSabotage = async () => {
    if (!targetPlayer || lifelines.sabotage <= 0)
      return

    try {
      setIsConfirming(true)

      // Use the lifeline first
      await useLifelineMutation.mutateAsync({
        gameSessionId,
        lifelineType: 'sabotage',
        targetUserId: targetPlayer.userId,
        metadata: { targetName: displayName },
      })

      // Execute the sabotage
      const result = await sabotagePlayerMutation.mutateAsync({
        gameSessionId,
        targetUserId: targetPlayer.userId,
      })

      // Send chat message
      await sendChatMessageMutation.mutateAsync({
        gameSessionId,
        message: `⚔️ ${currentUserDisplayName} used SABOTAGE on ${displayName}! They lost ${result.pointsLost} points!`,
      })

      onActionComplete()
      onClose()
    }
    catch (error) {
      console.error('Sabotage failed:', error)
    }
    finally {
      setIsConfirming(false)
    }
  }

  const handleSnitch = async () => {
    if (lifelines.snitch <= 0)
      return

    try {
      setIsConfirming(true)

      await useLifelineMutation.mutateAsync({
        gameSessionId,
        lifelineType: 'snitch',
        metadata: { action: 'view_top_players' },
      })

      await sendChatMessageMutation.mutateAsync({
        gameSessionId,
        message: `🔍 ${currentUserDisplayName} used SNITCH lifeline - gathering intelligence on top players...`,
      })

      setSelectedAction('snitch')
      onActionComplete()
    }
    catch (error) {
      console.error('Snitch failed:', error)
    }
    finally {
      setIsConfirming(false)
    }
  }

  const handleIntel = async () => {
    if (lifelines.intel <= 0)
      return

    try {
      setIsConfirming(true)

      await useLifelineMutation.mutateAsync({
        gameSessionId,
        lifelineType: 'intel',
        targetUserId: targetPlayer?.userId,
        metadata: { action: 'get_hint', targetName: displayName },
      })

      await sendChatMessageMutation.mutateAsync({
        gameSessionId,
        message: isTargetingSelf
          ? `🧠 ${currentUserDisplayName} used INTEL lifeline - seeking hints for challenges...`
          : `🧠 ${currentUserDisplayName} used INTEL lifeline to help ${displayName}!`,
      })

      setSelectedAction('intel')
      onActionComplete()
      onClose()
    }
    catch (error) {
      console.error('Intel failed:', error)
    }
    finally {
      setIsConfirming(false)
    }
  }

  const handleBoost = async () => {
    if (lifelines.boost <= 0)
      return

    try {
      setIsConfirming(true)

      await useLifelineMutation.mutateAsync({
        gameSessionId,
        lifelineType: 'boost',
        targetUserId: targetPlayer?.userId,
        metadata: { action: 'double_points', targetName: displayName },
      })

      await sendChatMessageMutation.mutateAsync({
        gameSessionId,
        message: isTargetingSelf
          ? `⚡ ${currentUserDisplayName} used BOOST lifeline - next challenge will give double points!`
          : `⚡ ${currentUserDisplayName} used BOOST lifeline on ${displayName} - their next challenge will give double points!`,
      })

      onActionComplete()
      onClose()
    }
    catch (error) {
      console.error('Boost failed:', error)
    }
    finally {
      setIsConfirming(false)
    }
  }

  const renderActionSelection = () => (
    <div className="space-y-4">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
          <span className="text-white font-mono text-xl font-bold">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="text-white font-mono text-lg font-semibold">{displayName}</h3>
          {isTargetingSelf && (
            <p className="text-blue-300 font-mono text-xs mt-1">(You)</p>
          )}
        </div>
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-white" />
            <span className="text-white font-mono text-sm font-semibold">{targetPlayer.points.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-white" />
            <span className="text-white font-mono text-sm font-semibold">
              #
              {targetPlayer.rank}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${targetPlayer.status === 'online'
              ? 'bg-green-400'
              : targetPlayer.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
            }`}
            />
            <span className="text-gray-300 font-mono text-xs capitalize">{targetPlayer.status}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Sabotage - Only for others */}
        {!isTargetingSelf && (
          <Button
            variant="outline"
            disabled={lifelines.sabotage <= 0 || isConfirming}
            onClick={handleSabotage}
            className="h-16 bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 text-white font-mono justify-start p-4"
          >
            <div className="flex items-center gap-3 w-full">
              <Sword className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="font-semibold text-sm">SABOTAGE</div>
                <div className="text-xs text-gray-400 leading-tight">
                  Force them to lose 25% of their points (
                  {lifelines.sabotage}
                  /1 uses)
                </div>
              </div>
            </div>
          </Button>
        )}

        {/* Snitch - Available for all */}
        <Button
          variant="outline"
          disabled={lifelines.snitch <= 0 || isConfirming}
          onClick={handleSnitch}
          className="h-16 bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50 text-white font-mono justify-start p-4"
        >
          <div className="flex items-center gap-3 w-full">
            <Eye className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm">SNITCH</div>
              <div className="text-xs text-gray-400 leading-tight">
                View top 3 players' details and recent activities (
                {lifelines.snitch}
                /2 uses)
              </div>
            </div>
          </div>
        </Button>

        {/* Intel - Available for all */}
        <Button
          variant="outline"
          disabled={lifelines.intel <= 0 || isConfirming}
          onClick={handleIntel}
          className="h-16 bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 hover:border-purple-500/50 text-white font-mono justify-start p-4"
        >
          <div className="flex items-center gap-3 w-full">
            <Search className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm">INTEL</div>
              <div className="text-xs text-gray-400 leading-tight">
                {isTargetingSelf ? 'Get a hint for any unsolved challenge' : 'Share intel with this player'}
                {' '}
                (
                {lifelines.intel}
                /3 uses)
              </div>
            </div>
          </div>
        </Button>

        {/* Boost - Available for all */}
        <Button
          variant="outline"
          disabled={lifelines.boost <= 0 || isConfirming}
          onClick={handleBoost}
          className="h-16 bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20 hover:border-yellow-500/50 text-white font-mono justify-start p-4"
        >
          <div className="flex items-center gap-3 w-full">
            <TrendingUp className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm">BOOST</div>
              <div className="text-xs text-gray-400 leading-tight">
                {isTargetingSelf ? 'Double your next challenge points' : 'Boost their next challenge'}
                {' '}
                (
                {lifelines.boost}
                /1 uses)
              </div>
            </div>
          </div>
        </Button>

        {/* Player Info - Available for all */}
        <Button
          variant="outline"
          onClick={() => setSelectedAction('underdog')}
          className="h-16 bg-green-500/10 border-green-500/30 hover:bg-green-500/20 hover:border-green-500/50 text-white font-mono justify-start p-4"
        >
          <div className="flex items-center gap-3 w-full">
            <Eye className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm">{isTargetingSelf ? 'MY STATS' : 'PLAYER INFO'}</div>
              <div className="text-xs text-gray-400 leading-tight">
                View
                {' '}
                {isTargetingSelf ? 'your' : 'player\'s'}
                {' '}
                detailed stats and recent performance
              </div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  )

  const renderSnitchResults = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="w-5 h-5 text-blue-400" />
        <h3 className="text-white font-mono text-lg font-semibold">TOP PLAYERS INTELLIGENCE</h3>
      </div>

      <ScrollArea className="max-h-96">
        <div className="space-y-4">
          {topPlayersDetails?.map((player, index) => (
            <div key={player.userId} className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Crown className={`w-4 h-4 ${index === 0
                      ? 'text-yellow-400'
                      : index === 1 ? 'text-gray-300' : 'text-orange-400'
                    }`}
                    />
                    <span className="text-white font-mono text-sm font-semibold">
                      #
                      {index + 1}
                      {' '}
                      {player.firstName && player.lastName
                        ? `${player.firstName} ${player.lastName}`.trim()
                        : player.username || 'Unknown'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-white" />
                  <span className="text-white font-mono text-sm font-bold">
                    {player.points.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <div className="text-xs text-gray-400 font-mono">Round 1</div>
                  <div className="text-white font-mono text-sm">{player.round1Points || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 font-mono">Round 2</div>
                  <div className="text-white font-mono text-sm">{player.round2Points || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 font-mono">Round 3</div>
                  <div className="text-white font-mono text-sm">{player.round3Points || 0}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-gray-400 font-mono">Recent Activities:</div>
                {player.recentActions.map((action, actionIndex) => (
                  <div key={actionIndex} className="text-xs font-mono flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${action.result === 'success'
                      ? 'bg-green-400'
                      : action.result === 'failed' ? 'bg-red-400' : 'bg-gray-400'
                    }`}
                    />
                    <span className="text-gray-300">
                      {action.actionType.replace('_', ' ')}
                      {(action.pointsEarned ?? 0) > 0 && ` (+${action.pointsEarned ?? 0})`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Button
        onClick={() => setSelectedAction(null)}
        className="w-full bg-white/10 hover:bg-white/20 text-white font-mono"
      >
        Back to Actions
      </Button>
    </div>
  )

  const renderUnderdogInfo = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-green-400" />
        <h3 className="text-white font-mono text-lg font-semibold">PLAYER DETAILS</h3>
      </div>

      {playerDetails && (
        <div className="space-y-4">
          <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              {playerDetails.user.imageUrl
                ? (
                    <Image
                      src={playerDetails.user.imageUrl}
                      alt="Profile"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )
                : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                      <span className="text-white font-mono text-lg font-bold">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
              <div>
                <h4 className="text-white font-mono text-lg font-semibold">{displayName}</h4>
                {playerDetails.user.username && (
                  <p className="text-gray-400 font-mono text-sm">
                    @
                    {playerDetails.user.username}
                  </p>
                )}
              </div>
            </div>

            {playerDetails.stats && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-white font-mono text-xl font-bold">
                    {playerDetails.stats.points.toLocaleString()}
                  </div>
                  <div className="text-gray-400 font-mono text-xs">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-mono text-xl font-bold">
                    {playerDetails.stats.currentStreak || 0}
                  </div>
                  <div className="text-gray-400 font-mono text-xs">Current Streak</div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="text-sm text-gray-400 font-mono">Recent Activities:</div>
              {playerDetails.recentActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${action.result === 'success'
                      ? 'bg-green-400'
                      : action.result === 'failed' ? 'bg-red-400' : 'bg-gray-400'
                    }`}
                    />
                    <span className="text-gray-300">
                      {action.actionType.replace('_', ' ')}
                    </span>
                  </div>
                  {(action.pointsEarned ?? 0) > 0 && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/20">
                      +
                      {action.pointsEarned ?? 0}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={() => setSelectedAction(null)}
        className="w-full bg-white/10 hover:bg-white/20 text-white font-mono"
      >
        Back to Actions
      </Button>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-xl bg-gray-900/90 border border-gray-800/50 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white font-mono text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            {isTargetingSelf ? 'My Actions' : 'Player Actions'}
          </DialogTitle>
        </DialogHeader>

        {selectedAction === null && renderActionSelection()}
        {selectedAction === 'snitch' && renderSnitchResults()}
        {selectedAction === 'underdog' && renderUnderdogInfo()}

        {isConfirming && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="text-white font-mono text-sm animate-pulse">Processing...</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
