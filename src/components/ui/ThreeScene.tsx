'use client'

import { Environment, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

function isMobile() {
  if (typeof window === 'undefined')
    return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
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

export function Scene({ showCipher = true }: { showCipher?: boolean }) {
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
