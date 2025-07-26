'use client'

import {
  AlertTriangle,
  Ban,
  Edit3,
  Heart,
  RotateCcw,
  Search,
  Settings,
  UserPlus,
  Users,
  UserX,
} from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import { Input } from '@/shadcn/ui/input'
import { ScrollArea } from '@/shadcn/ui/scroll-area'

interface Player {
  id: string
  username: string
  email: string
  points: number
  roundPoints: number
  alliance: string | null
  lifelines: {
    snitch: number
    sabotage: number
    boost: number
    intel: number
  }
  status: 'active' | 'idle' | 'offline' | 'banned'
  joinedAt: string
  lastActivity: string
  specialRoles: string[]
  warnings: number
}

export function PlayerManagement() {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: '1',
      username: 'CipherMaster',
      email: 'cipher@example.com',
      points: 245,
      roundPoints: 85,
      alliance: 'Alpha',
      lifelines: { snitch: 2, sabotage: 1, boost: 1, intel: 3 },
      status: 'active',
      joinedAt: '2024-01-15 14:30',
      lastActivity: '2 min ago',
      specialRoles: ['Round Director'],
      warnings: 0,
    },
    {
      id: '2',
      username: 'FirefoxNinja',
      email: 'ninja@example.com',
      points: 230,
      roundPoints: 70,
      alliance: 'Alpha',
      lifelines: { snitch: 1, sabotage: 1, boost: 0, intel: 2 },
      status: 'active',
      joinedAt: '2024-01-15 14:25',
      lastActivity: '1 min ago',
      specialRoles: [],
      warnings: 1,
    },
    {
      id: '3',
      username: 'CodeBreaker',
      email: 'breaker@example.com',
      points: 220,
      roundPoints: 65,
      alliance: null,
      lifelines: { snitch: 2, sabotage: 0, boost: 1, intel: 1 },
      status: 'idle',
      joinedAt: '2024-01-15 14:20',
      lastActivity: '5 min ago',
      specialRoles: ['Underdog Token Holder'],
      warnings: 0,
    },
    // Add more mock players...
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'idle' | 'offline' | 'banned'>('all')

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.username.toLowerCase().includes(searchTerm.toLowerCase())
      || player.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || player.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handlePointAdjustment = (playerId: string, adjustment: number) => {
    setPlayers(prev => prev.map(player =>
      player.id === playerId
        ? { ...player, points: Math.max(0, player.points + adjustment) }
        : player,
    ))
  }

  const handleLifelineAdjustment = (playerId: string, lifeline: keyof Player['lifelines'], adjustment: number) => {
    setPlayers(prev => prev.map(player =>
      player.id === playerId
        ? {
            ...player,
            lifelines: {
              ...player.lifelines,
              [lifeline]: Math.max(0, player.lifelines[lifeline] + adjustment),
            },
          }
        : player,
    ))
  }

  const handleStatusChange = (playerId: string, newStatus: Player['status']) => {
    setPlayers(prev => prev.map(player =>
      player.id === playerId
        ? { ...player, status: newStatus }
        : player,
    ))
  }

  const handleRoleToggle = (playerId: string, role: string) => {
    setPlayers(prev => prev.map(player =>
      player.id === playerId
        ? {
            ...player,
            specialRoles: player.specialRoles.includes(role)
              ? player.specialRoles.filter(r => r !== role)
              : [...player.specialRoles, role],
          }
        : player,
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/20'
      case 'idle': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20'
      case 'offline': return 'bg-gray-500/20 text-gray-300 border-gray-500/20'
      case 'banned': return 'bg-red-500/20 text-red-300 border-red-500/20'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      case 'idle': return <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
      case 'offline': return <div className="w-2 h-2 bg-gray-400 rounded-full" />
      case 'banned': return <div className="w-2 h-2 bg-red-400 rounded-full" />
      default: return <div className="w-2 h-2 bg-gray-400 rounded-full" />
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
        <Users className="w-6 h-6 animate-pulse" />
        Player Management
      </h2>

      {/* Search and Filters */}
      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search players by username or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-gray-800/50 text-white placeholder-gray-400 font-mono"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {(['all', 'active', 'idle', 'offline', 'banned'] as const).map(status => (
              <Button
                key={status}
                variant="outline"
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={`font-mono text-xs ${
                  filterStatus === status
                    ? 'bg-white/20 border-white/50 text-white'
                    : 'bg-white/5 border-gray-800/50 text-gray-300 hover:bg-white/10'
                }`}
              >
                {status.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Player List */}
      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 animate-pulse" />
          Players (
          {filteredPlayers.length}
          )
        </h3>

        <ScrollArea className="h-96">
          <div className="space-y-3">
            {filteredPlayers.map(player => (
              <div
                key={player.id}
                className={`backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPlayer === player.id ? 'border-white/50 bg-white/10' : 'hover:bg-white/10'
                }`}
                onClick={() => setSelectedPlayer(selectedPlayer === player.id ? null : player.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(player.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono text-sm font-semibold">{player.username}</span>
                        <Badge variant="secondary" className={getStatusColor(player.status)}>
                          {player.status}
                        </Badge>
                        {player.warnings > 0 && (
                          <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/20 text-xs">
                            {player.warnings}
                            {' '}
                            ⚠️
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">{player.email}</div>
                      {player.specialRoles.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {player.specialRoles.map(role => (
                            <Badge key={role} variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/20 text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-white font-mono font-bold">{player.points}</div>
                    <div className="text-xs text-gray-400 font-mono">
                      Round: +
                      {player.roundPoints}
                    </div>
                    {player.alliance && (
                      <Badge variant="secondary" className="bg-gray-500/20 text-gray-300 border-gray-500/20 text-xs mt-1">
                        {player.alliance}
                      </Badge>
                    )}
                  </div>
                </div>

                {selectedPlayer === player.id && (
                  <div className="mt-4 pt-4 border-t border-gray-800/50 space-y-4">
                    {/* Player Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-400">Joined:</span>
                        <div className="text-white mt-1">{player.joinedAt}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Last Activity:</span>
                        <div className="text-white mt-1">{player.lastActivity}</div>
                      </div>
                    </div>

                    {/* Lifelines */}
                    <div>
                      <span className="text-gray-400 text-xs">Lifelines:</span>
                      <div className="flex gap-2 mt-2">
                        {Object.entries(player.lifelines).map(([lifeline, count]) => (
                          <div key={lifeline} className="flex items-center gap-1">
                            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                              {lifeline.charAt(0).toUpperCase()}
                              :
                              {count}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-6 h-6 p-0 bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleLifelineAdjustment(player.id, lifeline as keyof Player['lifelines'], 1)
                              }}
                            >
                              +
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-6 h-6 p-0 bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleLifelineAdjustment(player.id, lifeline as keyof Player['lifelines'], -1)
                              }}
                            >
                              -
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Point Management */}
                    <div>
                      <span className="text-gray-400 text-xs">Point Adjustments:</span>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30 font-mono text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePointAdjustment(player.id, 25)
                          }}
                        >
                          +25
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30 font-mono text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePointAdjustment(player.id, 10)
                          }}
                        >
                          +10
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 font-mono text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePointAdjustment(player.id, -10)
                          }}
                        >
                          -10
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 font-mono text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePointAdjustment(player.id, -25)
                          }}
                        >
                          -25
                        </Button>
                        <Button
                          size="sm"
                          className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30 font-mono text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePointAdjustment(player.id, -player.points)
                          }}
                        >
                          RESET
                        </Button>
                      </div>
                    </div>

                    {/* Special Roles */}
                    <div>
                      <span className="text-gray-400 text-xs">Special Roles:</span>
                      <div className="flex gap-2 mt-2">
                        {['Round Director', 'Underdog Token Holder', 'Alliance Leader'].map(role => (
                          <Button
                            key={role}
                            size="sm"
                            variant="outline"
                            className={`font-mono text-xs ${
                              player.specialRoles.includes(role)
                                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                                : 'bg-white/5 border-gray-800/50 text-gray-300 hover:bg-white/10'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRoleToggle(player.id, role)
                            }}
                          >
                            {role}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-gray-800/50">
                      <Button
                        size="sm"
                        className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30 font-mono text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Send message to player
                        }}
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        MESSAGE
                      </Button>

                      <Button
                        size="sm"
                        className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 font-mono text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusChange(player.id, player.status === 'banned' ? 'active' : 'banned')
                        }}
                      >
                        <Ban className="w-3 h-3 mr-1" />
                        {player.status === 'banned' ? 'UNBAN' : 'BAN'}
                      </Button>

                      <Button
                        size="sm"
                        className="bg-white/20 border-white/50 text-white hover:bg-white/30 font-mono text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Reset player progress
                        }}
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        RESET
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Bulk Actions */}
      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 animate-pulse" />
          Bulk Actions
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            size="sm"
            className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30 font-mono text-xs"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            ADD PLAYER
          </Button>

          <Button
            size="sm"
            className="bg-white/20 border-white/50 text-white hover:bg-white/30 font-mono text-xs"
          >
            <Heart className="w-4 h-4 mr-2" />
            REFILL LIFELINES
          </Button>

          <Button
            size="sm"
            className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30 font-mono text-xs"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            BROADCAST MSG
          </Button>

          <Button
            size="sm"
            className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 font-mono text-xs"
          >
            <UserX className="w-4 h-4 mr-2" />
            KICK INACTIVE
          </Button>
        </div>
      </div>
    </div>
  )
}
