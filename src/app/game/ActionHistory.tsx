'use client'
import { CheckCircle2, GitBranch, Loader2, XCircle } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { Badge } from '@/shadcn/ui/badge'
import { ScrollArea } from '@/shadcn/ui/scroll-area'

interface ActionHistoryProps {
  gameSessionId: number
  actionGlitch: number | null
}

export function ActionHistory({
  gameSessionId,
  actionGlitch,
}: ActionHistoryProps) {
  const { data: playerActions, isLoading } = trpc.games.getActionHistory.useQuery(
    { gameSessionId },
    { enabled: !!gameSessionId, refetchInterval: 5000 },
  )

  if (isLoading) {
    return (
      <div className="h-full flex flex-col backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-3 md:p-4 border-b border-gray-800/50 flex-shrink-0">
          <div className="flex items-center gap-2 md:gap-3">
            <GitBranch className="w-4 h-4 md:w-5 md:h-5 text-white animate-pulse" />
            <h3 className="text-white font-mono text-xs md:text-sm font-semibold">
              ACTION HISTORY
            </h3>
            <Badge
              variant="secondary"
              className="bg-white/10 text-white border-white/20 animate-pulse text-xs"
            >
              0
            </Badge>
          </div>
        </div>
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-mono">Loading actions...</span>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="h-full flex flex-col backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-3 md:p-4 border-b border-gray-800/50 flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <GitBranch className="w-4 h-4 md:w-5 md:h-5 text-white animate-pulse" />
          <h3 className="text-white font-mono text-xs md:text-sm font-semibold">
            ACTION HISTORY
          </h3>
          <Badge
            variant="secondary"
            className="bg-white/10 text-white border-white/20 animate-pulse text-xs"
          >
            {playerActions?.length || 0}
          </Badge>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-3 md:p-4">
            {!playerActions || playerActions.length === 0
              ? (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    <span className="text-xs font-mono">No actions yet...</span>
                  </div>
                )
              : (
                  <div className="space-y-2 md:space-y-3">
                    {playerActions.map((action, index) => (
                      <div
                        key={action.id}
                        className={`backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-lg md:rounded-xl p-2 md:p-3 hover:bg-white/10 transition-all relative ${
                          actionGlitch === index
                            ? 'animate-pulse border-red-500/50 bg-red-500/10'
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 md:mb-2">
                          <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-1">
                            <div
                              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border-2 animate-pulse flex-shrink-0 ${
                                action.result === 'success'
                                  ? 'bg-white/20 border-white'
                                  : action.result === 'failed'
                                    ? 'bg-red-500/20 border-red-500'
                                    : 'bg-gray-500/20 border-gray-500'
                              }`}
                              style={{
                                animationDelay: `${action.id * 0.3}s`,
                                animationDuration: '2s',
                              }}
                            >
                              {action.result === 'success' && (
                                <CheckCircle2 className="w-1.5 h-1.5 md:w-2 md:h-2 text-white absolute -top-0.5 -left-0.5" />
                              )}
                              {action.result === 'failed' && (
                                <XCircle className="w-1.5 h-1.5 md:w-2 md:h-2 text-red-500 absolute -top-0.5 -left-0.5" />
                              )}
                            </div>
                            <span className="text-white font-mono text-xs font-semibold truncate">
                              {action.action}
                            </span>
                          </div>
                          <span className="text-gray-400 font-mono text-xs flex-shrink-0 ml-2">
                            {action.time}
                          </span>
                        </div>
                        <p className="text-gray-300 font-mono text-xs break-words ml-4 md:ml-5">
                          {action.target}
                        </p>
                        {actionGlitch === index && (
                          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg md:rounded-xl">
                            {[...Array.from({ length: 5 })].map((_, i) => (
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
                      </div>
                    ))}
                  </div>
                )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
