'use client'

import {
  AlertTriangle,
  CheckCircle2,
  Code,
  Copy,
  Edit3,
  Eye,
  EyeOff,
  Chrome as Firefox,
  Pause,
  Play,
  Plus,
  Puzzle,
  Save,
  Target,
  Trash2,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import { Input } from '@/shadcn/ui/input'
import { ScrollArea } from '@/shadcn/ui/scroll-area'
import { Textarea } from '@/shadcn/ui/textarea'

interface Challenge {
  id: string
  title: string
  description: string
  type: 'technical' | 'firefox' | 'logic' | 'collaborative' | 'chaos'
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  points: number
  timeLimit: number | null
  round: 1 | 2 | 3
  status: 'draft' | 'active' | 'completed' | 'disabled'
  hints: string[]
  solution: string
  createdBy: 'system' | 'gamemaster' | 'director'
  completedBy: string[]
  attempts: number
  successRate: number
}

export function ChallengeEditor() {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Hidden Console Messages',
      description: 'Find the secret message hidden in the browser console',
      type: 'technical',
      difficulty: 'easy',
      points: 25,
      timeLimit: null,
      round: 1,
      status: 'active',
      hints: ['Check the console tab', 'Look for encoded messages'],
      solution: 'FIREFOX_CIPHER_2024',
      createdBy: 'system',
      completedBy: ['CipherMaster', 'FirefoxNinja'],
      attempts: 15,
      successRate: 0.73,
    },
    {
      id: '2',
      title: 'Network Traffic Analysis',
      description: 'Analyze network requests to find the hidden endpoint',
      type: 'technical',
      difficulty: 'medium',
      points: 35,
      timeLimit: 30,
      round: 1,
      status: 'active',
      hints: ['Use Firefox Developer Tools', 'Check the Network tab'],
      solution: '/api/secret/endpoint',
      createdBy: 'system',
      completedBy: ['CodeBreaker'],
      attempts: 8,
      successRate: 0.25,
    },
    // Add more mock challenges...
  ])

  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [filterType, setFilterType] = useState<'all' | Challenge['type']>('all')
  const [filterRound, setFilterRound] = useState<'all' | 1 | 2 | 3>('all')

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesType = filterType === 'all' || challenge.type === filterType
    const matchesRound = filterRound === 'all' || challenge.round === filterRound
    return matchesType && matchesRound
  })

  const getTypeIcon = (type: Challenge['type']) => {
    switch (type) {
      case 'technical': return <Code className="w-4 h-4" />
      case 'firefox': return <Firefox className="w-4 h-4" />
      case 'logic': return <Puzzle className="w-4 h-4" />
      case 'collaborative': return <Target className="w-4 h-4" />
      case 'chaos': return <Zap className="w-4 h-4" />
      default: return <Code className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: Challenge['type']) => {
    switch (type) {
      case 'technical': return 'bg-gray-500/20 text-gray-300 border-gray-500/20'
      case 'firefox': return 'bg-orange-500/20 text-orange-300 border-orange-500/20'
      case 'logic': return 'bg-purple-500/20 text-purple-300 border-purple-500/20'
      case 'collaborative': return 'bg-green-500/20 text-green-300 border-green-500/20'
      case 'chaos': return 'bg-red-500/20 text-red-300 border-red-500/20'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/20'
    }
  }

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300 border-green-500/20'
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20'
      case 'hard': return 'bg-orange-500/20 text-orange-300 border-orange-500/20'
      case 'expert': return 'bg-red-500/20 text-red-300 border-red-500/20'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/20'
    }
  }

  const getStatusColor = (status: Challenge['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/20'
      case 'draft': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20'
      case 'completed': return 'bg-gray-500/20 text-gray-300 border-gray-500/20'
      case 'disabled': return 'bg-red-500/20 text-red-300 border-red-500/20'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/20'
    }
  }

  const handleCreateChallenge = () => {
    const newChallenge: Challenge = {
      id: Date.now().toString(),
      title: 'New Challenge',
      description: '',
      type: 'technical',
      difficulty: 'medium',
      points: 25,
      timeLimit: null,
      round: 1,
      status: 'draft',
      hints: [],
      solution: '',
      createdBy: 'gamemaster',
      completedBy: [],
      attempts: 0,
      successRate: 0,
    }
    setEditingChallenge(newChallenge)
    setIsCreating(true)
  }

  const handleSaveChallenge = () => {
    if (editingChallenge) {
      if (isCreating) {
        setChallenges(prev => [...prev, editingChallenge])
      }
      else {
        setChallenges(prev => prev.map(c => c.id === editingChallenge.id ? editingChallenge : c))
      }
      setEditingChallenge(null)
      setIsCreating(false)
    }
  }

  const handleDeleteChallenge = (id: string) => {
    setChallenges(prev => prev.filter(c => c.id !== id))
    if (selectedChallenge === id) {
      setSelectedChallenge(null)
    }
  }

  const handleStatusToggle = (id: string) => {
    setChallenges(prev => prev.map(c =>
      c.id === id
        ? { ...c, status: c.status === 'active' ? 'disabled' : 'active' }
        : c,
    ))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
        <Code className="w-6 h-6 animate-pulse" />
        Challenge Editor
      </h2>

      {/* Filters and Actions */}
      <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2">
            <div className="flex gap-1">
              {(['all', 'technical', 'firefox', 'logic', 'collaborative', 'chaos'] as const).map(type => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterType(type)}
                  className={`font-mono text-xs ${
                    filterType === type
                      ? 'bg-white/20 border-white/50 text-white'
                      : 'bg-white/5 border-gray-800/50 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {type === 'all' ? 'ALL' : type.toUpperCase()}
                </Button>
              ))}
            </div>

            <div className="w-px h-6 bg-gray-600 mx-2"></div>

            <div className="flex gap-1">
              {(['all', 1, 2, 3] as const).map(round => (
                <Button
                  key={round}
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterRound(round)}
                  className={`font-mono text-xs ${
                    filterRound === round
                      ? 'bg-white/20 border-white/50 text-white'
                      : 'bg-white/5 border-gray-800/50 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {round === 'all' ? 'ALL' : `R${round}`}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleCreateChallenge}
            className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30 font-mono"
          >
            <Plus className="w-4 h-4 mr-2" />
            CREATE CHALLENGE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Challenge List */}
        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 animate-pulse" />
            Challenges (
            {filteredChallenges.length}
            )
          </h3>

          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredChallenges.map(challenge => (
                <div
                  key={challenge.id}
                  className={`backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg p-3 cursor-pointer transition-all ${
                    selectedChallenge === challenge.id ? 'border-white/50 bg-white/10' : 'hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedChallenge(selectedChallenge === challenge.id ? null : challenge.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(challenge.type)}
                        <span className="text-white font-mono text-sm font-semibold">{challenge.title}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge variant="secondary" className={getTypeColor(challenge.type)}>
                          {challenge.type}
                        </Badge>
                        <Badge variant="secondary" className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant="secondary" className={getStatusColor(challenge.status)}>
                          {challenge.status}
                        </Badge>
                        <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                          R
                          {challenge.round}
                        </Badge>
                      </div>

                      <div className="text-xs text-gray-400 font-mono">
                        {challenge.points}
                        {' '}
                        pts •
                        {challenge.completedBy.length}
                        {' '}
                        completed •
                        {Math.round(challenge.successRate * 100)}
                        % success
                      </div>
                    </div>

                    <div className="flex gap-1 ml-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0 bg-white/20 border-white/50 text-white hover:bg-white/30"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingChallenge(challenge)
                        }}
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className={`w-8 h-8 p-0 ${
                          challenge.status === 'active'
                            ? 'bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30'
                            : 'bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusToggle(challenge.id)
                        }}
                      >
                        {challenge.status === 'active' ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0 bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteChallenge(challenge.id)
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {selectedChallenge === challenge.id && (
                    <div className="mt-3 pt-3 border-t border-gray-800/50">
                      <div className="text-xs text-gray-300 font-mono mb-2">
                        {challenge.description}
                      </div>

                      {challenge.hints.length > 0 && (
                        <div className="mb-2">
                          <span className="text-gray-400 text-xs">Hints:</span>
                          <ul className="text-xs text-gray-300 font-mono ml-4 mt-1">
                            {challenge.hints.map((hint, index) => (
                              <li key={index}>
                                •
                                {hint}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">
                          Solution:
                          {challenge.solution}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-white/20 border-white/50 text-white hover:bg-white/30 font-mono text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            COPY
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30 font-mono text-xs"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            TEST
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Challenge Editor */}
        <div className="backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
            <Edit3 className="w-5 h-5 animate-pulse" />
            {editingChallenge ? (isCreating ? 'Create Challenge' : 'Edit Challenge') : 'Select a Challenge'}
          </h3>

          {editingChallenge
            ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-xs font-mono">Title</label>
                    <Input
                      value={editingChallenge.title}
                      onChange={e => setEditingChallenge({ ...editingChallenge, title: e.target.value })}
                      className="mt-1 bg-white/5 border-gray-800/50 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 text-xs font-mono">Description</label>
                    <Textarea
                      value={editingChallenge.description}
                      onChange={e => setEditingChallenge({ ...editingChallenge, description: e.target.value })}
                      className="mt-1 bg-white/5 border-gray-800/50 text-white font-mono"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-xs font-mono">Type</label>
                      <select
                        value={editingChallenge.type}
                        onChange={e => setEditingChallenge({ ...editingChallenge, type: e.target.value as Challenge['type'] })}
                        className="mt-1 w-full bg-white/5 border border-gray-800/50 text-white font-mono rounded-md p-2"
                      >
                        <option value="technical">Technical</option>
                        <option value="firefox">Firefox</option>
                        <option value="logic">Logic</option>
                        <option value="collaborative">Collaborative</option>
                        <option value="chaos">Chaos</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs font-mono">Difficulty</label>
                      <select
                        value={editingChallenge.difficulty}
                        onChange={e => setEditingChallenge({ ...editingChallenge, difficulty: e.target.value as Challenge['difficulty'] })}
                        className="mt-1 w-full bg-white/5 border border-gray-800/50 text-white font-mono rounded-md p-2"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-xs font-mono">Points</label>
                      <Input
                        type="number"
                        value={editingChallenge.points}
                        onChange={e => setEditingChallenge({ ...editingChallenge, points: Number.parseInt(e.target.value) || 0 })}
                        className="mt-1 bg-white/5 border-gray-800/50 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs font-mono">Round</label>
                      <select
                        value={editingChallenge.round}
                        onChange={e => setEditingChallenge({ ...editingChallenge, round: Number.parseInt(e.target.value) as 1 | 2 | 3 })}
                        className="mt-1 w-full bg-white/5 border border-gray-800/50 text-white font-mono rounded-md p-2"
                      >
                        <option value={1}>Round 1</option>
                        <option value={2}>Round 2</option>
                        <option value={3}>Round 3</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-xs font-mono">Solution</label>
                    <Input
                      value={editingChallenge.solution}
                      onChange={e => setEditingChallenge({ ...editingChallenge, solution: e.target.value })}
                      className="mt-1 bg-white/5 border-gray-800/50 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 text-xs font-mono">Hints (one per line)</label>
                    <Textarea
                      value={editingChallenge.hints.join('\n')}
                      onChange={e => setEditingChallenge({ ...editingChallenge, hints: e.target.value.split('\n').filter(h => h.trim()) })}
                      className="mt-1 bg-white/5 border-gray-800/50 text-white font-mono"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-800/50">
                    <Button
                      onClick={handleSaveChallenge}
                      className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30 font-mono"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      SAVE
                    </Button>

                    <Button
                      onClick={() => {
                        setEditingChallenge(null)
                        setIsCreating(false)
                      }}
                      className="bg-gray-500/20 border-gray-500/50 text-gray-300 hover:bg-gray-500/30 font-mono"
                    >
                      CANCEL
                    </Button>
                  </div>
                </div>
              )
            : (
                <div className="text-center text-gray-400 font-mono text-sm py-8">
                  Select a challenge from the list to edit, or create a new one
                </div>
              )}
        </div>
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
            className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30 font-mono text-xs"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            ACTIVATE ALL
          </Button>

          <Button
            size="sm"
            className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 font-mono text-xs"
          >
            <Pause className="w-4 h-4 mr-2" />
            DISABLE ALL
          </Button>

          <Button
            size="sm"
            className="bg-white/20 border-white/50 text-white hover:bg-white/30 font-mono text-xs"
          >
            <Copy className="w-4 h-4 mr-2" />
            EXPORT CONFIG
          </Button>

          <Button
            size="sm"
            className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30 font-mono text-xs"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            VALIDATE ALL
          </Button>
        </div>
      </div>
    </div>
  )
}
