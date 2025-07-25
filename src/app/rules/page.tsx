'use client'

import {
  AlertTriangle,
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Code,
  Crosshair,
  Crown,
  Eye,
  ChromeIcon as Firefox,
  Gamepad2,
  Heart,
  Puzzle,
  Search,
  Settings,
  Shield,
  Star,
  Sword,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  Users,
  XCircle,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import { ScrollArea } from '@/shadcn/ui/scroll-area'
import './rules.css'

const rulesSections = [
  { id: 'overview', title: 'Game Overview', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'core', title: 'Core Mechanics', icon: <Settings className="w-4 h-4" /> },
  { id: 'round1', title: 'Round 1: Foundation', icon: <Target className="w-4 h-4" /> },
  { id: 'round2', title: 'Round 2: Director\'s Game', icon: <Crown className="w-4 h-4" /> },
  { id: 'round3', title: 'Round 3: Betrayal Finale', icon: <Sword className="w-4 h-4" /> },
  { id: 'gamemaster', title: 'Gamemaster Controls', icon: <Shield className="w-4 h-4" /> },
  { id: 'victory', title: 'Victory Conditions', icon: <Trophy className="w-4 h-4" /> },
]

export default function RulesPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [glitchEffect, setGlitchEffect] = useState(false)
  const [sectionGlitch, setSectionGlitch] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchEffect(true)
      setTimeout(() => setGlitchEffect(false), 200)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const sectionGlitchInterval = setInterval(() => {
      const randomSection = rulesSections[Math.floor(Math.random() * rulesSections.length)].id
      setSectionGlitch(randomSection)
      setTimeout(() => setSectionGlitch(null), 300)
    }, 4000)
    return () => clearInterval(sectionGlitchInterval)
  }, [])

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 hide-mobile">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-white/40 rounded-lg bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm flex items-center justify-center animate-pulse">
              <div className="text-white font-mono text-lg font-bold">{'</>'}</div>
              {sectionGlitch === 'overview' && (
                <div className="absolute inset-0 bg-red-500/20 rounded-lg">
                  <div className="absolute top-1 left-0 right-0 h-px bg-red-500/80"></div>
                  <div className="absolute bottom-1 left-0 right-0 h-px bg-red-500/60"></div>
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
              className={`text-4xl font-mono font-bold text-white relative glitch-text ${
                sectionGlitch === 'overview' ? 'glitch-active' : ''
              }`}
            >
              <span className="relative z-10">Firefox Cipher</span>
              <span className="absolute top-0 left-0 text-red-500/70 glitch-layer-1">Firefox Cipher</span>
              <span className="absolute top-0 left-0 text-blue-500/50 glitch-layer-2">Firefox Cipher</span>
            </h1>
          </div>
        </div>

        <div className="relative flex items-center justify-center gap-3 hide-mobile">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-mono text-sm font-semibold">LIVE</span>
          </div>
          <div className="w-px h-4 bg-gray-600"></div>
          <div className="flex items-center gap-2">
            <span className="text-white font-mono text-lg font-bold">30</span>
            <span className="text-gray-400 font-mono text-sm">users registered</span>
          </div>
          <div className="w-px h-4 bg-gray-600"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-red-400 font-mono text-sm">REGISTRATION_OPEN</span>
          </div>
        </div>

        <div className="relative mx-auto w-32 h-1">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-0 w-2 h-1 bg-white/80 scan-line"></div>
        </div>
      </div>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h2 className="text-xl font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 animate-pulse" />
          Game Description
        </h2>
        <p className="text-gray-300 font-mono text-sm leading-relaxed">
          A 3-round competitive treasure hunt where participants earn points through various challenges, with dynamic
          gameplay that ensures anyone can win until the very end. Navigate through web-based puzzles, Firefox-specific
          challenges, and strategic betrayals in this ultimate digital conspiracy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4 text-center">
          <Target className="w-8 h-8 text-white mx-auto mb-2 animate-pulse" />
          <h3 className="text-white font-mono font-semibold mb-1">3 Rounds</h3>
          <p className="text-gray-400 font-mono text-xs">Foundation, Director's Game, Betrayal Finale</p>
        </div>
        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4 text-center">
          <Users className="w-8 h-8 text-white mx-auto mb-2 animate-pulse" />
          <h3 className="text-white font-mono font-semibold mb-1">Dynamic Alliances</h3>
          <p className="text-gray-400 font-mono text-xs">Form, betray, and strategize with other players</p>
        </div>
        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4 text-center">
          <Zap className="w-8 h-8 text-white mx-auto mb-2 animate-pulse" />
          <h3 className="text-white font-mono font-semibold mb-1">Special Powers</h3>
          <p className="text-gray-400 font-mono text-xs">Lifelines, sabotage, and strategic abilities</p>
        </div>
      </div>

      <div className="relative h-96 mt-8 overflow-hidden backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl hide-mobile">
        {[...Array.from({ length: 12 })].map((_, i) => (
          <div
            key={`matrix-${i}`}
            className={`absolute top-0 animate-pulse matrix-fall-${i}`}
            style={{
              left: `${i * 8 + 5}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {[...Array.from({ length: 8 })].map((_, j) => (
              <div
                key={j}
                className={`text-xs font-mono mb-2 ${
                  sectionGlitch === 'overview' ? 'text-red-500/60' : 'text-white/30'
                }`}
                style={{
                  opacity: Math.max(0.1, 1 - j * 0.15),
                }}
              >
                {['01', '10', '11', '00', 'FF', 'A3', '7E', 'B2', 'C4', 'D1'][Math.floor(Math.random() * 10)]}
              </div>
            ))}
          </div>
        ))}

        {[...Array.from({ length: 15 })].map((_, i) => (
          <div
            key={`fish-${i}`}
            className={`absolute transition-all duration-1000 ${glitchEffect ? 'animate-pulse' : ''}`}
            style={{
              left: `${5 + i * 6}%`,
              top: `${15 + Math.sin(i * 0.8) * 25}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            <div
              className={`relative group cursor-pointer float-${i % 8}`}
              style={{
                animationDelay: `${i * 0.2}s`,
              }}
            >
              <div className="relative">
                <div
                  className={`w-6 h-3 bg-gradient-to-r from-white/25 to-white/10 rounded-full border border-white/40 ${
                    sectionGlitch === 'overview' ? 'border-red-500/60 bg-red-500/25' : ''
                  }`}
                >
                  <div className="absolute left-0.5 top-0.5 w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse">
                    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                  </div>

                  <div className="absolute left-2 top-0.5 w-px h-2 bg-white/20"></div>
                  <div className="absolute left-3 top-0.5 w-px h-2 bg-white/15"></div>

                  {sectionGlitch === 'overview' && (
                    <>
                      <div className="absolute top-0 left-0 right-0 h-px bg-red-500/80"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-red-500/60"></div>
                      <div className="absolute top-1 left-0 right-0 h-px bg-red-500/40"></div>
                    </>
                  )}
                </div>

                <div
                  className={`absolute -right-1.5 top-0 w-0 h-0 border-l-3 border-t-1.5 border-b-1.5 border-l-white/25 border-t-transparent border-b-transparent ${
                    sectionGlitch === 'overview' ? 'border-l-red-500/60' : ''
                  }`}
                >
                </div>

                <div className="absolute -left-8 top-0.5 w-6 h-2 opacity-40">
                  {[...Array.from({ length: 4 })].map((_, j) => (
                    <div
                      key={j}
                      className={`absolute h-px bg-white/25 animate-pulse ${
                        sectionGlitch === 'overview' ? 'bg-red-500/50' : ''
                      }`}
                      style={{
                        top: `${j * 1}px`,
                        left: `${j * 1.5}px`,
                        width: `${10 - j * 2}px`,
                        animationDelay: `${j * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute inset-0 pointer-events-none">
          {[...Array.from({ length: 8 })].map((_, i) => (
            <div
              key={`h-grid-${i}`}
              className={`absolute w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse ${
                sectionGlitch === 'overview' ? 'via-red-500/30' : ''
              }`}
              style={{
                top: `${i * 12.5}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '3s',
              }}
            />
          ))}
          {[...Array.from({ length: 10 })].map((_, i) => (
            <div
              key={`v-grid-${i}`}
              className={`absolute h-full w-px bg-gradient-to-b from-transparent via-white/8 to-transparent animate-pulse ${
                sectionGlitch === 'overview' ? 'via-red-500/25' : ''
              }`}
              style={{
                left: `${i * 10}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '4s',
              }}
            />
          ))}
        </div>

        {[...Array.from({ length: 8 })].map((_, i) => (
          <div
            key={`hex-${i}`}
            className="absolute animate-pulse"
            style={{
              left: `${10 + i * 11}%`,
              top: `${20 + Math.sin(i * 1.2) * 30}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          >
            <div
              className={`w-4 h-4 border border-white/20 transform rotate-45 spin-slow ${
                sectionGlitch === 'overview' ? 'border-red-500/40' : ''
              }`}
              style={{
                animationDelay: `${Math.random() * 4}s`,
              }}
            >
              <div className="absolute inset-1 border border-white/10 transform -rotate-45"></div>
            </div>
          </div>
        ))}

        {[...Array.from({ length: 6 })].map((_, i) => (
          <div
            key={`stream-${i}`}
            className="absolute"
            style={{
              left: `${15 + i * 15}%`,
              top: '10%',
              height: '80%',
            }}
          >
            <div
              className={`w-px h-full bg-gradient-to-b from-transparent via-white/15 to-transparent animate-pulse data-stream ${
                sectionGlitch === 'overview' ? 'via-red-500/40' : ''
              }`}
              style={{
                animationDelay: `${i * 0.5}s`,
              }}
            />
            <div
              className={`absolute w-1 h-1 bg-white/60 rounded-full packet-flow ${
                sectionGlitch === 'overview' ? 'bg-red-500/80' : ''
              }`}
              style={{
                left: '-1px',
                animationDelay: `${i * 0.3}s`,
              }}
            />
          </div>
        ))}

        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse scan-horizontal-slow ${
              sectionGlitch === 'overview' ? 'via-red-500/60' : ''
            }`}
            style={{
              top: '25%',
              boxShadow: '0 0 10px rgba(255,255,255,0.3)',
            }}
          />
          <div
            className={`absolute h-full w-0.5 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-pulse scan-vertical-slow ${
              sectionGlitch === 'overview' ? 'via-red-500/60' : ''
            }`}
            style={{
              left: '70%',
              boxShadow: '0 0 10px rgba(255,255,255,0.3)',
            }}
          />
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'NEURAL_LINK', value: 'ACTIVE', status: 'success' },
              { label: 'FIREWALL', value: 'BYPASSED', status: 'warning' },
              { label: 'ENCRYPTION', value: 'CRACKING', status: 'process' },
            ].map((item, _i) => (
              <div key={item.label} className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">{item.label}</span>
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      item.status === 'success' ? 'bg-white' : item.status === 'warning' ? 'bg-red-400' : 'bg-gray-400'
                    }`}
                  />
                </div>
                <div
                  className={`text-xs font-mono font-semibold mt-1 ${
                    sectionGlitch === 'overview'
                      ? 'text-red-500/80'
                      : item.status === 'success'
                        ? 'text-white'
                        : item.status === 'warning'
                          ? 'text-red-400'
                          : 'text-gray-300'
                  }`}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-2 left-2 w-6 h-6">
          <div className="w-full h-full border-l-2 border-t-2 border-white/30 animate-pulse">
            <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-white/20"></div>
          </div>
        </div>
        <div className="absolute top-2 right-2 w-6 h-6">
          <div className="w-full h-full border-r-2 border-t-2 border-white/30 animate-pulse">
            <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-white/20"></div>
          </div>
        </div>
        <div className="absolute bottom-2 left-2 w-6 h-6">
          <div className="w-full h-full border-l-2 border-b-2 border-white/30 animate-pulse">
            <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-white/20"></div>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 w-6 h-6">
          <div className="w-full h-full border-r-2 border-b-2 border-white/30 animate-pulse">
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-white/20"></div>
          </div>
        </div>

        {[...Array.from({ length: 5 })].map((_, i) => (
          <div
            key={`circuit-${i}`}
            className="absolute animate-pulse"
            style={{
              left: `${20 + i * 15}%`,
              top: `${60 + Math.sin(i * 0.7) * 20}%`,
              animationDelay: `${i * 0.6}s`,
            }}
          >
            <div className={`relative ${sectionGlitch === 'overview' ? 'text-red-500/40' : 'text-white/20'}`}>
              <div className="w-8 h-px bg-current"></div>
              <div className="absolute right-0 top-0 w-px h-4 bg-current"></div>
              <div className="absolute right-0 bottom-0 w-4 h-px bg-current"></div>
              <div className="absolute right-3 top-2 w-1 h-1 bg-current rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCoreMechanics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
        <Settings className="w-6 h-6 animate-pulse" />
        Core Mechanics
      </h2>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 animate-pulse" />
          Point System
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-mono text-sm">Base Points:</span>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                10-50 points
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-mono text-sm">Bonus Points:</span>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                5-20 points
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-mono text-sm">Penalty Points:</span>
              <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/20">
                -5 to -15 points
              </Badge>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-mono text-sm">Group Multiplier:</span>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                1.5x points
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-mono text-sm">Alliance Max:</span>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                3 players
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 animate-pulse" />
          Lifelines (Limited Usage)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-white" />
                <span className="text-white font-mono text-sm font-semibold">Snitch</span>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                  2 uses
                </Badge>
              </div>
              <p className="text-gray-400 font-mono text-xs">
                View top 3 players' current point breakdown and recent activities
              </p>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sword className="w-4 h-4 text-red-400" />
                <span className="text-white font-mono text-sm font-semibold">Sabotage</span>
                <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/20 text-xs">
                  1 use
                </Badge>
              </div>
              <p className="text-gray-400 font-mono text-xs">
                Force a specific player to lose 25% of their round points
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-white font-mono text-sm font-semibold">Boost</span>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                  1 use
                </Badge>
              </div>
              <p className="text-gray-400 font-mono text-xs">Double points from next completed challenge</p>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-white" />
                <span className="text-white font-mono text-sm font-semibold">Intel</span>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                  3 uses
                </Badge>
              </div>
              <p className="text-gray-400 font-mono text-xs">Get a hint for any unsolved challenge</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderRound1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
        <Target className="w-6 h-6 animate-pulse" />
        Round 1: The Foundation Hunt
      </h2>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Crosshair className="w-5 h-5 animate-pulse" />
          Objective
        </h3>
        <p className="text-gray-300 font-mono text-sm">
          Solve web-based puzzles and challenges to establish initial rankings. This round sets the foundation for the
          entire competition and determines special roles for subsequent rounds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4">
          <h4 className="text-white font-mono font-semibold mb-3 flex items-center gap-2">
            <Code className="w-4 h-4 animate-pulse" />
            Technical Challenges
          </h4>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 mb-3">
            20-30 points each
          </Badge>
          <ul className="space-y-2 text-xs text-gray-400 font-mono">
            <li>• Inspect element to find hidden messages</li>
            <li>• Decode base64 strings in image metadata</li>
            <li>• Find secret endpoints via network analysis</li>
            <li>• Solve JavaScript console puzzles</li>
            <li>• Extract data from "broken" forms</li>
          </ul>
        </div>

        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4">
          <h4 className="text-white font-mono font-semibold mb-3 flex items-center gap-2">
            <Firefox className="w-4 h-4 animate-pulse" />
            Firefox-Specific
          </h4>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 mb-3">
            25-35 points each
          </Badge>
          <ul className="space-y-2 text-xs text-gray-400 font-mono">
            <li>• Use Firefox Developer Tools</li>
            <li>• Find Easter eggs in about:config</li>
            <li>• Challenges requiring specific extensions</li>
            <li>• Navigate using Firefox shortcuts</li>
            <li>• Decode messages in CSS animations</li>
          </ul>
        </div>

        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4">
          <h4 className="text-white font-mono font-semibold mb-3 flex items-center gap-2">
            <Puzzle className="w-4 h-4 animate-pulse" />
            Logic/Riddle
          </h4>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 mb-3">
            15-25 points each
          </Badge>
          <ul className="space-y-2 text-xs text-gray-400 font-mono">
            <li>• Cryptographic puzzles with Mozilla theme</li>
            <li>• Pattern recognition in hex colors</li>
            <li>• Solve riddles to unlock new pages</li>
            <li>• Mozilla/Firefox themed challenges</li>
          </ul>
        </div>
      </div>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 animate-pulse" />
          Special Round 1 Mechanics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-white" />
              <span className="text-white font-mono text-sm font-semibold">Discovery Bonus</span>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                +20 points
              </Badge>
            </div>
            <p className="text-gray-400 font-mono text-xs ml-6">For finding hidden challenges not listed publicly</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-white" />
              <span className="text-white font-mono text-sm font-semibold">Speed Bonus</span>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                +10/+7/+5
              </Badge>
            </div>
            <p className="text-gray-400 font-mono text-xs ml-6">First 3 solvers of each challenge</p>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4">End of Round 1</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-white animate-pulse" />
            <div>
              <p className="text-white font-mono text-sm font-semibold">Leaderboard Crown</p>
              <p className="text-gray-400 font-mono text-xs">Top player becomes "Round Director" for Round 2</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-white animate-pulse" />
            <div>
              <p className="text-white font-mono text-sm font-semibold">Bottom 3 Advantage</p>
              <p className="text-gray-400 font-mono text-xs">Receive "Underdog Tokens" for later rounds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderRound2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
        <Crown className="w-6 h-6 animate-pulse" />
        Round 2: The Director's Game
      </h2>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4">Objective</h3>
        <p className="text-gray-300 font-mono text-sm">
          The Round 1 winner designs challenges for others while trying to maintain their lead. This round introduces
          player-created content and strategic manipulation.
        </p>
      </div>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 animate-pulse" />
          Round Director Powers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-white" />
              <span className="text-white font-mono text-sm">Create 3 custom challenges</span>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                15-45 pts
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-white" />
              <span className="text-white font-mono text-sm">Set special rules for this round</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-white font-mono text-sm">Director's Curse</span>
              <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/20 text-xs">
                -30 pts
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span className="text-white font-mono text-sm">Director's Blessing</span>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                +40 pts
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4">
          <h4 className="text-white font-mono font-semibold mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 animate-pulse" />
            Competitive Challenges
          </h4>
          <ul className="space-y-2 text-xs text-gray-400 font-mono">
            <li>• Timed coding challenges</li>
            <li>• Knowledge quizzes about Mozilla history</li>
            <li>• Speed debugging races</li>
          </ul>
        </div>

        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4">
          <h4 className="text-white font-mono font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            Chaos Challenges
          </h4>
          <ul className="space-y-2 text-xs text-gray-400 font-mono">
            <li>• Random mystery boxes with unknown points</li>
            <li>• Challenges that change requirements mid-game</li>
            <li>• Scavenger hunts requiring physical interaction</li>
          </ul>
        </div>
      </div>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4">Special Round 2 Mechanics</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-white font-mono text-sm font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Underdog Tokens
              </h4>
              <p className="text-gray-400 font-mono text-xs mb-2">Bottom 3 from Round 1 can spend tokens for:</p>
              <ul className="space-y-1 text-xs text-gray-400 font-mono ml-4">
                <li>• Immunity from Director's Curse</li>
                <li>• Double points on one challenge</li>
                <li>• Force re-vote on peer-judged challenges</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-mono text-sm font-semibold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Alliance Benefits
              </h4>
              <p className="text-gray-400 font-mono text-xs mb-2">Allied players can:</p>
              <ul className="space-y-1 text-xs text-gray-400 font-mono ml-4">
                <li>• Combine skills for collaborative challenges</li>
                <li>• Share strategic information</li>
                <li>• Betrayal opportunity: steal 50% of allies' points</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 animate-pulse" />
          Dynamic Events (Random, Gamemaster Triggered)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-xs text-gray-400 font-mono">
            <li>• Point Redistribution: Randomly swap two players' total points</li>
            <li>• Challenge Multiplier: Next challenge worth 3x points</li>
          </ul>
          <ul className="space-y-2 text-xs text-gray-400 font-mono">
            <li>• Alliance Shake-up: All alliances dissolved, new ones can form</li>
            <li>• Wildcard Entry: Add surprise challenge worth 100 points</li>
          </ul>
        </div>
      </div>
    </div>
  )

  const renderRound3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
        <Sword className="w-6 h-6 animate-pulse" />
        Round 3: The Betrayal Finale
      </h2>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4">Objective</h3>
        <p className="text-gray-300 font-mono text-sm">
          Ultimate showdown where alliances crumble and anyone can win. This final round features dramatic point
          equalization and strategic betrayal mechanics.
        </p>
      </div>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4">Pre-Round Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-white font-mono text-sm font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Great Equalization
            </h4>
            <p className="text-gray-400 font-mono text-xs">
              All players' points adjusted to be within 50 points of each other
            </p>
          </div>
          <div>
            <h4 className="text-white font-mono text-sm font-semibold mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Alliance Ultimatum
            </h4>
            <p className="text-gray-400 font-mono text-xs">
              All existing alliances must choose to "unite" or "dissolve"
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
            <h5 className="text-white font-mono text-xs font-semibold mb-1">United Alliances:</h5>
            <p className="text-gray-400 font-mono text-xs">
              Share all points equally but compete for single winner slot
            </p>
          </div>
          <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
            <h5 className="text-white font-mono text-xs font-semibold mb-1">Dissolved Alliances:</h5>
            <p className="text-gray-400 font-mono text-xs">Keep individual points but lose collaboration benefits</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4">
          <h4 className="text-white font-mono font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 animate-pulse" />
            Phase 1: The Trials
          </h4>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 mb-3">
            30 minutes
          </Badge>
          <ul className="space-y-2 text-xs text-gray-400 font-mono">
            <li>• 5 individual challenges</li>
            <li>• No collaboration allowed</li>
            <li>• Hidden point values (10-80 points)</li>
            <li>• Can't attempt all challenges</li>
          </ul>
        </div>

        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4">
          <h4 className="text-white font-mono font-semibold mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 animate-pulse" />
            Phase 2: The Heist
          </h4>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 mb-3">
            45 minutes
          </Badge>
          <ul className="space-y-2 text-xs text-gray-400 font-mono">
            <li>• One massive collaborative challenge</li>
            <li>• Requires 6-8 players</li>
            <li>• Only 3 players win full reward</li>
            <li>• 150 points each for winners</li>
          </ul>
        </div>

        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-4">
          <h4 className="text-white font-mono font-semibold mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 animate-pulse" />
            Phase 3: Final Gambit
          </h4>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 mb-3">
            15 minutes
          </Badge>
          <ul className="space-y-2 text-xs text-gray-400 font-mono">
            <li>• Point Auction system</li>
            <li>• Last Stand for bottom 5 players</li>
            <li>• 200 point final challenge</li>
            <li>• Wildcard finale worth 300 points</li>
          </ul>
        </div>
      </div>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 animate-pulse" />
          End Game Mechanics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sword className="w-4 h-4 text-red-400" />
              <span className="text-white font-mono text-sm">Traitor's Reward</span>
              <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/20 text-xs">
                +100
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-white" />
              <span className="text-white font-mono text-sm">Loyalty Bonus</span>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                +50
              </Badge>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-white font-mono text-sm">Comeback King</span>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                +75
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-white" />
              <span className="text-white font-mono text-sm">Desperation Mode</span>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                5x risk
              </Badge>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-white font-mono text-sm">Sabotage Tokens</span>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                2 each
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-white" />
              <span className="text-white font-mono text-sm">Insurance Policy</span>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                backup
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderGamemaster = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
        <Shield className="w-6 h-6 animate-pulse" />
        Gamemaster Controls & Features
      </h2>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 animate-pulse" />
          Real-Time Powers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-xs text-gray-400 font-mono">
            <li>• Chaos Button: Instantly trigger random events</li>
            <li>• Point Manipulation: Adjust any player's points with public notification</li>
            <li>• Challenge Injection: Add surprise challenges mid-round</li>
            <li>• Alliance Disruption: Force alliance breakups or formations</li>
            <li>• Time Control: Extend/shorten round timers</li>
          </ul>
          <ul className="space-y-2 text-xs text-gray-400 font-mono">
            <li>• Rubber Band Mechanic: Auto point adjustments if gaps too large</li>
            <li>• Underdog Buffs: Boost bottom players' point multipliers</li>
            <li>• Leader Penalties: Small point drains for extended time at #1</li>
            <li>• Engagement Rewards: Bonus points for participation and creativity</li>
          </ul>
        </div>
      </div>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 animate-pulse" />
          Monitoring Dashboard
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="text-white font-mono text-sm font-semibold">Live Tracking</h4>
            <ul className="space-y-1 text-xs text-gray-400 font-mono">
              <li>• Live leaderboard with point breakdown</li>
              <li>• Alliance tracking and relationship mapping</li>
              <li>• Lifeline usage statistics</li>
              <li>• Player activity heatmaps</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-white font-mono text-sm font-semibold">Analytics</h4>
            <ul className="space-y-1 text-xs text-gray-400 font-mono">
              <li>• Challenge completion rates</li>
              <li>• Player engagement metrics</li>
              <li>• Alliance formation patterns</li>
              <li>• Point distribution analysis</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-white font-mono text-sm font-semibold">Balance Tools</h4>
            <ul className="space-y-1 text-xs text-gray-400 font-mono">
              <li>• Automatic balancing suggestions</li>
              <li>• Difficulty adjustment recommendations</li>
              <li>• Player skill assessment</li>
              <li>• Engagement optimization</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 animate-pulse" />
          Administrative Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-xs text-gray-400 font-mono">
            <li>• Challenge Editor: Create/modify challenges on the fly</li>
            <li>• Player Management: Kick/ban, reset scores, award special powers</li>
            <li>• Event Log: Track all actions for post-game analysis</li>
            <li>• Backup System: Save/restore game states</li>
          </ul>
          <ul className="space-y-2 text-xs text-gray-400 font-mono">
            <li>• Manual Scoring: Override automatic point calculations</li>
            <li>• Custom Rule Implementation: Add new mechanics mid-game</li>
            <li>• Player Communication: Direct messaging and announcements</li>
            <li>• Game State Export: Generate detailed reports</li>
          </ul>
        </div>
      </div>
    </div>
  )

  const renderVictory = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
        <Trophy className="w-6 h-6 animate-pulse" />
        Victory Conditions
      </h2>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 animate-pulse" />
          Primary Winner
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span className="text-gray-300 font-mono text-sm">Highest total points after all rounds and bonuses</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span className="text-gray-300 font-mono text-sm">
              Must have completed at least 50% of available challenges
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span className="text-gray-300 font-mono text-sm">Cannot have been disqualified for cheating</span>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 animate-pulse" />
          Secondary Recognition
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-white" />
                <span className="text-white font-mono text-sm font-semibold">Master Strategist</span>
              </div>
              <p className="text-gray-400 font-mono text-xs">Most successful alliance manipulations</p>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-4 h-4 text-white" />
                <span className="text-white font-mono text-sm font-semibold">Technical Wizard</span>
              </div>
              <p className="text-gray-400 font-mono text-xs">Highest score on technical challenges</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-white" />
                <span className="text-white font-mono text-sm font-semibold">Community Champion</span>
              </div>
              <p className="text-gray-400 font-mono text-xs">Most peer-voted achievements</p>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-white" />
                <span className="text-white font-mono text-sm font-semibold">Chaos Agent</span>
              </div>
              <p className="text-gray-400 font-mono text-xs">Most unpredictable gameplay patterns</p>
            </div>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-mono font-semibold text-white mb-4">Important Notes</h3>
        <div className="space-y-2 text-gray-300 font-mono text-sm">
          <p>• The game is designed to ensure anyone can win until the very end</p>
          <p>• Dynamic balancing mechanisms prevent runaway leaders</p>
          <p>• Strategic gameplay is rewarded over pure technical skill</p>
          <p>• Collaboration and betrayal are equally valid strategies</p>
          <p>• The Gamemaster has final authority on all disputes</p>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview()
      case 'core':
        return renderCoreMechanics()
      case 'round1':
        return renderRound1()
      case 'round2':
        return renderRound2()
      case 'round3':
        return renderRound3()
      case 'gamemaster':
        return renderGamemaster()
      case 'victory':
        return renderVictory()
      default:
        return renderOverview()
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex rules-root">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-950">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {[...Array.from({ length: 20 })].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-red-500/30 animate-pulse"
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

      <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-32 w-24 h-24 bg-red-500/5 rounded-full blur-2xl animate-bounce" />
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-red-500/5 rounded-full blur-xl animate-ping" />

      <div className="absolute top-4 left-4 right-4 z-30 rules-header">
        <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="relative bg-black/60 border-white/30 text-white hover:bg-white/10 font-mono overflow-hidden group transition-all duration-300"
                onClick={() => window.history.back()}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/40 group-hover:border-white/80 transition-colors"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-white/40 group-hover:border-white/80 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-white/40 group-hover:border-white/80 transition-colors"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/40 group-hover:border-white/80 transition-colors"></div>

                <div className="relative z-10 flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  <span className="tracking-wider">BACK_TO_GAME</span>
                </div>

                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 scan-line-button"></div>
              </Button>
              <div className="w-px h-6 bg-gray-700" />
              <h1 className="text-white font-mono text-lg font-bold">GAME RULES</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-gray-400 font-mono text-sm">Firefox Cipher: The Digital Conspiracy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-24 left-4 w-64 bottom-4 z-20 rules-sidebar">
        <div className="h-full backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800/50 rules-nav">
            <h2 className="text-white font-mono text-sm font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 animate-pulse" />
              NAVIGATION
            </h2>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {rulesSections.map(section => (
                <Button
                  key={section.id}
                  variant="ghost"
                  className={`w-full justify-start mb-1 font-mono text-xs h-10 ${
                    activeSection === section.id
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  } ${sectionGlitch === section.id ? 'animate-pulse border-red-500/50 bg-red-500/10' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.icon}
                  <span className="ml-2">{section.title}</span>
                  {sectionGlitch === section.id && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded">
                      {[...Array.from({ length: 3 })].map((_, i) => (
                        <div
                          key={i}
                          className="absolute h-px bg-red-500/50"
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
        </div>
      </div>

      <div className="absolute top-24 left-72 right-4 bottom-4 z-10 rules-content">
        <div
          className={`h-full backdrop-blur-2xl bg-gray-900/30 border border-gray-800/30 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-200 rules-section ${
            glitchEffect ? 'animate-pulse border-red-500/50' : ''
          }`}
        >
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%224%22%20height%3D%224%22%20viewBox%3D%220%200%204%204%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200h1v1H0V0zm2%202h1v1H2V2z%22%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.1%22/%3E%3C/svg%3E')] pointer-events-none" />

          <div className="absolute inset-0 opacity-5">
            {glitchEffect && (
              <>
                {[...Array.from({ length: 30 })].map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-px bg-red-500 animate-pulse"
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
              <div className="absolute top-1/4 left-0 right-0 h-px bg-red-500/50 animate-pulse" />
              <div className="absolute top-3/4 left-0 right-0 h-px bg-red-500/30 animate-pulse" />
            </>
          )}
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array.from({ length: 15 })].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/20 rounded-full animate-pulse"
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
