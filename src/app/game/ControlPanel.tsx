'use client'
import { Bell, HelpCircle, LogOut, Settings, User } from 'lucide-react'
import { Button } from '@/shadcn/ui/button'

interface ControlPanelProps {
  buttonGlitch: number | null
}

export function ControlPanel({ buttonGlitch }: ControlPanelProps) {
  const buttons = [
    { icon: <LogOut className="w-5 h-5" />, label: 'Logout', index: 0 },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', index: 1 },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Help', index: 2 },
    { icon: <Bell className="w-5 h-5" />, label: 'Alerts', index: 3 },
  ]
  return (
    <div className="h-full backdrop-blur-xl bg-gray-900/40 border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-3 border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-white animate-pulse" />
          <h3 className="text-white font-mono text-xs font-semibold">CONTROL PANEL</h3>
        </div>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3 h-[calc(100%-56px)]">
        {buttons.map(item => (
          <Button
            key={item.label}
            variant="outline"
            className={`h-full flex flex-col items-center justify-center gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10 font-mono rounded-xl relative ${
              buttonGlitch === item.index ? 'animate-pulse border-red-500/50 bg-red-500/10' : ''
            }`}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
            {buttonGlitch === item.index && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
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
    </div>
  )
}
