'use client'

import { useEffect, useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { ActionHistory } from './ActionHistory'
import { ControlPanel } from './ControlPanel'
import { FloatingParticles } from './FloatingParticles'
import { GlobalChat } from './GlobalChat'
import { Leaderboard } from './Leaderboard'
import { MainGameArea } from './MainGameArea'
import { NotificationBar } from './NotificationBar'
import { PlayerUIBar } from './PlayerUIBar'

export default function GamePage() {
  const [glitchEffect, setGlitchEffect] = useState(false)
  const [playerGlitch, setPlayerGlitch] = useState<number | null>(null)
  const [buttonGlitch, setButtonGlitch] = useState<number | null>(null)
  const [actionGlitch, setActionGlitch] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState('')

  const { data: gameSession, isLoading: sessionLoading } = trpc.getCurrentGameSession.useQuery()

  const { data: _playerStats, isLoading: statsLoading } = trpc.getPlayerStats.useQuery(
    { gameSessionId: gameSession?.id || 0 },
    { enabled: !!gameSession?.id },
  )

  const { data: playerActions, isLoading: actionsLoading } = trpc.getPlayerActions.useQuery(
    { gameSessionId: gameSession?.id || 0, limit: 50 },
    { enabled: !!gameSession?.id },
  )

  const { data: chatMessages, isLoading: chatLoading } = trpc.getChatMessages.useQuery(
    { gameSessionId: gameSession?.id || 0, limit: 100 },
    { enabled: !!gameSession?.id },
  )

  const { data: notifications, isLoading: notificationsLoading } = trpc.getNotifications.useQuery(
    { gameSessionId: gameSession?.id || 0, limit: 20 },
    { enabled: !!gameSession?.id },
  )

  const sendMessageMutation = trpc.sendChatMessage.useMutation()

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchEffect(true)
      setTimeout(() => setGlitchEffect(false), 200)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const playerGlitchInterval = setInterval(() => {
      // Generate random player index for glitch effect (0-9 for up to 10 players)
      const randomPlayer = Math.floor(Math.random() * 10)
      setPlayerGlitch(randomPlayer)
      setTimeout(() => setPlayerGlitch(null), 300)
    }, 3000)
    return () => clearInterval(playerGlitchInterval)
  }, [])

  useEffect(() => {
    const buttonGlitchInterval = setInterval(() => {
      const randomButton = Math.floor(Math.random() * 4)
      setButtonGlitch(randomButton)
      setTimeout(() => setButtonGlitch(null), 300)
    }, 5000)
    return () => clearInterval(buttonGlitchInterval)
  }, [])

  useEffect(() => {
    const actionGlitchInterval = setInterval(() => {
      if (playerActions && playerActions.length > 0) {
        const randomAction = Math.floor(Math.random() * playerActions.length)
        setActionGlitch(randomAction)
        setTimeout(() => setActionGlitch(null), 400)
      }
    }, 4000)
    return () => clearInterval(actionGlitchInterval)
  }, [playerActions])

  const sendMessage = async () => {
    if (newMessage.trim() && gameSession?.id) {
      try {
        await sendMessageMutation.mutateAsync({
          gameSessionId: gameSession.id,
          message: newMessage,
        })
        setNewMessage('')
      }
      catch (error) {
        console.error('Failed to send message:', error)
      }
    }
  }

  if (sessionLoading || statsLoading || actionsLoading || chatLoading || notificationsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-mono text-lg animate-pulse">
          Loading game data...
        </div>
      </div>
    )
  }

  if (!gameSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-mono text-lg">
          No active game session found.
        </div>
      </div>
    )
  }

  const transformedPlayerActions = playerActions?.map(action => ({
    id: action.id,
    action: action.actionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    target: action.target || 'Unknown',
    result: action.result,
    time: new Date(action.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })) || []

  const transformedChatMessages = chatMessages?.map(msg => ({
    id: msg.id,
    user: msg.username || `${msg.firstName} ${msg.lastName}`.trim() || 'Anonymous',
    message: msg.message,
    time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })) || []

  const transformedNotifications = notifications?.map(notif => ({
    id: notif.id,
    type: notif.type === 'error' ? 'warning' : notif.type,
    message: notif.message,
    time: new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })) || []

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-950">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {[...Array.from({ length: 20 })].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-red-500/30 animate-pulse"
              style={{
                top: `${Math.floor(Math.random() * 100)}%`,
                left: 0,
                right: 0,
                height: `${Math.random() * 2}px`,
                opacity: Math.random() * 0.5 + 0.25,
                transform: `translateY(${Math.random() * 10 - 5}px)`,
                filter: 'blur(0.5px)',
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
          {[...Array.from({ length: 15 })].map((_, i) => (
            <div
              key={i + 100}
              className="absolute w-px bg-red-500/20 animate-pulse"
              style={{
                left: `${Math.floor(Math.random() * 100)}%`,
                top: 0,
                bottom: 0,
                width: `${Math.random() * 2}px`,
                opacity: Math.random() * 0.3 + 0.1,
                filter: 'blur(0.5px)',
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter%20id%3D%22noiseFilter%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23noiseFilter%29%22/%3E%3C/svg%3E')] opacity-[0.02]" />
      </div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-32 w-24 h-24 bg-red-500/5 rounded-full blur-2xl animate-bounce" />
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-red-500/5 rounded-full blur-xl animate-ping" />
      <div className="absolute top-4 left-4 w-72 h-[55vh] z-20">
        <ActionHistory playerActions={transformedPlayerActions} actionGlitch={actionGlitch} />
      </div>
      <div className="absolute bottom-4 left-4 w-72 h-[40vh] z-20">
        <GlobalChat
          chatMessages={transformedChatMessages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={sendMessage}
        />
      </div>
      <div className="absolute top-4 left-80 right-80 z-20">
        <NotificationBar notifications={transformedNotifications} />
      </div>
      <div className="absolute top-24 left-80 right-80 bottom-24 z-10">
        <MainGameArea glitchEffect={glitchEffect} />
      </div>
      <div className="absolute top-4 right-4 w-72 bottom-56 z-20">
        <Leaderboard playerGlitch={playerGlitch} />
      </div>
      <div className="absolute bottom-4 right-4 w-72 h-48 z-20 mt-3">
        <ControlPanel buttonGlitch={buttonGlitch} />
      </div>
      <div className="absolute bottom-4 left-80 right-80 z-20">
        <PlayerUIBar />
      </div>
      <FloatingParticles />
    </div>
  )
}
