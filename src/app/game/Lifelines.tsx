'use client'

import { useUser } from '@clerk/nextjs'
import { Eye, Search, Swords, Zap } from 'lucide-react'
import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import { ScrollArea } from '@/shadcn/ui/scroll-area'
import { ActionHistory } from './ActionHistory'

interface Lifeline {
  type: 'intel' | 'boost' | 'sabotage' | 'snitch'
  icon: React.ReactNode
  label: string
  description: string
  color: 'default' | 'red' | 'blue' | 'green'
  count: number
}

export function Lifelines({ gameSessionId }: { gameSessionId: number }) {
  const { user } = useUser()
  const [selectedLifeline, setSelectedLifeline] = useState<Lifeline['type'] | null>(null)
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)
  const [showPlayerSelect, setShowPlayerSelect] = useState(false)
  const [snitchChallenges, setSnitchChallenges] = useState<any[]>([])

  // Fetch player stats to get lifeline counts
  const { data: playerStats, refetch: refetchStats } = trpc.getPlayerStats.useQuery(
    { gameSessionId },
    { enabled: !!gameSessionId },
  )

  // Fetch leaderboard for player selection
  const { data: leaderboard } = trpc.getLeaderboard.useQuery(
    { gameSessionId },
    { enabled: !!gameSessionId },
  )

  // Mutation for using a lifeline
  const useLifeline = trpc.useLifeline.useMutation({
    onSuccess: (data) => {
      refetchStats()
      // Handle specific lifeline results
      if (selectedLifeline === 'snitch' && 'challenges' in data) {
        setSnitchChallenges(data.challenges || [])
      }
    },
  })

  // Define lifelines with their properties
  const lifelines: Lifeline[] = [
    {
      type: 'intel',
      icon: <Eye className="w-6 h-6 text-gray-100" />,
      label: 'Intel',
      description: 'View another player\'s action history',
      color: 'blue',
      count: (playerStats?.lifelines as Record<string, number>)?.intel || 0,
    },
    {
      type: 'boost',
      icon: <Zap className="w-6 h-6 text-gray-100" />,
      label: 'Boost',
      description: 'Get 20% more points on your next challenge',
      color: 'green',
      count: (playerStats?.lifelines as Record<string, number>)?.boost || 0,
    },
    {
      type: 'sabotage',
      icon: <Swords className="w-6 h-6 text-gray-100" />,
      label: 'Sabotage',
      description: 'Reduce another player\'s points by 10%',
      color: 'red',
      count: (playerStats?.lifelines as Record<string, number>)?.sabotage || 0,
    },
    {
      type: 'snitch',
      icon: <Search className="w-6 h-6 text-gray-100" />,
      label: 'Snitch',
      description: 'Reveal unsolved challenges from the leaderboard',
      color: 'default',
      count: (playerStats?.lifelines as Record<string, number>)?.snitch || 0,
    },
  ]

  const handleLifelineClick = (lifeline: Lifeline) => {
    setSelectedLifeline(lifeline.type)

    switch (lifeline.type) {
      case 'intel':
      case 'sabotage':
        setShowPlayerSelect(true)
        break

      case 'boost':
      case 'snitch':
        useLifeline.mutate({
          gameSessionId,
          lifelineType: lifeline.type,
        })
        break
    }
  }

  const handlePlayerSelect = (playerId: number) => {
    if (!selectedLifeline)
      return

    setSelectedPlayerId(playerId)
    setShowPlayerSelect(false)

    useLifeline.mutate({
      gameSessionId,
      lifelineType: selectedLifeline,
      targetUserId: playerId,
    })
  }

  // Filter out current user from player selection
  const otherPlayers = leaderboard?.filter(player => player.userId !== Number(user?.id)) || []

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Lifelines</h3>

      <div className="flex justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-100 w-fit">
          {lifelines.map(lifeline => (
            <LifelineCard
              key={lifeline.type}
              lifeline={lifeline}
              onClick={() => handleLifelineClick(lifeline)}
              isDisabled={lifeline.count <= 0}
              isLoading={useLifeline.isPending}
            />
          ))}
        </div>
      </div>

      {/* Player Selection Dialog */}
      <Dialog open={showPlayerSelect} onOpenChange={setShowPlayerSelect}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              Select a player to
              {' '}
              {selectedLifeline === 'intel' ? 'spy on' : 'sabotage'}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-64 pr-4">
            <div className="space-y-2">
              {otherPlayers.map(player => (
                <button
                  key={player.userId}
                  onClick={() => handlePlayerSelect(player.userId)}
                  className="w-full p-3 text-left rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-white flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    {player.rank}
                  </div>
                  <div>
                    <p className="font-medium">{player.username}</p>
                    <p className="text-sm text-gray-400">
                      {player.points}
                      {' '}
                      points
                    </p>
                  </div>
                </button>
              ))}

              {otherPlayers.length === 0 && (
                <p className="text-gray-400 text-center py-4">No other players found</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Intel Dialog */}
      {selectedLifeline === 'intel' && selectedPlayerId && (
        <Dialog open={!!selectedPlayerId} onOpenChange={open => !open && setSelectedPlayerId(null)}>
          <DialogContent className="max-w-2xl bg-gray-900 border-gray-800 h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-white">Player Action History</DialogTitle>
            </DialogHeader>

            <div className="flex-1 min-h-0">
              <ActionHistory
                gameSessionId={gameSessionId}
                actionGlitch={null}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Snitch Dialog */}
      {selectedLifeline === 'snitch' && snitchChallenges.length > 0 && (
        <Dialog
          open={snitchChallenges.length > 0}
          onOpenChange={open => !open && setSnitchChallenges([])}
        >
          <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-white">Challenges to Solve</DialogTitle>
              <p className="text-sm text-gray-400">These challenges have been solved by other players</p>
            </DialogHeader>

            <div className="space-y-3">
              {snitchChallenges.map(challenge => (
                <div key={challenge.id} className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white">{challenge.title}</h4>
                      <p className="text-sm text-gray-300 mt-1">{challenge.description}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      Solved by
                      {' '}
                      {challenge.solvedBy?.username || 'another player'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Boost Notification */}
      {selectedLifeline === 'boost' && useLifeline.isSuccess && (
        <div className="fixed bottom-4 right-4 p-4 bg-green-600 text-white rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <p>20% boost applied to your next challenge!</p>
          </div>
        </div>
      )}

      {/* Sabotage Notification */}
      {selectedLifeline === 'sabotage' && useLifeline.isSuccess && (
        <div className="fixed bottom-4 right-4 p-4 bg-red-600 text-white rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5" />
            <p>Successfully sabotaged the player!</p>
          </div>
        </div>
      )}
    </div>
  )
}

function LifelineCard({
  lifeline,
  onClick,
  isDisabled,
  isLoading,
}: {
  lifeline: {
    icon: React.ReactNode
    label: string
    description: string
    color: 'default' | 'red' | 'blue' | 'green'
    count: number
  }
  onClick: () => void
  isDisabled: boolean
  isLoading: boolean
}) {
  const colorClasses = {
    default: 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50',
    red: 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50',
    blue: 'border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50',
    green: 'border-green-500/30 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/50',
  }

  const color = isDisabled ? 'default' : lifeline.color

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onClick}
        disabled={isDisabled || isLoading}
        className={`
          w-full aspect-square rounded-xl p-4 flex flex-col items-center justify-center gap-2
          transition-all duration-300 border-2 ${colorClasses[color]}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          relative overflow-hidden
        `}
        title={lifeline.description}
      >
        {!isLoading
          ? (
              <>
                <div className="text-2xl">{lifeline.icon}</div>
                <span className="text-sm font-medium text-center">{lifeline.label}</span>
                {lifeline.count > 0 && (
                  <span className="absolute top-1 right-1 bg-white/10 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {lifeline.count}
                  </span>
                )}
              </>
            )
          : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
      </button>
      <p className="text-xs text-gray-400 text-center mt-1">
        {lifeline.count}
        {' '}
        left
      </p>
    </div>
  )
}
