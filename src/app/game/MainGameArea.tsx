'use client'

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Code,
  Crown,
  ExternalLink,
  Eye,
  FileText,
  Search,
  Sword,
  Target,
  Terminal,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'

interface MainGameAreaProps {
  glitchEffect: boolean
}

export function MainGameArea({ glitchEffect }: MainGameAreaProps) {
  const [localGlitch, setLocalGlitch] = useState(false)
  const [cardGlitches, setCardGlitches] = useState<number[]>([])
  const [scrollGlitch, setScrollGlitch] = useState(false)

  // Enhanced glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setLocalGlitch(true)
      setTimeout(() => setLocalGlitch(false), 100 + Math.random() * 200)
    }, 3000 + Math.random() * 4000)

    const cardGlitchInterval = setInterval(() => {
      const numGlitches = Math.floor(Math.random() * 3) + 1
      const glitchIndexes = Array.from({ length: numGlitches }, () => Math.floor(Math.random() * 3))
      setCardGlitches(glitchIndexes)
      setTimeout(() => setCardGlitches([]), 150 + Math.random() * 100)
    }, 2000 + Math.random() * 3000)

    const scrollGlitchInterval = setInterval(() => {
      setScrollGlitch(true)
      setTimeout(() => setScrollGlitch(false), 80)
    }, 8000 + Math.random() * 5000)

    return () => {
      clearInterval(glitchInterval)
      clearInterval(cardGlitchInterval)
      clearInterval(scrollGlitchInterval)
    }
  }, [])

  const { data: gameSession } = trpc.getCurrentGameSession.useQuery()
  const gameSessionId = gameSession?.id || 1

  const { data: gameProgress } = trpc.games.getGameProgress.useQuery({
    gameSessionId,
  })

  const rounds = [
    {
      id: 'round1',
      title: 'Round 1: Foundation Hunt',
      subtitle: 'Technical Challenges',
      description: 'Solve web-based puzzles and Firefox-specific challenges to establish initial rankings.',
      icon: <Target className="w-8 h-8" />,
      status: 'active',
      progress: gameProgress ? `${gameProgress.gamesCompleted}/5` : '0/5',
      points: gameProgress ? `${gameProgress.totalPoints}/100` : '0/100',
      color: 'border-green-500/50 bg-green-500/10',
      games: [
        { icon: <Eye className="w-4 h-4" />, name: 'Hidden Message Inspector', points: 20, target: 'inspect_element_game' },
        { icon: <Code className="w-4 h-4" />, name: 'Base64 Metadata Decoder', points: 20, target: 'base64_decoder_game' },
        { icon: <Search className="w-4 h-4" />, name: 'Secret Endpoint Discovery', points: 20, target: 'network_analysis_game' },
        { icon: <Terminal className="w-4 h-4" />, name: 'JavaScript Console Cipher', points: 20, target: 'console_puzzle_game' },
        { icon: <FileText className="w-4 h-4" />, name: 'Broken Form Data Extraction', points: 20, target: 'form_extraction_game' },
      ],
      action: () => window.open('/game/round1', '_blank'),
    },
    {
      id: 'round2',
      title: 'Round 2: Director\'s Game',
      subtitle: 'Player-Created Content',
      description: 'The Round 1 winner designs challenges while trying to maintain their lead.',
      icon: <Crown className="w-8 h-8" />,
      status: 'locked',
      progress: '0/8',
      points: '0/300',
      color: 'border-yellow-500/50 bg-yellow-500/10',
      games: [
        { icon: <Users className="w-4 h-4" />, name: 'Competitive Challenges', points: 50, target: 'competitive_challenge' },
        { icon: <Zap className="w-4 h-4" />, name: 'Chaos Challenges', points: 40, target: 'chaos_challenge' },
        { icon: <Crown className="w-4 h-4" />, name: 'Director\'s Custom Games', points: 60, target: 'director_custom' },
      ],
      action: () => {},
    },
    {
      id: 'round3',
      title: 'Round 3: Betrayal Finale',
      subtitle: 'Ultimate Showdown',
      description: 'Alliances crumble and anyone can win in this dramatic final round.',
      icon: <Sword className="w-8 h-8" />,
      status: 'locked',
      progress: '0/3',
      points: '0/500',
      color: 'border-red-500/50 bg-red-500/10',
      games: [
        { icon: <Clock className="w-4 h-4" />, name: 'The Trials', points: 150, target: 'trials' },
        { icon: <Users className="w-4 h-4" />, name: 'The Heist', points: 200, target: 'heist' },
        { icon: <Trophy className="w-4 h-4" />, name: 'Final Gambit', points: 150, target: 'final_gambit' },
      ],
      action: () => {},
    },
  ]

  return (
    <div
      className={`h-full backdrop-blur-2xl bg-gray-900/30 border border-gray-800/30 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-200 ${
        glitchEffect || localGlitch ? 'animate-pulse border-red-500/50' : ''
      } ${scrollGlitch ? 'brightness-110 contrast-125' : ''}`}
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%224%22%20height%3D%224%22%20viewBox%3D%220%200%204%204%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200h1v1H0V0zm2%202h1v1H2V2z%22%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.1%22/%3E%3C/svg%3E')] pointer-events-none" />

      {/* Glitch Lines */}
      <div className="absolute inset-0 opacity-5" suppressHydrationWarning>
        {(glitchEffect || localGlitch) && (
          <>
            {[...Array.from({ length: 25 })].map((_, i) => (
              <div
                key={i}
                className="absolute h-px bg-red-500 animate-pulse"
                style={{
                  top: `${Math.floor(Math.random() * 100)}%`,
                  left: 0,
                  right: 0,
                  height: `${Math.random() * 3}px`,
                  opacity: Math.random() * 0.8 + 0.2,
                  transform: `translateY(${Math.random() * 10 - 5}px) skewX(${Math.random() * 4 - 2}deg)`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  filter: 'blur(0.5px)',
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-10" suppressHydrationWarning>
        {[...Array.from({ length: 8 })].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent animate-pulse"
            style={{
              top: `${(i + 1) * 12.5}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Scrollable Rounds Container */}
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-800/30" />

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 pb-8">
            {rounds.map((round, index) => {
              const isGlitching = cardGlitches.includes(index)

              return (
                <div
                  key={round.id}
                  className={`
                    relative backdrop-blur-sm bg-white/5 border rounded-xl p-4 sm:p-6
                    transition-all duration-300 hover:bg-white/10 group
                    ${round.status === 'active' ? round.color : 'border-gray-800/50'}
                    ${round.status === 'locked' ? 'opacity-60' : ''}
                    ${isGlitching ? 'animate-pulse border-red-400 bg-red-500/20 transform scale-[1.02]' : ''}
                  `}
                >
                  {/* Glitch Overlay */}
                  {isGlitching && (
                    <div className="absolute inset-0 bg-red-500/20 animate-pulse rounded-xl pointer-events-none" />
                  )}

                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${round.status === 'active' ? 'bg-white/10' : 'bg-gray-800/50'}`}>
                          {round.icon}
                        </div>
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <h3 className="text-lg sm:text-xl font-mono font-bold text-white truncate">
                              {round.title}
                            </h3>
                            {round.status === 'active' && (
                              <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/20 w-fit">
                                Active
                              </Badge>
                            )}
                            {round.status === 'locked' && (
                              <Badge variant="outline" className="bg-gray-500/20 text-gray-400 border-gray-500/20 w-fit">
                                Locked
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-400 font-mono text-xs sm:text-sm">{round.subtitle}</p>
                          <p className="text-gray-300 font-mono text-sm sm:text-base leading-relaxed">
                            {round.description}
                          </p>

                          {/* Games Preview - Enhanced Design */}
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="h-px bg-gradient-to-r from-gray-600 to-transparent flex-1" />
                              <span className="text-gray-500 font-mono text-xs uppercase tracking-wider">
                                Challenges
                              </span>
                              <div className="h-px bg-gradient-to-l from-gray-600 to-transparent flex-1" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {round.games.map((game, gameIndex) => {
                                const isCompleted = gameProgress?.completedGames?.includes(game.target) || false
                                const attemptData = gameProgress?.attemptCounts?.[game.target]
                                const totalAttempts = attemptData?.total || 0
                                const failedAttempts = attemptData?.failed || 0

                                return (
                                  <div
                                    key={gameIndex}
                                    className={`relative group overflow-hidden rounded-lg border transition-all duration-300 ${
                                      isCompleted
                                        ? 'bg-green-500/10 border-green-500/50 hover:border-green-400/70'
                                        : round.status === 'active'
                                          ? 'bg-gray-800/30 border-gray-700/50 hover:border-green-500/50 hover:bg-green-500/5'
                                          : 'bg-gray-800/20 border-gray-800/50 hover:border-gray-600/50'
                                    }`}
                                  >
                                    {/* Completion Indicator */}
                                    {isCompleted && (
                                      <div className="absolute top-2 right-2 z-10">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                      </div>
                                    )}

                                    {/* Attempt Counter Badge */}
                                    {totalAttempts > 0 && (
                                      <div className="absolute top-2 left-2 z-10">
                                        <div className={`px-2 py-1 rounded-full text-xs font-mono font-bold ${
                                          isCompleted
                                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                            : failedAttempts > 0
                                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                              : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                                        }`}
                                        >
                                          {totalAttempts}
                                          {' '}
                                          {totalAttempts === 1 ? 'try' : 'tries'}
                                        </div>
                                      </div>
                                    )}

                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                      <div className={`h-full w-full ${isCompleted ? 'bg-[linear-gradient(45deg,_transparent_35%,_rgba(34,197,94,0.1)_50%,_transparent_65%)]' : 'bg-[linear-gradient(45deg,_transparent_35%,_rgba(255,255,255,0.1)_50%,_transparent_65%)]'} animate-pulse`} />
                                    </div>

                                    <div className="relative p-3 pt-8">
                                      {/* Icon Container */}
                                      <div
                                        className={`p-2 rounded-md flex-shrink-0 transition-all duration-300 mb-2 ${
                                          isCompleted
                                            ? 'bg-green-500/20 text-green-400'
                                            : round.status === 'active'
                                              ? 'bg-green-500/10 text-green-400 group-hover:bg-green-500/20'
                                              : 'bg-gray-700/50 text-gray-400 group-hover:bg-gray-700/70'
                                        }`}
                                      >
                                        {game.icon}
                                      </div>

                                      {/* Game Info */}
                                      <div className="space-y-2">
                                        <h4 className={`font-mono text-sm font-medium group-hover:text-white transition-colors ${isCompleted ? 'text-green-300' : 'text-gray-200'}`}>
                                          {game.name}
                                        </h4>

                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-1">
                                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                              isCompleted
                                                ? 'bg-green-400'
                                                : round.status === 'active'
                                                  ? 'bg-green-500'
                                                  : 'bg-gray-500'
                                            }`}
                                            />
                                            <span className="text-gray-500 font-mono text-xs">
                                              {isCompleted ? 'Completed' : round.status === 'active' ? 'Available' : 'Locked'}
                                            </span>
                                          </div>

                                          <div className="flex-shrink-0">
                                            <div
                                              className={`px-2 py-1 rounded-full font-mono text-xs font-bold transition-all duration-300 ${
                                                isCompleted
                                                  ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                                                  : round.status === 'active'
                                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30 group-hover:bg-green-500/30'
                                                    : 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
                                              }`}
                                            >
                                              {game.points}
                                              {' '}
                                              PTS
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs">
                                          <span className="text-gray-400 font-mono">
                                            Challenge #
                                            {gameIndex + 1}
                                          </span>

                                          {/* Attempt Stats */}
                                          {totalAttempts > 0 && (
                                            <div className="flex items-center gap-1 text-gray-400 font-mono">
                                              {failedAttempts > 0 && (
                                                <span className="text-red-400">
                                                  {failedAttempts}
                                                  {' '}
                                                  failed
                                                </span>
                                              )}
                                              {isCompleted && failedAttempts > 0 && (
                                                <span>, </span>
                                              )}
                                              {isCompleted && (
                                                <span className="text-green-400">
                                                  solved
                                                </span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Hover Effect Line */}
                                    <div
                                      className={`
                                      absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300
                                      ${isCompleted ? 'bg-gradient-to-r from-green-400 to-green-300' : round.status === 'active' ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-gray-500 to-gray-400'}
                                    `}
                                    />
                                  </div>
                                )
                              })}
                            </div>

                            {/* Summary Stats */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-800/50">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500 font-mono text-xs">Completed:</span>
                                  <span className="text-gray-300 font-mono text-xs font-bold">
                                    {round.id === 'round1' && gameProgress
                                      ? round.games.filter(game => gameProgress.completedGames?.includes(game.target)).length
                                      : 0}
                                    /
                                    {round.games.length}
                                    {' '}
                                    challenges
                                  </span>
                                </div>
                                {round.id === 'round1' && gameProgress?.attemptCounts && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-500 font-mono text-xs">Total Attempts:</span>
                                    <span className="text-gray-300 font-mono text-xs font-bold">
                                      {Object.values(gameProgress.attemptCounts).reduce((sum, attempt) => sum + attempt.total, 0)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500 font-mono text-xs">Max:</span>
                                  <span className="text-gray-300 font-mono text-xs font-bold">
                                    {round.games.reduce((sum, game) => sum + game.points, 0)}
                                    {' '}
                                    pts
                                  </span>
                                </div>
                              </div>
                              <div
                                className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                                  round.status === 'active'
                                    ? 'bg-green-500/10 text-green-400'
                                    : 'bg-gray-600/10 text-gray-500'
                                }`}
                              >
                                {round.status === 'active' ? 'ACTIVE' : 'LOCKED'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Stats and Actions */}
                      <div className="flex flex-col gap-3 lg:text-right lg:min-w-[200px]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 lg:justify-end">
                            <CheckCircle2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-300 font-mono text-sm">
                              Progress:
                              {' '}
                              {round.progress}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 lg:justify-end">
                            <Trophy className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-300 font-mono text-sm">
                              Points:
                              {' '}
                              {round.points}
                            </span>
                          </div>
                        </div>

                        {round.status === 'active' && (
                          <Button
                            onClick={round.action}
                            className="bg-white text-black hover:bg-gray-200 font-mono transition-all duration-200 group-hover:shadow-lg"
                          >
                            <span className="hidden sm:inline">
                              {round.id === 'round1' ? 'Open in New Tab' : 'Enter Round'}
                            </span>
                            <span className="sm:hidden">
                              {round.id === 'round1' ? 'Open' : 'Enter'}
                            </span>
                            {round.id === 'round1'
                              ? (
                                  <ExternalLink className="w-4 h-4 ml-2 flex-shrink-0" />
                                )
                              : (
                                  <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
                                )}
                          </Button>
                        )}

                        {round.status === 'locked' && (
                          <Button
                            disabled
                            variant="outline"
                            className="border-gray-600 text-gray-500 font-mono cursor-not-allowed"
                          >
                            Locked
                          </Button>
                        )}
                      </div>
                    </div>

                    {round.status === 'active' && gameProgress && (
                      <div className="mt-4 pt-4 border-t border-gray-800/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 font-mono text-xs">Round Progress</span>
                          <span className="text-gray-400 font-mono text-xs">
                            {Math.round((gameProgress.gamesCompleted / 5) * 100)}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-800/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(gameProgress.gamesCompleted / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="pt-40" />
      </div>

      {(glitchEffect || localGlitch) && (
        <>
          <div className="absolute top-1/4 left-0 right-0 h-px bg-red-500/50 animate-pulse" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-red-500/30 animate-pulse" />
          <div className="absolute top-1/2 left-1/4 right-1/4 h-px bg-red-500/40 animate-ping" />
        </>
      )}

      {scrollGlitch && (
        <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
      )}

      <style jsx>
        {`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #ef4444 #1f2937;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ef4444, #dc2626);
          border-radius: 4px;
          transition: all 0.2s;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #f87171, #ef4444);
        }
      `}
      </style>
    </div>
  )
}
