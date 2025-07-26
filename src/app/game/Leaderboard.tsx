'use client'
import { Crown, Trophy, Users } from 'lucide-react'
import { Badge } from '@/shadcn/ui/badge'
import { ScrollArea } from '@/shadcn/ui/scroll-area'

interface Player {
  id: number
  name: string
  points: number
  rank: number
  status: 'online' | 'away' | 'offline'
}

interface LeaderboardProps {
  players: Player[]
  playerGlitch: number | null
}

export function Leaderboard({ players, playerGlitch }: LeaderboardProps) {
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
        <div className="space-y-3">
          {players.map((player, index) => (
            <div
              key={player.id}
              className={`backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-3 hover:bg-white/10 transition-all ${
                playerGlitch === index ? 'animate-pulse border-red-500/50 bg-red-500/10' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {player.rank <= 3 && (
                    <Crown
                      className={`w-4 h-4 animate-pulse ${
                        player.rank === 1
                          ? 'text-white'
                          : player.rank === 2
                            ? 'text-gray-300'
                            : 'text-gray-500'
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
                  </span>
                </div>
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    player.status === 'online'
                      ? 'bg-white'
                      : player.status === 'away'
                        ? 'bg-gray-400'
                        : 'bg-gray-700'
                  }`}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-white font-mono text-sm ${playerGlitch === index ? 'animate-pulse' : ''}`}>
                  {player.name}
                </span>
                <div className="flex items-center gap-1">
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
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
