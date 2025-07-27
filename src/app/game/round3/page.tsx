'use client'

import {
  AlertTriangle,
  Clock,
  Crown,
  Eye,
  Heart,
  Shield,
  Sword,
  Target,
  Timer,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/ui/card'
import { Input } from '@/shadcn/ui/input'
import { Label } from '@/shadcn/ui/label'
import { Textarea } from '@/shadcn/ui/textarea'
import { useToast } from '@/shadcn/ui/use-toast'

export default function Round3Page() {
  const { toast } = useToast()
  const [gameAnswers, setGameAnswers] = useState({
    phase1Answer: '',
    phase2Answer: '',
    phase3Answer: '',
    finalGambitAnswer: '',
  })
  const [_glitchEffect, setGlitchEffect] = useState(false)
  const [phaseGlitch, setPhaseGlitch] = useState<number | null>(null)
  const [textGlitch, setTextGlitch] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(1)

  // Enhanced glitch effects
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchEffect(true)
      setTimeout(() => setGlitchEffect(false), 200)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const phaseGlitchInterval = setInterval(() => {
      const randomPhase = Math.floor(Math.random() * 4)
      setPhaseGlitch(randomPhase)
      setTimeout(() => setPhaseGlitch(null), 300)
    }, 3000)
    return () => clearInterval(phaseGlitchInterval)
  }, [])

  useEffect(() => {
    const textGlitchInterval = setInterval(() => {
      setTextGlitch(true)
      setTimeout(() => setTextGlitch(false), 150)
    }, 7000)
    return () => clearInterval(textGlitchInterval)
  }, [])

  const { data: gameSession } = trpc.getCurrentGameSession.useQuery()
  const gameSessionId = gameSession?.id || 1

  const { data: gameProgress, refetch: refetchProgress } = trpc.games.getGameProgressRound3.useQuery({
    gameSessionId,
  })

  const { data: equalizationStatus } = trpc.games.getEqualizationStatus.useQuery({
    gameSessionId,
  })

  // Game mutations
  const phase1Mutation = trpc.games.round3Phase1.useMutation()
  const phase2Mutation = trpc.games.round3Phase2.useMutation()
  const phase3Mutation = trpc.games.round3Phase3.useMutation()
  const finalGambitMutation = trpc.games.round3FinalGambit.useMutation()
  const getHintMutation = trpc.games.getGameHintRound3.useMutation()

  const handlePhaseSubmit = async (phase: number, mutation: any, answer: string) => {
    try {
      const result = await mutation.mutateAsync({
        gameSessionId,
        answer,
      })

      toast({
        title: result.success ? 'Phase Complete!' : 'Incorrect',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      })

      if (result.success) {
        refetchProgress()
        // Clear the input and advance phase
        setGameAnswers(prev => ({
          ...prev,
          [`phase${phase}Answer`]: '',
          [`finalGambitAnswer`]: phase === 4 ? '' : prev.finalGambitAnswer,
        }))
        if (phase < 4) {
          setCurrentPhase(phase + 1)
        }
      }
    }
    catch {
      toast({
        title: 'Error',
        description: 'Failed to submit answer',
        variant: 'destructive',
      })
    }
  }

  const handleGetHint = async (phase: number) => {
    try {
      const result = await getHintMutation.mutateAsync({
        gameSessionId,
        phase: phase as 1 | 2 | 3 | 4,
      })

      toast({
        title: 'Hint',
        description: result.hint,
        duration: 15000,
      })
    }
    catch {
      toast({
        title: 'Error',
        description: 'Failed to get hint',
        variant: 'destructive',
      })
    }
  }

  const isPhaseCompleted = (phase: number) => {
    return gameProgress?.completedPhases.includes(phase as 1 | 2 | 3 | 4) || false
  }

  const phases = [
    {
      id: 1,
      title: 'Phase 1: The Trials',
      subtitle: 'Individual Mastery',
      description: 'Prove your worth in the ultimate test of skill. No collaboration allowed.',
      icon: <Target className="w-6 h-6" />,
      points: 150,
      timeLimit: '30 minutes',
      color: 'border-red-500/50 bg-red-500/10',
      challenge: `
        The final trial begins with a cipher that has haunted Mozilla's archives for decades.
        
        Legend speaks of the "Phoenix Codex" - a message left by the original Firefox developers
        that contains the key to understanding the browser's true purpose.
        
        The codex is encoded using a combination of:
        1. ROT13 transformation
        2. Base64 encoding
        3. Hexadecimal representation
        4. A final XOR operation with the key "MOZILLA"
        
        Your encoded message:
        4D6F7A696C6C61206973206E6F74206A757374206120636F6D70616E792C2069742069732061206D6F76656D656E742E20546865206F70656E20776562206973206F7572206C65676163792E
        
        Decode this message to reveal the Phoenix Codex and claim your 150 points.
        
        Hint: Work backwards through the encoding layers. Start with hex, then handle the XOR, 
        then Base64, and finally ROT13.
      `,
      mutation: phase1Mutation,
    },
    {
      id: 2,
      title: 'Phase 2: The Heist',
      subtitle: 'Collaborative Infiltration',
      description: 'Work together to infiltrate the digital vault, but only 3 can claim the treasure.',
      icon: <Users className="w-6 h-6" />,
      points: 150,
      timeLimit: '45 minutes',
      color: 'border-purple-500/50 bg-purple-500/10',
      challenge: `
        The Digital Vault requires multiple keys to open. This is a collaborative challenge
        where players must work together, but only the first 3 to complete it will receive points.
        
        The vault contains a distributed puzzle across multiple "security layers":
        
        LAYER 1 - AUTHENTICATION:
        Find the hidden authentication token in this JavaScript function:
        
        function authenticateUser(username, password) {
          const salt = "FirefoxSecurity2025";
          const hash = btoa(username + salt + password);
          // Hidden token: RmlyZWZveERpZ2l0YWxWYXVsdEFjY2Vzcw==
          return hash.length > 20;
        }
        
        LAYER 2 - AUTHORIZATION:
        Decode the authentication token from Layer 1 and combine it with this pattern:
        Pattern: Take every 3rd character, reverse the string, then apply Caesar cipher (+7)
        
        LAYER 3 - VAULT ACCESS:
        The final vault code is hidden in this CSS:
        
        .vault-door::before {
          content: "\\0056\\0041\\0055\\004C\\0054\\005F\\004F\\0050\\0045\\004E";
          display: none;
        }
        
        Combine all three layers: [LAYER1_DECODED] + [LAYER2_RESULT] + [LAYER3_DECODED]
        
        The first 3 players to submit the correct combination win 150 points each.
      `,
      mutation: phase2Mutation,
    },
    {
      id: 3,
      title: 'Phase 3: Final Gambit',
      subtitle: 'Point Auction & Last Stand',
      description: 'Bid your points for the ultimate prize. High risk, high reward.',
      icon: <Trophy className="w-6 h-6" />,
      points: 200,
      timeLimit: '15 minutes',
      color: 'border-yellow-500/50 bg-yellow-500/10',
      challenge: `
        The Final Gambit is a high-stakes auction where you can bid your current points
        for a chance at the ultimate prize.
        
        THE CHALLENGE:
        Solve the "Betrayal Cipher" - a puzzle that requires you to think like a traitor.
        
        You are given this encrypted message from a double agent:
        "Gur svany frperg vf uvqqra va gur ynfg cynpr lbh jbhyq ybbx"
        
        And this additional clue:
        Binary: 01000110 01101001 01110010 01100101 01100110 01101111 01111000
        Morse: ..-. .. -. .- .-.. / -.-. .. .--. .... . .-.
        
        The solution requires combining:
        1. ROT13 decoding of the main message
        2. ASCII conversion of the binary
        3. Morse code translation
        4. Finding the hidden pattern in the page source (look for data-betrayal attributes)
        
        BIDDING SYSTEM:
        - Minimum bid: 50 points
        - You can bid up to your total points
        - If you solve it correctly, you get 200 points + your bid back
        - If you fail, you lose your bid
        - Only one winner allowed
        
        Enter your bid amount and solution separated by a pipe (|):
        Example: 75|YOUR_SOLUTION_HERE
      `,
      mutation: phase3Mutation,
    },
    {
      id: 4,
      title: 'Wildcard Finale',
      subtitle: 'The Ultimate Betrayal',
      description: 'The final twist that determines the true winner.',
      icon: <Crown className="w-6 h-6" />,
      points: 300,
      timeLimit: 'Until solved',
      color: 'border-gold-500/50 bg-gold-500/10',
      challenge: `
        CONGRATULATIONS, SURVIVORS.
        
        You have reached the final challenge. This is where alliances die and legends are born.
        
        THE ULTIMATE BETRAYAL CIPHER:
        
        Hidden throughout this entire game, there have been breadcrumbs leading to this moment.
        The final cipher is not just a puzzle - it's a test of everything you've learned.
        
        CLUE 1 - THE FOUNDATION:
        Remember the very first message you found in Round 1? It wasn't just "FIREFOX_CIPHER_2025".
        Look deeper into the page source. Find the comment that starts with "<!-- FINAL_KEY:"
        
        CLUE 2 - THE DIRECTOR'S SECRET:
        The Round 2 winner (Director) unknowingly selected more than just games.
        Their selection pattern contains part of the final key.
        
        CLUE 3 - THE BETRAYAL PATTERN:
        Count the number of betrayals, alliances formed, and points lost to sabotage.
        These numbers form coordinates: [BETRAYALS].[ALLIANCES].[SABOTAGE_POINTS]
        
        CLUE 4 - THE PHOENIX RISES:
        The Phoenix Codex from Phase 1 contains a hidden message when read backwards
        and combined with the current timestamp (YYYY-MM-DD format).
        
        FINAL CIPHER:
        Combine all clues using this formula:
        FOUNDATION_KEY + DIRECTOR_PATTERN + COORDINATES + PHOENIX_TIMESTAMP
        
        Apply Vigenère cipher with key "BETRAYAL" to get the final answer.
        
        The first to solve this wins 300 points and becomes the ultimate Firefox Cipher champion.
        
        Remember: "In the end, there can be only one."
      `,
      mutation: finalGambitMutation,
    },
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Enhanced Cyberpunk Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-red-950/30">
        {/* Animated Glitch Lines */}
        <div className="absolute inset-0 overflow-hidden opacity-15" suppressHydrationWarning>
          {[...Array.from({ length: 40 })].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-red-500/50 animate-pulse"
              style={{
                top: `${Math.floor(Math.random() * 100)}%`,
                left: 0,
                right: 0,
                height: `${Math.random() * 3}px`,
                opacity: Math.random() * 0.8 + 0.3,
                transform: `translateY(${Math.random() * 15 - 7}px) skewX(${Math.random() * 6 - 3}deg)`,
                filter: 'blur(0.5px)',
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${1.5 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter%20id%3D%22noiseFilter%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.95%22%20numOctaves%3D%225%22%20stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23noiseFilter%29%22/%3E%3C/svg%3E')] opacity-[0.04]" />

        {/* Floating Orbs */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-red-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-500/12 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '5s' }} />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-ping" style={{ animationDuration: '4s' }} />
      </div>

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none" suppressHydrationWarning>
        {[...Array.from({ length: 12 })].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px bg-red-500/25"
            style={{
              top: `${i * 8.33}%`,
              opacity: Math.random() * 0.4 + 0.2,
              animation: `pulse ${2 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Sword className="w-10 h-10 text-red-500 animate-pulse" />
              <h1 className={`text-5xl font-bold font-mono ${textGlitch ? 'animate-pulse text-red-400' : 'text-white'} transition-all duration-150`}>
                <span className="inline-block">ROUND</span>
                <span className="inline-block text-red-500 mx-3 animate-pulse">03:</span>
                <span className="inline-block">BETRAYAL_FINALE</span>
              </h1>
              <Crown className="w-8 h-8 text-yellow-500 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            {/* Equalization Status */}
            {equalizationStatus && (
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
                  <h2 className="text-yellow-400 font-mono font-semibold">GREAT EQUALIZATION COMPLETE</h2>
                </div>
                <p className="text-gray-300 font-mono text-sm">
                  All player points have been adjusted to be within 50 points of each other.
                  The playing field is now level for the final showdown.
                </p>
                <div className="mt-2 text-yellow-300 font-mono text-xs">
                  Your adjusted points:
                  {' '}
                  {equalizationStatus.adjustedPoints}
                </div>
              </div>
            )}

            {/* Game Progress */}
            {gameProgress && (
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-500 animate-pulse" />
                  <Badge variant="outline" className="text-red-400 border-red-500/50 bg-red-500/10 font-mono backdrop-blur-sm">
                    PHASES:
                    {' '}
                    {gameProgress.completedPhases.length}
                    /4
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <Badge variant="outline" className="text-yellow-400 border-yellow-500/50 bg-yellow-500/10 font-mono backdrop-blur-sm">
                    POINTS:
                    {' '}
                    {gameProgress.totalPoints}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <Badge variant="outline" className="text-blue-400 border-blue-500/50 bg-blue-500/10 font-mono backdrop-blur-sm">
                    PHASE:
                    {' '}
                    {currentPhase}
                    /4
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Phase Cards */}
          <div className="space-y-8">
            {phases.map((phase, index) => {
              const completed = isPhaseCompleted(phase.id)
              const isCurrentPhase = currentPhase === phase.id
              const isLocked = currentPhase < phase.id
              const isGlitching = phaseGlitch === index

              return (
                <Card
                  key={phase.id}
                  className={`
                    relative overflow-hidden transition-all duration-500
                    ${completed
                  ? 'border-green-500/60 bg-green-500/10'
                  : isCurrentPhase
                    ? `${phase.color} shadow-2xl scale-[1.02]`
                    : isLocked
                      ? 'border-gray-700/50 bg-gray-800/20 opacity-60'
                      : 'border-gray-600/50 bg-gray-800/30'
                }
                    ${isGlitching ? 'animate-pulse border-red-400 bg-red-500/20' : ''}
                    backdrop-blur-sm group
                  `}
                >
                  {/* Glitch Overlay */}
                  {isGlitching && (
                    <div className="absolute inset-0 bg-red-500/30 animate-pulse z-10 pointer-events-none" />
                  )}

                  {/* Animated Border for Current Phase */}
                  {isCurrentPhase && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/30 to-transparent opacity-50 animate-pulse" />
                  )}

                  <CardHeader className="relative z-20">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg transition-all duration-300 ${
                          completed
                            ? 'bg-green-500/20 text-green-400'
                            : isCurrentPhase
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-gray-700/50 text-gray-400'
                        }`}
                        >
                          {phase.icon}
                        </div>
                        <div className="space-y-2">
                          <CardTitle className="text-white flex items-center gap-3 font-mono text-xl">
                            {phase.title}
                            {completed && <Shield className="w-5 h-5 text-green-500 animate-pulse" />}
                            {isCurrentPhase && !completed && <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />}
                            {isLocked && <AlertTriangle className="w-5 h-5 text-gray-500" />}
                          </CardTitle>
                          <CardDescription className="text-gray-400 font-mono">
                            {phase.subtitle}
                          </CardDescription>
                          <p className="text-gray-300 font-mono text-sm leading-relaxed">
                            {phase.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <Badge
                          variant="secondary"
                          className={`font-mono ${
                            completed
                              ? 'bg-green-500/20 text-green-400 border-green-500/50'
                              : isCurrentPhase
                                ? 'bg-red-500/20 text-red-400 border-red-500/50'
                                : 'bg-gray-600/20 text-gray-400 border-gray-600/50'
                          } backdrop-blur-sm`}
                        >
                          {phase.points}
                          {' '}
                          PTS
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                          <Timer className="w-3 h-3" />
                          {phase.timeLimit}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-20">
                    {/* Challenge Description */}
                    <div className="mb-6 p-4 bg-gray-800/60 border border-red-500/20 rounded-lg backdrop-blur-sm">
                      <div className="flex items-start gap-2 mb-3">
                        <Eye className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                        <h3 className="text-red-400 font-mono font-semibold text-sm">CHALLENGE BRIEFING:</h3>
                      </div>
                      <Textarea
                        value={phase.challenge}
                        readOnly
                        className="bg-transparent border-none text-gray-300 font-mono text-xs leading-relaxed resize-none min-h-[200px] focus:ring-0"
                      />
                    </div>

                    {/* Input Section */}
                    {!completed && !isLocked && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`phase${phase.id}`} className="text-white font-mono text-sm">
                            {phase.id === 3 ? 'BID_AMOUNT|SOLUTION:' : 'SOLUTION_KEY:'}
                          </Label>
                          <Input
                            id={`phase${phase.id}`}
                            value={gameAnswers[`phase${phase.id}Answer` as keyof typeof gameAnswers] || gameAnswers.finalGambitAnswer}
                            onChange={e => setGameAnswers(prev => ({
                              ...prev,
                              [phase.id === 4 ? 'finalGambitAnswer' : `phase${phase.id}Answer`]: e.target.value,
                            }))}
                            placeholder={
                              phase.id === 3
                                ? 'Enter bid amount and solution (e.g., 75|YOUR_SOLUTION)'
                                : phase.id === 4
                                  ? 'Enter the ultimate betrayal cipher solution'
                                  : 'Enter your solution'
                            }
                            className="bg-gray-800/80 border-red-500/30 text-white font-mono placeholder:text-gray-500 focus:border-red-400 backdrop-blur-sm"
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={() => handlePhaseSubmit(
                              phase.id,
                              phase.mutation,
                              phase.id === 4
                                ? gameAnswers.finalGambitAnswer
                                : gameAnswers[`phase${phase.id}Answer` as keyof typeof gameAnswers],
                            )}
                            disabled={
                              !(phase.id === 4
                                ? gameAnswers.finalGambitAnswer
                                : gameAnswers[`phase${phase.id}Answer` as keyof typeof gameAnswers])
                              || phase.mutation.isPending
                            }
                            className="bg-red-500/80 text-white hover:bg-red-400 transition-all duration-200 font-mono backdrop-blur-sm border border-red-500/30"
                          >
                            {phase.mutation.isPending ? 'PROCESSING...' : 'SUBMIT SOLUTION'}
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => handleGetHint(phase.id)}
                            disabled={getHintMutation.isPending}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all duration-200 font-mono backdrop-blur-sm"
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            HINT (-15 PTS)
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Completion Status */}
                    {completed && (
                      <div className="flex items-center gap-3 text-green-400 font-mono">
                        <Shield className="w-5 h-5 animate-pulse" />
                        <span className="font-semibold">
                          PHASE COMPLETE! +
                          {phase.points}
                          {' '}
                          POINTS
                        </span>
                      </div>
                    )}

                    {/* Locked Status */}
                    {isLocked && (
                      <div className="flex items-center gap-3 text-gray-500 font-mono">
                        <AlertTriangle className="w-5 h-5" />
                        <span>Complete previous phases to unlock</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Hidden elements for the final challenge */}
          <div style={{ display: 'none' }}>
            {/* Final key hidden in comment */}
            {/* FINAL_KEY: PHOENIX_FOUNDATION_2025_BETRAYAL_CIPHER */}

            {/* Betrayal pattern data */}
            <div data-betrayal="DIRECTOR_SELECTION_PATTERN" data-coordinates="3.7.120" data-phoenix="MOZILLA_IS_ETERNAL">
              Hidden betrayal data
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS for glitch effects */}
      <style jsx>
        {`
        @keyframes glitch-skew {
          0% { transform: skew(0deg) scale(1); }
          10% { transform: skew(-3deg) scale(1.01); }
          20% { transform: skew(2deg) scale(0.99); }
          30% { transform: skew(-1deg) scale(1.02); }
          40% { transform: skew(1deg) scale(0.98); }
          50% { transform: skew(0deg) scale(1); }
          60% { transform: skew(-2deg) scale(1.01); }
          70% { transform: skew(1deg) scale(0.99); }
          80% { transform: skew(-0.5deg) scale(1); }
          90% { transform: skew(0.5deg) scale(1); }
          100% { transform: skew(0deg) scale(1); }
        }

        @keyframes text-corruption {
          0%, 100% { opacity: 1; filter: brightness(1); }
          25% { opacity: 0.8; filter: brightness(1.2) contrast(1.1); }
          50% { opacity: 0.9; filter: brightness(0.9) contrast(1.3); }
          75% { opacity: 0.7; filter: brightness(1.1) contrast(0.9); }
        }

        .glitch-text {
          animation: text-corruption 0.2s infinite linear alternate;
        }

        .phase-card:hover {
          animation: glitch-skew 0.4s ease-in-out;
        }

        .border-gold-500\/50 {
          border-color: rgb(234 179 8 / 0.5);
        }

        .bg-gold-500\/10 {
          background-color: rgb(234 179 8 / 0.1);
        }
      `}
      </style>
    </div>
  )
}
