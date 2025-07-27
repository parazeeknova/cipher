/* eslint-disable no-console */
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { GlassmorphicErrorCard, GlassmorphicLoadingCard } from '@/components/ui/GlassmorphicComponents'
import { useDirectUser } from '@/contexts/DirectUserContext'
import { trpc } from '@/lib/trpc/client'

interface DirectUserFormProps {
  onSuccess: (user: any) => void
  onBack: () => void
}

export function DirectUserForm({ onSuccess, onBack }: DirectUserFormProps) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { setDirectUser } = useDirectUser()
  const router = useRouter()

  const createDirectUserMutation = trpc.createDirectUser.useMutation({
    onSuccess: (user) => {
      console.log('Direct user created successfully:', user)

      // Save the user to the direct user context
      setDirectUser({
        id: user.id,
        // @ts-expect-error - Assuming user has these properties
        username: user.username,
        playerId: user.playerId,
        clerkId: user.clerkId,
      })

      console.log('Direct user saved to context, redirecting to game...')

      // Call the onSuccess callback
      onSuccess(user)

      // Try router push with refresh
      setTimeout(() => {
        console.log('Attempting redirect to /test-direct')
        router.push('/test-direct')
        router.refresh()
      }, 100)
    },
    onError: (error) => {
      console.error('Failed to create direct user:', error)
      setError(error.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long')
      return
    }

    createDirectUserMutation.mutate({ username: username.trim() })
  }

  if (createDirectUserMutation.isPending) {
    return (
      <GlassmorphicLoadingCard>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Creating Player...</h2>
          <p className="text-gray-400">Setting up your game account</p>
        </div>
      </GlassmorphicLoadingCard>
    )
  }

  if (error) {
    return (
      <GlassmorphicErrorCard
        title="Failed to Create Player"
        message={error}
        onRetry={() => {
          setError(null)
          if (username.trim()) {
            createDirectUserMutation.mutate({ username: username.trim() })
          }
        }}
      />
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Join the Game</h2>
          <p className="text-gray-400">Enter your username to start playing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your username"
              minLength={3}
              maxLength={50}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be 3-50 characters long
            </p>
          </div>

          <button
            type="submit"
            disabled={username.trim().length < 3}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            Create Player & Join Game
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Options
          </button>
        </div>
      </div>
    </div>
  )
}
