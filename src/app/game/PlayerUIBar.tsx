'use client'

import { AlertTriangle, Clock, Heart, Shield, Target, Trophy, Zap } from 'lucide-react'
import { Button } from '@/shadcn/ui/button'

interface Player {
  name: string
  points: number
  rank: number
  lifelines: number
  hints: number
  timeLeft: string
  streak: number
  level: number
}

interface PlayerUIBarProps {
  currentPlayer: Player
}

export function PlayerUIBar({ currentPlayer }: PlayerUIBarProps) {
  return (
    <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 shadow-2xl">
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-2 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center animate-pulse">
              <span className="text-white font-mono text-xs font-bold">{currentPlayer.name.charAt(0)}</span>
            </div>
            <div>
              <p className="text-white font-mono text-sm font-semibold">{currentPlayer.name}</p>
              <p className="text-gray-400 font-mono text-xs">
                Level
                {currentPlayer.level}
              </p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Trophy className="w-4 h-4 text-white animate-pulse" />
            <span className="text-white font-mono text-lg font-bold">{currentPlayer.points.toLocaleString()}</span>
          </div>
          <p className="text-gray-400 font-mono text-xs">POINTS</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Heart className="w-4 h-4 text-white animate-pulse" />
            <span className="text-white font-mono text-lg font-bold">{currentPlayer.lifelines}</span>
          </div>
          <p className="text-gray-400 font-mono text-xs">LIFELINES</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-4 h-4 text-white animate-pulse" />
            <span className="text-white font-mono text-lg font-bold">{currentPlayer.timeLeft}</span>
          </div>
          <p className="text-gray-400 font-mono text-xs">TIME LEFT</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="w-4 h-4 text-white animate-pulse" />
            <span className="text-white font-mono text-lg font-bold">{currentPlayer.streak}</span>
          </div>
          <p className="text-gray-400 font-mono text-xs">STREAK</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-800/50">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/20 text-white hover:bg-white/10 font-mono animate-pulse"
        >
          <Shield className="w-4 h-4 mr-2" />
          Use Hint (
          {currentPlayer.hints}
          )
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/20 text-white hover:bg-white/10 font-mono animate-pulse"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Skip Challenge
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/20 text-white hover:bg-white/10 font-mono animate-pulse"
        >
          <Target className="w-4 h-4 mr-2" />
          Submit Flag
        </Button>
      </div>
    </div>
  )
}
