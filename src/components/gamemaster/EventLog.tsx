'use client'

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Info,
  Search,
  Settings,
  Trash2,
  Trophy,
  Users,
  XCircle,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import { Input } from '@/shadcn/ui/input'
import { ScrollArea } from '@/shadcn/ui/scroll-area'

interface LogEvent {
  id: string
  timestamp: string
  type: 'game' | 'player' | 'challenge' | 'alliance' | 'system' | 'admin'
  severity: 'info' | 'warning' | 'error' | 'success'
  actor: string
  action: string
  target?: string
  details: string
  metadata?: Record<string, any>
}

export function EventLog() {
  const [events, setEvents] = useState<LogEvent[]>([
    {
      id: '1',
      timestamp: '2024-01-15 14:32:15',
      type: 'challenge',
      severity: 'success',
      actor: 'CipherMaster',
      action: 'CHALLENGE_COMPLETED',
      target: 'Hidden Console Messages',
      details: 'Player completed challenge and earned 25 points',
      metadata: { points: 25, timeSpent: 180 },
    },
    {
      id: '2',
      timestamp: '2024-01-15 14:31:45',
      type: 'player',
      severity: 'info',
      actor: 'FirefoxNinja',
      action: 'LIFELINE_USED',
      target: 'Intel',
      details: 'Player used Intel lifeline for Network Analysis challenge',
      metadata: { lifeline: 'intel', challenge: 'Network Analysis' },
    },
    {
      id: '3',
      timestamp: '2024-01-15 14:30:22',
      type: 'alliance',
      severity: 'info',
      actor: 'DevHacker',
      action: 'ALLIANCE_FORMED',
      target: 'Beta Alliance',
      details: 'Player formed alliance with ScriptKiddie',
      metadata: { members: ['DevHacker', 'ScriptKiddie'] },
    },
    {
      id: '4',
      timestamp: '2024-01-15 14:29:10',
      type: 'admin',
      severity: 'warning',
      actor: 'Gamemaster',
      action: 'POINTS_ADJUSTED',
      target: 'BugHunter',
      details: 'Manual point adjustment: +50 points for exceptional creativity',
      metadata: { adjustment: 50, reason: 'exceptional creativity' },
    },
    {
      id: '5',
      timestamp: '2024-01-15 14:28:33',
      type: 'game',
      severity: 'info',
      actor: 'System',
      action: 'CHAOS_EVENT_TRIGGERED',
      target: 'Point Redistribution',
      details: 'Chaos event triggered: Points redistributed between top 2 players',
      metadata: { event: 'point_redistribution', affected: ['CipherMaster', 'FirefoxNinja'] },
    },
    {
      id: '6',
      timestamp: '2024-01-15 14:27:55',
      type: 'player',
      severity: 'error',
      actor: 'CodeBreaker',
      action: 'CHALLENGE_FAILED',
      target: 'Network Analysis',
      details: 'Player failed challenge attempt, -5 points penalty',
      metadata: { penalty: -5, attempts: 3 },
    },
    // Add more mock events...
  ])

  const [filteredEvents, setFilteredEvents] = useState<LogEvent[]>(events)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | LogEvent['type']>('all')
  const [filterSeverity, setFilterSeverity] = useState<'all' | LogEvent['severity']>('all')
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.actor.toLowerCase().includes(searchTerm.toLowerCase())
        || event.action.toLowerCase().includes(searchTerm.toLowerCase())
        || event.details.toLowerCase().includes(searchTerm.toLowerCase())
        || (event.target && event.target.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType)
    }

    if (filterSeverity !== 'all') {
      filtered = filtered.filter(event => event.severity === filterSeverity)
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, filterType, filterSeverity])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate new events
        const newEvent: LogEvent = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          type: ['game', 'player', 'challenge', 'alliance', 'system'][Math.floor(Math.random() * 5)] as LogEvent['type'],
          severity: ['info', 'warning', 'error', 'success'][Math.floor(Math.random() * 4)] as LogEvent['severity'],
          actor: ['CipherMaster', 'FirefoxNinja', 'CodeBreaker', 'System', 'Gamemaster'][Math.floor(Math.random() * 5)],
          action: 'SIMULATED_EVENT',
          details: 'This is a simulated event for demonstration',
          metadata: { simulated: true },
        }
        setEvents(prev => [newEvent, ...prev])
      }, 10000)

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getTypeIcon = (type: LogEvent['type']) => {
    switch (type) {
      case 'game': return <Settings className="w-4 h-4" />
      case 'player': return <Users className="w-4 h-4" />
      case 'challenge': return <Trophy className="w-4 h-4" />
      case 'alliance': return <Users className="w-4 h-4" />
      case 'system': return <Zap className="w-4 h-4" />
      case 'admin': return <Settings className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: LogEvent['type']) => {
    switch (type) {
      case 'game': return 'bg-gray-500/20 text-gray-300 border-gray-500/20'
      case 'player': return 'bg-green-500/20 text-green-300 border-green-500/20'
      case 'challenge': return 'bg-purple-500/20 text-purple-300 border-purple-500/20'
      case 'alliance': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20'
      case 'system': return 'bg-gray-500/20 text-gray-300 border-gray-500/20'
      case 'admin': return 'bg-red-500/20 text-red-300 border-red-500/20'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/20'
    }
  }

  const getSeverityIcon = (severity: LogEvent['severity']) => {
    switch (severity) {
      case 'success': return <CheckCircle2 className="w-4 h-4" />
      case 'warning': return <AlertTriangle className="w-4 h-4" />
      case 'error': return <XCircle className="w-4 h-4" />
      case 'info': return <Info className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const getSeverityColor = (severity: LogEvent['severity']) => {
    switch (severity) {
      case 'success': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'error': return 'text-red-400'
      case 'info': return 'text-white'
      default: return 'text-gray-400'
    }
  }

  const handleExportLogs = () => {
    const dataStr = JSON.stringify(filteredEvents, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `game-logs-${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleClearLogs = () => {
    setEvents([])
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
        <Activity className="w-6 h-6 animate-pulse" />
        Event Log & Monitoring
      </h2>

      {/* Controls */}
      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search events by actor, action, or details..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-gray-800/50 text-white placeholder-gray-400 font-mono"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as typeof filterType)}
              className="bg-white/5 border border-gray-800/50 text-white font-mono rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Types</option>
              <option value="game">Game</option>
              <option value="player">Player</option>
              <option value="challenge">Challenge</option>
              <option value="alliance">Alliance</option>
              <option value="system">System</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={filterSeverity}
              onChange={e => setFilterSeverity(e.target.value as typeof filterSeverity)}
              className="bg-white/5 border border-gray-800/50 text-white font-mono rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Severity</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`font-mono ${
                autoRefresh
                  ? 'bg-green-500/20 border-green-500/50 text-green-300'
                  : 'bg-gray-500/20 border-gray-500/50 text-gray-300'
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              {autoRefresh ? 'LIVE' : 'PAUSED'}
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            onClick={handleExportLogs}
            className="bg-white/20 border-white/50 text-white hover:bg-white/30 font-mono"
          >
            <Download className="w-4 h-4 mr-2" />
            EXPORT
          </Button>

          <Button
            size="sm"
            onClick={handleClearLogs}
            className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 font-mono"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            CLEAR
          </Button>

          <div className="flex-1"></div>

          <div className="text-sm text-gray-400 font-mono">
            Showing
            {' '}
            {filteredEvents.length}
            {' '}
            of
            {' '}
            {events.length}
            {' '}
            events
          </div>
        </div>
      </div>

      {/* Event Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: events.length, color: 'text-white' },
          { label: 'Errors', value: events.filter(e => e.severity === 'error').length, color: 'text-red-400' },
          { label: 'Warnings', value: events.filter(e => e.severity === 'warning').length, color: 'text-yellow-400' },
          { label: 'Success', value: events.filter(e => e.severity === 'success').length, color: 'text-green-400' },
        ].map((stat, index) => (
          <div key={index} className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4 text-center">
            <div className={`text-2xl font-mono font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-400 font-mono text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Event List */}
      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 animate-pulse" />
          Event Stream
        </h3>

        <ScrollArea className="h-96">
          <div className="space-y-2">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`mt-0.5 ${getSeverityColor(event.severity)}`}>
                      {getSeverityIcon(event.severity)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className={getTypeColor(event.type)}>
                          <div className="flex items-center gap-1">
                            {getTypeIcon(event.type)}
                            {event.type.toUpperCase()}
                          </div>
                        </Badge>

                        <span className="text-white font-mono text-sm font-semibold">{event.actor}</span>
                        <span className="text-gray-400 font-mono text-sm">→</span>
                        <span className="text-white font-mono text-sm">{event.action}</span>

                        {event.target && (
                          <>
                            <span className="text-gray-400 font-mono text-sm">→</span>
                            <span className="text-yellow-400 font-mono text-sm">{event.target}</span>
                          </>
                        )}
                      </div>

                      <div className="text-gray-300 font-mono text-xs mb-2">
                        {event.details}
                      </div>

                      {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <div className="text-xs text-gray-500 font-mono">
                          {Object.entries(event.metadata).map(([key, value]) => (
                            <span key={key} className="mr-3">
                              {key}
                              :
                              {JSON.stringify(value)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 font-mono whitespace-nowrap ml-4">
                    {event.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {filteredEvents.length === 0 && (
              <div className="text-center text-gray-400 font-mono text-sm py-8">
                No events match the current filters
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Quick Filters */}
      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 animate-pulse" />
          Quick Filters
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            size="sm"
            onClick={() => {
              setFilterSeverity('error')
              setFilterType('all')
            }}
            className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 font-mono text-xs"
          >
            <XCircle className="w-4 h-4 mr-2" />
            ERRORS ONLY
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setFilterType('admin')
              setFilterSeverity('all')
            }}
            className="bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30 font-mono text-xs"
          >
            <Settings className="w-4 h-4 mr-2" />
            ADMIN ACTIONS
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setFilterType('challenge')
              setFilterSeverity('success')
            }}
            className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30 font-mono text-xs"
          >
            <Trophy className="w-4 h-4 mr-2" />
            COMPLETIONS
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setFilterType('all')
              setFilterSeverity('all')
              setSearchTerm('')
            }}
            className="bg-gray-500/20 border-gray-500/50 text-gray-300 hover:bg-gray-500/30 font-mono text-xs"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            CLEAR ALL
          </Button>
        </div>
      </div>
    </div>
  )
}
