'use client'

import {
  Activity,
  BarChart3,
  Clock,
  Download,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import { ScrollArea } from '@/shadcn/ui/scroll-area'

interface AnalyticsData {
  playerEngagement: {
    totalPlayers: number
    activeNow: number
    averageSessionTime: number
    retentionRate: number
  }
  challengeStats: {
    totalChallenges: number
    completionRate: number
    averageAttempts: number
    mostDifficult: string
    easiest: string
  }
  pointDistribution: {
    average: number
    median: number
    highest: number
    lowest: number
    standardDeviation: number
  }
  allianceMetrics: {
    totalAlliances: number
    averageSize: number
    betrayalRate: number
    successRate: number
  }
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | 'all'>('24h')
  const [refreshing, setRefreshing] = useState(false)

  const analyticsData: AnalyticsData = {
    playerEngagement: {
      totalPlayers: 30,
      activeNow: 24,
      averageSessionTime: 45,
      retentionRate: 0.85,
    },
    challengeStats: {
      totalChallenges: 25,
      completionRate: 0.68,
      averageAttempts: 2.3,
      mostDifficult: 'Network Traffic Analysis',
      easiest: 'Hidden Console Messages',
    },
    pointDistribution: {
      average: 185,
      median: 175,
      highest: 245,
      lowest: 85,
      standardDeviation: 42,
    },
    allianceMetrics: {
      totalAlliances: 8,
      averageSize: 2.4,
      betrayalRate: 0.15,
      successRate: 0.72,
    },
  }

  const challengePerformance = [
    { name: 'Hidden Console Messages', attempts: 15, completions: 11, successRate: 0.73, avgTime: 180 },
    { name: 'Network Traffic Analysis', attempts: 8, completions: 2, successRate: 0.25, avgTime: 420 },
    { name: 'Firefox Extension Hunt', attempts: 12, completions: 7, successRate: 0.58, avgTime: 300 },
    { name: 'CSS Animation Decoder', attempts: 10, completions: 8, successRate: 0.80, avgTime: 240 },
    { name: 'JavaScript Puzzle Box', attempts: 18, completions: 12, successRate: 0.67, avgTime: 360 },
  ]

  const playerActivity = [
    { hour: '14:00', active: 18, challenges: 5, points: 120 },
    { hour: '14:30', active: 22, challenges: 8, points: 180 },
    { hour: '15:00', active: 24, challenges: 12, points: 240 },
    { hour: '15:30', active: 20, challenges: 6, points: 150 },
    { hour: '16:00', active: 19, challenges: 4, points: 90 },
  ]

  const topPerformers = [
    { username: 'CipherMaster', points: 245, challenges: 8, alliances: 1, lifelines: 3 },
    { username: 'FirefoxNinja', points: 230, challenges: 7, alliances: 1, lifelines: 2 },
    { username: 'CodeBreaker', points: 220, challenges: 6, alliances: 0, lifelines: 4 },
    { username: 'DevHacker', points: 195, challenges: 5, alliances: 1, lifelines: 1 },
    { username: 'ScriptKiddie', points: 180, challenges: 4, alliances: 1, lifelines: 2 },
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      timeRange,
      analytics: analyticsData,
      challengePerformance,
      playerActivity,
      topPerformers,
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 animate-pulse" />
          Analytics Dashboard
        </h2>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {(['1h', '24h', '7d', 'all'] as const).map(range => (
              <Button
                key={range}
                variant="outline"
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`font-mono text-xs ${
                  timeRange === range
                    ? 'bg-white/20 border-white/50 text-white'
                    : 'bg-white/5 border-gray-800/50 text-gray-300 hover:bg-white/10'
                }`}
              >
                {range.toUpperCase()}
              </Button>
            ))}
          </div>

          <Button
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white/20 border-white/50 text-white hover:bg-white/30 font-mono"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            REFRESH
          </Button>

          <Button
            size="sm"
            onClick={handleExport}
            className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30 font-mono"
          >
            <Download className="w-4 h-4 mr-2" />
            EXPORT
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-white" />
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/20 text-xs">
              +12%
            </Badge>
          </div>
          <div className="text-2xl font-mono font-bold text-white">{analyticsData.playerEngagement.activeNow}</div>
          <div className="text-sm text-gray-400 font-mono">Active Players</div>
          <div className="text-xs text-gray-500 font-mono mt-1">
            of
            {' '}
            {analyticsData.playerEngagement.totalPlayers}
            {' '}
            total
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/20 text-xs">
              +8%
            </Badge>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {Math.round(analyticsData.challengeStats.completionRate * 100)}
            %
          </div>
          <div className="text-sm text-gray-400 font-mono">Completion Rate</div>
          <div className="text-xs text-gray-500 font-mono mt-1">
            {analyticsData.challengeStats.averageAttempts}
            {' '}
            avg attempts
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6 text-green-400" />
            <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/20 text-xs">
              -5%
            </Badge>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {analyticsData.playerEngagement.averageSessionTime}
            m
          </div>
          <div className="text-sm text-gray-400 font-mono">Avg Session</div>
          <div className="text-xs text-gray-500 font-mono mt-1">
            {Math.round(analyticsData.playerEngagement.retentionRate * 100)}
            % retention
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6 text-purple-400" />
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/20 text-xs">
              +15%
            </Badge>
          </div>
          <div className="text-2xl font-mono font-bold text-white">{analyticsData.pointDistribution.average}</div>
          <div className="text-sm text-gray-400 font-mono">Avg Points</div>
          <div className="text-xs text-gray-500 font-mono mt-1">
            σ =
            {' '}
            {analyticsData.pointDistribution.standardDeviation}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Challenge Performance */}
        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 animate-pulse" />
            Challenge Performance
          </h3>

          <ScrollArea className="h-80">
            <div className="space-y-3">
              {challengePerformance.map((challenge, index) => (
                <div key={index} className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-mono text-sm font-semibold">{challenge.name}</span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        challenge.successRate >= 0.7
                          ? 'bg-green-500/20 text-green-300 border-green-500/20'
                          : challenge.successRate >= 0.5
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20'
                            : 'bg-red-500/20 text-red-300 border-red-500/20'
                      }`}
                    >
                      {Math.round(challenge.successRate * 100)}
                      %
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Attempts:</span>
                      <div className="text-white font-mono">{challenge.attempts}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Completed:</span>
                      <div className="text-white font-mono">{challenge.completions}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Avg Time:</span>
                      <div className="text-white font-mono">
                        {Math.round(challenge.avgTime / 60)}
                        m
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${
                        challenge.successRate >= 0.7
                          ? 'bg-green-400'
                          : challenge.successRate >= 0.5 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${challenge.successRate * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Player Activity Timeline */}
        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 animate-pulse" />
            Activity Timeline
          </h3>

          <div className="space-y-4">
            {playerActivity.map((activity, index) => (
              <div key={index} className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-mono text-sm font-semibold">{activity.hour}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                      {activity.active}
                      {' '}
                      active
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400">Challenges:</span>
                    <div className="text-white font-mono">{activity.challenges}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Points Earned:</span>
                    <div className="text-white font-mono">{activity.points}</div>
                  </div>
                </div>

                {/* Activity visualization */}
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded ${
                        i < Math.floor((activity.active / 30) * 10) ? 'bg-white' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 animate-pulse" />
            Top Performers
          </h3>

          <div className="space-y-3">
            {topPerformers.map((player, index) => (
              <div key={index} className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20 w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <div className="text-white font-mono text-sm font-semibold">{player.username}</div>
                      <div className="text-xs text-gray-400 font-mono">
                        {player.challenges}
                        {' '}
                        challenges •
                        {player.alliances}
                        {' '}
                        alliance
                        {player.alliances !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-white font-mono font-bold">{player.points}</div>
                    <div className="text-xs text-gray-400 font-mono">
                      {player.lifelines}
                      {' '}
                      lifelines
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alliance Analytics */}
        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 animate-pulse" />
            Alliance Analytics
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-mono font-bold text-white">{analyticsData.allianceMetrics.totalAlliances}</div>
              <div className="text-xs text-gray-400 font-mono">Total Alliances</div>
            </div>

            <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-mono font-bold text-white">{analyticsData.allianceMetrics.averageSize}</div>
              <div className="text-xs text-gray-400 font-mono">Avg Size</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-mono text-sm">Success Rate:</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 bg-green-400 rounded-full"
                    style={{ width: `${analyticsData.allianceMetrics.successRate * 100}%` }}
                  />
                </div>
                <span className="text-white font-mono text-sm">
                  {Math.round(analyticsData.allianceMetrics.successRate * 100)}
                  %
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-mono text-sm">Betrayal Rate:</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 bg-red-400 rounded-full"
                    style={{ width: `${analyticsData.allianceMetrics.betrayalRate * 100}%` }}
                  />
                </div>
                <span className="text-white font-mono text-sm">
                  {Math.round(analyticsData.allianceMetrics.betrayalRate * 100)}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800/50">
            <h4 className="text-white font-mono text-sm font-semibold mb-2">Alliance Distribution</h4>
            <div className="space-y-2">
              {[
                { size: '2 players', count: 5, color: 'bg-white' },
                { size: '3 players', count: 2, color: 'bg-green-400' },
                { size: '4+ players', count: 1, color: 'bg-yellow-400' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-mono">
                    {item.size}
                    :
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-gray-700 rounded-full h-1">
                      <div
                        className={`h-1 ${item.color} rounded-full`}
                        style={{ width: `${(item.count / analyticsData.allianceMetrics.totalAlliances) * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-mono">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Performance */}
      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 animate-pulse" />
          System Performance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Response Time', value: '45ms', status: 'good', trend: 'down' },
            { label: 'Memory Usage', value: '68%', status: 'warning', trend: 'up' },
            { label: 'Active Connections', value: '24', status: 'good', trend: 'stable' },
            { label: 'Error Rate', value: '0.2%', status: 'good', trend: 'down' },
          ].map((metric, index) => (
            <div key={index} className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-400 font-mono text-xs">{metric.label}</span>
                <div className={`w-2 h-2 rounded-full ${
                  metric.status === 'good'
                    ? 'bg-green-400'
                    : metric.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                } animate-pulse`}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white font-mono font-bold">{metric.value}</span>
                <div className={`${
                  metric.trend === 'up'
                    ? 'text-red-400'
                    : metric.trend === 'down' ? 'text-green-400' : 'text-gray-400'
                }`}
                >
                  {metric.trend === 'up'
                    ? <TrendingUp className="w-3 h-3" />
                    : metric.trend === 'down'
                      ? <TrendingDown className="w-3 h-3" />
                      : <div className="w-3 h-0.5 bg-gray-400" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
