'use client'

import { useEffect } from 'react'

export function GlassmorphicSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full animate-spin">
        <div className="absolute top-0 left-1/2 w-1 h-1 bg-white/60 rounded-full transform -translate-x-1/2" />
      </div>
      <div className="absolute inset-1 bg-white/10 backdrop-blur-md rounded-full" />
    </div>
  )
}

export function GlassmorphicLoadingCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <GlassmorphicSpinner size="lg" />
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          {children}
        </div>
      </div>
    </div>
  )
}

export function GlassmorphicSkeletonLine({ width = 'full' }: { width?: 'full' | '3/4' | '1/2' | '1/4' }) {
  const widthClasses = {
    'full': 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/4': 'w-1/4',
  }

  return (
    <div className={`${widthClasses[width]} h-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg animate-pulse`}>
      <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  )
}

export function GlassmorphicErrorCard({ title, message, onRetry }: {
  title: string
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 shadow-2xl">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full blur-xl animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-red-400">{title}</h3>
          <p className="text-red-300 text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 px-4 py-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-all duration-200"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function GlassmorphicToast({ message, type = 'error', onClose }: {
  message: string
  type?: 'error' | 'success' | 'info'
  onClose: () => void
}) {
  const colors = {
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
    success: 'bg-green-500/10 border-green-500/20 text-green-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  }

  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed top-4 right-4 z-50 ${colors[type]} backdrop-blur-xl border rounded-2xl p-4 shadow-2xl animate-slide-in-right`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
