'use client'

import { Gamepad2 } from 'lucide-react'

interface MainGameAreaProps {
  glitchEffect: boolean
}

export function MainGameArea({ glitchEffect }: MainGameAreaProps) {
  return (
    <div
      className={`h-full backdrop-blur-2xl bg-gray-900/30 border border-gray-800/30 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-200 ${
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
      <div className="absolute inset-8 border-2 border-dashed border-gray-700/50 rounded-2xl flex items-center justify-center">
        <div className="text-center space-y-4">
          <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto animate-pulse" />
          <p className="text-gray-400 font-mono text-lg">GAME CONTENT AREA</p>
          <p className="text-gray-600 font-mono text-sm">Challenges will be loaded here</p>
        </div>
      </div>
      {glitchEffect && (
        <>
          <div className="absolute top-1/4 left-0 right-0 h-px bg-red-500/50 animate-pulse" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-red-500/30 animate-pulse" />
        </>
      )}
    </div>
  )
}
