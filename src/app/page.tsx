"use client"

import { useUser, useSignIn, useSignUp } from "@clerk/nextjs"
import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

const isMobile = () => {
  if (typeof window === "undefined") return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

const BoxWithEdges = ({ position, color = "#6b7280", edgeColor = "#374151" }: {
  position: [number, number, number];
  color?: string;
  edgeColor?: string;
}) => {
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

const BoxLetter = ({ letter, position, color, edgeColor }: {
  letter: string;
  position: [number, number, number];
  color: string;
  edgeColor: string;
}) => {
  const group = useRef<THREE.Group>(null)

  const getLetterShape = (letter: string): number[][] => {
    const shapes: { [key: string]: number[][] } = {
      C: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
      ],
      I: [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 0, 0],
        [0, 1, 0],
      ],
      P: [
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
      ],
      H: [
        [1, 0, 0, 1, 0],
        [1, 0, 0, 1, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 1, 0],
      ],
      E: [
        [1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 0, 0],
      ],
      R: [
        [1, 1, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 1, 1, 0, 0],
        [1, 0, 1, 0, 0],
        [1, 0, 0, 1, 0],
      ],
      "#": [
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 0, 1, 0],
      ],
    }
    return shapes[letter] || shapes["I"]
  }

  const letterShape = getLetterShape(letter)

  return (
    <group ref={group} position={position}>
      {letterShape.map((row: number[], i: number) =>
        row.map((cell: number, j: number) => {
          if (cell) {
            let xOffset = j * 0.5

            if (letter === "C") {
              xOffset = j * 0.5 - 1
            }
            if (letter === "I") {
              xOffset = j * 0.5 - 0.5
            }
            if (letter === "P") {
              xOffset = j * 0.5 - 1
            }
            if (letter === "H") {
              xOffset = j * 0.5 - 1
            }
            if (letter === "E") {
              xOffset = j * 0.5 - 1
            }
            if (letter === "R") {
              xOffset = j * 0.5 - 1
            }
            if (letter === "#") {
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

const Scene = ({ showCipher = true }: { showCipher?: boolean }) => {
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
      // Smooth opacity transition
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
            ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download3-7FArHVIJTFszlXm2045mQDPzsZqAyo.jpg"
            : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dither_it_M3_Drone_Shot_equirectangular-jpg_San_Francisco_Big_City_1287677938_12251179%20(1)-NY2qcmpjkyG6rDp1cPGIdX0bHk3hMR.jpg"
        }
        background
      />
    </>
  )
}

const GoogleAuthButton = ({ onSuccess }: { onSuccess: () => void }) => {
  const { signIn } = useSignIn()
  const { signUp } = useSignUp()
  const [loading, setLoading] = useState(false)

  const handleGoogleAuth = async () => {
    if (!signIn || !signUp) return

    setLoading(true)
    try {
      const signInResult = await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/dashboard',
        redirectUrlComplete: '/dashboard',
      })
    } catch (error) {
      try {
        await signUp.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: '/dashboard',
          redirectUrlComplete: '/dashboard',
        })
      } catch (signUpError) {
        console.error('Google authentication failed:', signUpError)
        setLoading(false)
      }
    }
  }

  return (
    <button
      onClick={handleGoogleAuth}
      disabled={loading}
      className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-gray-600 font-medium text-lg shadow-2xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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

      <span className="relative z-10">
        {loading ? 'Connecting...' : 'Continue with Google'}
      </span>
    </button>
  )
}

export default function Home() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()
  const [showInstruction, setShowInstruction] = useState(true)
  const [currentView, setCurrentView] = useState<'home' | 'auth'>('home')

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault()
        if (isSignedIn) {
          router.push('/dashboard')
        } else {
          setCurrentView('auth')
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isSignedIn, router])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstruction(false)
    }, 150000)

    return () => clearTimeout(timer)
  }, [])

  const handleAuthSuccess = () => {
    router.push('/dashboard')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-100 text-lg">Loading...</div>
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
                onClick={handleBackToHome}
                className="text-gray-600 hover:text-white transition-colors text-sm"
              >
                ← Back to Landing
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-8 right-8">
        <div className="text-white text-sm opacity-70">
          {isSignedIn ? 'Authenticated' : 'Guest'}
        </div>
      </div>

      <div className="absolute top-8 left-8">
        <div className="text-gray-100 text-sm font-bold tracking-wider">
          MOZILLA FIREFOX CLUB
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .animate-fade {
          animation: fadeInOut 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
