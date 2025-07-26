'use client'

import {
  Activity,
  AlertTriangle,
  Eye,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import { ScrollArea } from '@/shadcn/ui/scroll-area'

interface Player {
  id: string
  username: string
  points: number
  roundPoints: number
  alliance: string | null
  lifelines: {
    snitch: number
    sabotage: number
    boost: number
    intel: number
  }
  status: 'active' | 'idle' | 'offline'
  lastActivity: string
}

interface Alliance {
  id: string
  name: string
  members: string[]
  totalPoints: number
  status: 'united' | 'dissolved' | 'betrayed'
}

export function LiveMonitoring() {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: '1',
      username: 'CipherMaster',
      points: 245,
      roundPoints: 85,
      alliance: 'Alpha',
      lifelines: { snitch: 2, sabotage: 1, boost: 1, intel: 3 },
      status: 'active',
      lastActivity: '2 min ago',
    },
    {
      id: '2',
      username: 'FirefoxNinja',
      points: 230,
      roundPoints: 70,
      alliance: 'Alpha',
      lifelines: { snitch: 1, sabotage: 1, boost: 0, intel: 2 },
      status: 'active',
      lastActivity: '1 min ago',
    },
    {
      id: '3',
      username: 'CodeBreaker',
      points: 220,
      roundPoints: 65,
      alliance: null,
      lifelines: { snitch: 2, sabotage: 0, boost: 1, intel: 1 },
      status: 'idle',
      lastActivity: '5 min ago',
    },
    // Add more mock players...
  ])

  const [alliances, _setAlliances] = useState<Alliance[]>([
    { id: 'alpha', name: 'Alpha', members: ['CipherMaster', 'FirefoxNinja'], totalPoints: 475, status: 'united' },
    { id: 'beta', name: 'Beta', members: ['DevHacker', 'ScriptKiddie'], totalPoints: 380, status: 'united' },
    { id: 'gamma', name: 'Gamma', members: ['BugHunter'], totalPoints: 180, status: 'dissolved' },
  ])

  const [recentActivity, _setRecentActivity] = useState([
    { time: '14:32', player: 'CipherMaster', action: 'Completed Challenge: "Hidden Console"', points: '+25' },
    { time: '14:31', player: 'FirefoxNinja', action: 'Used Lifeline: Intel', points: '0' },
    { time: '14:30', player: 'CodeBreaker', action: 'Failed Challenge: "Network Analysis"', points: '-5' },
    { time: '14:29', player: 'DevHacker', action: 'Formed Alliance with ScriptKiddie', points: '0' },
    { time: '14:28', player: 'BugHunter', action: 'Used Lifeline: Sabotage on CipherMaster', points: '0' },
  ])

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setPlayers(prev => prev.map(player => ({
        ...player,
        points: player.points + Math.floor(Math.random() * 10) - 5,
        status: Math.random() > 0.1 ? player.status : 'idle',
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const _getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'idle': return 'text-yellow-400'
      case 'offline': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      case 'idle': return <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
      case 'offline': return <div className="w-2 h-2 bg-red-400 rounded-full" />
      default: return <div className="w-2 h-2 bg-gray-400 rounded-full" />
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
        <Eye className="w-6 h-6 animate-pulse" />
        Live Monitoring Dashboard
      </h2>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4 text-center">
          <Users className="w-8 h-8 text-white mx-auto mb-2 animate-pulse" />
          <h3 className="text-white font-mono font-semibold mb-1">Active Players</h3>
          <p className="text-2xl font-mono font-bold text-white">
            {players.filter(p => p.status === 'active').length}
          </p>
        </div>

        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4 text-center">
          <Trophy className="w-8 h-8 text-white mx-auto mb-2 animate-pulse" />
          <h3 className="text-white font-mono font-semibold mb-1">Avg Points</h3>
          <p className="text-2xl font-mono font-bold text-white">
            {Math.round(players.reduce((sum, p) => sum + p.points, 0) / players.length)}
          </p>
        </div>

        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4 text-center">
          <Users className="w-8 h-8 text-white mx-auto mb-2 animate-pulse" />
          <h3 className="text-white font-mono font-semibold mb-1">Alliances</h3>
          <p className="text-2xl font-mono font-bold text-white">
            {alliances.filter(a => a.status === 'united').length}
          </p>
        </div>

        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4 text-center">
          <Activity className="w-8 h-8 text-white mx-auto mb-2 animate-pulse" />
          <h3 className="text-white font-mono font-semibold mb-1">Actions/Min</h3>
          <p className="text-2xl font-mono font-bold text-white">12</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Leaderboard */}
        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 animate-pulse" />
            Live Leaderboard
          </h3>

          <ScrollArea className="h-80">
            <div className="space-y-2">
              {players
                .sort((a, b) => b.points - a.points)
                .map((player, index) => (
                  <div
                    key={player.id}
                    className={`backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3 cursor-pointer transition-all ${
                      selectedPlayer === player.id ? 'border-white/50 bg-white/10' : 'hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedPlayer(selectedPlayer === player.id ? null : player.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-white/10 text-white border-white/20 w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-mono text-sm font-semibold">{player.username}</span>
                            {getStatusIcon(player.status)}
                          </div>
                          {player.alliance && (
                            <Badge variant="secondary" className="bg-gray-500/20 text-gray-300 border-gray-500/20 text-xs mt-1">
                              {player.alliance}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-white font-mono font-bold">{player.points}</div>
                        <div className="text-xs text-gray-400 font-mono">
                          Round: +
                          {player.roundPoints}
                        </div>
                      </div>
                    </div>

                    {selectedPlayer === player.id && (
                      <div className="mt-3 pt-3 border-t border-gray-800/50">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-gray-400">Lifelines:</span>
                            <div className="flex gap-1 mt-1">
                              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                                S:
                                {player.lifelines.snitch}
                              </Badge>
                              <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/20 text-xs">
                                X:
                                {player.lifelines.sabotage}
                              </Badge>
                              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/20 text-xs">
                                B:
                                {player.lifelines.boost}
                              </Badge>
                              <Badge variant="secondary" className="bg-gray-500/20 text-gray-300 border-gray-500/20 text-xs">
                                I:
                                {player.lifelines.intel}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Last Activity:</span>
                            <div className="text-white mt-1">{player.lastActivity}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </ScrollArea>
        </div>

        {/* Alliance Tracking */}
        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 animate-pulse" />
            Alliance Tracking
          </h3>

          <div className="space-y-3">
            {alliances.map(alliance => (
              <div key={alliance.id} className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm font-semibold">{alliance.name}</span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        alliance.status === 'united'
                          ? 'bg-green-500/20 text-green-300 border-green-500/20'
                          : alliance.status === 'dissolved'
                            ? 'bg-red-500/20 text-red-300 border-red-500/20'
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20'
                      }`}
                    >
                      {alliance.status}
                    </Badge>
                  </div>
                  <div className="text-white font-mono font-bold">{alliance.totalPoints}</div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {alliance.members.map(member => (
                    <Badge key={member} variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800/50">
            <h4 className="text-white font-mono text-sm font-semibold mb-2">Solo Players</h4>
            <div className="flex flex-wrap gap-1">
              {players
                .filter(p => !p.alliance)
                .map(player => (
                  <Badge key={player.id} variant="secondary" className="bg-gray-500/20 text-gray-300 border-gray-500/20 text-xs">
                    {player.username}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 animate-pulse" />
          Real-time Activity Feed
        </h3>

        <ScrollArea className="h-60">
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <div key={index} className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                      {activity.time}
                    </Badge>
                    <span className="text-white font-mono text-sm font-semibold">{activity.player}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      activity.points.startsWith('+')
                        ? 'bg-green-500/20 text-green-300 border-green-500/20'
                        : activity.points.startsWith('-')
                          ? 'bg-red-500/20 text-red-300 border-red-500/20'
                          : 'bg-gray-500/20 text-gray-300 border-gray-500/20'
                    }`}
                  >
                    {activity.points}
                  </Badge>
                </div>
                <div className="text-gray-300 font-mono text-xs mt-1">{activity.action}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Quick Actions */}
      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 animate-pulse" />
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            size="sm"
            className="bg-white/20 border-white/50 text-white hover:bg-white/30 font-mono text-xs"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            BOOST BOTTOM 3
          </Button>

          <Button
            size="sm"
            className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 font-mono text-xs"
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            PENALIZE LEADER
          </Button>

          <Button
            size="sm"
            className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30 font-mono text-xs"
          >
            <Users className="w-4 h-4 mr-2" />
            DISSOLVE ALL
          </Button>

          <Button
            size="sm"
            className="bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30 font-mono text-xs"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            EMERGENCY ALERT
          </Button>
        </div>
      </div>
    </div>
  )
}
