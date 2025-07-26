'use client'

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Code,
  Crown,
  Eye,
  Settings,
  Shield,
  Users,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { AnalyticsDashboard } from '@/components/gamemaster/AnalyticsDashboard'
import { ChallengeEditor } from '@/components/gamemaster/ChallengeEditor'
import { EventLog } from '@/components/gamemaster/EventLog'
import { GameControlPanel } from '@/components/gamemaster/GameControlPanel'
import { LiveMonitoring } from '@/components/gamemaster/LiveMonitoring'
import { PlayerManagement } from '@/components/gamemaster/PlayerManagement'
import { Button } from '@/shadcn/ui/button'
import { ScrollArea } from '@/shadcn/ui/scroll-area'
import './gamemaster.css'

const dashboardSections = [
  { id: 'control', title: 'Game Control', icon: <Shield className="w-4 h-4" /> },
  { id: 'monitoring', title: 'Live Monitoring', icon: <Eye className="w-4 h-4" /> },
  { id: 'players', title: 'Player Management', icon: <Users className="w-4 h-4" /> },
  { id: 'challenges', title: 'Challenge Editor', icon: <Code className="w-4 h-4" /> },
  { id: 'events', title: 'Event Log', icon: <Activity className="w-4 h-4" /> },
  { id: 'analytics', title: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
]

export default function GamemasterDashboard() {
  const [activeSection, setActiveSection] = useState('control')
  const [glitchEffect, setGlitchEffect] = useState(false)
  const [sectionGlitch, setSectionGlitch] = useState<string | null>(null)
  const [gameStatus, setGameStatus] = useState<'waiting' | 'active' | 'paused'>('waiting')

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchEffect(true)
      setTimeout(() => setGlitchEffect(false), 200)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const sectionGlitchInterval = setInterval(() => {
      const randomSection = dashboardSections[Math.floor(Math.random() * dashboardSections.length)].id
      setSectionGlitch(randomSection)
      setTimeout(() => setSectionGlitch(null), 300)
    }, 4000)
    return () => clearInterval(sectionGlitchInterval)
  }, [])

  const renderContent = () => {
    switch (activeSection) {
      case 'control':
        return <GameControlPanel gameStatus={gameStatus} setGameStatus={setGameStatus} />
      case 'monitoring':
        return <LiveMonitoring />
      case 'players':
        return <PlayerManagement />
      case 'challenges':
        return <ChallengeEditor />
      case 'events':
        return <EventLog />
      case 'analytics':
        return <AnalyticsDashboard />
      default:
        return <GameControlPanel gameStatus={gameStatus} setGameStatus={setGameStatus} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex gamemaster-root">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {[...Array.from({ length: 20 })].map((_, i) => (
            <div
              key={i}
              className={`absolute h-px bg-white/30 animate-pulse ${sectionGlitch ? 'bg-white/50' : ''
              }`}
              style={{
                top: `${Math.floor(Math.random() * 100)}%`,
                left: 0,
                right: 0,
                height: `${Math.random() * 2}px`,
                opacity: Math.random() * 0.5 + 0.25,
                transform: `translateY(${Math.random() * 10 - 5}px)`,
                filter: 'blur(0.5px)',
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter%20id%3D%22noiseFilter%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23noiseFilter%29%22/%3E%3C/svg%3E')] opacity-[0.02]" />
      </div>

      {/* Ambient effects */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-32 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-bounce" />
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/5 rounded-full blur-xl animate-ping" />

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-30 gamemaster-header">
        <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl px-4 pt-4 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-10 border-2 border-white/40 rounded-lg bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm flex items-center justify-center animate-pulse">
                  <Crown className="text-white w-6 h-6" />
                  {sectionGlitch === 'control' && (
                    <div className="absolute inset-0 bg-white/20 rounded-lg">
                      <div className="absolute top-1 left-0 right-0 h-px bg-white/80"></div>
                      <div className="absolute bottom-1 left-0 right-0 h-px bg-white/60"></div>
                    </div>
                  )}
                </div>
                <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-white/60"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-white/60"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-white/60"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-white/60"></div>
              </div>
              <div className="relative">
                <h1
                  className={`text-4xl font-mono font-bold text-white relative glitch-text ${sectionGlitch === 'control' ? 'glitch-active' : ''
                  }`}
                >
                  <span className="relative z-10">Gamemaster</span>
                  <span className="absolute top-0 left-0 text-gray-500/70 glitch-layer-1">Gamemaster</span>
                  <span className="absolute top-0 left-0 text-gray-400/50 glitch-layer-2">Gamemaster</span>
                </h1>
              </div>
            </div>

            <div className="relative flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${gameStatus === 'active'
                  ? 'bg-green-400'
                  : gameStatus === 'paused' ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                >
                </div>
                <span className={`font-mono text-sm font-semibold ${gameStatus === 'active'
                  ? 'text-green-400'
                  : gameStatus === 'paused' ? 'text-yellow-400' : 'text-red-400'
                }`}
                >
                  {gameStatus.toUpperCase()}
                </span>
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono text-lg font-bold">30</span>
                <span className="text-gray-400 font-mono text-sm">players online</span>
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white animate-pulse" />
                <span className="text-white font-mono text-sm">ADMIN_MODE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="absolute top-24 left-4 w-64 bottom-4 z-20 gamemaster-sidebar mt-6">
        <div className="h-full backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800/50">
            <h2 className="text-white font-mono text-sm font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4 animate-pulse" />
              CONTROL PANELS
            </h2>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {dashboardSections.map(section => (
                <Button
                  key={section.id}
                  variant="ghost"
                  className={`w-full justify-start mb-1 font-mono text-xs h-10 ${activeSection === section.id
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  } ${sectionGlitch === section.id ? 'animate-pulse border-white/50 bg-white/10' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.icon}
                  <span className="ml-2">{section.title}</span>
                  {sectionGlitch === section.id && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded">
                      {[...Array.from({ length: 3 })].map((_, i) => (
                        <div
                          key={i}
                          className="absolute h-px bg-white/50"
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
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* Emergency Controls */}
          <div className="p-4 border-t border-gray-800/50">
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 font-mono text-xs"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              EMERGENCY STOP
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute top-24 left-72 right-4 bottom-4 z-10 gamemaster-content mt-6">
        <div
          className={`h-full backdrop-blur-2xl bg-gray-900/30 border border-gray-800/30 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-200 ${glitchEffect ? 'animate-pulse border-white/50' : ''
          }`}
        >
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%224%22%20height%3D%224%22%20viewBox%3D%220%200%204%204%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200h1v1H0V0zm2%202h1v1H2V2z%22%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.1%22/%3E%3C/svg%3E')] pointer-events-none" />

          <div className="absolute inset-0 opacity-5">
            {glitchEffect && (
              <>
                {[...Array.from({ length: 30 })].map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-px bg-white animate-pulse"
                    style={{
                      top: `${Math.floor(Math.random() * 100)}%`,
                      left: 0,
                      right: 0,
                      height: `${Math.random() * 2}px`,
                      opacity: Math.random() * 0.8 + 0.2,
                      transform: `translateY(${Math.random() * 10 - 5}px)`,
                    }}
                  />
                ))}
              </>
            )}
          </div>

          <ScrollArea className="h-full">
            <div className="p-8">{renderContent()}</div>
          </ScrollArea>

          {glitchEffect && (
            <>
              <div className="absolute top-1/4 left-0 right-0 h-px bg-white/50 animate-pulse" />
              <div className="absolute top-3/4 left-0 right-0 h-px bg-white/30 animate-pulse" />
            </>
          )}
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array.from({ length: 15 })].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
