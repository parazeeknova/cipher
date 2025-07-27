/* eslint-disable no-console */
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface DirectUser {
  id: number
  username: string
  playerId: string
  clerkId: string
}

interface DirectUserContextType {
  directUser: DirectUser | null
  setDirectUser: (user: DirectUser | null) => void
  isDirectUser: boolean
}

const DirectUserContext = createContext<DirectUserContextType | undefined>(undefined)

export function DirectUserProvider({ children }: { children: React.ReactNode }) {
  console.log('DirectUserProvider: Rendering')
  const [directUser, setDirectUser] = useState<DirectUser | null>(null)
  const [_isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load direct user from localStorage on mount
    console.log('DirectUserContext: useEffect triggered')

    const loadDirectUser = () => {
      try {
        const savedUser = localStorage.getItem('directUser')
        console.log('DirectUserContext: Loading from localStorage:', savedUser)
        if (savedUser) {
          const user = JSON.parse(savedUser)
          console.log('DirectUserContext: Parsed user:', user)
          setDirectUser(user)
        }
      }
      catch (error) {
        console.error('Failed to parse saved direct user:', error)
        localStorage.removeItem('directUser')
      }
      finally {
        setIsLoaded(true)
      }
    }

    // Try immediately
    loadDirectUser()

    // Also try after a small delay as fallback
    const timer = setTimeout(loadDirectUser, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleSetDirectUser = (user: DirectUser | null) => {
    console.log('DirectUserContext: Setting direct user:', user)
    setDirectUser(user)
    if (user) {
      localStorage.setItem('directUser', JSON.stringify(user))
      console.log('DirectUserContext: Saved to localStorage')
    }
    else {
      localStorage.removeItem('directUser')
      console.log('DirectUserContext: Removed from localStorage')
    }
  }

  return (
    <DirectUserContext.Provider
      value={{
        directUser,
        setDirectUser: handleSetDirectUser,
        isDirectUser: !!directUser,
      }}
    >
      {children}
    </DirectUserContext.Provider>
  )
}

export function useDirectUser() {
  const context = useContext(DirectUserContext)
  if (context === undefined) {
    throw new Error('useDirectUser must be used within a DirectUserProvider')
  }
  return context
}
