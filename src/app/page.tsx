'use client'

import { useUser } from '@clerk/nextjs'
import { Canvas } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { OnboardingForm } from '@/components/auth/OnboardingForm'
import {
  GlassmorphicErrorCard,
  GlassmorphicLoadingCard,
  GlassmorphicSkeletonLine,
  GlassmorphicToast,
} from '@/components/ui/GlassmorphicComponents'
import { Scene } from '@/components/ui/ThreeScene'
import { trpc } from '@/lib/trpc/client'

export default function Home() {
  const router = useRouter()
  const { isSignedIn, isLoaded, user } = useUser()
  const [showInstruction, setShowInstruction] = useState(true)
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'onboarding'>('home')
  const [toast, setToast] = useState<{ message: string, type: 'error' | 'success' | 'info' } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const existingUser = trpc.getUser.useQuery(undefined, {
    enabled: isLoaded && !!user,
    retry: 3,
    staleTime: 1000 * 60 * 5,
  })

  const createUserMutation = trpc.createOrGetUser.useMutation({
    // eslint-disable-next-line unused-imports/no-unused-vars
    onSuccess: (data) => {
      setToast({ message: 'Account created successfully!', type: 'success' })
      existingUser.refetch()
    },
    // eslint-disable-next-line unused-imports/no-unused-vars, node/handle-callback-err
    onError: (error) => {
      setError('Failed to create account. Please try again.')
      setToast({ message: 'Failed to create account', type: 'error' })
    },
  })

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault()
        if (isSignedIn) {
          if (existingUser.data) {
            router.push('/dashboard')
          }
          else if (!existingUser.isLoading) {
            setCurrentView('onboarding')
          }
        }
        else {
          setCurrentView('auth')
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isSignedIn, existingUser.data, existingUser.isLoading, router])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstruction(false)
    }, 15000)

    return () => clearTimeout(timer)
  }, [])

  // Auto-create user in database when they first log in
  useEffect(() => {
    if (isLoaded && isSignedIn && user && user.primaryEmailAddress?.emailAddress) {
      if (!existingUser.isLoading && !existingUser.data && !createUserMutation.isPending) {
        createUserMutation.mutate({
          email: user.primaryEmailAddress.emailAddress,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          imageUrl: user.imageUrl || undefined,
        })
      }
    }
  }, [isLoaded, isSignedIn, user, existingUser.data, existingUser.isLoading, createUserMutation])

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const timer = setTimeout(() => {
        if (existingUser.data) {
          if (existingUser.data.username) {
            router.push('/game')
          }
          else {
            setCurrentView('onboarding')
          }
        }
        else if (!existingUser.isLoading && !existingUser.error && !createUserMutation.isPending) {
          setCurrentView('onboarding')
        }
        else if (existingUser.error && !createUserMutation.isPending) {
          setCurrentView('onboarding')
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isLoaded, isSignedIn, user, existingUser.data, existingUser.isLoading, existingUser.error, createUserMutation.isPending, router])

  const handleAuthSuccess = () => {
    // This will be handled by the useEffect above
  }

  const handleOnboardingComplete = () => {
    router.push('/game')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-screen bg-gray-900 relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        <div className="relative z-10 w-full max-w-md">
          <GlassmorphicLoadingCard>
            <div className="space-y-3">
              <GlassmorphicSkeletonLine width="3/4" />
              <GlassmorphicSkeletonLine width="1/2" />
              <GlassmorphicSkeletonLine width="full" />
            </div>
            <p className="text-gray-600 text-sm mt-4">
              Initializing Cipher...
            </p>
          </GlassmorphicLoadingCard>
        </div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000" />
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden">
      <Canvas camera={{ position: [10.047021, -0.127436, -11.137374], fov: 50 }}>
        <Scene showCipher={currentView === 'home'} />
      </Canvas>

      {currentView === 'home' && showInstruction && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-pulse transition-all duration-500 ease-in-out pointer-events-none">
          <p className="text-gray-400 text-lg tracking-wider">
            press space to enter
          </p>
        </div>
      )}

      {currentView === 'auth' && (
        <div className="absolute inset-0 flex items-center justify-center p-4 z-10 transition-all duration-500 ease-in-out">
          <div className="text-center">
            <div className="mb-8">
              <p className="text-gray-600 text-lg">
                Ready to beat Cipher?
              </p>
            </div>

            <GoogleAuthButton onSuccess={handleAuthSuccess} />

            <div className="mt-8">
              <button
                type="button"
                onClick={handleBackToHome}
                className="text-gray-600 hover:text-white transition-colors text-sm"
              >
                ← Back to Landing
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === 'onboarding' && user && (
        <div className="absolute inset-0 flex items-center justify-center p-4 z-10 transition-all duration-500 ease-in-out">
          {createUserMutation.isPending
            ? (
                <GlassmorphicLoadingCard>
                  <div className="space-y-3">
                    <GlassmorphicSkeletonLine width="3/4" />
                    <GlassmorphicSkeletonLine width="1/2" />
                  </div>
                  <p className="text-gray-600 text-sm mt-4">
                    Setting up your account...
                  </p>
                </GlassmorphicLoadingCard>
              )
            : error
              ? (
                  <GlassmorphicErrorCard
                    title="Account Setup Failed"
                    message={error}
                    onRetry={() => {
                      setError(null)
                      if (user?.primaryEmailAddress?.emailAddress) {
                        createUserMutation.mutate({
                          email: user.primaryEmailAddress.emailAddress,
                          firstName: user.firstName || undefined,
                          lastName: user.lastName || undefined,
                          imageUrl: user.imageUrl || undefined,
                        })
                      }
                    }}
                  />
                )
              : (
                  <OnboardingForm user={user} onComplete={handleOnboardingComplete} />
                )}
        </div>
      )}

      {toast && (
        <GlassmorphicToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="absolute top-8 left-8">
        <div className="text-gray-100 text-sm font-bold tracking-wider">
          MOZILLA FIREFOX CLUB
        </div>
      </div>

      <style jsx>
        {`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .animate-fade {
          animation: fadeInOut 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        @keyframes slideInRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}
      </style>
    </div>
  )
}
