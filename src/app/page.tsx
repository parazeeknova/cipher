'use client'

import { useSignIn, useSignUp, useUser } from '@clerk/nextjs'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useForm } from '@tanstack/react-form'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { trpc } from '@/lib/trpc/client'

function isMobile() {
  if (typeof window === 'undefined')
    return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

function GlassmorphicSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
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

function GlassmorphicLoadingCard({ children }: { children: React.ReactNode }) {
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

function GlassmorphicSkeletonLine({ width = 'full' }: { width?: 'full' | '3/4' | '1/2' | '1/4' }) {
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

function BoxWithEdges({ position, color = '#6b7280', edgeColor = '#374151' }: {
  position: [number, number, number]
  color?: string
  edgeColor?: string
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.1}
          metalness={0.8}
          transparent={true}
          opacity={0.9}
          transmission={0.5}
          clearcoat={1}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, 0.5)]} />
        <lineBasicMaterial color={edgeColor} linewidth={2} />
      </lineSegments>
    </group>
  )
}

function BoxLetter({ letter, position, color, edgeColor }: {
  letter: string
  position: [number, number, number]
  color: string
  edgeColor: string
}) {
  const group = useRef<THREE.Group>(null)

  const getLetterShape = (letter: string): number[][] => {
    const shapes: { [key: string]: number[][] } = {
      'C': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
      ],
      'I': [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 0, 0],
        [0, 1, 0],
      ],
      'P': [
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
      ],
      'H': [
        [1, 0, 0, 1, 0],
        [1, 0, 0, 1, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 1, 0],
      ],
      'E': [
        [1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 0, 0],
      ],
      'R': [
        [1, 1, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 1, 1, 0, 0],
        [1, 0, 1, 0, 0],
        [1, 0, 0, 1, 0],
      ],
      '#': [
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 0, 1, 0],
      ],
    }
    return shapes[letter] || shapes.I
  }

  const letterShape = getLetterShape(letter)

  return (
    <group ref={group} position={position}>
      {letterShape.map((row: number[], i: number) =>
        row.map((cell: number, j: number) => {
          if (cell) {
            let xOffset = j * 0.5

            if (letter === 'C') {
              xOffset = j * 0.5 - 1
            }
            if (letter === 'I') {
              xOffset = j * 0.5 - 0.5
            }
            if (letter === 'P') {
              xOffset = j * 0.5 - 1
            }
            if (letter === 'H') {
              xOffset = j * 0.5 - 1
            }
            if (letter === 'E') {
              xOffset = j * 0.5 - 1
            }
            if (letter === 'R') {
              xOffset = j * 0.5 - 1
            }
            if (letter === '#') {
              xOffset = j * 0.5 - 1
            }

            return (
              <BoxWithEdges
                key={`${i}-${j}`}
                position={[xOffset, (4 - i) * 0.5 - 1, 0]}
                color={color}
                edgeColor={edgeColor}
              />
            )
          }
          return null
        }),
      )}
    </group>
  )
}

function Scene({ showCipher = true }: { showCipher?: boolean }) {
  const orbitControlsRef = useRef<any>(null)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const cipherGroupRef = useRef<THREE.Group>(null)
  const currentOpacity = useRef(0.9)
  const targetOpacity = useRef(0.9)

  useEffect(() => {
    setIsMobileDevice(isMobile())
  }, [])

  useEffect(() => {
    targetOpacity.current = showCipher ? 0.9 : 0.1
  }, [showCipher])

  useFrame((state, delta) => {
    if (cipherGroupRef.current) {
      const speed = 3
      currentOpacity.current += (targetOpacity.current - currentOpacity.current) * speed * delta

      cipherGroupRef.current.traverse((child) => {
        if (child.type === 'Mesh') {
          const mesh = child as THREE.Mesh
          if (mesh.material) {
            const material = mesh.material as THREE.MeshPhysicalMaterial
            material.transparent = true
            material.opacity = currentOpacity.current
          }
        }
        if (child.type === 'LineSegments') {
          const lineSegments = child as THREE.LineSegments
          if (lineSegments.material) {
            const material = lineSegments.material as THREE.LineBasicMaterial
            material.transparent = true
            material.opacity = currentOpacity.current
          }
        }
      })
    }
  })

  return (
    <>
      <group
        ref={cipherGroupRef}
        position={[1.5, 0, 0]}
        rotation={[0, Math.PI / 1.5, 0]}
      >
        <BoxLetter letter="C" position={[-6, 0, 0]} color="#000000" edgeColor="#1f2937" />
        <BoxLetter letter="I" position={[-4.5, 0, 0]} color="#1f2937" edgeColor="#374151" />
        <BoxLetter letter="P" position={[-2.5, 0, 0]} color="#374151" edgeColor="#4b5563" />
        <BoxLetter letter="H" position={[0, 0, 0]} color="#4b5563" edgeColor="#6b7280" />
        <BoxLetter letter="E" position={[2.5, 0, 0]} color="#6b7280" edgeColor="#9ca3af" />
        <BoxLetter letter="R" position={[4.5, 0, 0]} color="#4b5563" edgeColor="#6b7280" />
        <BoxLetter letter="#" position={[7, 0, 0]} color="#6b7280" edgeColor="#9ca3af" />
      </group>
      <OrbitControls
        ref={orbitControlsRef}
        enableZoom
        enablePan
        enableRotate
        autoRotate
        autoRotateSpeed={0.5}
      />

      <ambientLight intensity={0.5} />

      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />

      <Environment
        files={
          isMobileDevice
            ? 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download3-7FArHVIJTFszlXm2045mQDPzsZqAyo.jpg'
            : 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dither_it_M3_Drone_Shot_equirectangular-jpg_San_Francisco_Big_City_1287677938_12251179%20(1)-NY2qcmpjkyG6rDp1cPGIdX0bHk3hMR.jpg'
        }
        background
      />
    </>
  )
}

function GoogleAuthButton({ onSuccess: _onSuccess }: { onSuccess: () => void }) {
  const { signUp, isLoaded: signUpLoaded } = useSignUp()
  const { signIn, isLoaded: signInLoaded } = useSignIn()
  const [isLoading, setIsLoading] = useState(false)

  const isLoaded = signUpLoaded && signInLoaded

  const handleGoogleAuth = async () => {
    if (!isLoaded || !signUp || !signIn)
      return

    setIsLoading(true)

    try {
      // Try sign-in first for existing users
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: window.location.origin,
        redirectUrlComplete: window.location.origin,
      })
    }
    catch {
      try {
        // If sign-in fails, try sign-up for new users
        await signUp.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: window.location.origin,
          redirectUrlComplete: window.location.origin,
        })
      }
      catch (signUpError) {
        console.error('Authentication failed:', signUpError)
        setIsLoading(false)
      }
    }
  }

  return (
    <button
      onClick={handleGoogleAuth}
      disabled={isLoading || !isLoaded}
      className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-gray-600 font-medium text-lg shadow-2xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {isLoading
        ? (
            <GlassmorphicSpinner size="sm" />
          )
        : (
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}

      <span className="relative z-10">
        {isLoading ? 'Connecting...' : 'Continue with Google'}
      </span>
    </button>
  )
}

function OnboardingForm({ user, onComplete }: { user: any, onComplete: () => void }) {
  const router = useRouter()
  const utils = trpc.useUtils()

  const onboardMutation = trpc.onboardUser.useMutation({
    onSuccess: () => {
      onComplete()
    },
    onError: (error) => {
      console.error('Onboarding error:', error)
    },
  })

  const form = useForm({
    defaultValues: {
      username: '',
    },
    onSubmit: async ({ value }) => {
      if (!user?.primaryEmailAddress?.emailAddress)
        return

      await onboardMutation.mutateAsync({
        username: value.username,
        email: user.primaryEmailAddress.emailAddress,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        imageUrl: user.imageUrl || undefined,
      })
    },
  })

  const handleRefreshCheck = async () => {
    await utils.getUser.invalidate()
    const result = await utils.getUser.fetch()
    if (result) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Choose a unique username to complete your profile
          </p>
        </div>

        <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
          {user.imageUrl && (
            <Image
              src={user.imageUrl}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-white/20"
            />
          )}
          <div>
            <div className="text-gray-600 font-medium">
              {user.firstName}
              {' '}
              {user.lastName}
            </div>
            <div className="text-gray-500 text-sm">
              {user.primaryEmailAddress?.emailAddress}
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) => {
                if (!value || value.length < 3) {
                  return 'Username must be at least 3 characters'
                }
                if (value.length > 50) {
                  return 'Username must be less than 50 characters'
                }
                if (!/^\w+$/.test(value)) {
                  return 'Username can only contain letters, numbers, and underscores'
                }
                return undefined
              },
            }}
          >
            {field => (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                    disabled={onboardMutation.isPending}
                  />
                  {onboardMutation.isPending && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <GlassmorphicSpinner size="sm" />
                    </div>
                  )}
                </div>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <div className="mt-2 text-red-400 text-sm">
                    {field.state.meta.errors[0]}
                  </div>
                )}
                {field.state.value.length >= 3
                  && !field.state.meta.errors.length && (
                  <div className="mt-2 text-green-400 text-sm">
                    ✓ Username looks good
                  </div>
                )}
              </div>
            )}
          </form.Field>

          <form.Subscribe
            selector={state => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || onboardMutation.isPending}
                className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-gray-600 font-medium text-lg shadow-2xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {onboardMutation.isPending || isSubmitting
                  ? <GlassmorphicSpinner size="sm" />
                  : null}

                <span className="relative z-10">
                  {onboardMutation.isPending || isSubmitting
                    ? 'Creating Account...'
                    : 'Complete Setup'}
                </span>
              </button>
            )}
          </form.Subscribe>

          {onboardMutation.error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
              <div className="text-red-400 text-sm">
                {onboardMutation.error.message}
                {onboardMutation.error.message.includes('already exists') && (
                  <div className="mt-2">
                    <button
                      onClick={handleRefreshCheck}
                      className="text-blue-400 underline text-xs"
                    >
                      Click here to go to dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="text-center mt-6">
        <p className="text-gray-600 text-sm">
          By continuing, you agree to our terms and conditions
        </p>
      </div>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const { isSignedIn, isLoaded, user } = useUser()
  const [showInstruction, setShowInstruction] = useState(true)
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'onboarding'>('home')

  const existingUser = trpc.getUser.useQuery(undefined, {
    enabled: isLoaded && !!user,
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
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

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const timer = setTimeout(() => {
        if (existingUser.data) {
          router.push('/dashboard')
        }
        else if (!existingUser.isLoading && !existingUser.error) {
          setCurrentView('onboarding')
        }
        else if (existingUser.error) {
          setCurrentView('onboarding')
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isLoaded, isSignedIn, user, existingUser.data, existingUser.isLoading, existingUser.error, router])

  const handleAuthSuccess = () => {
    // This will be handled by the useEffect above
  }

  const handleOnboardingComplete = () => {
    router.push('/dashboard')
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
          <OnboardingForm user={user} onComplete={handleOnboardingComplete} />
        </div>
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
        }https://github.com/parazeeknova/ThermoSense

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}
      </style>
    </div>
  )
}
