'use client'

import {
  AlertTriangle,
  CheckCircle2,
  Crown,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  Square,
  Timer,
  Users,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'

interface GameControlPanelProps {
  gameStatus: 'waiting' | 'active' | 'paused'
  setGameStatus: (status: 'waiting' | 'active' | 'paused') => void
}

export function GameControlPanel({ gameStatus, setGameStatus }: GameControlPanelProps) {
  const [currentRound, setCurrentRound] = useState(1)
  const [roundTimer, setRoundTimer] = useState(45)

  const handleStartGame = () => {
    setGameStatus('active')
  }

  const handlePauseGame = () => {
    setGameStatus('paused')
  }

  const handleStopGame = () => {
    setGameStatus('waiting')
    setCurrentRound(1)
    setRoundTimer(45)
  }

  const handleNextRound = () => {
    if (currentRound < 3) {
      setCurrentRound(currentRound + 1)
    }
  }

  const chaosEvents = [
    { name: 'Point Redistribution', description: 'Randomly swap two players\' total points' },
    { name: 'Challenge Multiplier', description: 'Next challenge worth 3x points' },
    { name: 'Alliance Shake-up', description: 'All alliances dissolved, new ones can form' },
    { name: 'Wildcard Entry', description: 'Add surprise challenge worth 100 points' },
    { name: 'Rubber Band', description: 'Boost bottom 3 players by 50 points each' },
    { name: 'Leader Penalty', description: 'Top player loses 25% of current round points' },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">

        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              gameStatus === 'active'
                ? 'bg-green-400'
                : gameStatus === 'paused' ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            >
            </div>
            <span className="text-white font-mono text-lg font-bold">
              {gameStatus.toUpperCase()}
            </span>
          </div>
          <div className="w-px h-6 bg-gray-600"></div>
          <div className="flex items-center gap-2">
            <span className="text-white font-mono text-sm">Round</span>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              {currentRound}
              /3
            </Badge>
          </div>
          <div className="w-px h-6 bg-gray-600"></div>
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-white" />
            <span className="text-white font-mono text-sm">
              {roundTimer}
              :00
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Controls */}
      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 animate-pulse" />
          Primary Controls
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={handleStartGame}
            disabled={gameStatus === 'active'}
            className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30 font-mono"
          >
            <Play className="w-4 h-4 mr-2" />
            START
          </Button>

          <Button
            onClick={handlePauseGame}
            disabled={gameStatus !== 'active'}
            className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30 font-mono"
          >
            <Pause className="w-4 h-4 mr-2" />
            PAUSE
          </Button>

          <Button
            onClick={handleStopGame}
            className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 font-mono"
          >
            <Square className="w-4 h-4 mr-2" />
            STOP
          </Button>

          <Button
            onClick={() => window.location.reload()}
            className="bg-white/20 border-white/50 text-white hover:bg-white/30 font-mono"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            RESET
          </Button>
        </div>
      </div>

      {/* Round Management */}
      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 animate-pulse" />
          Round Management
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-mono text-sm">Current Round:</span>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                Round
                {' '}
                {currentRound}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-mono text-sm">Phase:</span>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                {currentRound === 1 ? 'Foundation' : currentRound === 2 ? 'Director\'s Game' : 'Betrayal Finale'}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleNextRound}
              disabled={currentRound >= 3 || gameStatus !== 'active'}
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 font-mono text-xs"
            >
              ADVANCE ROUND
            </Button>
            <Button
              onClick={() => setRoundTimer(prev => Math.max(0, prev - 5))}
              disabled={gameStatus !== 'active'}
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 font-mono text-xs"
            >
              -5 MIN
            </Button>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => { /* Trigger Great Equalization */ }}
              disabled={currentRound !== 3}
              className="w-full bg-yellow-500/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30 font-mono text-xs"
            >
              GREAT EQUALIZATION
            </Button>
            <Button
              onClick={() => setRoundTimer(prev => prev + 5)}
              disabled={gameStatus !== 'active'}
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 font-mono text-xs"
            >
              +5 MIN
            </Button>
          </div>
        </div>
      </div>

      {/* Chaos Controls */}
      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 animate-pulse" />
          Chaos Engine
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Button
            className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 font-mono"
            onClick={() => {
              const randomEvent = chaosEvents[Math.floor(Math.random() * chaosEvents.length)]
              // Trigger random event
              // eslint-disable-next-line no-console
              console.log('Triggered:', randomEvent.name)
            }}
          >
            <Shuffle className="w-4 h-4 mr-2" />
            CHAOS BUTTON
          </Button>

          <Button
            className="bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30 font-mono"
            onClick={() => { /* Auto-balance points */ }}
          >
            <Users className="w-4 h-4 mr-2" />
            AUTO BALANCE
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {chaosEvents.map((event, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="justify-start bg-white/5 border-gray-800/50 text-gray-300 hover:bg-white/10 font-mono text-xs h-auto p-3"
              onClick={() => { /* Trigger specific event */ }}
            >
              <div className="text-left">
                <div className="font-semibold text-white">{event.name}</div>
                <div className="text-xs text-gray-400 mt-1">{event.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4">System Status</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'DATABASE', status: 'ONLINE', icon: CheckCircle2, color: 'green' },
            { label: 'WEBSOCKET', status: 'CONNECTED', icon: CheckCircle2, color: 'green' },
            { label: 'CHALLENGES', status: 'LOADED', icon: CheckCircle2, color: 'green' },
            { label: 'PLAYERS', status: '30 ACTIVE', icon: Users, color: 'white' },
            { label: 'ALLIANCES', status: '8 FORMED', icon: Users, color: 'white' },
            { label: 'ALERTS', status: '2 PENDING', icon: AlertTriangle, color: 'yellow' },
          ].map((item, index) => (
            <div key={index} className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-400">{item.label}</span>
                <item.icon className={`w-4 h-4 ${
                  item.color === 'green'
                    ? 'text-green-400'
                    : item.color === 'yellow'
                      ? 'text-yellow-400'
                      : item.color === 'red' ? 'text-red-400' : 'text-white'
                } animate-pulse`}
                />
              </div>
              <div className={`text-xs font-mono font-semibold mt-1 ${
                item.color === 'green'
                  ? 'text-green-400'
                  : item.color === 'yellow'
                    ? 'text-yellow-400'
                    : item.color === 'red' ? 'text-red-400' : 'text-white'
              }`}
              >
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
