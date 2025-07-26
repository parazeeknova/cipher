'use client'

import {
  CheckCircle2,
  Code,
  Eye,
  FileText,
  Lightbulb,
  Search,
  Shield,
  Target,
  Terminal,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/ui/card'
import { Input } from '@/shadcn/ui/input'
import { Label } from '@/shadcn/ui/label'
import { useToast } from '@/shadcn/ui/use-toast'

export default function Round1GamesPage() {
  const { toast } = useToast()
  const [gameAnswers, setGameAnswers] = useState({
    inspectElement: '',
    base64Decoder: '',
    networkAnalysis: '',
    consolePuzzle: '',
    formExtraction: '',
  })
  const [_glitchEffect, setGlitchEffect] = useState(false)
  const [cardGlitch, setCardGlitch] = useState<number | null>(null)
  const [textGlitch, setTextGlitch] = useState(false)

  // Glitch effects
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchEffect(true)
      setTimeout(() => setGlitchEffect(false), 150)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const cardGlitchInterval = setInterval(() => {
      const randomCard = Math.floor(Math.random() * 5)
      setCardGlitch(randomCard)
      setTimeout(() => setCardGlitch(null), 200)
    }, 4000)
    return () => clearInterval(cardGlitchInterval)
  }, [])

  useEffect(() => {
    const textGlitchInterval = setInterval(() => {
      setTextGlitch(true)
      setTimeout(() => setTextGlitch(false), 100)
    }, 8000)
    return () => clearInterval(textGlitchInterval)
  }, [])

  const { data: gameSession } = trpc.getCurrentGameSession.useQuery()
  const gameSessionId = gameSession?.id || 1

  const { data: gameProgress, refetch: refetchProgress } = trpc.games.getGameProgress.useQuery({
    gameSessionId,
  })

  // Game mutations
  const inspectElementMutation = trpc.games.inspectElementGame.useMutation()
  const base64DecoderMutation = trpc.games.base64DecoderGame.useMutation()
  const networkAnalysisMutation = trpc.games.networkAnalysisGame.useMutation()
  const consolePuzzleMutation = trpc.games.consolePuzzleGame.useMutation()
  const formExtractionMutation = trpc.games.formExtractionGame.useMutation()
  const getHintMutation = trpc.games.getGameHint.useMutation()

  const handleGameSubmit = async (gameType: string, mutation: any, answer: string) => {
    try {
      const result = await mutation.mutateAsync({
        gameSessionId,
        [gameType === 'inspectElement'
          ? 'answer'
          : gameType === 'base64Decoder'
            ? 'decodedMessage'
            : gameType === 'networkAnalysis'
              ? 'endpoint'
              : gameType === 'consolePuzzle' ? 'solution' : 'extractedData']: answer,
      })

      toast({
        title: result.success ? 'Success!' : 'Incorrect',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      })

      if (result.success) {
        refetchProgress()
        // Clear the input
        setGameAnswers(prev => ({ ...prev, [gameType]: '' }))
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

  const handleGetHint = async (gameType: string) => {
    try {
      const result = await getHintMutation.mutateAsync({
        gameSessionId,
        gameType: gameType as any,
      })

      toast({
        title: 'Hint',
        description: result.hint,
        duration: 10000,
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

  const isGameCompleted = (gameTarget: string) => {
    return gameProgress?.completedGames.includes(gameTarget) || false
  }

  const games = [
    {
      id: 'inspectElement',
      target: 'inspect_element_game',
      title: 'The Curator\'s Notes',
      description: 'Ancient scholars left marginal notes in their manuscripts',
      icon: <Eye className="w-5 h-5" />,
      points: 20,
      type: 'Archaeological Dig',
      instructions: 'The curator always left notes in the margins of digital manuscripts. These annotations weren\'t meant for casual readers, but scholars knew where to look. Sometimes the most valuable insights hide between the lines, invisible to the naked eye.',
      placeholder: 'What did the curator write?',
      mutation: inspectElementMutation,
    },
    {
      id: 'base64Decoder',
      target: 'base64_decoder_game',
      title: 'The Photographer\'s Secret',
      description: 'Every picture tells a story, but some hide another tale entirely',
      icon: <Code className="w-5 h-5" />,
      points: 20,
      type: 'Digital Forensics',
      instructions: 'The old photographer had a peculiar habit - embedding messages in ways only fellow developers would recognize. He spoke of a universal encoding that transforms bytes into readable characters, popular since the early days of email attachments.',
      placeholder: 'Decode the photographer\'s message',
      mutation: base64DecoderMutation,
    },
    {
      id: 'networkAnalysis',
      target: 'network_analysis_game',
      title: 'The Network Cartographer',
      description: 'Every digital journey leaves traces in the ethernet',
      icon: <Search className="w-5 h-5" />,
      points: 20,
      type: 'Traffic Analysis',
      instructions: 'The network cartographer documented every digital pathway. She believed that understanding the flow of information was key to finding hidden routes. Modern browsers keep detailed logs of these journeys for those curious enough to peek behind the curtain.',
      placeholder: 'Which secret path did you discover?',
      mutation: networkAnalysisMutation,
    },
    {
      id: 'consolePuzzle',
      target: 'console_puzzle_game',
      title: 'The Developer\'s Sandbox',
      description: 'Where code comes alive and functions reveal their secrets',
      icon: <Terminal className="w-5 h-5" />,
      points: 20,
      type: 'Code Archaeology',
      instructions: 'The developer\'s sandbox is where ideas become reality. Here, functions wait patiently to be called, variables hold their values, and the wise know that some puzzles can only be solved by speaking the language of the machine directly.',
      placeholder: 'What answer did the sandbox provide?',
      mutation: consolePuzzleMutation,
    },
    {
      id: 'formExtraction',
      target: 'form_extraction_game',
      title: 'The Form Designer\'s Legacy',
      description: 'Not all input fields were meant to be seen by users',
      icon: <FileText className="w-5 h-5" />,
      points: 20,
      type: 'UI Archaeology',
      instructions: 'The form designer believed in layers - what users see is just the surface. Beneath lie fields that serve different purposes, carrying data attributes and values meant for the system\'s eyes only. The DOM inspector reveals all.',
      placeholder: 'What was hidden in the form\'s architecture?',
      mutation: formExtractionMutation,
    },
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cyberpunk Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-red-950/20">
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 overflow-hidden opacity-20" suppressHydrationWarning>
          {[...Array.from({ length: 30 })].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-red-500/40 animate-pulse"
              style={{
                top: `${Math.floor(Math.random() * 100)}%`,
                left: 0,
                right: 0,
                height: `${Math.random() * 2}px`,
                opacity: Math.random() * 0.6 + 0.2,
                transform: `translateY(${Math.random() * 10 - 5}px)`,
                filter: 'blur(0.5px)',
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
          {[...Array.from({ length: 20 })].map((_, i) => (
            <div
              key={i + 100}
              className="absolute w-px bg-red-500/30 animate-pulse"
              style={{
                left: `${Math.floor(Math.random() * 100)}%`,
                top: 0,
                bottom: 0,
                width: `${Math.random() * 2}px`,
                opacity: Math.random() * 0.4 + 0.1,
                filter: 'blur(0.5px)',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1.5 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter%20id%3D%22noiseFilter%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.85%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23noiseFilter%29%22/%3E%3C/svg%3E')] opacity-[0.03]" />

        {/* Floating Glitch Orbs */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-32 right-40 w-32 h-32 bg-red-500/8 rounded-full blur-2xl animate-bounce"
          style={{ animationDuration: '4s' }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-24 h-24 bg-red-500/6 rounded-full blur-xl animate-ping"
          style={{ animationDuration: '3s' }}
        />
        <div
          className="absolute bottom-1/4 left-3/4 w-20 h-20 bg-red-500/8 rounded-full blur-2xl animate-pulse"
          style={{ animationDuration: '2.5s' }}
        />
      </div>

      {/* Scanlines Effect */}
      <div className="absolute inset-0 pointer-events-none" suppressHydrationWarning>
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        {[...Array.from({ length: 10 })].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px bg-red-500/20"
            style={{
              top: `${i * 10}%`,
              opacity: Math.random() * 0.3 + 0.1,
              animation: `pulse ${2 + Math.random() * 2}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="w-8 h-8 text-red-500 animate-pulse" />
              <h1 className={`text-4xl font-bold mb-2 font-mono ${textGlitch ? 'animate-pulse text-red-400' : 'text-white'} transition-all duration-150`}>
                <span className="inline-block">ROUND</span>
                <span className="inline-block text-red-500 mx-2 animate-pulse">01:</span>
                <span className="inline-block">FOUNDATION_HUNT</span>
              </h1>
              <Target className="w-6 h-6 text-red-500 animate-spin" style={{ animationDuration: '4s' }} />
            </div>

            {gameProgress && (
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
                  <Badge variant="outline" className="text-green-400 border-green-500/50 bg-green-500/10 font-mono backdrop-blur-sm">
                    PROGRESS:
                    {' '}
                    {gameProgress.gamesCompleted}
                    /
                    {gameProgress.totalGames}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-500" />
                  <Badge variant="outline" className="text-red-400 border-red-500/50 bg-red-500/10 font-mono backdrop-blur-sm">
                    POINTS:
                    {' '}
                    {gameProgress.totalPoints}
                    /100
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {games.map((game, index) => {
              const completed = isGameCompleted(game.target)
              const isGlitching = cardGlitch === index

              return (
                <Card
                  key={game.id}
                  className={`
                    bg-gray-900/80 border-red-500/30 backdrop-blur-sm transition-all duration-300
                    ${completed ? 'border-green-500/60 bg-green-500/10' : 'hover:border-red-500/60'}
                    ${isGlitching ? 'animate-pulse border-red-400 bg-red-500/20' : ''}
                    relative overflow-hidden group
                  `}
                >
                  {/* Card Glitch Overlay */}
                  {isGlitching && (
                    <div className="absolute inset-0 bg-red-500/30 animate-pulse z-10 pointer-events-none" />
                  )}

                  {/* Animated Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="relative z-20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${completed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} transition-all duration-300`}>
                          {game.icon}
                        </div>
                        <div>
                          <CardTitle className="text-white flex items-center gap-2 font-mono">
                            {game.title}
                            {completed && <CheckCircle2 className="w-5 h-5 text-green-500 animate-pulse" />}
                            {!completed && <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />}
                          </CardTitle>
                          <CardDescription className="text-gray-400 font-mono text-sm">
                            {game.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className={`font-mono ${completed ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'} backdrop-blur-sm`}
                        >
                          {game.points}
                          {' '}
                          PTS
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1 font-mono">{game.type.toUpperCase()}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-20">
                    <div className="space-y-4">
                      <div className="bg-gray-800/60 p-4 rounded-lg border border-red-500/20 backdrop-blur-sm">
                        <div className="flex items-start gap-2 mb-2">
                          <Terminal className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                          <p className="text-sm text-gray-300 font-mono leading-relaxed">
                            <span className="text-red-400">$</span>
                            {' '}
                            {game.instructions}
                          </p>
                        </div>
                      </div>

                      {!completed && (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={game.id} className="text-white font-mono text-sm">
                              INPUT_CIPHER_KEY:
                            </Label>
                            <Input
                              id={game.id}
                              value={gameAnswers[game.id as keyof typeof gameAnswers]}
                              onChange={e => setGameAnswers(prev => ({
                                ...prev,
                                [game.id]: e.target.value,
                              }))}
                              placeholder={game.placeholder}
                              className="bg-gray-800/80 border-red-500/30 text-white font-mono placeholder:text-gray-500 focus:border-red-400 backdrop-blur-sm"
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleGameSubmit(
                                game.id,
                                game.mutation,
                                gameAnswers[game.id as keyof typeof gameAnswers],
                              )}
                              disabled={!gameAnswers[game.id as keyof typeof gameAnswers] || game.mutation.isPending}
                              className="bg-red-500/80 text-white hover:bg-red-400 transition-all duration-200 font-mono text-sm backdrop-blur-sm border border-red-500/30"
                            >
                              {game.mutation.isPending ? 'DECRYPTING...' : 'SUBMIT CIPHER'}
                            </Button>

                            <Button
                              variant="outline"
                              onClick={() => handleGetHint(game.id)}
                              disabled={getHintMutation.isPending}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all duration-200 font-mono text-sm backdrop-blur-sm"
                            >
                              <Lightbulb className="w-4 h-4 mr-2" />
                              HINT
                            </Button>
                          </div>
                        </div>
                      )}

                      {completed && (
                        <div className="flex items-center gap-2 text-green-400 font-mono">
                          <CheckCircle2 className="w-5 h-5 animate-pulse" />
                          <span className="font-semibold">
                            DECRYPTED! +
                            {game.points}
                            {' '}
                            POINTS
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Hidden elements for the games */}
          <div style={{ display: 'none' }}>
            {/* Hidden comment for inspect element game */}

            <p>FIREFOX_CIPHER_2025</p>

            {/* Hidden image with base64 in alt attribute */}
            <Image
              height={200}
              width={200}
              src="/fishbowl-sf.png"
              alt="VEhFX1RSVVRIX0lTX0lOX1RIRV9NRVRBREFUQQ=="
              data-secret="THE_TRUTH_IS_IN_THE_METADATA"
            />

            {/* Hidden form elements */}
            <form style={{ display: 'none' }}>
              <input type="hidden" name="secret" value="HIDDEN_FORM_VALUE_2025" />
              <input type="text" data-cipher="HIDDEN_FORM_VALUE_2025" />
            </form>
          </div>
        </div>
      </div>

      {/* JavaScript for console puzzle */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // The developer's sandbox artifacts
          window.cipherSolve = function(year, organization) {
            if (year === 1998 && organization === 'MOZILLA_FOUNDATION') {
              return 'MOZILLA_FOUNDATION_1998';
            }
            return 'The timeline doesn\\'t align with the foundation\\'s origin story...';
          };

          // Network cartographer's automated survey
          setTimeout(() => {
            fetch('/api/secret/cipher-key', { method: 'GET' })
              .catch(() => {}); // Silent exploration for the curious
          }, 2000);

          console.log('� The Developer\\'s Sandbox Archive');
          console.log('Available function: cipherSolve(year, organization)');
          console.log('💭 The old stories speak of a foundation that changed the web forever...');
          console.log('💭 When giants walked the earth and browsers were born...');
        `,
      }}
      />

      {/* Custom CSS for additional glitch effects */}
      <style jsx>
        {`
        @keyframes glitch-skew {
          0% { transform: skew(0deg); }
          10% { transform: skew(-2deg); }
          20% { transform: skew(2deg); }
          30% { transform: skew(-1deg); }
          40% { transform: skew(1deg); }
          50% { transform: skew(0deg); }
          60% { transform: skew(-1deg); }
          70% { transform: skew(1deg); }
          80% { transform: skew(-0.5deg); }
          90% { transform: skew(0.5deg); }
          100% { transform: skew(0deg); }
        }

        @keyframes text-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .glitch-text {
          animation: text-flicker 0.15s infinite linear alternate;
        }

        .glitch-card:hover {
          animation: glitch-skew 0.3s ease-in-out;
        }

        .terminal-cursor::after {
          content: '_';
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}
      </style>
    </div>
  )
}
