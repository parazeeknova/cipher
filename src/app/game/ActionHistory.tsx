'use client'
import { CheckCircle2, GitBranch, XCircle } from 'lucide-react'
import { Badge } from '@/shadcn/ui/badge'
import { ScrollArea } from '@/shadcn/ui/scroll-area'

interface Action {
  id: number
  action: string
  target: string
  result: 'success' | 'failed' | 'neutral'
  time: string
}

interface ActionHistoryProps {
  playerActions: Action[]
  actionGlitch: number | null
}

export function ActionHistory({
  playerActions,
  actionGlitch,
}: ActionHistoryProps) {
  return (
    <div className="h-full backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <GitBranch className="w-5 h-5 text-white animate-pulse" />
          <h3 className="text-white font-mono text-sm font-semibold">
            ACTION HISTORY
          </h3>
          <Badge
            variant="secondary"
            className="bg-white/10 text-white border-white/20 animate-pulse"
          >
            {playerActions.length}
          </Badge>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {playerActions.map((action, index) => (
            <div
              key={action.id}
              className={`backdrop-blur-sm bg-white/5 border border-gray-800/50 rounded-xl p-3 hover:bg-white/10 transition-all relative ${
                actionGlitch === index
                  ? 'animate-pulse border-red-500/50 bg-red-500/10'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full border-2 animate-pulse ${
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
                      <CheckCircle2 className="w-2 h-2 text-white absolute -top-0.5 -left-0.5" />
                    )}
                    {action.result === 'failed' && (
                      <XCircle className="w-2 h-2 text-red-500 absolute -top-0.5 -left-0.5" />
                    )}
                  </div>
                  <span className="text-white font-mono text-xs font-semibold">
                    {action.action}
                  </span>
                </div>
                <span className="text-gray-400 font-mono text-xs">
                  {action.time}
                </span>
              </div>
              <p className="text-gray-300 font-mono text-xs break-words ml-5">
                {action.target}
              </p>
              {actionGlitch === index && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
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
      </ScrollArea>
    </div>
  )
}
