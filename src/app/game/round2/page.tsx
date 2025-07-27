'use client'

import { ArrowRight, CheckCircle2, DollarSign, Gavel, Gift, Loader2, Package, Sparkles, Trophy, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { trpc } from '@/lib/trpc/client'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/ui/card'
import { Input } from '@/shadcn/ui/input'
import { Label } from '@/shadcn/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select'

export default function Round2Page() {
  const [localGlitch, setLocalGlitch] = useState(false)
  const [directorGlow, setDirectorGlow] = useState(false)
  const [cardGlitches, setCardGlitches] = useState<number[]>([])
  const [selectedGames, setSelectedGames] = useState<string[]>([])
  const [bidAmount, setBidAmount] = useState(10)
  const [targetPlayerId, setTargetPlayerId] = useState<number | null>(null)
  const [selectedBox, setSelectedBox] = useState<number | null>(null)
  const [glitchEffect, setGlitchEffect] = useState('')

  // Enhanced glitch effects with more variety
  useEffect(() => {
    const glitchEffects = ['glitch-1', 'glitch-2', 'glitch-3']

    const glitchInterval = setInterval(() => {
      setLocalGlitch(true)
      setGlitchEffect(glitchEffects[Math.floor(Math.random() * glitchEffects.length)])
      setTimeout(() => setLocalGlitch(false), 50 + Math.random() * 150)
    }, 3000 + Math.random() * 4000)

    const directorGlowInterval = setInterval(() => {
      setDirectorGlow(true)
      setTimeout(() => setDirectorGlow(false), 200 + Math.random() * 300)
    }, 2500 + Math.random() * 3000)

    const cardGlitchInterval = setInterval(() => {
      const numGlitches = Math.floor(Math.random() * 3) + 1
      const glitchIndexes = Array.from(
        { length: numGlitches },
        () => Math.floor(Math.random() * 3),
      )
      setCardGlitches(glitchIndexes)
      setTimeout(() => setCardGlitches([]), 100 + Math.random() * 150)
    }, 2000 + Math.random() * 3000)

    return () => {
      clearInterval(glitchInterval)
      clearInterval(directorGlowInterval)
      clearInterval(cardGlitchInterval)
    }
  }, [])

  // TRPC queries and mutations
  const { data: gameSession, isLoading: _sessionLoading } = trpc.getCurrentGameSession.useQuery()
  const gameSessionId = gameSession?.id || 1

  const { data: currentUser, isLoading: _userLoading } = trpc.getUser.useQuery()
  const { data: round1Winner, isLoading: _winnerLoading } = trpc.games.getRound1Winner.useQuery({ gameSessionId })
  const { data: directorSelectedGames } = trpc.games.getDirectorSelectedGames.useQuery({ gameSessionId })
  const { data: allPlayers } = trpc.games.getAllPlayers.useQuery({ gameSessionId })
  const { data: curseAuctionStatus } = trpc.games.getCurseAuctionStatus.useQuery({ gameSessionId })
  const { data: gameProgress, refetch: refetchGameProgress } = trpc.games.getGameProgressRound2.useQuery({ gameSessionId })

  const directorSelectGamesMutation = trpc.games.directorSelectGames.useMutation()
  const curseDistributionMutation = trpc.games.curseDistributionGame.useMutation()
  const pandorasBoxMutation = trpc.games.pandorasBoxGame.useMutation({
    onSuccess: () => {
      refetchGameProgress()
    },
  })
  const equiBlessingMutation = trpc.games.equiBlessingGame.useMutation()

  const isDirector = round1Winner?.winnerId === currentUser?.id

  const handleGameSelection = async () => {
    if (selectedGames.length !== 2) {
      toast.error('Invalid selection', {
        description: 'Please select exactly 2 games',
      })
      return
    }

    try {
      await directorSelectGamesMutation.mutateAsync({
        gameSessionId,
        selectedGames: selectedGames as ('curse_distribution' | 'pandoras_box' | 'equi_blessing')[],
      })
      toast.success('Games selected successfully!', {
        description: `Selected ${selectedGames.join(' and ')} for this round.`,
      })
    }
    catch (error: any) {
      console.error('Game selection error:', error)
      const errorMessage = error?.message || 'Failed to select games'
      const errorDetails = error?.data?.message || 'Please try again later.'

      toast.error(errorMessage, {
        description: errorDetails,
        duration: 5000,
      })
    }
  }

  const handleCurseBid = async () => {
    if (!targetPlayerId || bidAmount < 10) {
      toast.error('Invalid bid', {
        description: 'Please select a target and enter a valid bid amount (minimum 10 points)',
      })
      return
    }

    try {
      const targetPlayer = allPlayers?.find(p => p.userId === targetPlayerId)
      await curseDistributionMutation.mutateAsync({
        gameSessionId,
        bidAmount,
        targetPlayerId,
      })
      toast.success('Bid placed!', {
        description: `You've bid ${bidAmount} points on ${targetPlayer?.username || 'the target'}`,
      })
      setBidAmount(10)
      setTargetPlayerId(null)
    }
    catch (error: any) {
      console.error('Bid error:', error)
      // Check if this is a TRPC error with a message
      const errorMessage = error?.message || 'Failed to place bid'
      const errorDetails = error?.data?.message || 'Please try again later.'

      toast.error(errorMessage, {
        description: errorDetails,
        duration: 5000,
      })
    }
  }

  const handlePandorasBox = async (boxNumber: number) => {
    try {
      const result = await pandorasBoxMutation.mutateAsync({
        gameSessionId,
        selectedBox: boxNumber,
      })

      // Show a more detailed success message
      toast.success('Pandora\'s Box opened!', {
        description: result.message || `You've opened box ${boxNumber}`,
        duration: 5000,
      })

      setSelectedBox(boxNumber)
    }
    catch (error: any) {
      console.error('Pandora\'s Box error:', error)
      const errorMessage = error?.message || 'Failed to open Pandora\'s Box'
      const errorDetails = error?.data?.message || (error instanceof Error ? error.message : 'An error occurred')

      toast.error(errorMessage, {
        description: errorDetails,
        duration: 5000,
      })
    }
  }

  const handleEquiBlessing = async () => {
    try {
      const result = await equiBlessingMutation.mutateAsync({ gameSessionId })
      toast.success('Equi Blessing Activated!', {
        description: result.message || 'All players have received +10 points!',
        duration: 5000,
      })
    }
    catch (error: any) {
      console.error('Equi Blessing error:', error)
      const errorMessage = error?.message || 'Failed to activate Equi Blessing'
      const errorDetails = error?.data?.message || 'Please try again later.'

      toast.error(errorMessage, {
        description: errorDetails,
        duration: 5000,
      })
    }
  }

  const availableGames = [
    {
      id: 'curse_distribution',
      title: 'Community Curse Distribution',
      subtitle: 'Auction System',
      description: 'Bid points to curse another player. Highest bidder removes 60 points from target.',
      icon: <Gavel className="w-6 h-6" />,
      color: 'border-red-500/50 bg-red-500/10',
      glowColor: 'shadow-red-500/20',
    },
    {
      id: 'pandoras_box',
      title: 'Pandora\'s Box',
      subtitle: 'Risk & Reward',
      description: 'Choose a box for random points. Director has different odds than other players.',
      icon: <Package className="w-6 h-6" />,
      color: 'border-purple-500/50 bg-purple-500/10',
      glowColor: 'shadow-purple-500/20',
    },
    {
      id: 'equi_blessing',
      title: 'Equi Blessing',
      subtitle: 'Universal Benefit',
      description: 'Activate to give +10 points to ALL players. Creates point inflation.',
      icon: <Gift className="w-6 h-6" />,
      color: 'border-green-500/50 bg-green-500/10',
      glowColor: 'shadow-green-500/20',
    },
  ]

  // Participant status component
  const ParticipantStatus = () => {
    if (!gameProgress?.participants?.length)
      return null

    return (
      <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-mono text-purple-300">PARTICIPANT STATUS</CardTitle>
          <CardDescription className="text-gray-400">
            {gameProgress.curseBidsCount}
            {' '}
            /
            {gameProgress.maxCurseBids}
            {' '}
            bids placed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {gameProgress.participants.map(participant => (
              <div
                key={participant.userId}
                className={`p-3 rounded-lg border ${
                  participant.userId === currentUser?.id
                    ? 'border-yellow-400/50 bg-yellow-400/10'
                    : 'border-gray-700/50 bg-gray-800/30'
                }`}
              >
                <div className="font-medium text-gray-200 truncate">
                  {participant.username}
                  {participant.userId === currentUser?.id && (
                    <span className="ml-2 text-xs text-yellow-400">(You)</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">
                    {participant.points}
                    {' '}
                    pts
                  </span>
                  <div className="flex items-center space-x-1">
                    {participant.pandoraBoxSelected
                      ? (
                          <span className="text-xs text-green-400 flex items-center">
                            <Package className="w-3 h-3 mr-1" />
                            {' '}
                            Box
                          </span>
                        )
                      : (
                          <span className="text-xs text-red-400">No Box</span>
                        )}
                    {participant.curseBidPlaced && (
                      <span className="text-xs text-purple-400 flex items-center">
                        <Gavel className="w-3 h-3 mr-1" />
                        {' '}
                        Bid
                      </span>
                    )}
                    {participant.blessingActivated && (
                      <span className="text-xs text-blue-400 flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {' '}
                        Blessing
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-200 p-4 md:p-8 relative overflow-hidden ${localGlitch ? glitchEffect : ''}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {[...Array.from({ length: 20 })].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse ${5 + Math.random() * 10}s infinite alternate`,
              opacity: 0.1 + Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      {/* Glitch Lines */}
      <div className="absolute inset-0 opacity-5" suppressHydrationWarning>
        {localGlitch && (
          <>
            {[...Array.from({ length: 20 })].map((_, i) => (
              <div
                key={i}
                className="absolute h-px bg-purple-500 animate-pulse"
                style={{
                  top: `${Math.floor(Math.random() * 100)}%`,
                  left: 0,
                  right: 0,
                  height: `${Math.random() * 2}px`,
                  opacity: Math.random() * 0.8 + 0.2,
                  transform: `translateY(${Math.random() * 10 - 5}px) skewX(${Math.random() * 4 - 2}deg)`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-10" suppressHydrationWarning>
        {[...Array.from({ length: 6 })].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-pulse"
            style={{
              top: `${(i + 1) * 16.66}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="mb-2">
            <h1 className={`text-3xl md:text-5xl font-mono font-bold text-white mb-2 relative inline-block ${localGlitch ? 'glitch-effect-1' : ''}`}>
              <span className="relative z-10 italic">DIRECTOR'S GAME</span>
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                DIRECTOR'S GAME
              </span>
            </h1>
            <div className="h-0.5 w-20 mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent my-3"></div>
            <p className="text-sm text-gray-400 font-mono tracking-widest">ROUND 2</p>
          </div>

          {round1Winner && (
            <div className={`mt-6 inline-block px-6 py-2 rounded-full border ${isDirector ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-purple-500/30 bg-purple-500/10'} transition-all duration-300 group`}>
              <div className="flex items-center justify-center gap-2">
                <Trophy className={`w-4 h-4 ${isDirector ? 'text-yellow-400' : 'text-purple-400'}`} />
                <span className="text-sm text-gray-200 font-mono tracking-wide">
                  <span className={`${isDirector ? 'text-yellow-300' : 'text-purple-300'} font-medium`}>
                    {round1Winner.winnerName}
                  </span>
                  {isDirector && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-200 border border-yellow-500/30">
                      YOU
                    </span>
                  )}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {round1Winner.winnerPoints}
                {' '}
                points in Round 1
              </div>
            </div>
          )}

          {/* Subtle glitch effect lines */}
          <div className="absolute -z-10 inset-0 opacity-30 pointer-events-none">
            {[...Array.from({ length: 3 })].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                style={{
                  top: `${20 + (i * 20)}%`,
                  transform: `translateY(${Math.sin(Date.now() / 1000 + i) * 2}px)`,
                  opacity: 0.5 + (Math.sin(Date.now() / 1000 + i) + 1) * 0.25,
                }}
              />
            ))}
          </div>
        </div>

        {/* Director's Game Selection Panel */}
        {isDirector && !directorSelectedGames?.selectedGames && (
          <Card className={`mb-8 backdrop-blur-sm bg-yellow-500/10 border-yellow-500/50 ${directorGlow ? 'shadow-2xl shadow-yellow-500/20' : ''} transition-all duration-300`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400 font-mono">
                <Sparkles className="w-5 h-5" />
                Director's Control Panel
              </CardTitle>
              <CardDescription className="text-gray-300 font-mono">
                As the Round 1 winner, select exactly 2 games for all players to compete in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {availableGames.map((game, index) => {
                  const isSelected = selectedGames.includes(game.id)
                  const isGlitching = cardGlitches.includes(index)

                  return (
                    <div
                      key={game.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedGames(prev => prev.filter(g => g !== game.id))
                        }
                        else if (selectedGames.length < 2) {
                          setSelectedGames(prev => [...prev, game.id])
                        }
                      }}
                      className={`
                        relative cursor-pointer p-4 rounded-lg border transition-all duration-300
                        ${isSelected
                      ? `${game.color} ${game.glowColor} shadow-lg scale-105`
                      : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600/50'
                    }
                        ${isGlitching ? 'animate-pulse border-purple-400 bg-purple-500/20' : ''}
                        ${selectedGames.length >= 2 && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/10' : 'bg-gray-700/50'}`}>
                          {game.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-mono font-bold text-white text-sm mb-1">
                            {game.title}
                          </h3>
                          <p className="text-gray-400 font-mono text-xs mb-2">
                            {game.subtitle}
                          </p>
                          <p className="text-gray-300 font-mono text-xs leading-relaxed">
                            {game.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400 font-mono">
                  Selected:
                  {' '}
                  {selectedGames.length}
                  /2 games
                </div>
                <Button
                  onClick={handleGameSelection}
                  disabled={selectedGames.length !== 2 || directorSelectGamesMutation.isPending}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-mono font-bold"
                >
                  {directorSelectGamesMutation.isPending
                    ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Selecting...
                        </>
                      )
                    : (
                        <>
                          Confirm Selection
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Games Display */}
        {directorSelectedGames?.selectedGames && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-mono font-bold text-purple-400 mb-2">
                Active Games Selected by
                {' '}
                {directorSelectedGames.director}
              </h2>
              <div className="flex items-center justify-center gap-4">
                {directorSelectedGames.selectedGames.map((gameId, _index) => {
                  const game = availableGames.find(g => g.id === gameId)
                  return game
                    ? (
                        <Badge key={gameId} className="bg-purple-500/20 text-purple-300 border-purple-500/30 font-mono">
                          {game.title}
                        </Badge>
                      )
                    : null
                })}
              </div>
            </div>

            {/* Game Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {directorSelectedGames.selectedGames.map((gameId, index) => {
                const game = availableGames.find(g => g.id === gameId)
                const isGlitching = cardGlitches.includes(index)

                if (!game)
                  return null

                return (
                  <Card
                    key={gameId}
                    className={`
                      backdrop-blur-sm ${game.color} transition-all duration-300
                      ${isGlitching ? 'animate-pulse border-purple-400 bg-purple-500/20 scale-[1.02]' : ''}
                      ${game.glowColor}
                    `}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white font-mono">
                        {game.icon}
                        {game.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300 font-mono">
                        {game.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {gameId === 'curse_distribution' && (
                        <CurseDistributionGame
                          allPlayers={allPlayers || []}
                          curseAuctionStatus={curseAuctionStatus}
                          bidAmount={bidAmount}
                          setBidAmount={setBidAmount}
                          targetPlayerId={targetPlayerId}
                          setTargetPlayerId={setTargetPlayerId}
                          onSubmitBid={handleCurseBid}
                          isLoading={curseDistributionMutation.isPending}
                        />
                      )}

                      {gameId === 'pandoras_box' && (
                        <PandorasBoxGame
                          isDirector={isDirector}
                          selectedBox={selectedBox}
                          onSelectBox={handlePandorasBox}
                          isLoading={pandorasBoxMutation.isPending}
                        />
                      )}

                      {gameId === 'equi_blessing' && (
                        <EquiBlessingGame
                          onActivate={handleEquiBlessing}
                          isLoading={equiBlessingMutation.isPending}
                          allPlayers={allPlayers || []}
                        />
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        <div className="mb-8">
          <ParticipantStatus />
        </div>
      </div>

      {/* Additional glitch effects */}
      {localGlitch && (
        <>
          <div className="absolute top-1/4 left-0 right-0 h-px bg-purple-500/50 animate-pulse" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-purple-500/30 animate-pulse" />
          <div className="absolute top-1/2 left-1/4 right-1/4 h-px bg-purple-500/40 animate-ping" />
        </>
      )}
    </div>
  )
}

// Component for Curse Distribution Game
function CurseDistributionGame({
  allPlayers,
  curseAuctionStatus,
  bidAmount,
  setBidAmount,
  targetPlayerId,
  setTargetPlayerId,
  onSubmitBid,
  isLoading,
}: {
  allPlayers: any[]
  curseAuctionStatus: any
  bidAmount: number
  setBidAmount: (amount: number) => void
  targetPlayerId: number | null
  setTargetPlayerId: (id: number | null) => void
  onSubmitBid: () => void
  isLoading: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-300 font-mono text-sm">Target Player</Label>
          <Select value={targetPlayerId?.toString() || ''} onValueChange={value => setTargetPlayerId(Number(value))}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white font-mono">
              <SelectValue placeholder="Select target..." />
            </SelectTrigger>
            <SelectContent>
              {allPlayers.map(player => (
                <SelectItem key={player.userId} value={player.userId.toString()}>
                  {player.username || player.firstName}
                  {' '}
                  (
                  {player.points}
                  {' '}
                  pts)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-gray-300 font-mono text-sm">Bid Amount (multiples of 10)</Label>
          <Input
            type="number"
            min="10"
            step="10"
            value={bidAmount}
            onChange={e => setBidAmount(Number(e.target.value))}
            className="bg-gray-800/50 border-gray-700 text-white font-mono"
          />
        </div>
      </div>

      <Button
        onClick={onSubmitBid}
        disabled={!targetPlayerId || bidAmount < 10 || isLoading}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-mono font-bold"
      >
        {isLoading
          ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Placing Bid...
              </>
            )
          : (
              <>
                <DollarSign className="w-4 h-4 mr-2" />
                Place Curse Bid (
                {bidAmount}
                {' '}
                points)
              </>
            )}
      </Button>

      {curseAuctionStatus && curseAuctionStatus.totalBids > 0 && (
        <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <div className="text-sm text-gray-400 font-mono mb-2">Current Auction Status:</div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 font-mono text-sm">
              Highest Bid:
              {' '}
              <span className="text-red-400 font-bold">
                {curseAuctionStatus.highestBid}
                {' '}
                points
              </span>
            </span>
            <span className="text-gray-300 font-mono text-sm">
              Total Bids:
              {' '}
              <span className="text-yellow-400 font-bold">{curseAuctionStatus.totalBids}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// Component for Pandora's Box Game
function PandorasBoxGame({
  isDirector,
  selectedBox,
  onSelectBox,
  isLoading,
}: {
  isDirector: boolean
  selectedBox: number | null
  onSelectBox: (boxNumber: number) => void
  isLoading: boolean
}) {
  const [glitch, setGlitch] = useState(false)
  const [showBoxes, setShowBoxes] = useState(true)

  // Add glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true)
      const timer = setTimeout(() => setGlitch(false), 100)
      return () => clearTimeout(timer)
    }, 3000 + Math.random() * 5000)

    return () => clearInterval(interval)
  }, [])

  const handleBoxSelect = (boxNumber: number) => {
    onSelectBox(boxNumber)
    setShowBoxes(false)
  }

  if (!showBoxes) {
    return (
      <div className="text-center p-6 bg-gray-900/80 rounded-lg border border-purple-500/30">
        <div className="text-purple-400 font-mono text-sm mb-2">
          The box has been opened...
        </div>
        <div className="text-gray-400 text-xs">
          Your fate has been sealed!
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 relative ${glitch ? 'glitch-effect' : ''}`}>
      <div className="p-3 bg-gray-900/80 rounded-lg border border-purple-500/20 shadow-lg shadow-purple-500/10">
        <div className="text-sm text-purple-400 font-mono mb-1">
          {isDirector ? 'Director Odds:' : 'Player Odds:'}
        </div>
        <div className="text-xs text-gray-400 font-mono">
          {isDirector
            ? '1 box with +100 points, 3 boxes with -50 points'
            : '2 boxes with +100 points, 2 boxes with -50 points'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 relative">
        {[1, 2, 3, 4].map(boxNumber => (
          <Button
            key={boxNumber}
            onClick={() => handleBoxSelect(boxNumber)}
            disabled={isLoading || selectedBox !== null}
            variant="ghost"
            className={`
              h-20 font-mono font-bold transition-all duration-300 relative
              overflow-hidden group
              ${selectedBox === boxNumber
            ? 'bg-purple-600/90 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/30'
            : 'bg-gray-900/80 hover:bg-gray-800/80 text-gray-300 border border-purple-500/20 hover:border-purple-500/40'
          }
              hover:scale-[1.02] transform transition-transform duration-200
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {isLoading && selectedBox === boxNumber
              ? (
                  <Loader2 className="w-6 h-6 animate-spin text-purple-300" />
                )
              : (
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <Package className="w-6 h-6 mb-1 text-purple-300 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">
                      Box
                      {boxNumber}
                    </span>
                  </div>
                )}
          </Button>
        ))}
      </div>
    </div>
  )
}

// Component for Equi Blessing Game
function EquiBlessingGame({
  onActivate,
  isLoading,
  allPlayers,
}: {
  onActivate: () => void
  isLoading: boolean
  allPlayers: any[]
}) {
  return (
    <div className="space-y-4">
      <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <div className="text-sm text-gray-300 font-mono mb-2">Universal Blessing Effect:</div>
        <div className="text-xs text-gray-400 font-mono">
          Activating this will give +10 points to ALL
          {' '}
          {allPlayers.length}
          {' '}
          players in the game.
          This creates point inflation and changes the relative standings.
        </div>
      </div>

      <Button
        onClick={onActivate}
        disabled={isLoading}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-mono font-bold h-16"
      >
        {isLoading
          ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Activating Blessing...
              </>
            )
          : (
              <>
                <Zap className="w-6 h-6 mr-2" />
                Activate Equi Blessing
                <br />
                <span className="text-xs opacity-80">+10 points to all players</span>
              </>
            )}
      </Button>
    </div>
  )
}
